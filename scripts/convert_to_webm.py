#!/usr/bin/env python3
"""
Recursively find `video.mp4` files under a root directory and convert them
to WebM (VP9 + Opus). The original mp4 files are kept.

Usage:
  python scripts/convert_to_webm.py [--root PATH] [--dry-run] [--overwrite]

Defaults:
  root: public/projects

Notes:
  - Requires ffmpeg installed and available on PATH.
  - The script attempts to create WebM files that are playable while
    downloading/streaming by using WebM muxer clustering options that place
    cues/cluster information frequently. Exact behaviour depends on ffmpeg
    version and player.
"""

import argparse
import shutil
import subprocess
from pathlib import Path


def find_video_files(root: Path, name="video.mp4"):
    matches = []
    for p in root.rglob("*"):
        if p.is_file() and p.name == name:
            matches.append(p)
    return matches


def check_ffmpeg():
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        return False, "ffmpeg not found in PATH"
    # Check for supported encoders
    try:
        out = subprocess.check_output(
            [ffmpeg, "-hide_banner", "-encoders"], stderr=subprocess.STDOUT, text=True)
    except subprocess.CalledProcessError as e:
        return False, f"ffmpeg returned non-zero exit when querying encoders: {e}"

    if "libvpx-vp9" in out or "libvpx" in out:
        if "libopus" in out or "opus" in out:
            return True, ffmpeg
        # opus may be provided as builtin in some builds; still return ffmpeg
        return True, ffmpeg
    return False, "ffmpeg found but libvpx-vp9 (VP9) encoder not available"


def encode_file(ffmpeg_cmd: str, src: Path, dst: Path, overwrite: bool = False, crf: int = 25, threads: int = 8):
    if dst.exists() and not overwrite:
        return False, f"destination exists: {dst}"

    dst.parent.mkdir(parents=True, exist_ok=True)

    # Build ffmpeg command to encode VP9 WebM tuned for streaming.
    # Keep original resolution and drop audio. Mirror bitrate caps
    # from the NVENC script: cap at ~3M with a CRF quality similar to CQ 25.
    cmd = [
        ffmpeg_cmd,
        "-hide_banner",
        "-y" if overwrite else "-n",
        "-i",
        str(src),
        # drop audio
        "-an",
        # video
        "-c:v",
        "libvpx-vp9",
        "-crf",
        str(crf),
        # set target / cap similar to nvenc settings
        "-b:v",
        "3M",
        "-maxrate",
        "3M",
        "-bufsize",
        "10M",
        "-pix_fmt",
        "yuv420p",
        "-row-mt",
        "1",
        "-g",
        "240",
        # performance/quality tradeoffs
        "-deadline",
        "good",
        "-cpu-used",
        "1",
        # threads
        "-threads",
        str(threads),
        # webm muxer options: cluster_time_limit controls cluster length (ms)
        # and can help create more frequent clusters/cues so playback can
        # start earlier while downloading. cluster_time_limit=2000 => 2s
        # clusters. cluster_size_limit is set large to avoid triggering
        # size-based cluster splitting.
        "-f",
        "webm",
        "-cluster_time_limit",
        "2000",
        "-cluster_size_limit",
        "2097152",
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
    p.add_argument("--crf", type=int, default=30,
                   help="VP9 CRF quality (lower = better quality, 15-40)")
    p.add_argument("--threads", type=int, default=0,
                   help="threads to pass to encoder (0 = let encoder decide)")
    args = p.parse_args()

    root = Path(args.root)
    if not root.exists():
        print(f"Root not found: {root}")
        return

    ok, ffmpeg_or_msg = check_ffmpeg()
    if not ok:
        print("FFmpeg check warning:", ffmpeg_or_msg)
        print("You can still run with --dry-run, or install an ffmpeg build with libvpx (VP9).")
        if args.dry_run:
            print("Continuing in dry-run mode.")
        else:
            return
    else:
        ffmpeg_cmd = ffmpeg_or_msg

    files = find_video_files(root, name="video.mp4")
    if not files:
        print("No video.mp4 files found under", root)
        return

    print(f"Found {len(files)} files")

    for src in files:
        dst = src.with_suffix(".webm")
        print("->", src, "=>", dst)
        if args.dry_run:
            continue
        ok, msg = encode_file(
            ffmpeg_cmd, src, dst, overwrite=args.overwrite, crf=args.crf, threads=args.threads)
        print("   ", msg)


if __name__ == "__main__":
    main()
