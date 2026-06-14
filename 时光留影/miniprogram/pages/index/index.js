const app=getApp();const api=require('../../utils/api');
Page({data:{freeCount:0,dailyLimit:1},onLoad(){this.checkFreeCount()},onShow(){this.checkFreeCount()},
checkFreeCount(){const today=wx.getStorageSync('today_date');const todayDate=new Date().toDateString();
if(today!==todayDate){wx.setStorageSync('today_date',todayDate);wx.setStorageSync('used_today',0);this.setData({freeCount:1})}
else{const used=wx.getStorageSync('used_today')||0;this.setData({freeCount:Math.max(0,1-used)})}},
chooseImage(){const token=wx.getStorageSync('token');
if(!token){this.loginFirst();return}
wx.chooseImage({count:1,sizeType:['compressed'],sourceType:['album','camera'],success:(res)=>{const tempFilePath=res.tempFilePaths[0];wx.navigateTo({url:"/pages/result/result?image="+encodeURIComponent(tempFilePath)})}})},
loginFirst(){wx.showModal({title:"登录提示",content:"请先登录后再使用",success:(res)=>{if(res.confirm){wx.switchTab({url:"/pages/mine/mine"})}}})}})
