import requests
import os

API_URL = "http://127.0.0.1:8000/api/predict"
downloads = os.path.expanduser("~/Downloads")

test_list = [
    ("Real Potato Leaf 1 (Halo)", os.path.join(downloads, "Halo-2-3-1080x675.jpg"), True),
    ("Real Potato Leaf 2 (HN-RC)", os.path.join(downloads, "HN-RC-585.jpg"), True),
    ("Real Potato Leaf 3 (eat-potato)", os.path.join(downloads, "can-you-eat-potato-leaves.jpg"), True),
    ("Real Person Photo (marcus)", os.path.join(downloads, "marcus _image.jpg"), False),
]

for name, path, exp_success in test_list:
    if not os.path.exists(path):
        print("Skipping missing:", path)
        continue
    with open(path, "rb") as f:
        resp = requests.post(API_URL, files={"image": (os.path.basename(path), f, "image/jpeg")})
    data = resp.json()
    success = data.get("success")
    status = "PASSED" if success == exp_success else "FAILED"
    print(f"[{status}] {name}")
    print(f"       File: {os.path.basename(path)}")
    print(f"       Success: {success}, Error: {data.get('error_type')}")
    if success:
        print(f"       Crop: {data.get('crop')} | Disease: {data.get('disease')} | Conf: {data.get('confidence')}%\n")
    else:
        print(f"       Message: {data.get('message')}\n")
