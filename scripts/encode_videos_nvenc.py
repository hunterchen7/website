#!/usr/bin/env python3
"""
Recursively find `video.webm` files under a root directory and re-encode them to
NVENC HEVC MP4 using ffmpeg with a high-quality preset and -qp 20.

Usage:
  python scripts/encode_videos_nvenc.py [--root PATH] [--dry-run] [--overwrite]

Defaults:
  root: public/projects

Notes:
  - Requires ffmpeg with hevc_nvenc support (NVIDIA GPU + driver + ffmpeg built with --enable-nvenc).
  - On Windows, run in cmd/powershell; on other OSes, run with python3.
"""

import argparse
import shutil
import subprocess
from pathlib import Path


def find_video_files(root: Path, ext=".mp4"):
    # Find all files with the given extension (case-insensitive)
    matches = []
    for p in root.rglob("*"):
        if p.is_file() and p.suffix.lower() == ext.lower():
            matches.append(p)
    return matches


def check_ffmpeg_nvenc():
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        return False, "ffmpeg not found in PATH"
    # Check encoders list
    try:
        out = subprocess.check_output(
            [ffmpeg, "-hide_banner", "-encoders"], stderr=subprocess.STDOUT, text=True)
    except subprocess.CalledProcessError as e:
        return False, f"ffmpeg returned non-zero exit when querying encoders: {e}"

    if "hevc_nvenc" in out or "h264_nvenc" in out:
        return True, ffmpeg
    return False, "ffmpeg found but hevc_nvenc encoder not available"


def encode_file(ffmpeg_cmd: str, src: Path, dst: Path, overwrite: bool = False):
    if dst.exists() and not overwrite:
        return False, f"destination exists: {dst}"

    dst.parent.mkdir(parents=True, exist_ok=True)

    # Build ffmpeg command for nvenc hevc (HEVC/H.265)
    # Use high-quality variable bitrate and cap at 5 Mbps
    cmd = [
        ffmpeg_cmd,
        "-y" if overwrite else "-n",
        "-hwaccel",
        "auto",
        "-i",
        str(src),
        "-c:v",
        "hevc_nvenc",
        "-preset",
        "p7",
        "-rc",
        "vbr_hq",
        "-cq",
        "25",
        "-b:v",
        "3M",
        "-maxrate",
        "3M",
        "-bufsize",
        "10M",
        # scale to exactly half width and half height, ensuring even dimensions
        # iw/2 and ih/2 may produce non-integer for odd inputs; force to even with trunc() and *2
        "-vf",
        "scale=trunc(iw/2/2)*2:trunc(ih/2/2)*2",
        "-an",
        str(dst),
    ]

    try:
        subprocess.check_call(cmd)
        return True, "encoded"
    except subprocess.CalledProcessError as e:
        return False, f"ffmpeg failed: {e}"


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--root", default="../public/projects",
                   help="root directory to search")
    p.add_argument("--dry-run", action="store_true",
                   help="list files but don't encode")
    p.add_argument("--overwrite", action="store_true",
                   help="overwrite existing outputs")
    args = p.parse_args()

    root = Path(args.root)
    if not root.exists():
        print(f"Root not found: {root}")
        return

    ok, ffmpeg_or_msg = check_ffmpeg_nvenc()
    if not ok:
        print("FFmpeg NVENC check failed:", ffmpeg_or_msg)
        print("You can still run with --dry-run, or install an ffmpeg build with nvenc.")
        if args.dry_run:
            print("Continuing in dry-run mode.")
        else:
            return
    else:
        ffmpeg_cmd = ffmpeg_or_msg

    files = find_video_files(root, ext=".mp4")
    if not files:
        print("No video.webm files found under", root)
        return

    print(f"Found {len(files)} files")

    for src in files:
        # re-encode in-place: write to temp then replace original
        dst = src.with_suffix(".tmp.mp4")
        print("->", src, "=>", dst)
        if args.dry_run:
            continue
        ok, msg = encode_file(ffmpeg_cmd, src, dst, overwrite=True)
        print("   ", msg)
        if ok:
            try:
                # replace original with new file
                dst.replace(src)
            except Exception as e:
                print("   failed to replace original:", e)


if __name__ == "__main__":
    main()
