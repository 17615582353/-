from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from database import get_db
from models.task import RestoreTask
from typing import Optional
import jwt
from fastapi import Header
from config import settings

router = APIRouter()

async def get_current_user(authorization: Optional[str] = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="未登录")
    try:
        payload = jwt.decode(authorization[7:], settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
        return payload["openid"]
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="登录已过期")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="无效的登录凭证")

@router.get("/info")
async def get_user_info(openid: str = Depends(get_current_user)):
    return {"openid": openid, "isVip": False, "vipExpireAt": None}

@router.get("/history")
async def get_history(page: int = 1, size: int = 20, db: AsyncSession = Depends(get_db), openid: str = Depends(get_current_user)):
    result = await db.execute(select(RestoreTask).where(RestoreTask.openid == openid).offset((page - 1) * size).limit(size))
    tasks = result.scalars().all()
    return {"items": [{"id": t.id, "date": t.created_at.isoformat() if t.created_at else "", "status": t.status} for t in tasks], "total": len(tasks), "page": page}

@router.get("/stats")
async def get_stats(db: AsyncSession = Depends(get_db), openid: str = Depends(get_current_user)):
    result = await db.execute(select(func.count(RestoreTask.id)).where(RestoreTask.openid == openid))
    total = result.scalar()
    return {"totalRestores": total or 0, "totalSaved": total or 0, "daysActive": 1}
