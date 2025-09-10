import { Camera, Aperture, Image, Telescope, Clock, File } from "lucide-solid";
import { formatDate } from "~/utils/date";
import { type Photo as PhotoType } from "~/constants/photos";
import { type ExifData } from "~/types/exif";

const S3_PREFIX = "https://photos.hunterchen.ca/";

interface DrawerContentProps {
  photo: PhotoType;
  exif: () => ExifData;
  downloadProgress: () => { loaded: number; total: number };
}

export function DrawerContent({
  photo,
  exif,
  downloadProgress,
}: DrawerContentProps) {
  return (
    <>
      <h2 class="text-lg text-violet-200 mb-4">Photo Info</h2>
      <div class="text-xs md:text-sm text-violet-200 space-y-2 text-left">
        {photo.url ? (
          <div class="flex gap-2">
            <File class="w-4 h-4 mt-[2px]" />
            <a
              href={`${S3_PREFIX}${photo.url}`}
              target="_blank"
              rel="noopener noreferrer"
              class="hover:text-purple-400 break-all"
            >
              {photo.url}
            </a>
            <div>
              ({(downloadProgress().total / 1024 / 1024).toFixed(2)} MB)
            </div>
          </div>
        ) : (
          ""
        )}
        {photo.date ? (
          <div class="flex gap-2">
            <Clock class="w-4 h-4 mt-[2px]" />
            {formatDate(photo.date)}
          </div>
        ) : (
          ""
        )}
        {exif().camera && (
          <div class="flex gap-2">
            <Camera class="w-4 h-4 mt-0.5" />
            {exif().camera}
          </div>
        )}
        {exif().lensModel && (
          <div class="flex gap-2">
            <Telescope class="w-4 h-4 mt-0.5" />
            {exif().lensModel}
          </div>
        )}
        {(exif().shutter ||
          exif().aperture ||
          exif().iso ||
          exif().focalLength) && (
          <div class="flex space-x-2 justify-left">
            <Aperture class="w-4 h-4 mt-0.5" />
            {exif().shutter && <div>{exif().shutter}s</div>}
            {exif().aperture && <div>{exif().aperture}</div>}
            {exif().iso && <div>ISO{exif().iso}</div>}
            {exif().focalLength && <div>{exif().focalLength}</div>}
          </div>
        )}
        {exif().width && exif().height && (
          <div class="flex gap-2">
            <Image class="w-4 h-4" />
            {exif().width} x {exif().height} ({exif().megapixels} MP)
          </div>
        )}
      </div>
      <div class="mt-auto text-sm text-gray-500 mb-4">2025 - Hunter Chen</div>
    </>
  );
}
