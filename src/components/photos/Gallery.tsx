import { createSignal, Show, JSX, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Photo as PhotoType } from "~/constants/photos";
import { Photo } from "~/components/photos/Photo";
import { Carousel } from "~/components/photos/Carousel";
import { shuffle } from "~/utils/shuffle";

export interface GalleryProps {
  manifest: readonly PhotoType[];
  caption: JSX.Element;
  seed?: number;
}

function CollectionLink({
  href,
  children,
}: {
  href: string;
  children: JSX.Element;
}) {
  return (
    <a href={href} class="underline hover:text-violet-300 text-violet-400">
      {children}
    </a>
  );
}

export function Gallery(props: GalleryProps) {
  const [expandedIndex, setExpandedIndex] = createSignal<number | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const shuffled = shuffle(props.manifest, props.seed);

  // Check for image parameter on mount and set expanded photo accordingly
  onMount(() => {
    const imageParam = searchParams.image;
    if (imageParam) {
      const photoIndex = shuffled.findIndex((p) => p.url === imageParam);
      if (photoIndex !== -1) {
        setExpandedIndex(photoIndex);
      }
    }
  });

  // Function to update URL with image parameter
  const updateUrlWithImage = (index: number | null) => {
    if (index !== null && shuffled[index]) {
      setSearchParams({ image: shuffled[index].url });
    } else {
      setSearchParams({ image: undefined });
    }
  };

  // Enhanced setExpandedIndex that also updates URL
  const setExpandedIndexWithUrl = (index: number | null) => {
    setExpandedIndex(index);
    updateUrlWithImage(index);
  };

  const handleLeft = () => {
    const currentIndex = shuffled.findIndex((p) => p.url === expanded()?.url);

    if (!expanded()) return;
    if (currentIndex > 0) {
      setExpandedWithUrl(null);
      setExpandedWithUrl(shuffled[currentIndex - 1]);
    }
  };

  const handleRight = () => {
    if (!expanded()) return;
    const currentIndex = shuffled.findIndex((p) => p.url === expanded()?.url);
    if (currentIndex < shuffled.length - 1) {
      setExpandedWithUrl(null);
      setExpandedWithUrl(shuffled[currentIndex + 1]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!expanded()) return;

    if (e.key === "ArrowLeft") {
      handleLeft();
    } else if (e.key === "ArrowRight") {
      handleRight();
    } else if (e.key === "Escape") {
      setExpandedWithUrl(null);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!expanded()) {
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
    if (expanded()) {
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
    <main class="text-center mx-auto font-mono text-violet-200 pb-20 h-screen overflow-y-auto">
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight mt-2 md:mt-12 mb-8 mx-auto max-w-[14rem] md:max-w-none">
        gallery
      </h1>
      <div class="text-violet-200 mb-4 text-xs md:text-sm">
        {props.caption}
        <div class="mt-2 space-x-2">
          collections: <CollectionLink href="/gallery">all</CollectionLink>
          <CollectionLink href="/airshow">airshow ✈️</CollectionLink>
        </div>
      </div>

      <div class="w-fill p-1 sm:p-2 md:p-4">
        <div class="flex flex-wrap gap-1 sm:gap-2">
          {shuffled.map((photo, index) => (
            <Photo photo={photo} onClick={() => setExpandedIndexWithUrl(index)} />
          ))}
        </div>
      </div>

      <Show when={expandedIndex() !== null}>
        <Carousel
          photos={shuffled}
          initialIndex={expandedIndex()!}
          onClose={() => setExpandedIndexWithUrl(null)}
        />
      </Show>
    </main>
  );
}