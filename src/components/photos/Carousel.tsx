import { createSignal, createEffect, onCleanup, JSX, For } from "solid-js";
import { type Photo as PhotoType } from "~/constants/photos";
import { Lightbox } from "./Lightbox";
import { NavArrow } from "./lightbox/NavArrow";

export interface CarouselProps {
  photos: readonly PhotoType[];
  initialIndex?: number;
  onClose: () => void;
}

export function Carousel(props: CarouselProps) {
  const [currentIndex, setCurrentIndex] = createSignal(props.initialIndex ?? 0);
  const [showNavigation, setShowNavigation] = createSignal(false);
  const [touchStartX, setTouchStartX] = createSignal(0);
  const [touchStartY, setTouchStartY] = createSignal(0);
  const [isTransitioning, setIsTransitioning] = createSignal(false);

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
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartX();
    const deltaY = touch.clientY - touchStartY();

    // Only handle horizontal swipes that are more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
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
                photo={photo}
                onClose={props.onClose}
                isCarouselMode={true}
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
      <div class="fixed bottom-2 left-1/2 -translate-x-1/2 z-[70] px-4 py-2 bg-black/70 rounded-full text-sm select-none">
        {currentIndex() + 1} / {props.photos.length}
      </div>
    </div>
  );
}
