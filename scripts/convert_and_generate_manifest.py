import subprocess
import sys
import os

# Paths to scripts
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONVERT_SCRIPT = os.path.join(SCRIPT_DIR, "convert_jpg_to_webp_thumnail.py")
MANIFEST_SCRIPT = os.path.join(SCRIPT_DIR, "generate_photos_manifest.py")

# Run convert_jpg_to_webp_thumnail.py
print("Converting JPGs to webp and thumbnails...")
subprocess.run([sys.executable, CONVERT_SCRIPT], check=True)

# Run generate_photos_manifest.py
print("Generating manifest...")
subprocess.run([sys.executable, MANIFEST_SCRIPT], check=True)

print("All done.")
