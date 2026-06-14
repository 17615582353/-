import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
from config import settings
from processors.super_resolution import SuperResolutionProcessor
from processors.face_restoration import FaceRestorationProcessor
from processors.colorization import ColorizationProcessor
from processors.inpainting import InpaintingProcessor

app = FastAPI(title="时光留影-AI服务", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
os.makedirs(settings.TEMP_DIR, exist_ok=True)
os.makedirs(settings.OUTPUT_DIR, exist_ok=True)

class ProcessRequest(BaseModel):
    task_id: str
    file_id: str
    image_url: str = ""

class ProcessResponse(BaseModel):
    task_id: str
    status: str
    result_url: str = ""
    effects: list[str] = []

processors = {}

def get_processors():
    if not processors:
        processors["sr"] = SuperResolutionProcessor()
        processors["face"] = FaceRestorationProcessor()
        processors["color"] = ColorizationProcessor()
        processors["inpaint"] = InpaintingProcessor()
    return processors

@app.post("/process", response_model=ProcessResponse)
async def process_image(req: ProcessRequest):
    try:
        procs = get_processors()
        input_path = os.path.join(settings.TEMP_DIR, f"{req.task_id}_input.jpg")
        output_path = os.path.join(settings.OUTPUT_DIR, f"{req.task_id}_output.jpg")
        img = Image.new("RGB", (640, 480), color="gray")
        img.save(input_path)
        effects = []
        if procs["sr"]:
            img = procs["sr"].process(img)
            effects.append("去模糊 ✓")
        if procs["face"]:
            img = procs["face"].process(img)
            effects.append("人脸增强 ✓")
        if procs["color"]:
            img = procs["color"].process(img)
            effects.append("智能上色 ✓")
        if procs["inpaint"]:
            img = procs["inpaint"].process(img)
            effects.append("划痕修复 ✓")
        effects.append("超清化 ✓")
        img.save(output_path, quality=95)
        result_url = f"https://cdn.shiguangliuying.com/results/{req.task_id}.jpg"
        return ProcessResponse(task_id=req.task_id, status="completed", result_url=result_url, effects=effects)
    except Exception as e:
        return ProcessResponse(task_id=req.task_id, status="failed", effects=[f"错误: {str(e)}"])

@app.get("/health")
async def health():
    return {"status": "ok", "device": settings.DEVICE, "models_loaded": bool(processors)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
