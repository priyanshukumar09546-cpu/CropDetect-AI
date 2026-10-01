import os
import cv2
import numpy as np
from PIL import Image, ImageDraw

# Create test images
os.makedirs("test_fixtures", exist_ok=True)

# 1. Human face / person fixture (oval with eyes, mouth, skin tone)
face_img = Image.new("RGB", (300, 300), color=(220, 220, 240))
draw = ImageDraw.Draw(face_img)
draw.ellipse([70, 50, 230, 240], fill=(240, 200, 170), outline=(180, 130, 100)) # skin face
draw.ellipse([100, 110, 130, 130], fill=(50, 40, 30)) # eye
draw.ellipse([170, 110, 200, 130], fill=(50, 40, 30)) # eye
draw.line([(150, 130), (145, 170), (160, 170)], fill=(180, 120, 90), width=3) # nose
draw.arc([115, 180, 185, 210], start=0, end=180, fill=(180, 50, 50), width=4) # smile
face_img.save("test_fixtures/synthetic_face.jpg")

# 2. Car / vehicle fixture (red car with wheels)
car_img = Image.new("RGB", (300, 300), color=(200, 200, 200))
draw = ImageDraw.Draw(car_img)
draw.rectangle([50, 140, 250, 200], fill=(220, 30, 30)) # car body
draw.polygon([(80, 140), (110, 90), (190, 90), (220, 140)], fill=(180, 200, 240)) # car cabin/window
draw.ellipse([75, 185, 115, 225], fill=(30, 30, 30)) # wheel
draw.ellipse([185, 185, 225, 225], fill=(30, 30, 30)) # wheel
car_img.save("test_fixtures/synthetic_car.jpg")

# 3. Completely blank / uniform image
blank_img = Image.new("RGB", (300, 300), color=(255, 255, 255))
blank_img.save("test_fixtures/blank_white.jpg")

# 4. Extremely blurry image
leaf = cv2.imread("sample_images/tomato_late_blight_leaf.jpg")
if leaf is not None:
    blurry_leaf = cv2.GaussianBlur(leaf, (51, 51), 0)
    cv2.imwrite("test_fixtures/blurry_leaf.jpg", blurry_leaf)

print("Created test fixtures successfully!")
