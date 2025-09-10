import { createSignal, onCleanup, createEffect, onMount, JSX } from "solid-js";
import { S3_PREFIX, type Photo as PhotoType } from "~/constants/photos";
import { type ExifData } from "~/types/exif";
import { InfoBar } from "./lightbox/InfoBar";
import { DrawerContent } from "./lightbox/DrawerContent";
import { Loader } from "./lightbox/Loader";
import { extractExif } from "~/utils/exif";

const magnifierSize = 500; // px
const magnifierZoom = 0.75;

export function Lightbox({
  photo,
  onClose,
  isCarouselMode = false,
}: {
  photo: PhotoType;
  onClose: () => void;
  isCarouselMode?: boolean;
}) {
  const [downloadProgress, setDownloadProgress] = createSignal({
    loaded: 0,
    total: 0,
  });
  const [isFetching, setIsFetching] = createSignal(false);
  const [exif, setExif] = createSignal<ExifData>({});

  // Magnifier state
  const [isZoomMode, setIsZoomMode] = createSignal(false);
  const [magnifierPos, setMagnifierPos] = createSignal({ x: 0, y: 0 });

  const [imgRef, setImgRef] = createSignal<HTMLImageElement | null>(null);

  // used by magnifier
  const [imgWidth, setImgWidth] = createSignal<number>(0);
  const [imgHeight, setImgHeight] = createSignal<number>(0);
  const [drawerOpen, setDrawerOpen] = createSignal(false);
  const [isMobile, setIsMobile] = createSignal(false);

  onMount(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  });

  const magnifierStyle = (): JSX.CSSProperties => {
    if (!isZoomMode() || imgWidth() <= 0 || imgHeight() <= 0) {
      return { display: "none" };
    }

    const img = imgRef();
    if (!img) return { display: "none" };

    // 1. Clamp the cursor position to stay within the image boundaries
    const cursorX = Math.max(0, Math.min(magnifierPos().x, img.offsetWidth));
    const cursorY = Math.max(0, Math.min(magnifierPos().y, img.offsetHeight));

    // 2. Calculate the lens's top-left position based on the clamped cursor
    const lensX = cursorX - magnifierSize / 2;
    const lensY = cursorY - magnifierSize / 2;

    // 3. Calculate background position based on the clamped cursor position
    const bgX =
      -(cursorX / img.offsetWidth) * (imgWidth() * magnifierZoom) +
      magnifierSize / 2;
    const bgY =
      -(cursorY / img.offsetHeight) * (imgHeight() * magnifierZoom) +
      magnifierSize / 2;

    return {
      position: "absolute",
      "pointer-events": "none",
      left: `${lensX}px`,
      top: `${lensY}px`,
      width: `${magnifierSize}px`,
      height: `${magnifierSize}px`,
      "box-shadow": "0 0 8px 2px #0008",
      border: "2px solid #eee",
      overflow: "hidden",
      "z-index": 10,
      "background-image": `url(${S3_PREFIX + photo.url})`,
      "background-repeat": "no-repeat",
      "background-size": `${imgWidth() * magnifierZoom}px ${
        imgHeight() * magnifierZoom
      }px`,
      "background-position": `${bgX}px ${bgY}px`,
    };
  };

  // This effect will run whenever the `photo` prop changes.
  createEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Reset state for the new photo
    setDownloadProgress({ loaded: 0, total: 0 });
    setIsFetching(true);
    setExif({});

    // this was previously used to display the image, but now it only gets used to extract EXIF data as well as track download progress
    const fetchFullImage = async () => {
      try {
        const response = await fetch(`${S3_PREFIX}${photo.url}`, { signal });

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

          // Check if the fetch was aborted
          if (signal.aborted) {
            return;
          }

          chunks.push(value);
          loaded += value.length;
          if (total > 0) {
            setDownloadProgress({ loaded, total });
          }
        }

        const buffer = new Uint8Array(loaded);
        let offset = 0;
        for (const chunk of chunks) {
          buffer.set(chunk, offset);
          offset += chunk.length;
        }

        if (!signal.aborted) {
          setExif(extractExif(buffer.buffer));
        }
      } catch (err) {
        setExif({});
      } finally {
        if (!signal.aborted) {
          setIsFetching(false);
        }
      }
    };

    fetchFullImage();

    // Cleanup function to abort the fetch if the component unmounts or the effect re-runs
    onCleanup(() => {
      controller.abort();
      setIsFetching(false);
    });
  });

  createEffect(() => {
    if (!isZoomMode()) return;

    const handleMouseMove = (e: MouseEvent) => {
      const img = imgRef();
      if (!img) return;
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMagnifierPos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove);
    });
  });

  return (
    <div
      class={`${isCarouselMode ? '' : 'fixed inset-0 z-50 bg-black/90'} flex items-center justify-center w-full h-full`}
      onClick={isCarouselMode ? undefined : onClose}
      tabIndex={isCarouselMode ? -1 : 0}
      onKeyDown={isCarouselMode ? undefined : (e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        class="relative flex flex-col items-center bg-violet-900/30 rounded-lg border border-slate-300/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          class="relative min-w-32 min-h-32 md:min-w-96 md:min-h-96"
          onMouseMove={(e) => {
            // Magnifier behavior (when enabled) tracks pointer over the image
            if (!isZoomMode()) return;
            const img = imgRef();
            if (!img) return;
            const rect = img.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setMagnifierPos({ x, y });
          }}
        >
          {/* Thumbnail image underneath main image */}
          <img
            src={`${S3_PREFIX}${photo.thumbnail}`}
            alt="thumbnail"
            class="absolute top-0 left-0 max-h-[95vh] max-w-[98vw] rounded-lg shadow-lg w-full h-full object-contain brightness-85"
          />
          <img
            ref={setImgRef}
            src={`${S3_PREFIX}${photo.url}`}
            alt="photo"
            onLoad={(e) => {
              setImgWidth(e.currentTarget.naturalWidth);
              setImgHeight(e.currentTarget.naturalHeight);
            }}
            class="max-h-[95vh] max-w-[95vw] rounded-lg shadow-lg relative z-1"
            style={{
              display: "block",
              cursor: (() => {
                if (isMobile()) return "default";
                if (isZoomMode()) return "zoom-out";
                return "zoom-in";
              })(),
            }}
            onClick={(e) => {
              if (isMobile()) return;
              e.stopPropagation();
              if (!isZoomMode()) {
                const img = imgRef();
                if (img) {
                  const rect = img.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  setMagnifierPos({ x, y });
                }
              }
              setIsZoomMode(!isZoomMode());
            }}
            onContextMenu={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              img.src = `${S3_PREFIX}${photo.url}`;
            }}
          />

          {/* Magnifier lens */}
          {isZoomMode() && <div style={magnifierStyle()} />}
          {isFetching() && <Loader downloadProgress={downloadProgress} />}
        </div>
        <InfoBar
          photo={photo}
          exif={exif}
          downloadProgress={downloadProgress}
          isMobile={isMobile}
          isZoomMode={isZoomMode}
          setIsZoomMode={setIsZoomMode}
          setDrawerOpen={setDrawerOpen}
        />
        {/* Info Drawer Overlay and Drawer (kept mounted so transitions animate) */}
        <div
          class={`fixed inset-0 z-[99] transition-opacity duration-300 ease-in-out overflow-y-none ${
            drawerOpen() ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden={!drawerOpen()}
        >
          <div class="absolute inset-0 bg-black/80" />
        </div>
        <aside
          class={`overflow-y-none fixed right-0 top-0 h-full w-72 md:w-96 bg-gray-900/95 shadow-lg z-[100] flex flex-col p-6 transition-transform duration-300 ease-in-out ${
            drawerOpen() ? "translate-x-0" : "translate-x-full"
          }`}
          aria-hidden={!drawerOpen()}
        >
          <DrawerContent
            photo={photo}
            exif={exif}
            downloadProgress={downloadProgress}
          />
        </aside>
      </div>
    </div>
  );
}
