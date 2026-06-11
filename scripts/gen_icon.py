"""Generate Magnet app icon: 3x3 rounded-square grid (IG nine-grid) on dark bg."""
from PIL import Image, ImageDraw

BG = (13, 13, 13)        # #0d0d0d
PINK = (232, 93, 138)    # #e85d8a brand pink

SS = 4  # supersample factor for crisp anti-aliased corners


def make_grid(size, padding_ratio, gap_ratio, corner_ratio, bg=BG):
    """Render a centered 3x3 rounded-square grid.

    padding_ratio: fraction of full canvas used as safe margin on each side.
    gap_ratio: gap between cells as fraction of cell side.
    corner_ratio: cell corner radius as fraction of cell side.
    """
    S = size * SS
    img = Image.new("RGB", (S, S), bg)
    d = ImageDraw.Draw(img)

    pad = S * padding_ratio
    grid = S - 2 * pad                      # full grid span (cells + gaps)
    # grid = 3*cell + 2*gap ; gap = gap_ratio*cell
    cell = grid / (3 + 2 * gap_ratio)
    gap = gap_ratio * cell
    radius = corner_ratio * cell

    for r in range(3):
        for c in range(3):
            x0 = pad + c * (cell + gap)
            y0 = pad + r * (cell + gap)
            d.rounded_rectangle(
                [x0, y0, x0 + cell, y0 + cell],
                radius=radius,
                fill=PINK,
            )
    return img.resize((size, size), Image.LANCZOS)


# iOS / main icon: ~20% padding, tighter precise grid
icon = make_grid(1024, padding_ratio=0.20, gap_ratio=0.18, corner_ratio=0.24)
icon.save(r"C:\dev\magnet-app\assets\icon.png")

# Android adaptive foreground: grid smaller (Android crops to a circle/squircle
# and reserves a large safe zone ~ outer 25%). Push padding bigger.
adaptive = make_grid(1024, padding_ratio=0.30, gap_ratio=0.18, corner_ratio=0.24)
adaptive.save(r"C:\dev\magnet-app\assets\adaptive-icon.png")

print("done")
