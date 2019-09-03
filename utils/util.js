// 接口
let portUrls={
    'login' :  'http://bed.079l.com/api/1_0/wechat/login', //微信登录接口
    'phoneLogin':'http://bed.079l.com/api/1_0/phone/login',
    'member':  'http://bed.079l.com/api/1_0/member',       //获取会员信息
    'account': 'http://bed.079l.com/api/1_0/account',      //获取账户信息
    'bill':    'http://bed.079l.com/api/1_0/bill',         //获取账单列表
    'setCode':'http://bed.079l.com/api/1_0/sms/verification/code', //发送验证码
    'orderList':'http://bed.079l.com/api/1_0/order', //获取去订单列表
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/***检查是否为空 */
const checkNull=(obj)=>{
    var isNull=false;
    if (obj === null || typeof (obj) === "undefined") {
        isNull=true;
    }else{
        var type = (typeof (obj)).toLowerCase();
        if (type === "string" && (obj.toString()).replace(/(^\s*)|(\s*$)/g, "") === "") {
            isNull=true;
        }
        if(type=="object"){
            isNull=false;
        }
    }
    return isNull;
}
const showLoading=()=>{
    wx.showLoading({
        title: '加载中...',
    })
}

const hideLoading=()=>{
    wx.hideLoading()
}

// /登录状态 是否过期
const loginType=()=>{
    const app = getApp()
    const userInfo= app.globalData.userInfo || {};
    let p = new Promise(function(resolve,reject){
        showLoading()
        wx.checkSession({
            success(res) {
                if(userInfo.accessToken){
                    hideLoading()
                    resolve('随便什么数据');
                }else{
                    reject("erro")
                    wx.navigateTo({url:"/pages/loginUnited/loginUnited"})
                    hideLoading()
                }
            }, 
            fail() {
                reject("erro")
                wx.navigateTo({url:"/pages/loginUnited/loginUnited"})
                hideLoading()
            }
        })
    });
    return p
}

/***返回 */
const navigateBack=(n=1)=>{
    wx.navigateBack({
        delta: n
    })
}
const assigns = Object.assign || function(e) {
    for (var t = 1; t < arguments.length; t++) {
        var o = arguments[t];
        for (var n in o) Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n]);
    }
    return e;
}


const finishLoading=()=>{
    this.setData({
        waitingState: false,
    }), hideLoading();
}

const showToast=(text="",{icon="none",duration=2000}={})=>{
    if(text=="")return "";
    wx.showToast({
        title: text,
        icon: icon,
        duration: duration
    })
}

const tolinks=(e)=>{
    let link=e.currentTarget.dataset.link || ""; 
    if(link!=""){
        wx.navigateTo({
            url: link,
        })
    }
}
module.exports = {
  portUrls:portUrls,
  formatTime: formatTime,
  loginType:loginType,
  formatNumber:formatNumber,
  navigateBack:navigateBack,
  assigns:assigns,
  showLoading:showLoading,
  hideLoading:hideLoading,
  showToast:showToast,
  tolinks:tolinks,
}
