import { createSignal, Show, onMount, onCleanup } from "solid-js";
import { type Photo as PhotoType } from "~/constants/photos";
import { LoadingSpinner } from "./LoadingSpinner";
import { formatDate } from "~/utils/date";

const S3_PREFIX = "https://photos.hunterchen.ca/";

export function Photo({
  photo,
  onClick,
}: {
  photo: PhotoType;
  onClick: () => void;
}) {
  const [loaded, setLoaded] = createSignal(false);
  const [aspectRatio, setAspectRatio] = createSignal(1.5); // Default aspect ratio
  const [baseWidth, setBaseWidth] = createSignal(300); // Default base width
  let imgRef: HTMLImageElement | null = null;

  // Function to calculate base width based on screen size
  const updateBaseWidth = () => {
    const width = window.innerWidth;
    if (width < 640) {
      // sm
      setBaseWidth(150);
    } else if (width < 768) {
      // md
      setBaseWidth(175);
    } else if (width < 1024) {
      // lg
      setBaseWidth(200);
    } else if (width < 1536) {
      // xl
      setBaseWidth(250);
    }
  };

  onMount(() => {
    updateBaseWidth();
    window.addEventListener("resize", updateBaseWidth);
  });

  onCleanup(() => {
    window.removeEventListener("resize", updateBaseWidth);
  });

  // Robustly check if image is already loaded (cached)
  function handleImgRef(el: HTMLImageElement) {
    imgRef = el;
    if (el) {
      // Use microtask to ensure DOM is updated
      setTimeout(() => {
        if (el.complete && el.naturalWidth > 0) {
          setLoaded(true);
          // Calculate aspect ratio from the loaded image
          let ratio = el.naturalWidth / el.naturalHeight;

          // Constrain extreme aspect ratios
          ratio = Math.max(0.5, Math.min(3.0, ratio));

          setAspectRatio(ratio);
        }
      }, 0);
    }
  }

  const handleImageLoad = () => {
    setLoaded(true);
    if (imgRef && imgRef.naturalWidth > 0 && imgRef.naturalHeight > 0) {
      const ratio = imgRef.naturalWidth / imgRef.naturalHeight;

      setAspectRatio(ratio);
    }
  };

  return (
    <div
      class={`flex-grow rounded shadow-lg overflow-hidden border border-violet-700/50 bg-violet-900/20 flex flex-col`}
      style={`
        flex-basis: ${baseWidth() * aspectRatio()}px;
      `}
    >
      <div class="relative flex-1">
        {!loaded() && (
          <div class="absolute inset-0 flex items-center justify-center z-10">
            <LoadingSpinner />
          </div>
        )}
        <img
          ref={handleImgRef}
          src={`${S3_PREFIX}${photo.thumbnail}`}
          alt="Gallery photo"
          class={`w-full h-full object-cover transition-opacity duration-300 ${
            loaded() ? "opacity-100" : "opacity-0"
          } hover:scale-[1.01] transition-transform cursor-pointer`}
          loading="lazy"
          draggable="true"
          onLoad={handleImageLoad}
          onClick={onClick}
        />
      </div>
      <div class="p-1 flex-shrink-0">
        <span class="text-xs text-violet-300 font-mono">
          {photo.date ? formatDate(photo.date) : ""}
        </span>
      </div>
    </div>
  );
}
