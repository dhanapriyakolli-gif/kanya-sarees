from dotenv import load_dotenv
load_dotenv()

import cloudinary.uploader
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
MEDIA_ROOT = BASE_DIR / "media" / "products"

for image_path in MEDIA_ROOT.iterdir():
    if not image_path.is_file():
        continue

    print(f"Uploading: {image_path.name}")

    result = cloudinary.uploader.upload(
    str(image_path),
    public_id=f"products/{image_path.stem}",
    overwrite=True,
)

    print(f"Uploaded: {result['public_id']}")

print("Finished uploading images.")