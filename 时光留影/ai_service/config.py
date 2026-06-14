from pydantic_settings import BaseSettings

class AISettings(BaseSettings):
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    GFPGAN_MODEL_PATH: str = "models/GFPGANv1.4.pth"
    ESRGAN_MODEL_PATH: str = "models/RealESRGAN_x4plus.pth"
    COLORIZATION_MODEL_PATH: str = "models/Colorization.pth"
    INPAINTING_MODEL_PATH: str = "models/lama.pt"
    DEVICE: str = "cuda"
    MAX_IMAGE_SIZE: int = 4096
    USE_FACE_ENHANCE: bool = True
    TEMP_DIR: str = "/tmp/shiguang"
    OUTPUT_DIR: str = "/tmp/shiguang_output"
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = AISettings()
