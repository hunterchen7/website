import { Title } from "@solidjs/meta";
import { manifest } from "~/constants/photos";
import { createSignal, Show } from "solid-js";

const S3_PREFIX = "https://photos.hunterchen.ca/";

// Seeded random number generator (LCG)
function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 3141) % 2477;
    return value / 4433;
  };
}

function shuffle<T>(array: readonly T[]): T[] {
  let arr = [...array];
  const rand = seededRandom(15);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function PhotoWithPlaceholder({
  photo,
}: {
  photo: { url: string; date: string };
}) {
  const [loaded, setLoaded] = createSignal(false);
  return (
    <div class="mb-2 break-inside-avoid rounded shadow-lg overflow-hidden flex flex-col items-center border border-violet-700/50 p-1 bg-violet-900/20">
      <div class="w-full h-auto min-h-[180px] flex items-center justify-center relative">
        <img
          src={`${S3_PREFIX}${photo.url}`}
          alt="Gallery photo"
          class={`w-full h-auto object-contain hover:scale-[1.01] transition-transform cursor-pointer`}
          loading="lazy"
          draggable="true"
          onLoad={() => {
            setLoaded(true);
            console.log(`Loaded: ${photo.url}`);
          }}
        />
        <Show
          when={loaded()}
          fallback={
            <span class="absolute inset-0 flex items-center justify-center">
              {/* SVG spinner */}
              <svg
                class="animate-spin h-8 w-8 text-violet-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            </span>
          }
        >
          <></>
        </Show>
      </div>
      <span class="text-xs text-violet-300 mt-1 font-mono">
        {photo.date ? new Date(photo.date).toLocaleString() : ""}
      </span>
    </div>
  );
}

export default function Gallery() {
  const shuffled = shuffle(manifest);
  return (
    <main class="text-center p-4 mx-auto font-mono text-violet-200 pb-20">
      <Title>Gallery</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight my-12 mx-auto max-w-[14rem] md:max-w-none">
        gallery
      </h1>
      <div class="columns-2 md:columns-3 lg:columns-4 gap-2 max-w-7xl mx-auto">
        {shuffled.map((photo) => (
          <PhotoWithPlaceholder photo={photo} />
        ))}
      </div>
    </main>
  );
}
