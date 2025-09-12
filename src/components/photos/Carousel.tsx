import { createSignal, createEffect, onCleanup, JSX, For } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { type Photo as PhotoType, S3_PREFIX } from "~/constants/photos";
import { type ExifData } from "~/types/exif";
import { extractExif } from "~/utils/exif";
import { Lightbox } from "./Lightbox";
import { NavArrow } from "./lightbox/NavArrow";
import { DrawerContent } from "./lightbox/DrawerContent";

export interface CarouselProps {
  photos: readonly PhotoType[];
  initialIndex?: number;
  onClose: () => void;
}

export function Carousel(props: CarouselProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentIndex, setCurrentIndex] = createSignal(props.initialIndex ?? 0);
  const [showNavigation, setShowNavigation] = createSignal(false);
  const [touchStartX, setTouchStartX] = createSignal(0);
  const [touchStartY, setTouchStartY] = createSignal(0);
  const [isTransitioning, setIsTransitioning] = createSignal(false);
  const [imageExifs, setImageExifs] = createSignal<Record<string, ExifData>>(
    {}
  );

  // Shared drawer state
  const [drawerOpen, setDrawerOpen] = createSignal(false);

  // Shared EXIF and download progress data for the current photo
  const [currentPhotoExif, setCurrentPhotoExif] = createSignal<ExifData>({});
  const [currentDownloadProgress, setCurrentDownloadProgress] = createSignal({
    loaded: 0,
    total: 0,
  });

  // Update search params when current index changes
  createEffect(() => {
    const currentPhoto = props.photos[currentIndex()];
    if (currentPhoto) {
      setSearchParams({ image: currentPhoto.url });
    }
  });

  // Fetch EXIF data for the current photo
  createEffect(() => {
    const currentPhoto = props.photos[currentIndex()];
    if (!currentPhoto) return;

    const controller = new AbortController();
    const signal = controller.signal;

    setCurrentPhotoExif({});

    if (imageExifs()[currentPhoto.url]) {
      setCurrentPhotoExif(imageExifs()[currentPhoto.url]);
      return;
    }

    // Reset state for the new photo
    setCurrentDownloadProgress({ loaded: 0, total: 0 });

    const fetchPhotoData = async () => {
      const attemptFetch = async (useCache: boolean = true) => {
        const response = await fetch(`${S3_PREFIX}${currentPhoto.url}`, {
          signal,
          cache: useCache ? "default" : "no-cache",
        });

        if (!response.body) {
          throw new Error("ReadableStream not supported");
        }

        const contentLength = response.headers.get("content-length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        let loaded = 0;
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          if (signal.aborted) {
            return;
          }

          chunks.push(value);
          loaded += value.length;
          if (total > 0) {
            setCurrentDownloadProgress({ loaded, total });
          }
        }

        const buffer = new Uint8Array(loaded);
        let offset = 0;
        for (const chunk of chunks) {
          buffer.set(chunk, offset);
          offset += chunk.length;
        }

        if (!signal.aborted) {
          const exif = extractExif(buffer.buffer, total);
          setCurrentPhotoExif(exif);
          setImageExifs((prev) => ({
            ...prev,
            [currentPhoto.url]: exif,
          }));
        }
      };

      try {
        // First attempt with cache
        await attemptFetch();
      } catch (err) {
        try {
          // Retry without cache if first attempt fails, evades some CORS issues
          await attemptFetch(false);
        } catch (retryErr) {
          // Both attempts failed, set empty EXIF
          setCurrentPhotoExif({});
        }
      }
    };

    fetchPhotoData();

    onCleanup(() => {
      controller.abort();
    });
  });

  const goToPrevious = () => {
    if (isTransitioning() || currentIndex() === 0) return;
    const newIndex = currentIndex() - 1;
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const goToNext = () => {
    if (isTransitioning() || currentIndex() === props.photos.length - 1) return;
    const newIndex = currentIndex() + 1;
    setIsTransitioning(true);
    setCurrentIndex(newIndex);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
        e.preventDefault();
        if (currentIndex() > 0) {
          goToPrevious();
        }
        break;
      case "ArrowRight":
        e.preventDefault();
        if (currentIndex() < props.photos.length - 1) {
          goToNext();
        }
        break;
      case "Escape":
        e.preventDefault();
        props.onClose();
        break;
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    const proximity = 150;
    const x = e.clientX;
    const screenWidth = window.innerWidth;

    setShowNavigation(x <= proximity || x >= screenWidth - proximity);
  };

  const handleTouchStart = (e: TouchEvent) => {
    // Only track single-finger touches to avoid interfering with pinch-zoom
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setTouchStartX(touch.clientX);
      setTouchStartY(touch.clientY);
    } else {
      // If more than one finger, reset start position to cancel swipe
      setTouchStartX(0);
      setTouchStartY(0);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    // If touchStartX is 0, it means the gesture was cancelled (e.g., multi-touch)
    if (touchStartX() === 0) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX();
    const deltaY = touch.clientY - touchStartY();

    // Increased swipe threshold from 50 to 75 for less sensitivity
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 75) {
      if (deltaX > 0 && currentIndex() > 0) {
        goToPrevious();
      } else if (deltaX < 0 && currentIndex() < props.photos.length - 1) {
        goToNext();
      }
    }
  };

  createEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousemove", handleMouseMove);

    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousemove", handleMouseMove);
    });
  });

  const getCarouselItemStyle = (index: number): JSX.CSSProperties => {
    const offset = index - currentIndex();
    return {
      transform: `translateX(${offset * 100}%)`,
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "absolute",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
    };
  };

  // change this render both the left and the right
  const shouldLoadHighRes = (index: number): boolean => {
    return (
      index === currentIndex() ||
      index === currentIndex() - 1 ||
      index === currentIndex() + 1
    );
  };

  // Get current photo reactively
  const currentPhoto = () => props.photos[currentIndex()];

  return (
    <div
      class="fixed inset-0 z-50 bg-black/95 overflow-hidden"
      onClick={props.onClose}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseLeave={() => setShowNavigation(false)}
    >
      {/* Carousel container */}
      <div class="relative w-full h-full overflow-hidden">
        <For each={props.photos}>
          {(photo, index) => (
            <div style={getCarouselItemStyle(index())}>
              <Lightbox
                photo={() => photo}
                exif={currentPhotoExif}
                downloadProgress={currentDownloadProgress}
                setDrawerOpen={setDrawerOpen}
                shouldLoadHighRes={() => shouldLoadHighRes(index())}
              />
            </div>
          )}
        </For>
      </div>

      {/* Navigation arrows */}
      <NavArrow
        side="left"
        visible={showNavigation() && currentIndex() > 0}
        onClick={goToPrevious}
      />

      <NavArrow
        side="right"
        visible={showNavigation() && currentIndex() < props.photos.length - 1}
        onClick={goToNext}
      />

      {/* Counter */}
      <div class="fixed top-2 sm:top-auto sm:bottom-2 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 bg-black/70 rounded-full text-sm select-none">
        {currentIndex() + 1} / {props.photos.length}
      </div>

      {/* Shared Info Drawer Overlay and Drawer */}
      <div
        class={`fixed inset-0 z-[99] transition-opacity duration-300 ease-in-out overflow-y-none ${
          drawerOpen() ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={(e) => {
          setDrawerOpen(false);
          e.stopPropagation();
        }}
        aria-hidden={!drawerOpen()}
      >
        <div class="absolute inset-0 bg-black/80" />
      </div>
      <aside
        class={`overflow-y-none fixed right-0 top-0 h-full w-72 md:w-96 bg-gray-900/95 shadow-lg z-[100] flex flex-col p-6 transition-transform duration-300 ease-in-out ${
          drawerOpen() ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!drawerOpen()}
        onClick={(e) => e.stopPropagation()}
      >
        <DrawerContent photo={currentPhoto} exif={currentPhotoExif} />
      </aside>
    </div>
  );
}
