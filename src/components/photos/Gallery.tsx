import { createSignal, JSX, onMount } from "solid-js";
import { useSearchParams } from "@solidjs/router";
import { Photo as PhotoType } from "~/constants/photos";
import { Photo } from "~/components/photos/Photo";
import { PhotoCarousel } from "~/components/photos/PhotoCarousel";
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
  const [expanded, setExpanded] = createSignal<PhotoType | null>(null);
  const [expandOrigin, setExpandOrigin] = createSignal<{
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const shuffled = shuffle(props.manifest, props.seed);

  // Check for image parameter on mount and set expanded photo accordingly
  onMount(() => {
    const imageParam = searchParams.image;
    if (imageParam) {
      const photo = shuffled.find((p) => p.url === imageParam);
      if (photo) {
        // When opening from URL, skip animation
        setExpanded(photo);
        setExpandOrigin(null);
      }
    }
  });

  // Function to update URL with image parameter
  const updateUrlWithImage = (photo: PhotoType | null) => {
    if (photo) {
      setSearchParams({ image: photo.url });
    } else {
      setSearchParams({ image: undefined });
    }
  };

  // Enhanced setExpanded that also updates URL
  const setExpandedWithUrl = (
    photo: PhotoType | null,
    clickEvent?: MouseEvent
  ) => {
    if (photo && clickEvent) {
      // Calculate the position and size of the clicked element
      const target = clickEvent.currentTarget as HTMLElement;
      const rect = target.getBoundingClientRect();
      setExpandOrigin({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        width: rect.width,
        height: rect.height,
      });
    } else {
      setExpandOrigin(null);
    }
    setExpanded(photo);
    updateUrlWithImage(photo);
  };

  const handleClose = () => {
    setExpandedWithUrl(null);
  };

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
          {shuffled.map((photo) => (
            <Photo
              photo={photo}
              onClick={(e) => setExpandedWithUrl(photo, e)}
            />
          ))}
        </div>
      </div>
      <PhotoCarousel
        photos={shuffled}
        currentPhoto={expanded()}
        expandOrigin={expandOrigin()}
        onClose={handleClose}
      />
    </main>
  );
}
