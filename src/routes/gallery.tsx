import { Title } from "@solidjs/meta";
import { manifest, type Photo as PhotoType } from "~/constants/photos";
import { createSignal, Show, onMount } from "solid-js";
import ExifReader from "exifreader";

const S3_PREFIX = "https://photos.hunterchen.ca/";

function LoadingSpinner({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span class="absolute inset-0 flex items-center justify-center pointer-events-none">
      <svg
        class={`animate-spin text-violet-400 ${className}`}
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
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
  );
}

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
  const rand = seededRandom(111);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function Photo({ photo, onClick }: { photo: PhotoType; onClick: () => void }) {
  const [loaded, setLoaded] = createSignal(false);
  let imgRef: HTMLImageElement | null = null;

  // Robustly check if image is already loaded (cached)
  function handleImgRef(el: HTMLImageElement) {
    imgRef = el;
    if (el) {
      // Use microtask to ensure DOM is updated
      setTimeout(() => {
        if (el.complete && el.naturalWidth > 0) {
          setLoaded(true);
        }
      }, 0);
    }
  }

  return (
    <div class="mb-2 break-inside-avoid rounded shadow-lg overflow-hidden flex flex-col items-center border border-violet-700/50 p-1 bg-violet-900/20">
      <div class="w-full h-auto min-h-[180px] flex items-center justify-center relative">
        <Show when={loaded()} fallback={<LoadingSpinner />}>
          <></>
        </Show>
        <img
          ref={handleImgRef}
          src={`${S3_PREFIX}${photo.thumbnail}`}
          alt="Gallery photo"
          class={`w-full h-auto object-contain hover:scale-[1.01] transition-transform cursor-pointer`}
          loading="lazy"
          draggable="true"
          onLoad={() => {
            setLoaded(true);
          }}
          onClick={onClick}
        />
      </div>
      <span class="text-xs text-violet-300 mt-1 font-mono">
        {photo.date ? new Date(photo.date).toLocaleString() : ""}
      </span>
    </div>
  );
}

function Lightbox({
  photo,
  onClose,
}: {
  photo: PhotoType;
  onClose: () => void;
}) {
  const [loaded, setLoaded] = createSignal(false);
  const [imageBuffer, setImageBuffer] = createSignal<ArrayBuffer | null>(null);
  let imgRef: HTMLImageElement | null = null;

  const [exif, setExif] = createSignal<any>({});

  // Fetch image data once and use it for both display and EXIF extraction
  onMount(async () => {
    try {
      const response = await fetch(`${S3_PREFIX}${photo.url}`);
      const buffer = await response.arrayBuffer();
      setImageBuffer(buffer);

      // Extract EXIF data from the buffer
      try {
        const tags = ExifReader.load(buffer);
        setExif({
          model: tags.Make?.description + " " + tags.Model?.description,
          iso: tags.ISOSpeedRatings?.description,
          shutter: tags.ExposureTime?.description,
          aperture: tags.FNumber?.description,
          focalLength: tags.FocalLength35efl?.description,
        });
      } catch (err) {
        setExif({});
      }
    } catch (err) {
      setExif({});
    }
  });

  function handleLoad() {
    setLoaded(true);
  }

  return (
    <div
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center w-full"
      onClick={onClose}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Escape") onClose();
      }}
    >
      <div
        class="relative flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          ref={(el) => (imgRef = el)}
          src={
            imageBuffer()
              ? URL.createObjectURL(new Blob([imageBuffer()!]))
              : `${S3_PREFIX}${photo.url}`
          }
          alt={photo.url ?? "Full photo"}
          class={`max-h-[92vh] max-w-[95vw] rounded shadow-lg transition-opacity ${
            loaded() ? "opacity-100" : "opacity-0"
          }`}
          loading="eager"
          onLoad={handleLoad}
        />
        {!loaded() && (
          <span class="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner className="h-12 w-12" />
          </span>
        )}
        <button
          class="absolute top-2 right-2 bg-violet-900/80 text-violet-200 rounded-full h-8 w-8 text-lg font-bold shadow hover:bg-violet-700/80 cursor-pointer p-auto"
          onClick={onClose}
          aria-label="Close"
        >
          x
        </button>
        <span class="text-xs text-violet-300 mt-2 font-mono flex flex-col sm:flex-row justify-between w-full">
          {photo.date ? new Date(photo.date).toLocaleString() : ""}
          <div>
            {exif().model && <span>{exif().model} |</span>}
            {exif().iso && <span> ISO {exif().iso} |</span>}
            {exif().shutter && <span> {exif().shutter}s |</span>}
            {exif().aperture && <span> {exif().aperture} |</span>}
            {exif().focalLength && <span> {exif().focalLength} </span>}
          </div>
        </span>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [expanded, setExpanded] = createSignal<PhotoType | null>(null);
  const shuffled = shuffle(manifest);
  return (
    <main class="text-center p-4 mx-auto font-mono text-violet-200 pb-20 h-screen overflow-y-auto">
      <Title>Gallery</Title>
      <h1 class="text-2xl sm:text-4xl font-thin leading-tight mt-12 mb-8 mx-auto max-w-[14rem] md:max-w-none">
        gallery
      </h1>
      <div class="text-violet-400 mb-4">
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
