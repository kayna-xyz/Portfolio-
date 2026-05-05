#!/usr/bin/env python3
"""
Convert a video to black-and-white ASCII art style.
Effects applied:
  - Crop 180px from top and bottom
  - Slow-motion 2x for the 0:04–0:07 segment
  - ASCII character mapping with contrast/gamma enhancement
  - Audio time-stretched to match
"""
import os, sys, subprocess, shutil
import static_ffmpeg
static_ffmpeg.add_paths()

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# ── paths ──────────────────────────────────────────────────────────────────
INPUT  = '/Users/xiaohuanghuang/Downloads/hf_20260505_020936_b75b97c1-bd79-43dc-8b87-e195eacb6091_trimmed.mp4'
OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'output', 'ascii-video.mp4')
ORIG   = os.path.join(os.path.dirname(__file__), '..', 'public', 'input',  'original.mp4')
OUTPUT = os.path.abspath(OUTPUT)
ORIG   = os.path.abspath(ORIG)

# ── edit parameters ─────────────────────────────────────────────────────────
CROP_TOP      = 180
CROP_BOTTOM   = 180
SLOWMO_START  = 4.0   # seconds
SLOWMO_END    = 7.0   # seconds
SLOWMO_FACTOR = 2     # each frame duplicated this many times

# ── ASCII parameters ─────────────────────────────────────────────────────────
N_COLS    = 180    # number of character columns
FONT_SIZE = 11     # pt; determines output resolution
# Character ramp: sparse (dark on black bg ≈ dark) → dense (bright on black bg ≈ bright)
CHARS = list(' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$')

# contrast/gamma
CLAHE_CLIP  = 3.0
GAMMA       = 1.35    # >1 boosts mid-tones
CRF         = 20      # libx264 quality (lower = better)


def get_ffmpeg_bin():
    ffmpeg = shutil.which('ffmpeg')
    if ffmpeg:
        return ffmpeg
    # static_ffmpeg stores binaries in its package dir
    import static_ffmpeg.run as sfr
    try:
        return sfr.get_platform_executables_or_raise()[0]
    except Exception:
        raise RuntimeError('ffmpeg binary not found')


def load_font(size):
    candidates = [
        '/System/Library/Fonts/Menlo.ttc',
        '/Library/Fonts/Courier New.ttf',
        '/System/Library/Fonts/Monaco.dfont',
        '/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf',
        '/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf',
    ]
    for path in candidates:
        try:
            return ImageFont.truetype(path, size)
        except Exception:
            pass
    print('[warn] Could not load TrueType font; falling back to bitmap.')
    return ImageFont.load_default()


def measure_char(font):
    probe = Image.new('L', (200, 200))
    d = ImageDraw.Draw(probe)
    bbox = d.textbbox((0, 0), 'W', font=font)
    w = bbox[2] - bbox[0]
    h = bbox[3] - bbox[1]
    return max(w, 1), max(h, 1)


def build_char_atlas(chars, font, cw, ch):
    """Pre-render every unique character as a grayscale numpy array."""
    atlas = np.zeros((len(chars), ch, cw), dtype=np.uint8)
    for i, c in enumerate(chars):
        img = Image.new('L', (cw, ch), 0)
        ImageDraw.Draw(img).text((0, 0), c, fill=255, font=font)
        atlas[i] = np.array(img)
    return atlas


def build_gamma_lut(gamma):
    return np.array([int(((i / 255.0) ** (1.0 / gamma)) * 255) for i in range(256)], dtype=np.uint8)


def process_frame(gray, clahe, gamma_lut, atlas, n_cols, n_rows, cw, ch):
    gray = clahe.apply(gray)
    gray = gamma_lut[gray]

    small = cv2.resize(gray, (n_cols, n_rows), interpolation=cv2.INTER_AREA)

    # map brightness → char index
    idx = (small.astype(np.float32) / 255.0 * (len(atlas) - 1)).astype(np.int32)
    idx = np.clip(idx, 0, len(atlas) - 1)

    # vectorised assembly: atlas[idx] → (n_rows, n_cols, ch, cw)
    selected = atlas[idx]
    # rearrange axes: (n_rows, ch, n_cols, cw) → (n_rows*ch, n_cols*cw)
    out = selected.transpose(0, 2, 1, 3).reshape(n_rows * ch, n_cols * cw)
    return out


def main():
    ffmpeg = get_ffmpeg_bin()
    print(f'ffmpeg: {ffmpeg}')

    # copy original
    if not os.path.exists(ORIG):
        shutil.copy2(INPUT, ORIG)
        print(f'Copied original → {ORIG}')

    cap = cv2.VideoCapture(INPUT)
    fps       = cap.get(cv2.CAP_PROP_FPS)
    src_w     = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    src_h     = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    n_frames  = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    crop_h = src_h - CROP_TOP - CROP_BOTTOM
    print(f'Source  : {src_w}×{src_h} @ {fps:.2f} fps  ({n_frames} frames)')
    print(f'Cropped : {src_w}×{crop_h}')

    # font + grid
    font = load_font(FONT_SIZE)
    cw, ch = measure_char(font)
    print(f'Char    : {cw}×{ch} px')

    char_aspect = ch / cw          # ~2 for monospace
    cell_w      = src_w / N_COLS
    cell_h      = cell_w * char_aspect
    n_rows      = max(1, int(crop_h / cell_h))

    out_w = N_COLS * cw
    out_h = n_rows * ch
    # H.264 needs even dimensions
    out_w += out_w % 2
    out_h += out_h % 2
    print(f'Grid    : {N_COLS}×{n_rows} chars')
    print(f'Output  : {out_w}×{out_h} px')

    atlas     = build_char_atlas(CHARS, font, cw, ch)
    clahe     = cv2.createCLAHE(clipLimit=CLAHE_CLIP, tileGridSize=(8, 8))
    gamma_lut = build_gamma_lut(GAMMA)

    # ffmpeg pipe for silent output
    tmp_silent = OUTPUT.replace('.mp4', '_silent_tmp.mp4')
    pipe_cmd = [
        ffmpeg, '-y',
        '-f', 'rawvideo', '-vcodec', 'rawvideo',
        '-s', f'{out_w}x{out_h}', '-pix_fmt', 'gray',
        '-r', str(int(fps)), '-i', 'pipe:0',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', str(CRF),
        tmp_silent,
    ]
    proc = subprocess.Popen(pipe_cmd, stdin=subprocess.PIPE)

    slowmo_s = int(SLOWMO_START * fps)
    slowmo_e = int(SLOWMO_END   * fps)

    fi = 0
    written = 0
    while True:
        ok, frame = cap.read()
        if not ok:
            break

        cropped = frame[CROP_TOP: CROP_TOP + crop_h]
        gray    = cv2.cvtColor(cropped, cv2.COLOR_BGR2GRAY)
        art     = process_frame(gray, clahe, gamma_lut, atlas, N_COLS, n_rows, cw, ch)

        # pad to even dimensions if needed
        if art.shape != (out_h, out_w):
            padded = np.zeros((out_h, out_w), dtype=np.uint8)
            padded[:art.shape[0], :art.shape[1]] = art
            art = padded

        reps = SLOWMO_FACTOR if (slowmo_s <= fi < slowmo_e) else 1
        raw  = art.tobytes()
        for _ in range(reps):
            proc.stdin.write(raw)
            written += 1

        fi += 1
        if fi % 12 == 0 or fi == n_frames:
            pct = fi / n_frames * 100
            sys.stdout.write(f'\r  {pct:5.1f}%  frame {fi}/{n_frames}  →  {written} out')
            sys.stdout.flush()

    cap.release()
    proc.stdin.close()
    ret = proc.wait()
    print(f'\nSilent video written: {tmp_silent}  (ffmpeg exit {ret})')

    if ret != 0:
        print('ERROR: ffmpeg encoding failed. Check messages above.')
        sys.exit(1)

    # ── add audio ─────────────────────────────────────────────────────────────
    # Mirror the frame-level slow-mo in the audio stream.
    # Section A: 0 → SLOWMO_START  (normal speed)
    # Section B: SLOWMO_START → SLOWMO_END  (atempo=0.5 for 2× slow)
    # Section C: SLOWMO_END → end  (normal speed)
    audio_filter = (
        f'[1:a]atrim=start=0:end={SLOWMO_START},asetpts=PTS-STARTPTS[a1];'
        f'[1:a]atrim=start={SLOWMO_START}:end={SLOWMO_END},'
        f'asetpts=PTS-STARTPTS,atempo=0.5[a2];'
        f'[1:a]atrim=start={SLOWMO_END},asetpts=PTS-STARTPTS[a3];'
        f'[a1][a2][a3]concat=n=3:v=0:a=1[aout]'
    )
    mix_cmd = [
        ffmpeg, '-y',
        '-i', tmp_silent,
        '-i', INPUT,
        '-filter_complex', audio_filter,
        '-map', '0:v', '-map', '[aout]',
        '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
        OUTPUT,
    ]
    print('Merging audio…')
    r2 = subprocess.run(mix_cmd, capture_output=True, text=True)
    if r2.returncode != 0:
        print('Audio merge failed – keeping silent version.')
        print(r2.stderr[-800:])
        shutil.move(tmp_silent, OUTPUT)
    else:
        os.remove(tmp_silent)
        print('Audio merged OK.')

    print(f'\n✓ Done → {OUTPUT}')


if __name__ == '__main__':
    main()
