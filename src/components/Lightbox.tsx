import { createSignal, onMount } from "solid-js";
import { type Photo as PhotoType } from "~/constants/photos";
import ExifReader from "exifreader";
import { LoadingSpinner } from "./LoadingSpinner";

const S3_PREFIX = "https://photos.hunterchen.ca/";

export function Lightbox({
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
          data-src={`${S3_PREFIX}${photo.url}`}
          alt={photo.url ?? "Full photo"}
          class={`max-h-[92vh] max-w-[95vw] rounded shadow-lg transition-opacity ${
            loaded() ? "opacity-100" : "opacity-0"
          }`}
          loading="eager"
          onLoad={handleLoad}
          onContextMenu={(e) => {
            // When right-clicking, temporarily set src to original URL
            const img = e.currentTarget as HTMLImageElement;
            const originalSrc = img.src;
            img.src = `${S3_PREFIX}${photo.url}`;

            // Restore blob URL after context menu interaction
            setTimeout(() => {
              if (imageBuffer()) {
                img.src = originalSrc;
              }
            }, 100);
          }}
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
