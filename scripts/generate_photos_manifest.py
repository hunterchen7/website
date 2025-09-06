import os
import json
from datetime import datetime
from PIL import Image
from PIL.ExifTags import TAGS

FAVOURITES_DIR = "./favourites"
OUTPUT_JSON = "./public/photos.json"

photos = []

def get_exif_date(img_path):
    try:
        image = Image.open(img_path)
        exif_data = image._getexif()
        if not exif_data:
            return None
        for tag_id, value in exif_data.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "DateTimeOriginal":
                # Convert EXIF date format to ISO
                try:
                    dt = datetime.strptime(value, "%Y:%m:%d %H:%M:%S")
                    return dt.isoformat()
                except Exception:
                    return value
        return None
    except Exception:
        return None

for filename in os.listdir(FAVOURITES_DIR):
    if filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        img_path = os.path.join(FAVOURITES_DIR, filename)
        date = get_exif_date(img_path)
        base_name, ext = os.path.splitext(filename)
        url = f"{base_name}.webp"
        thumbnail = f"{base_name}-thumb.webp"
        photos.append({
            "url": url,
            "date": date or "",
            "thumbnail": thumbnail
        })

# Sort by date (newest first, fallback to filename if no date)
def sort_key(photo):
    # Use date if available, else fallback to url
    date = photo.get("date")
    if date:
        try:
            # Parse date string to datetime for accurate sorting
            return datetime.fromisoformat(date)
        except Exception:
            return date
    return photo["url"]
photos.sort(key=sort_key, reverse=True)

with open(OUTPUT_JSON, "w") as f:
    json.dump(photos, f, indent=2)

print(f"Manifest written to {OUTPUT_JSON} with {len(photos)} photos.")
