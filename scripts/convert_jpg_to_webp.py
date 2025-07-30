
import os
from PIL import Image
from concurrent.futures import ThreadPoolExecutor, as_completed


# Set your favourites folder path
FAVOURITES_DIR = os.path.join(os.path.dirname(__file__), '../', '', 'favourites')
# Set output folder for webp files
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), '../', '', 'favourites_webp')

# Compression quality (0-100, lower = smaller file)
WEBP_QUALITY = 80
# Number of threads (adjust as needed)
NUM_THREADS = min(8, os.cpu_count() or 4)

def convert_single_jpg(jpg_path):
    # Get filename without extension
    filename = os.path.splitext(os.path.basename(jpg_path))[0] + '.webp'
    webp_path = os.path.join(OUTPUT_DIR, filename)
    try:
        with Image.open(jpg_path) as img:
            exif = img.info.get('exif')
            icc_profile = img.info.get('icc_profile')
            save_kwargs = {'quality': WEBP_QUALITY}
            if exif:
                save_kwargs['exif'] = exif
            if icc_profile:
                save_kwargs['icc_profile'] = icc_profile
            img.save(webp_path, 'webp', **save_kwargs)
        print(f"Converted: {os.path.basename(jpg_path)} -> {os.path.basename(webp_path)}")
    except Exception as e:
        print(f"Error converting {os.path.basename(jpg_path)}: {e}")

def convert_jpgs_to_webp_multithread(folder):
    if not os.path.exists(OUTPUT_DIR):
        os.makedirs(OUTPUT_DIR)
    jpg_files = [os.path.join(folder, f) for f in os.listdir(folder) if f.lower().endswith('.jpg')]
    if not jpg_files:
        print("No JPG files found.")
        return
    with ThreadPoolExecutor(max_workers=NUM_THREADS) as executor:
        futures = [executor.submit(convert_single_jpg, jpg) for jpg in jpg_files]
        for future in as_completed(futures):
            future.result()

if __name__ == "__main__":
    if not os.path.exists(FAVOURITES_DIR):
        print(f"Folder not found: {FAVOURITES_DIR}")
    else:
        convert_jpgs_to_webp_multithread(FAVOURITES_DIR)
        print("Done.")
