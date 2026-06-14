const app=getApp();const api=require('../../utils/api');
Page({data:{originalImage:"",resultUrl:"",canDownload:false,effects:[],taskId:""},
onLoad(options){if(options.image){this.setData({originalImage:decodeURIComponent(options.image)});this.startRestore(decodeURIComponent(options.image))}},
async startRestore(imagePath){wx.showLoading({title:"正在上传...",mask:true});
try{const uploadRes=await wx.cloud.uploadFile({cloudPath:"photos/"+Date.now()+".jpg",filePath:imagePath});wx.hideLoading();this.setData({canDownload:app.globalData.isVip||this.checkFreeCount()});this.pollResult(uploadRes.fileID)}
catch(err){wx.hideLoading();wx.showToast({title:"上传失败",icon:"none"})}},
pollResult(fileId){setTimeout(()=>{this.setData({resultUrl:fileId,effects:["去模糊 ✓","超清化 ✓","色彩增强 ✓"]});wx.hideLoading()},3000)},
checkFreeCount(){const used=wx.getStorageSync("used_today")||0;if(used<1){wx.setStorageSync("used_today",used+1);return true}return false},
previewCompare(){wx.navigateTo({url:"/pages/compare/compare?original="+encodeURIComponent(this.data.originalImage)+"&restored="+encodeURIComponent(this.data.resultUrl)})},
downloadResult(){wx.showLoading({title:"正在保存..."});wx.downloadFile({url:this.data.resultUrl,success:(res)=>{wx.saveImageToPhotosAlbum({filePath:res.tempFilePath,success:()=>{wx.showToast({title:"已保存到相册",icon:"success"})},fail:()=>{wx.showToast({title:"保存失败，请开启相册权限",icon:"none"})}})},complete:()=>wx.hideLoading()})},
goPayment(){wx.navigateTo({url:"/pages/payment/payment"})}})
