import { ZoomIn, ZoomOut, Info, Download } from "lucide-solid";
import { formatDate } from "~/utils/date";
import { type Photo as PhotoType } from "~/constants/photos";
import { type ExifData } from "~/types/exif";

interface InfoBarProps {
  photo: PhotoType;
  exif: () => ExifData;
  downloadProgress: () => { loaded: number; total: number };
  isMobile: () => boolean;
  isZoomMode: () => boolean;
  setIsZoomMode: (v: boolean) => void;
  setDrawerOpen: (v: boolean) => void;
}

export function InfoBar({
  photo,
  exif,
  downloadProgress,
  isMobile,
  isZoomMode,
  setIsZoomMode,
  setDrawerOpen,
}: InfoBarProps) {
  const S3_PREFIX = "https://photos.hunterchen.ca/";
  return (
    <span class="text-xs text-violet-200 font-mono flex flex-col sm:flex-row justify-between w-full p-1">
      <div class="flex flex-col sm:flex-row sm:gap-2">
        <div class="border-violet-300">
          {photo.date ? formatDate(photo.date) : ""}
          {exif().iso && <span> | ISO {exif().iso} |</span>}
          {exif().shutter && <span> {exif().shutter}s |</span>}
          {exif().aperture && <span> {exif().aperture} |</span>}
          {exif().focalLength && <span> {exif().focalLength} </span>}
        </div>
      </div>
      {downloadProgress().loaded === downloadProgress().total && (
        <div class="flex justify-center mt-1 sm:mt-0 gap-1">
          {!isMobile() &&
            (!isZoomMode() ? (
              <ZoomIn
                class="inline h-4 w-4 cursor-pointer hover:text-purple-400"
                onClick={() => setIsZoomMode(true)}
              />
            ) : (
              <ZoomOut
                class="inline h-4 w-4 cursor-pointer hover:text-purple-400"
                onClick={() => setIsZoomMode(false)}
              />
            ))}
          <Info
            class="inline h-4 w-4 cursor-pointer hover:text-purple-400"
            onClick={() => setDrawerOpen(true)}
          />
          <Download
            class="inline h-4 w-4 cursor-pointer hover:text-purple-400"
            onClick={() => {
              fetch(`${S3_PREFIX}${photo.url}`)
                .then((response) => response.blob())
                .then((blob) => {
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = photo.url;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                });
            }}
          />
        </div>
      )}
    </span>
  );
}
