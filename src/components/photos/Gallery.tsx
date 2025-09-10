import { createSignal, Show, onCleanup, createEffect, JSX } from "solid-js";
import { Photo as PhotoType } from "~/constants/photos";
import { Photo } from "~/components/photos/Photo";
import { Lightbox } from "~/components/photos/Lightbox";

export interface GalleryProps {
  manifest: readonly PhotoType[];
  caption: string;
  seed?: number;
}

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 314431) % 24377;
    return value / 44333;
  };
}

function shuffle<T>(array: readonly T[], seed?: number): T[] {
  if (seed === undefined) return [...array];
  let arr = [...array];
  const rand = seededRandom(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
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
  const shuffled = shuffle(props.manifest, props.seed);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!expanded()) return;

    const currentIndex = shuffled.findIndex((p) => p.url === expanded()?.url);

    if (e.key === "ArrowRight") {
      if (currentIndex < shuffled.length - 1) {
        setExpanded(null);
        setExpanded(shuffled[currentIndex + 1]);
      }
    } else if (e.key === "ArrowLeft") {
      if (currentIndex > 0) {
        setExpanded(null);
        setExpanded(shuffled[currentIndex - 1]);
      }
    } else if (e.key === "Escape") {
      setExpanded(null);
    }
  };

  createEffect(() => {
    if (expanded()) {
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.removeEventListener("keydown", handleKeyDown);
    }
    onCleanup(() => document.removeEventListener("keydown", handleKeyDown));
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
          {shuffled.map((photo) => (
            <Photo photo={photo} onClick={() => setExpanded(photo)} />
          ))}
        </div>
      </div>
      <Show when={!!expanded()}>
        <Lightbox photo={expanded()!} onClose={() => setExpanded(null)} />
      </Show>
    </main>
  );
}
