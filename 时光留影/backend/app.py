from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from database import init_db
from routes import auth, restore, payment, user

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(title=settings.APP_NAME, version=settings.VERSION, lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(restore.router, prefix="/api/v1/restore", tags=["修复"])
app.include_router(payment.router, prefix="/api/v1/payment", tags=["支付"])
app.include_router(user.router, prefix="/api/v1/user", tags=["用户"])

@app.get("/")
async def root():
    return {"name": settings.APP_NAME, "version": settings.VERSION, "status": "running"}

@app.get("/health")
async def health():
    return {"status": "ok"}
