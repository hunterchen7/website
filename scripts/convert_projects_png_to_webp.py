import os
from PIL import Image

PROJECTS_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'projects')

png_to_webp_map = {}

def convert_png_to_webp(png_path):
    webp_path = os.path.splitext(png_path)[0] + '.webp'
    try:
        with Image.open(png_path) as img:
            img.save(webp_path, 'webp', quality=85)
        print(f"Converted: {png_path} -> {webp_path}")
        # Delete PNG after successful conversion
        try:
            os.remove(png_path)
            print(f"Deleted: {png_path}")
        except Exception as del_err:
            print(f"Error deleting {png_path}: {del_err}")
        return webp_path
    except Exception as e:
        print(f"Error converting {png_path}: {e}")
        return None

def process_folder(folder):
    for root, _, files in os.walk(folder):
        for file in files:
            if file.lower().endswith('.png'):
                png_path = os.path.join(root, file)
                webp_path = convert_png_to_webp(png_path)
                if webp_path:
                    rel_png = os.path.relpath(png_path, PROJECTS_DIR).replace('\\', '/')
                    rel_webp = os.path.relpath(webp_path, PROJECTS_DIR).replace('\\', '/')
                    png_to_webp_map['/projects/' + rel_png] = '/projects/' + rel_webp

if __name__ == "__main__":
    process_folder(PROJECTS_DIR)
    # Output mapping for updating projects.ts
    print("\nPNG to WebP mapping:")
    for k, v in png_to_webp_map.items():
        print(f"{k} -> {v}")
    print("\nDone.")
