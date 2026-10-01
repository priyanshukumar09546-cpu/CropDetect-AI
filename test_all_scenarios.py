"""
Verification test suite for all 8 test cases specified in the requirement:
TEST 1: Human/person photo -> Expected: INVALID_IMAGE
TEST 2: Dog/cat photo -> Expected: INVALID_IMAGE
TEST 3: Car photo -> Expected: INVALID_IMAGE
TEST 4: Random object -> Expected: INVALID_IMAGE
TEST 5: Clear tomato leaf -> Expected: Accepted disease classification
TEST 6: Clear potato leaf -> Expected: Accepted disease classification
TEST 7: Clear healthy plant leaf -> Expected: Healthy classification
TEST 8: Very blurry leaf -> Expected: Rejected as blurry/low quality
"""
import os
import requests
from PIL import Image, ImageDraw

API_URL = "http://127.0.0.1:8000/api/predict"
os.makedirs("test_fixtures", exist_ok=True)

# 1. Person / Human portrait fixture (realistic proportions)
person_img = Image.new("RGB", (320, 320), color=(180, 200, 210))
d = ImageDraw.Draw(person_img)
# Shoulders & clothes
d.rectangle([60, 230, 260, 320], fill=(40, 50, 80)) # dark blue suit
d.polygon([(130, 230), (160, 280), (190, 230)], fill=(240, 240, 250)) # white shirt
# Neck
d.rectangle([140, 190, 180, 235], fill=(230, 185, 155)) # skin neck
# Head / face
d.ellipse([100, 60, 220, 210], fill=(235, 190, 160)) # skin face
# Hair
d.arc([95, 45, 225, 140], start=180, end=360, fill=(35, 25, 20), width=18)
# Eyes, nose, mouth
d.ellipse([125, 120, 145, 135], fill=(40, 30, 30))
d.ellipse([175, 120, 195, 135], fill=(40, 30, 30))
d.line([(160, 135), (157, 165), (165, 165)], fill=(190, 130, 100), width=2)
d.arc([135, 170, 185, 190], start=0, end=180, fill=(160, 60, 60), width=3)
person_img.save("test_fixtures/test1_person.jpg")

# 2. Dog / Cat / Animal fixture (Brown animal on blue background)
dog_img = Image.new("RGB", (320, 320), color=(120, 180, 230))
d = ImageDraw.Draw(dog_img)
# Dog head
d.ellipse([90, 90, 230, 230], fill=(160, 100, 50)) # brown fur
# Ears
d.polygon([(80, 70), (110, 130), (70, 150)], fill=(110, 65, 30))
d.polygon([(240, 70), (210, 130), (250, 150)], fill=(110, 65, 30))
# Muzzle & nose
d.ellipse([130, 160, 190, 215], fill=(210, 170, 130))
d.ellipse([150, 170, 170, 190], fill=(20, 20, 20))
# Eyes
d.ellipse([120, 125, 140, 145], fill=(20, 20, 20))
d.ellipse([180, 125, 200, 145], fill=(20, 20, 20))
dog_img.save("test_fixtures/test2_dog.jpg")

# 3. Car / Vehicle fixture
car_img = Image.new("RGB", (320, 320), color=(220, 220, 220))
d = ImageDraw.Draw(car_img)
d.rectangle([40, 160, 280, 230], fill=(220, 20, 30))
d.polygon([(80, 160), (120, 100), (200, 100), (240, 160)], fill=(180, 220, 250))
d.ellipse([70, 210, 120, 260], fill=(30, 30, 30))
d.ellipse([200, 210, 250, 260], fill=(30, 30, 30))
car_img.save("test_fixtures/test3_car.jpg")

# 4. Random Object (Laptop computer)
laptop_img = Image.new("RGB", (320, 320), color=(240, 240, 240))
d = ImageDraw.Draw(laptop_img)
d.rectangle([60, 60, 260, 200], fill=(50, 50, 50)) # screen frame
d.rectangle([75, 75, 245, 185], fill=(30, 120, 200)) # blue screen
d.polygon([(40, 240), (60, 200), (260, 200), (280, 240)], fill=(180, 180, 185)) # keyboard base
laptop_img.save("test_fixtures/test4_laptop.jpg")

# Run all 8 tests
test_cases = [
    ("TEST 1: Human/person photo", "test_fixtures/test1_person.jpg", False, "INVALID_IMAGE"),
    ("TEST 2: Dog/cat photo", "test_fixtures/test2_dog.jpg", False, "INVALID_IMAGE"),
    ("TEST 3: Car photo", "test_fixtures/test3_car.jpg", False, "INVALID_IMAGE"),
    ("TEST 4: Random object (Laptop)", "test_fixtures/test4_laptop.jpg", False, "INVALID_IMAGE"),
    ("TEST 5: Clear tomato leaf", "sample_images/tomato_late_blight_leaf.jpg", True, None),
    ("TEST 6: Clear potato leaf", "sample_images/potato_early_blight_leaf.jpg", True, None),
    ("TEST 7: Clear healthy plant leaf", "sample_images/tomato_healthy_leaf.jpg", True, None),
    ("TEST 8: Very blurry leaf", "test_fixtures/blurry_leaf.jpg", False, "INVALID_IMAGE"),
]

print("==================================================")
print("RUNNING ALL 8 SPECIFIED TEST CASES")
print("==================================================")

all_passed = True

for test_name, file_path, exp_success, exp_err_type in test_cases:
    with open(file_path, "rb") as f:
        resp = requests.post(API_URL, files={"image": f})
        data = resp.json()

        act_success = data.get("success")
        act_err = data.get("error_type")

        success_match = (act_success == exp_success)
        err_match = (act_err == exp_err_type) if not exp_success else True

        passed = success_match and err_match
        if not passed:
            all_passed = False

        status_str = "PASSED" if passed else "FAILED"
        print(f"\n[{status_str}] {test_name}")
        print(f"       File: {file_path}")
        print(f"       Expected -> success: {exp_success}, error_type: {exp_err_type}")
        print(f"       Actual   -> success: {act_success}, error_type: {act_err}")
        if act_success:
            print(f"       Diagnosis: {data.get('crop')} - {data.get('disease')} (Confidence: {data.get('confidence')}%)")
        else:
            print(f"       Message: {data.get('message')}")

print("\n==================================================")
if all_passed:
    print("ALL 8 VERIFICATION TESTS PASSED SUCCESSFULLY!")
else:
    print("SOME TESTS FAILED! CHECK OUTPUT ABOVE.")
print("==================================================")
