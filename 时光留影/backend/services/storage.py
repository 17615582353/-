from qiniu import Auth, put_file, BucketManager
from config import settings

class StorageService:
    def __init__(self):
        self.auth = Auth(settings.STORAGE_ACCESS_KEY, settings.STORAGE_SECRET_KEY)
        self.bucket = settings.STORAGE_BUCKET
        self.domain = settings.STORAGE_DOMAIN
    def get_upload_token(self, key: str) -> str:
        return self.auth.upload_token(self.bucket, key, 3600)
    def get_download_url(self, key: str) -> str:
        return f"{self.domain}/{key}"
    def upload_file(self, local_path: str, key: str) -> bool:
        token = self.get_upload_token(key)
        ret, info = put_file(token, key, local_path)
        return ret is not None
    def delete_file(self, key: str) -> bool:
        bucket_manager = BucketManager(self.auth)
        ret, info = bucket_manager.delete(self.bucket, key)
        return ret is not None

storage_service = StorageService()
