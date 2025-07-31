import { createSignal, Show } from "solid-js";
import { type Photo as PhotoType } from "~/constants/photos";
import { LoadingSpinner } from "./LoadingSpinner";

const S3_PREFIX = "https://photos.hunterchen.ca/";

export function Photo({
  photo,
  onClick,
}: {
  photo: PhotoType;
  onClick: () => void;
}) {
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
      <div class="w-full h-auto md:min-h-[180px] flex items-center justify-center relative">
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
