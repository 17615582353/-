import hashlib
import xml.etree.ElementTree as ET
from config import settings

class WeChatPayService:
    @staticmethod
    def generate_sign(params: dict) -> str:
        sorted_params = sorted(params.items())
        sign_str = "&".join(f"{k}={v}" for k, v in sorted_params if v)
        sign_str += f"&key={settings.WX_API_KEY}"
        return hashlib.md5(sign_str.encode("utf-8")).hexdigest().upper()
    @staticmethod
    def verify_notification(xml_data: str) -> bool:
        root = ET.fromstring(xml_data)
        sign = root.findtext("sign", "")
        params = {child.tag: child.text for child in root}
        params.pop("sign", None)
        return sign == WeChatPayService.generate_sign(params)

wx_pay_service = WeChatPayService()
