import { createSignal, onCleanup, createEffect } from "solid-js";
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
  const [imageBuffer, setImageBuffer] = createSignal<ArrayBuffer | null>(null);
  const [downloadProgress, setDownloadProgress] = createSignal({
    loaded: 0,
    total: 0,
  });
  const [isFetching, setIsFetching] = createSignal(false);
  const [exif, setExif] = createSignal<any>({});

  // This effect will run whenever the `photo` prop changes.
  createEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    // Reset state for the new photo
    setImageBuffer(null);
    setDownloadProgress({ loaded: 0, total: 0 });
    setIsFetching(true);
    setExif({});

    const fetchFullImage = async () => {
      try {
        const response = await fetch(`${S3_PREFIX}${photo.url}`, { signal });

        if (!response.body) {
          throw new Error("ReadableStream not supported");
        }

        const contentLength = response.headers.get("content-length");
        const total = contentLength ? parseInt(contentLength, 10) : 0;

        let loaded = 0;
        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Check if the fetch was aborted
          if (signal.aborted) {
            return;
          }

          chunks.push(value);
          loaded += value.length;
          if (total > 0) {
            setDownloadProgress({ loaded, total });
          }
        }

        const buffer = new Uint8Array(loaded);
        let offset = 0;
        for (const chunk of chunks) {
          buffer.set(chunk, offset);
          offset += chunk.length;
        }

        if (!signal.aborted) {
          setImageBuffer(buffer.buffer);
          try {
            const tags = ExifReader.load(buffer.buffer);
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
        }
      } catch (err) {
        setExif({});
      } finally {
        if (!signal.aborted) {
          setIsFetching(false);
        }
      }
    };

    fetchFullImage();

    // Cleanup function to abort the fetch if the component unmounts or the effect re-runs
    onCleanup(() => {
      controller.abort();
      setIsFetching(false);
    });
  });

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
        <div class="relative">
          <img
            src={
              imageBuffer()
                ? URL.createObjectURL(new Blob([imageBuffer()!]))
                : `${S3_PREFIX}${photo.thumbnail}`
            }
            alt={photo.url ?? "Full photo"}
            class="max-h-[92vh] max-w-[95vw] rounded shadow-lg"
            onContextMenu={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              const originalSrc = img.src;
              img.src = `${S3_PREFIX}${photo.url}`;
              setTimeout(() => {
                if (imageBuffer()) {
                  img.src = originalSrc;
                }
              }, 100);
            }}
          />
          {isFetching() && (
            <span class="absolute inset-0 flex flex-col items-center justify-center">
              <div class="bg-gray-900/50 px-2 pb-2 rounded-lg flex items-center">
                <LoadingSpinner className="h-12 w-12 -mt-4" />
                {downloadProgress().total > 0 && (
                  <span class="text-violet-200 text-xs font-mono mt-18">
                    {Math.round(downloadProgress().loaded / 1024)}/
                    {Math.round(downloadProgress().total / 1024)} KB
                  </span>
                )}
              </div>
            </span>
          )}
        </div>
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
