from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import httpx
import jwt
from datetime import datetime, timedelta
from config import settings

router = APIRouter()

class LoginRequest(BaseModel):
    code: str

class LoginResponse(BaseModel):
    token: str
    is_new_user: bool

@router.post("/login", response_model=LoginResponse)
async def wx_login(req: LoginRequest):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.weixin.qq.com/sns/jscode2session",
            params={"appid": settings.WX_APP_ID, "secret": settings.WX_APP_SECRET, "js_code": req.code, "grant_type": "authorization_code"}
        )
        data = resp.json()
    if "errcode" in data and data["errcode"] != 0:
        raise HTTPException(status_code=400, detail="微信登录失败: " + data.get("errmsg", ""))
    openid = data["openid"]
    session_key = data["session_key"]
    payload = {"openid": openid, "session_key": session_key, "exp": datetime.utcnow() + timedelta(seconds=settings.JWT_EXPIRATION)}
    token = jwt.encode(payload, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return LoginResponse(token=token, is_new_user=False)
