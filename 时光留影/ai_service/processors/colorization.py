import numpy as np
from PIL import Image

class ColorizationProcessor:
    def __init__(self):
        self.model = None
        print("[Color] Colorization processor initialized (simulated mode)")
    def process(self, image: Image.Image) -> Image.Image:
        if image.mode == "L" or self._is_effectively_grayscale(image):
            if image.mode == "L":
                image = image.convert("RGB")
            arr = np.array(image, dtype=np.float32)
            arr[:, :, 0] *= 1.05
            arr[:, :, 1] *= 1.02
            arr[:, :, 2] *= 0.95
            arr = np.clip(arr, 0, 255).astype(np.uint8)
            image = Image.fromarray(arr)
            print("[Color] Applied colorization")
        else:
            print("[Color] Image is already colored, skipped")
        return image
    def _is_effectively_grayscale(self, image: Image.Image) -> bool:
        if image.mode != "RGB":
            return True
        arr = np.array(image)
        diff = np.abs(arr[:,:,0].astype(int) - arr[:,:,1].astype(int)).mean()
        diff += np.abs(arr[:,:,1].astype(int) - arr[:,:,2].astype(int)).mean()
        return diff < 15
    def load_model(self):
        pass
