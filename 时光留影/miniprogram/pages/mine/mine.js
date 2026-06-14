const app=getApp();const api=require("../../utils/api");
Page({data:{isLoggedIn:false,avatarUrl:"",nickname:"",isVip:false,restoreCount:0,savedCount:0,daysActive:0},
onShow(){this.checkLoginStatus()},
checkLoginStatus(){const token=wx.getStorageSync("token");if(token){this.setData({isLoggedIn:true,nickname:wx.getStorageSync("nickname")||"用户",avatarUrl:wx.getStorageSync("avatarUrl")||"",isVip:wx.getStorageSync("isVip")||false});this.loadStats()}},
login(){wx.login({success:(res)=>{if(res.code){wx.setStorageSync("token","demo_token");wx.setStorageSync("nickname","用户_"+res.code.slice(-4));this.checkLoginStatus();wx.showToast({title:"登录成功",icon:"success"})}}})},
loadStats(){},goPayment(){wx.navigateTo({url:"/pages/payment/payment"})},goHistory(){wx.navigateTo({url:"/pages/history/history"})},
shareApp(){wx.shareAppMessage({title:"时光留影 - AI老照片修复",desc:"让记忆重新清晰"})},
showAbout(){wx.showModal({title:"关于时光留影",content:"时光留影是一款基于AI技术的老照片修复小程序。我们利用最新的深度学习算法，为您修复泛黄、破损、模糊的老照片，让珍贵的记忆重新清晰。",showCancel:false})}})
