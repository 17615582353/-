const app=getApp();const api=require("../../utils/api");
Page({data:{records:[]},onShow(){this.loadRecords()},
loadRecords(){const mockRecords=[{id:1,thumbnail:"/images/demo1.jpg",date:"2026-06-14",effects:"去模糊+上色",isVip:false},{id:2,thumbnail:"/images/demo2.jpg",date:"2026-06-13",effects:"超清化+上色",isVip:true}];this.setData({records:mockRecords})},
viewDetail(e){wx.showToast({title:"查看详情",icon:"none"})},goHome(){wx.switchTab({url:"/pages/index/index"})}})
