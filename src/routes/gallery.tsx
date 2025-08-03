import { Title } from "@solidjs/meta";
import { manifest, type Photo as PhotoType } from "~/constants/photos";
import { createSignal, Show } from "solid-js";
import { Photo } from "~/components/Photo";
import { Lightbox } from "~/components/Lightbox";

// Seeded random number generator (LCG)
function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 314431) % 24377;
    return value / 44333;
  };
}

function shuffle<T>(array: readonly T[]): T[] {
  let arr = [...array];
  const rand = seededRandom(17);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function Gallery() {
  const [expanded, setExpanded] = createSignal<PhotoType | null>(null);
  const shuffled = shuffle(manifest);
  return (
    <main class="text-center p-4 mx-auto font-mono text-violet-200 pb-20 h-screen overflow-y-auto">
      <Title>Gallery</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight mt-2 md:mt-12 mb-8 mx-auto max-w-[14rem] md:max-w-none">
        gallery
      </h1>
      <div class="text-violet-200 mb-4 text-xs md:text-sm">
        a collection of some photos I took that I like :)
      </div>
      <div class="columns-2 md:columns-3 3xl:columns-4 gap-2 max-w-7xl 3xl:max-w-[100rem] mx-auto">
        {shuffled.map((photo) => (
          <Photo photo={photo} onClick={() => setExpanded(photo)} />
        ))}
      </div>
      <Show when={!!expanded()}>
        <Lightbox photo={expanded()!} onClose={() => setExpanded(null)} />
      </Show>
    </main>
  );
}
