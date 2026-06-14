from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from database import get_db
from models.order import Order
from config import settings
import httpx
import xml.etree.ElementTree as ET
import random
import string

router = APIRouter()

class CreateOrderRequest(BaseModel):
    plan: str

class CreateOrderResponse(BaseModel):
    orderId: str
    prepayId: str

PRICE_MAP = {"single": settings.PRICE_SINGLE, "month": settings.PRICE_MONTH, "quarter": settings.PRICE_QUARTER, "year": settings.PRICE_YEAR}

def generate_nonce():
    return "".join(random.choices(string.ascii_letters + string.digits, k=32))

@router.post("/create", response_model=CreateOrderResponse)
async def create_order(req: CreateOrderRequest, db: AsyncSession = Depends(get_db)):
    if req.plan not in PRICE_MAP:
        raise HTTPException(status_code=400, detail="无效的套餐类型")
    price = PRICE_MAP[req.plan]
    order = Order(plan=req.plan, amount=price, status="pending")
    db.add(order)
    await db.commit()
    await db.refresh(order)
    nonce_str = generate_nonce()
    order_xml = f"""<xml><appid>{settings.WX_APP_ID}</appid><mch_id>{settings.WX_MCH_ID}</mch_id><nonce_str>{nonce_str}</nonce_str><body>时光留影-{req.plan}</body><out_trade_no>ORD{order.id}</out_trade_no><total_fee>{int(price * 100)}</total_fee><spbill_create_ip>127.0.0.1</spbill_create_ip><notify_url>https://api.shiguangliuying.com/api/v1/payment/notify</notify_url><trade_type>JSAPI</trade_type></xml>"""
    async with httpx.AsyncClient() as client:
        resp = await client.post("https://api.mch.weixin.qq.com/pay/unifiedorder", data=order_xml.encode("utf-8"), headers={"Content-Type": "application/xml"})
        root = ET.fromstring(resp.text)
        prepay_id = root.findtext("prepay_id", "")
    if not prepay_id:
        raise HTTPException(status_code=500, detail="微信支付下单失败")
    return CreateOrderResponse(orderId=f"ORD{order.id}", prepayId=prepay_id)

@router.post("/notify")
async def payment_notify():
    return {"return_code": "SUCCESS", "return_msg": "OK"}
