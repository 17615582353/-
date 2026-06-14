from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
import httpx
from config import settings
from models.task import RestoreTask

router = APIRouter()

class RestoreRequest(BaseModel):
    fileId: str

class RestoreResponse(BaseModel):
    taskId: str
    status: str

class TaskResult(BaseModel):
    taskId: str
    status: str
    resultUrl: str = ""
    effects: list[str] = []

@router.post("", response_model=RestoreResponse)
async def create_restore_task(req: RestoreRequest, db: AsyncSession = Depends(get_db)):
    task = RestoreTask(file_id=req.fileId, status="pending")
    db.add(task)
    await db.commit()
    await db.refresh(task)
    try:
        async with httpx.AsyncClient() as client:
            await client.post(f"{settings.AI_SERVICE_URL}/process", json={"task_id": str(task.id), "file_id": req.fileId}, timeout=settings.AI_SERVICE_TIMEOUT)
        task.status = "processing"
        await db.commit()
    except Exception:
        task.status = "failed"
        await db.commit()
        raise HTTPException(status_code=503, detail="AI 服务暂时不可用")
    return RestoreResponse(taskId=str(task.id), status="processing")

@router.get("/{task_id}", response_model=TaskResult)
async def get_task_result(task_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(RestoreTask).where(RestoreTask.id == int(task_id)))
    task = result.scalar_one_or_none()
    if not task:
        raise HTTPException(status_code=404, detail="任务不存在")
    return TaskResult(taskId=str(task.id), status=task.status, resultUrl=task.result_url or "", effects=task.effects.split(",") if task.effects else [])
