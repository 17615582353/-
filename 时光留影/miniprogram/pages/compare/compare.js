Page({data:{originalImage:"",restoredImage:"",sliderValue:50},
onLoad(options){this.setData({originalImage:decodeURIComponent(options.original),restoredImage:decodeURIComponent(options.restored)})},
onSliderStart(e){},onSliderMove(e){const query=wx.createSelectorQuery();query.select(".compare-wrapper").boundingClientRect(rect=>{if(rect){const x=e.touches[0].clientX-rect.left;const value=Math.max(0,Math.min(100,(x/rect.width)*100));this.setData({sliderValue:value})}}).exec()},
downloadCurrent(){wx.showLoading({title:"正在保存..."});wx.downloadFile({url:this.data.restoredImage,success:(res)=>{wx.saveImageToPhotosAlbum({filePath:res.tempFilePath,success:()=>wx.showToast({title:"已保存",icon:"success"}),fail:()=>wx.showToast({title:"请开启相册权限",icon:"none"})})},complete:()=>wx.hideLoading()})},
goBack(){wx.switchTab({url:"/pages/index/index"})}})
