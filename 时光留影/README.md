# 时光留影 📸

> AI 老照片修复微信小程序 —— 让记忆重新清晰

## 项目简介
「时光留影」是一款基于 AI 技术的老照片修复微信小程序。用户只需上传泛黄、破损、模糊的老照片，AI 自动完成去模糊、超清化、智能上色、划痕修复，让珍贵的记忆重新清晰。

## 功能特性
- ✨ **AI 去模糊**：消除照片模糊和噪点
- 🎨 **智能上色**：黑白照片一键变彩色
- 🔍 **超清放大**：提升照片分辨率
- 🩹 **划痕修复**：修复破损和划痕
- 📊 **前后对比**：左右滑动对比修复效果
- 💎 **会员订阅**：无限次修复使用

## 技术栈
| 层级 | 技术 |
|:--|:--|
| 小程序前端 | 微信小程序原生框架 (WXML + WXSS + JS) |
| 后端服务 | Python FastAPI |
| AI 推理 | PyTorch + GFP-GAN + Real-ESRGAN + DeOldify |
| 数据库 | MySQL (SQLAlchemy) |
| 缓存 | Redis |
| 支付 | 微信支付 |
| 存储 | 七牛云 / 阿里云OSS |

## 项目结构
```
时光留影/
├── miniprogram/          # 微信小程序前端（6个页面）
├── backend/              # Python 后端（路由/模型/服务）
├── ai_service/           # AI 推理服务（模型处理器）
├── docs/                 # 项目文档（商业计划书 + API文档）
├── docker-compose.yml    # Docker 一键部署
└── README.md             # 项目说明
```

## 快速开始
### 小程序
1. 打开微信开发者工具，导入 `miniprogram/` 目录
2. 修改 `app.js` 中的 `env` 为云开发环境 ID
3. 修改 `project.config.json` 中的 `appid`
4. 编译运行

### 后端
```bash
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --port 8000
```

### AI 服务
```bash
cd ai_service
pip install -r requirements.txt
python server.py
```

### Docker 部署
```bash
docker-compose up -d
```

## 盈利模式
| 产品 | 价格 | 说明 |
|:--|:--:|:--|
| 免费试用 | ¥0 | 每日 1 张预览（带水印） |
| 单次修复 | ¥3.9 | 解锁高清原图下载 |
| 月卡 | ¥14.9/月 | 无限次修复 |
| 季卡 | ¥34.9/季 | 省 30% |
| 年卡 | ¥99/年 | 省 44% |

## 许可证
MIT License
