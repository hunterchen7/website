import { createSignal, onCleanup, createEffect, onMount, JSX } from "solid-js";
import { type Photo as PhotoType } from "~/constants/photos";
import ExifReader from "exifreader";
import { LoadingSpinner } from "./LoadingSpinner";

const S3_PREFIX = "https://photos.hunterchen.ca/";
const magnifierSize = 500; // px
const magnifierZoom = 0.75;

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

  // Magnifier state
  const [isZoomMode, setIsZoomMode] = createSignal(false);
  const [magnifierPos, setMagnifierPos] = createSignal({ x: 0, y: 0 });

  const [imgRef, setImgRef] = createSignal<HTMLImageElement | null>(null);
  const [imgWidth, setImgWidth] = createSignal<number>(0);
  const [imgHeight, setImgHeight] = createSignal<number>(0);
  const [objectUrl, setObjectUrl] = createSignal<string | null>(null);

  const [isMobile, setIsMobile] = createSignal(false);
  onMount(() => {
    setIsMobile(window.matchMedia("(pointer: coarse)").matches);
  });

  const magnifierStyle = (): JSX.CSSProperties => {
    if (!isZoomMode() || imgWidth() <= 0 || imgHeight() <= 0) {
      return { display: "none" };
    }

    const img = imgRef();
    if (!img) return { display: "none" };

    // 1. Clamp the cursor position to stay within the image boundaries
    const cursorX = Math.max(0, Math.min(magnifierPos().x, img.offsetWidth));
    const cursorY = Math.max(0, Math.min(magnifierPos().y, img.offsetHeight));

    // 2. Calculate the lens's top-left position based on the clamped cursor
    const lensX = cursorX - magnifierSize / 2;
    const lensY = cursorY - magnifierSize / 2;

    // 3. Calculate background position based on the clamped cursor position
    const bgX =
      -(cursorX / img.offsetWidth) * (imgWidth() * magnifierZoom) +
      magnifierSize / 2;
    const bgY =
      -(cursorY / img.offsetHeight) * (imgHeight() * magnifierZoom) +
      magnifierSize / 2;

    return {
      position: "absolute",
      "pointer-events": "none",
      left: `${lensX}px`,
      top: `${lensY}px`,
      width: `${magnifierSize}px`,
      height: `${magnifierSize}px`,
      "box-shadow": "0 0 8px 2px #0008",
      border: "2px solid #eee",
      overflow: "hidden",
      "z-index": 10,
      "background-image": `url(${
        objectUrl() ?? S3_PREFIX + photo.thumbnail
      })`,
      "background-repeat": "no-repeat",
      "background-size": `${imgWidth() * magnifierZoom}px ${
        imgHeight() * magnifierZoom
      }px`,
      "background-position": `${bgX}px ${bgY}px`,
    };
  };

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

  createEffect(() => {
    if (imageBuffer()) {
      const url = URL.createObjectURL(new Blob([imageBuffer()!]));
      setObjectUrl(url);
      onCleanup(() => {
        URL.revokeObjectURL(url);
        setObjectUrl(null);
      });
    } else {
      setObjectUrl(null);
    }
  });

  createEffect(() => {
    if (!isZoomMode()) return;

    const handleMouseMove = (e: MouseEvent) => {
      const img = imgRef();
      if (!img) return;
      const rect = img.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMagnifierPos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    onCleanup(() => {
      window.removeEventListener("mousemove", handleMouseMove);
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
        <div class="relative" onMouseMove={(e) => {
              if (!isZoomMode()) return;
              const img = imgRef();
              if (!img) return;
              const rect = img.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              setMagnifierPos({ x, y });
            }}>
          <img
            ref={setImgRef}
            src={objectUrl() ?? `${S3_PREFIX}${photo.thumbnail}`}
            alt="photo"
            onLoad={(e) => {
              setImgWidth(e.currentTarget.naturalWidth);
              setImgHeight(e.currentTarget.naturalHeight);
            }}
            class="max-h-[92vh] max-w-[95vw] rounded shadow-lg"
            style={{
              display: "block",
              cursor: !isMobile() && isZoomMode() ? "zoom-out" : isMobile() ? "default" : "zoom-in",
            }}
            onClick={(e) => {
              if (isMobile()) return;
              e.stopPropagation();
              if (!isZoomMode()) {
                const img = imgRef();
                if (img) {
                  const rect = img.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  setMagnifierPos({ x, y });
                }
              }
              setIsZoomMode(!isZoomMode());
            }}
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
          {/* Magnifier lens */}
          {isZoomMode() && <div style={magnifierStyle()} />}
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
