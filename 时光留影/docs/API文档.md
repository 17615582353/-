# 时光留影 API 文档

Base URL: `https://api.shiguangliuying.com/api/v1`

## 认证
### POST /auth/login
微信登录，用 code 换取 token
**请求**: `{"code": "微信临时登录凭证"}`
**响应**: `{"token": "jwt_token", "is_new_user": false}`

## 修复
### POST /restore
创建修复任务
**请求**: `{"fileId": "云存储文件ID"}`
**响应**: `{"taskId": "1", "status": "processing"}`

### GET /restore/{task_id}
查询修复结果
**响应**: `{"taskId": "1", "status": "completed", "resultUrl": "https://...", "effects": ["去模糊 ✓", "超清化 ✓"]}`

## 支付
### POST /payment/create
创建支付订单
**请求**: `{"plan": "month"}`
**响应**: `{"orderId": "ORD1", "prepayId": "wx_prepay_id"}`

## 用户
### GET /user/info
获取用户信息
**响应**: `{"openid": "xxx", "isVip": false, "vipExpireAt": null}`

### GET /user/history
获取修复记录（参数: page=1, size=20）

### GET /user/stats
获取用户统计数据

## Webhook
### POST /payment/notify
微信支付结果回调（XML格式）
