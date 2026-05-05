#!/usr/bin/env python3
"""
ASCII art video renderer – parameterised.
Usage:
    python3 generate-ascii-video-v2.py --config /path/to/config.json

Progress lines written to stdout:
    PROGRESS:50.0
    DONE:ok
    ERROR:message
"""
import argparse, json, os, sys, subprocess, shutil, random
import static_ffmpeg
static_ffmpeg.add_paths()

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# ── Defaults ──────────────────────────────────────────────────────────────────
DEFAULT = {
    "inputPath":    None,
    "outputPath":   None,
    "charSet":      "dense",
    "customChars":  "",
    "cols":         160,
    "contrast":     0,
    "brightness":   0,
    "gamma":        1.35,
    "blackLevel":   0,
    "whiteLevel":   255,
    "fontSize":     11,
    "colorMode":    "white-on-black",
    "fgColor":      "#ffffff",
    "bgColor":      "#000000",
    "cropTop":      180,
    "cropBottom":   180,
    "slowmoStart":  None,
    "slowmoEnd":    None,
    "slowmoFactor": 1,
    "targetFps":    None,
    "keepAudio":    True,
    "scanlines":    False,
    "crtEffect":    False,
    "glitchNoise":  False,
}

CHAR_SETS = {
    "binary": list("01"),
    "dense":  list(" .:-=+*#%@"),
    "glitch": list("01▓▒░#@%&$+=-:;."),
    "full":   list(" .'`^\",;:!i1lI|/tfjrvunzXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"),
}

COLOR_MODES = {
    "white-on-black": ("#ffffff", "#000000"),
    "black-on-white": ("#000000", "#ffffff"),
    "matrix":         ("#00ff41", "#000000"),
    "amber":          ("#ffb000", "#0a0000"),
}


def hex_to_rgb(h: str):
    h = h.lstrip("#")
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))


def get_ffmpeg():
    b = shutil.which("ffmpeg")
    if b:
        return b
    import static_ffmpeg.run as sfr
    return sfr.get_platform_executables_or_raise()[0]


def load_font(size):
    for fp in [
        "/System/Library/Fonts/Menlo.ttc",
        "/Library/Fonts/Courier New.ttf",
        "/System/Library/Fonts/Monaco.dfont",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ]:
        try:
            return ImageFont.truetype(fp, size)
        except Exception:
            pass
    return ImageFont.load_default()


def build_atlas(chars, font, cw, ch):
    atlas = np.zeros((len(chars), ch, cw), dtype=np.uint8)
    for i, c in enumerate(chars):
        img = Image.new("L", (cw, ch), 0)
        ImageDraw.Draw(img).text((0, 0), c, fill=255, font=font)
        atlas[i] = np.array(img)
    return atlas


def adjust_luma(gray_f: np.ndarray, cfg: dict) -> np.ndarray:
    """Apply black/white level → brightness → contrast → gamma."""
    bl, wl = cfg["blackLevel"], cfg["whiteLevel"]
    rng = max(1, wl - bl)
    g = (gray_f - bl) / rng * 255.0
    np.clip(g, 0, 255, out=g)

    g += cfg["brightness"] * 2.55
    np.clip(g, 0, 255, out=g)

    cf = 1.0 + cfg["contrast"] / 100.0
    g = (g - 128.0) * cf + 128.0
    np.clip(g, 0, 255, out=g)

    g = np.power(g / 255.0, 1.0 / max(0.05, cfg["gamma"])) * 255.0
    np.clip(g, 0, 255, out=g)
    return g


def apply_effects(rgb: np.ndarray, cfg: dict, fg_arr: np.ndarray, out_h: int, out_w: int) -> np.ndarray:
    if cfg.get("scanlines"):
        rgb[0::4, :] = (rgb[0::4, :] * 0.2).astype(np.uint8)

    if cfg.get("glitchNoise"):
        n = max(1, int(out_w * out_h * 0.004))
        ys = np.random.randint(0, out_h, n)
        xs = np.random.randint(0, out_w, n)
        rgb[ys, xs] = fg_arr.astype(np.uint8)

    if cfg.get("crtEffect"):
        cy, cx = out_h / 2, out_w / 2
        Y, X = np.mgrid[0:out_h, 0:out_w]
        dist = np.sqrt(((Y - cy) / out_h) ** 2 + ((X - cx) / out_w) ** 2)
        vignette = np.clip(1.0 - dist * 1.2, 0.3, 1.0).astype(np.float32)
        rgb = (rgb * vignette[:, :, None]).astype(np.uint8)

    return rgb


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", required=True)
    args = parser.parse_args()

    with open(args.config) as f:
        user = json.load(f)
    cfg = {**DEFAULT, **user}

    ffmpeg = get_ffmpeg()

    # ── Character set ───────────────────────────────────────────────────────
    if cfg["charSet"] == "custom" and cfg.get("customChars"):
        chars = list(dict.fromkeys(cfg["customChars"]))
    else:
        chars = CHAR_SETS.get(cfg["charSet"], CHAR_SETS["dense"])
    if len(chars) < 2:
        chars = CHAR_SETS["dense"]

    # ── Colors ─────────────────────────────────────────────────────────────
    if cfg["colorMode"] in COLOR_MODES:
        fg_hex, bg_hex = COLOR_MODES[cfg["colorMode"]]
    else:
        fg_hex = cfg.get("fgColor", "#ffffff")
        bg_hex = cfg.get("bgColor", "#000000")

    fg_arr = np.array(hex_to_rgb(fg_hex), dtype=np.float32)
    bg_arr = np.array(hex_to_rgb(bg_hex), dtype=np.float32)

    # ── Open source ─────────────────────────────────────────────────────────
    cap      = cv2.VideoCapture(cfg["inputPath"])
    src_fps  = cap.get(cv2.CAP_PROP_FPS) or 24.0
    src_w    = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    src_h    = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    n_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    out_fps   = float(cfg["targetFps"] or src_fps)
    crop_top  = int(cfg["cropTop"])
    crop_bot  = int(cfg["cropBottom"])
    crop_h    = max(1, src_h - crop_top - crop_bot)

    # ── Font + grid ─────────────────────────────────────────────────────────
    font = load_font(cfg["fontSize"])
    probe = Image.new("L", (200, 200))
    bbox = ImageDraw.Draw(probe).textbbox((0, 0), "W", font=font)
    cw = max(1, bbox[2] - bbox[0])
    ch = max(1, bbox[3] - bbox[1])

    n_cols      = int(cfg["cols"])
    char_aspect = ch / cw
    cell_h      = (src_w / n_cols) * char_aspect
    n_rows      = max(1, int(crop_h / cell_h))

    out_w = n_cols * cw + (n_cols * cw) % 2
    out_h = n_rows * ch + (n_rows * ch) % 2

    print(f"Grid: {n_cols}×{n_rows}  Output: {out_w}×{out_h}  FPS: {out_fps:.1f}", flush=True)

    atlas = build_atlas(chars, font, cw, ch)
    clahe = cv2.createCLAHE(clipLimit=2.5, tileGridSize=(8, 8))

    # ── Slow-mo settings ────────────────────────────────────────────────────
    sm_factor = max(1, int(cfg.get("slowmoFactor", 1)))
    sm_s = int(cfg["slowmoStart"] * src_fps) if cfg.get("slowmoStart") and sm_factor > 1 else None
    sm_e = int(cfg["slowmoEnd"]   * src_fps) if cfg.get("slowmoEnd")   and sm_factor > 1 else None

    # ── ffmpeg output pipe ─────────────────────────────────────────────────
    os.makedirs(os.path.dirname(cfg["outputPath"]), exist_ok=True)
    tmp = cfg["outputPath"].replace(".mp4", "_tmp_silent.mp4")

    pipe_cmd = [
        ffmpeg, "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{out_w}x{out_h}", "-pix_fmt", "rgb24",
        "-r", str(int(out_fps)), "-i", "pipe:0",
        "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20",
        tmp,
    ]
    proc = subprocess.Popen(pipe_cmd, stdin=subprocess.PIPE, stderr=subprocess.DEVNULL)

    fi = written = 0

    while True:
        ok, frame = cap.read()
        if not ok:
            break

        cropped = frame[crop_top: crop_top + crop_h]
        gray    = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)
        gray    = clahe.apply(gray)
        small   = cv2.resize(gray, (n_cols, n_rows), interpolation=cv2.INTER_AREA)

        small_f  = adjust_luma(small.astype(np.float32), cfg)
        idx      = np.clip((small_f / 255.0 * (len(chars) - 1)).astype(np.int32), 0, len(chars) - 1)
        selected = atlas[idx]                                      # (rows, cols, ch, cw)
        gray_out = selected.transpose(0, 2, 1, 3).reshape(n_rows * ch, n_cols * cw)

        # Pad to even
        pad = np.zeros((out_h, out_w), dtype=np.uint8)
        pad[:gray_out.shape[0], :gray_out.shape[1]] = gray_out

        # Colorise: interpolate bg→fg
        t = pad.astype(np.float32) / 255.0
        rgb = np.stack([
            (bg_arr[c] + (fg_arr[c] - bg_arr[c]) * t).clip(0, 255).astype(np.uint8)
            for c in range(3)
        ], axis=-1)

        rgb = apply_effects(rgb, cfg, fg_arr, out_h, out_w)

        reps = sm_factor if (sm_s is not None and sm_s <= fi < sm_e) else 1
        raw  = rgb.tobytes()
        for _ in range(reps):
            proc.stdin.write(raw)
            written += 1

        fi += 1
        if fi % 6 == 0 or fi == n_frames:
            print(f"PROGRESS:{fi / n_frames * 100:.1f}", flush=True)

    cap.release()
    proc.stdin.close()
    ret = proc.wait()

    if ret != 0:
        print("ERROR:ffmpeg encoding failed", flush=True)
        sys.exit(1)

    # ── Audio ───────────────────────────────────────────────────────────────
    if not cfg.get("keepAudio", True):
        shutil.move(tmp, cfg["outputPath"])
        print("DONE:ok", flush=True)
        return

    if sm_s is not None and sm_e is not None and sm_factor > 1:
        slowmo_start = cfg["slowmoStart"]
        slowmo_end   = cfg["slowmoEnd"]
        tempo        = 1.0 / sm_factor   # e.g. 0.5 for 2×
        # atempo requires [0.5, 100]; chain filters for slower rates
        atempo_chain = ",".join([f"atempo=0.5"] * int(1 / tempo)) if tempo < 0.5 else f"atempo={tempo}"
        audio_filter = (
            f"[1:a]atrim=start=0:end={slowmo_start},asetpts=PTS-STARTPTS[a1];"
            f"[1:a]atrim=start={slowmo_start}:end={slowmo_end},"
            f"asetpts=PTS-STARTPTS,{atempo_chain}[a2];"
            f"[1:a]atrim=start={slowmo_end},asetpts=PTS-STARTPTS[a3];"
            f"[a1][a2][a3]concat=n=3:v=0:a=1[aout]"
        )
        mix = [
            ffmpeg, "-y",
            "-i", tmp, "-i", cfg["inputPath"],
            "-filter_complex", audio_filter,
            "-map", "0:v", "-map", "[aout]",
            "-c:v", "copy", "-c:a", "aac",
            cfg["outputPath"],
        ]
    else:
        mix = [
            ffmpeg, "-y",
            "-i", tmp, "-i", cfg["inputPath"],
            "-map", "0:v", "-map", "1:a",
            "-c:v", "copy", "-c:a", "aac", "-shortest",
            cfg["outputPath"],
        ]

    r = subprocess.run(mix, capture_output=True)
    if r.returncode != 0:
        shutil.move(tmp, cfg["outputPath"])
    else:
        os.remove(tmp)

    print("DONE:ok", flush=True)


if __name__ == "__main__":
    main()
