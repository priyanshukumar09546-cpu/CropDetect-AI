"""
Generates clean test leaf images in sample_images/ directory for easy demonstration and testing.
"""
import os
import math
from PIL import Image, ImageDraw

os.makedirs("sample_images", exist_ok=True)

def create_leaf_image(filename: str, leaf_color=(34, 139, 34), spot_color=None, has_spots=False):
    width, height = 400, 400
    img = Image.new("RGB", (width, height), color=(248, 250, 248))
    draw = ImageDraw.Draw(img)

    # Draw leaf blade (oval/pointed shape)
    cx, cy = 200, 200
    rx, ry = 110, 150
    draw.polygon([
        (cx, cy - ry),
        (cx + rx, cy - ry // 3),
        (cx + rx - 10, cy + ry // 3),
        (cx, cy + ry),
        (cx - rx + 10, cy + ry // 3),
        (cx - rx, cy - ry // 3)
    ], fill=leaf_color, outline=(20, 90, 20))

    # Main vein
    draw.line([(cx, cy - ry + 15), (cx, cy + ry + 30)], fill=(20, 80, 20), width=4)
    # Side veins
    for i in range(-4, 5):
        vy = cy + i * 25
        draw.line([(cx, vy), (cx + 65, vy - 20)], fill=(30, 95, 30), width=2)
        draw.line([(cx, vy), (cx - 65, vy - 20)], fill=(30, 95, 30), width=2)

    # Stem
    draw.line([(cx, cy + ry), (cx - 5, cy + ry + 40)], fill=(101, 67, 33), width=6)

    # If spots (disease symptom)
    if has_spots and spot_color:
        spot_coords = [
            (cx - 35, cy - 40, 22),
            (cx + 40, cy - 20, 26),
            (cx - 20, cy + 30, 30),
            (cx + 30, cy + 60, 20),
            (cx - 50, cy + 50, 18),
        ]
        for sx, sy, radius in spot_coords:
            # Concentric rings for blight or dark spots
            draw.ellipse([sx - radius, sy - radius, sx + radius, sy + radius], fill=(70, 40, 20))
            draw.ellipse([sx - radius + 4, sy - radius + 4, sx + radius - 4, sy + radius - 4], fill=spot_color)
            draw.ellipse([sx - 4, sy - 4, sx + 4, sy + 4], fill=(30, 15, 5))

    img.save(os.path.join("sample_images", filename), "JPEG", quality=95)
    print(f"Created sample_images/{filename}")

create_leaf_image("tomato_healthy_leaf.jpg", leaf_color=(46, 139, 87), has_spots=False)
create_leaf_image("tomato_late_blight_leaf.jpg", leaf_color=(75, 120, 60), spot_color=(50, 35, 20), has_spots=True)
create_leaf_image("potato_early_blight_leaf.jpg", leaf_color=(80, 130, 50), spot_color=(90, 55, 25), has_spots=True)
create_leaf_image("apple_rust_leaf.jpg", leaf_color=(60, 140, 60), spot_color=(200, 100, 20), has_spots=True)
create_leaf_image("corn_common_rust_leaf.jpg", leaf_color=(70, 145, 55), spot_color=(180, 80, 20), has_spots=True)
