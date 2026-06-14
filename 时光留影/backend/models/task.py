from sqlalchemy import Column, Integer, String, DateTime, Text, Enum
from sqlalchemy.sql import func
from database import Base
import enum

class TaskStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"

class RestoreTask(Base):
    __tablename__ = "restore_tasks"
    id = Column(Integer, primary_key=True, autoincrement=True)
    openid = Column(String(64), index=True, default="")
    file_id = Column(String(256), nullable=False)
    result_url = Column(String(512), default="")
    status = Column(Enum(TaskStatus), default=TaskStatus.PENDING)
    effects = Column(Text, default="")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
