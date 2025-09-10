import {
  createSignal,
  Show,
  onCleanup,
  createEffect,
  onMount,
} from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Photo as PhotoType } from "~/constants/photos";
import { Lightbox } from "~/components/photos/Lightbox";
import { NavArrow } from "~/components/photos/lightbox/NavArrow";

export type SlideDirection = "left" | "right" | "none";

export interface PhotoCarouselProps {
  photos: readonly PhotoType[];
  currentPhoto: PhotoType | null;
  expandOrigin: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  onClose: () => void;
}

export function PhotoCarousel(props: PhotoCarouselProps) {
  const [showLeft, setShowLeft] = createSignal(false);
  const [showRight, setShowRight] = createSignal(false);
  const [slideDirection, setSlideDirection] =
    createSignal<SlideDirection>("none");
  const [pendingPhoto, setPendingPhoto] = createSignal<PhotoType | null>(null);

  // Get current index and neighboring photos
  // Use pending photo if sliding, otherwise use current photo
  const currentPhoto = () => pendingPhoto() || props.currentPhoto;

  const currentIndex = () => {
    const current = currentPhoto();
    if (!current) return -1;
    return props.photos.findIndex((p) => p.url === current.url);
  };

  const leftPhoto = () => {
    const index = currentIndex();
    return index > 0 ? props.photos[index - 1] : null;
  };

  const rightPhoto = () => {
    const index = currentIndex();
    return index >= 0 && index < props.photos.length - 1 ? props.photos[index + 1] : null;
  };

  const handleLeft = () => {
    const left = leftPhoto();
    if (left) {
      setSlideDirection("left");
      setPendingPhoto(left);

      // After animation completes, update the actual photo and reset
      setTimeout(() => {
        // props.onPhotoChange(left);
        setPendingPhoto(null);
        setSlideDirection("none");
      }, 300);
    }
  };

  const handleRight = () => {
    const right = rightPhoto();
    if (right) {
      setSlideDirection("right");
      setPendingPhoto(right);

      // After animation completes, update the actual photo and reset
      setTimeout(() => {
        // props.onPhotoChange(right);
        setPendingPhoto(null);
        setSlideDirection("none");
      }, 300);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!currentPhoto()) return;

    if (e.key === "ArrowLeft") {
      handleLeft();
    } else if (e.key === "ArrowRight") {
      handleRight();
    } else if (e.key === "Escape") {
      props.onClose();
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!currentPhoto()) {
      setShowLeft(false);
      setShowRight(false);
      return;
    }

    const proximity = 100;

    // Show arrows based on screen position (within proximity px of screen edges)
    const x = e.clientX;
    const screenWidth = window.innerWidth;

    setShowLeft(x <= proximity);
    setShowRight(x >= screenWidth - proximity);
  };

  const handleMouseLeave = () => {
    setShowLeft(false);
    setShowRight(false);
  };

  createEffect(() => {
    if (currentPhoto()) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseleave", handleMouseLeave);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    }
    onCleanup(() => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    });
  });

  return (
    <Show when={!!currentPhoto()}>
      {/* Carousel container - sliding window approach */}
      <div class="fixed inset-0 z-50 overflow-hidden bg-black/90">
        <div
          class="flex h-full transition-transform duration-300 ease-out"
          style={{
            width: "300vw", // 3 lightboxes each 100vw wide
            transform: (() => {
              // Default position: center lightbox visible (shifted left by 100vw)
              let translateX = -100;

              // Adjust based on slide direction
              if (slideDirection() === "left") {
                translateX = 0; // Show left lightbox
              } else if (slideDirection() === "right") {
                translateX = -200; // Show right lightbox
              }

              return `translateX(${translateX}vw)`;
            })()
          }}
        >
          {/* Left lightbox (100vw wide) */}
          <div class="w-screen h-full flex-shrink-0 flex items-center justify-center relative">
            {leftPhoto() && (
              <Lightbox
                photo={leftPhoto()!}
                onClose={props.onClose}
                expandOrigin={null}
                slideDirection="none"
                isCarouselSlide={true}
                useRelativePositioning={true}
              />
            )}
          </div>

          {/* Center lightbox (100vw wide) */}
          <div class="w-screen h-full flex-shrink-0 flex items-center justify-center relative">
            <Lightbox
              photo={currentPhoto()!}
              onClose={props.onClose}
              expandOrigin={slideDirection() === "none" ? props.expandOrigin : null}
              slideDirection="none"
              isCarouselSlide={slideDirection() !== "none"}
              useRelativePositioning={true}
            />
          </div>

          {/* Right lightbox (100vw wide) */}
          <div class="w-screen h-full flex-shrink-0 flex items-center justify-center relative">
            {rightPhoto() && (
              <Lightbox
                photo={rightPhoto()!}
                onClose={props.onClose}
                expandOrigin={null}
                slideDirection="none"
                isCarouselSlide={true}
                useRelativePositioning={true}
              />
            )}
          </div>
        </div>
      </div>

      <NavArrow side="left" visible={showLeft()} onClick={handleLeft} />
      <NavArrow side="right" visible={showRight()} onClick={handleRight} />
    </Show>
  );
}
