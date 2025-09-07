import asyncio
import sys
import os

# Paths to scripts
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
CONVERT_SCRIPT = os.path.join(SCRIPT_DIR, "convert_jpg_to_webp_thumnail.py")
MANIFEST_SCRIPT = os.path.join(SCRIPT_DIR, "generate_photos_manifest.py")

async def run_script(script_path, description):
    print(description)
    proc = await asyncio.create_subprocess_exec(
        sys.executable, script_path
    )
    await proc.wait()

async def main():
    await run_script(MANIFEST_SCRIPT, "Generating manifest...")
    await run_script(CONVERT_SCRIPT, "Converting JPGs to webp and thumbnails...")
    print("All done.")

if __name__ == "__main__":
    asyncio.run(main())
