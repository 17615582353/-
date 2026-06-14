const app=getApp();const api=require("../../utils/api");
Page({data:{selectedPlan:"quarter",plans:{month:{price:14.9,name:"月卡"},quarter:{price:34.9,name:"季卡"},year:{price:99,name:"年卡"}}},
selectPlan(e){this.setData({selectedPlan:e.currentTarget.dataset.plan})},
buySingle(){this.createOrder("single",3.9)},
handlePayment(){const plan=this.data.selectedPlan;const price=this.data.plans[plan].price;this.createOrder(plan,price)},
async createOrder(type,amount){const token=wx.getStorageSync("token");if(!token){wx.showToast({title:"请先登录",icon:"none"});return}
wx.showLoading({title:"正在创建订单...",mask:true});
try{const res=await new Promise((resolve)=>{setTimeout(()=>{resolve({code:0,data:{orderId:"ORD"+Date.now(),prepayId:"wx"+Date.now()}})},500)});
if(res.code===0){wx.requestPayment({timeStamp:String(Date.now()),nonceStr:"random_str","package":"prepay_id="+res.data.prepayId,signType:"MD5",paySign:"sign",
success:()=>{wx.showToast({title:"支付成功！",icon:"success"});if(type!=="single"){wx.setStorageSync("isVip",true);app.globalData.isVip=true}setTimeout(()=>wx.navigateBack(),1500)},
fail:()=>{wx.showToast({title:"支付取消",icon:"none"})}})}}catch(err){wx.showToast({title:"网络异常",icon:"none"})}wx.hideLoading()}})
