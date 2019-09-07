// 接口
let portUrls={
    'login' :  'http://bed.079l.com/api/1_0/wechat/login', //微信登录接口
    'phoneLogin':'http://bed.079l.com/api/1_0/phone/login',
    'member':  'http://bed.079l.com/api/1_0/member',       //获取会员信息
    'account': 'http://bed.079l.com/api/1_0/account',      //获取账户信息
    'bill':    'http://bed.079l.com/api/1_0/bill',         //获取账单列表
    'setCode':'http://bed.079l.com/api/1_0/sms/verification/code', //发送验证码
    'orderList':  'http://bed.079l.com/api/1_0/order', //订单接口
    'dict':'http://bed.079l.com/api/1_0/dict',   //字典接口
    'feedback':'http://bed.079l.com/api/1_0/feedback', //意见反馈
    'bedInfo':'http://bed.079l.com/api/1_0/bed',  //获取床信息
    'usage':'http://bed.079l.com/api/1_0/bed/usage',//更新床使用信息
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
    const userInfo= wx.getStorageSync('userInfo') || {};
    let  accessToken=userInfo.accessToken || "";
    let p = new Promise(function(resolve,reject){
        showLoading()
        wx.checkSession({
            success(res) {
                if(accessToken!=""){
                    hideLoading()
                    resolve('随便什么数据');
                }else{
                    console.log('accessToken不存在');
                    reject("erro")
                    wx.navigateTo({url:"/pages/loginUnited/loginUnited"})
                    hideLoading()
                }
            }, 
            fail(erro) {
                console.log('获取登录状态失败 erro:',erro);
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

const showToast=(text="",{icon="none",duration=2000, success=()=>{}}={})=>{
    if(text=="")return "";
    wx.showToast({
        title: text,
        icon: icon,
        duration: duration,
        success:function(){
            setTimeout(() => {
                success()
            }, duration);
        }
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
const ajaxFns=({
    method="Get",
    data={},
    header={},
    success=()=>{},
    fail=()=>{},
    erroText="获取信息失败",
}={},ajaxUrl="")=>{
    if(ajaxUrl==""){
        showToast("接口地址不能为空")
        return false;
    } 
    wx.request({
        url: ajaxUrl,
        method:method,
        data: data,
        header: header,
        success(res) {
            // console.log('request_res:',res);
            const rest=res || {};
            if(rest.statusCode!="200"){
                var objtype = (typeof (rest.data)).toLowerCase();
                let errMsg="";
                if(objtype=="string"){
                    errMsg=rest.data
                }else{
                    let datas=rest.data || {}
                    errMsg=datas.msg || erroText
                }
                console.log('request rest.statusCode!=200 errorMessage：', errMsg);
                if(errMsg=="Token has expired"){
                    console.log('用户登录超时');
                    showToast("用户登录超时");
                    wx.navigateTo({url:"/pages/loginUnited/loginUnited"})
                    return false;
                }
                showToast(erroText)
                fail(errMsg);
                return false;
            }
            let resData=res.data;
            let state=resData.state || "";
            if(state!="1"){
                let errorMessage=resData.message || erroText;
                console.log('request state!=1  errorMessage：',errorMessage);
                showToast(erroText)
                fail(errorMessage);
                return false;
            }
            success(res.data)
        },
        fail(erro){
            console.log('request erro：', erro);
            let errorMessage="接口异常";
            showToast(erroText)
            fail(errorMessage);
        }
    })
}//系统版本比较 
const versionCompare=function (ver1, ver2) {
    var version1pre = parseFloat(ver1)
    var version2pre = parseFloat(ver2)
    var version1next = parseInt(ver1.replace(version1pre + ".", ""))
    var version2next = parseInt(ver2.replace(version2pre + ".", ""))
    if (version1pre > version2pre)
        return true
    else if (version1pre < version2pre) 
        return false
    else {
        if (version1next > version2next)
            return true
        else
            return false
    }
}
/**是否支持蓝牙 */
const isSupportBluetooth=()=>{
    let p = new Promise(function(resolve,reject){
        const app = getApp();
        let sysinfo=app.globalData.sysinfo; //系统信息
        let model=sysinfo.model;     //系统
        let version=sysinfo.version;  
        if (model == 'android' && this.versionCompare('6.5.7', version)) {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，请更新至最新版本',
                showCancel: false
            })
        }
        else if (model == 'ios' && this.versionCompare('6.5.6', version)) {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，请更新至最新版本',
                showCancel: false
            })
        }else{
            resolve()
        }
    })
    return p;
}
//获取url参数
function geturl(name, url="location.href") {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(url)) return decodeURI(RegExp.$2.replace(/\+/g, " ")); return "";
}
// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
}/***分秒时转换 */
const timetransform=(time="")=>{
    time=time!=""?parseFloat(time):"";
    if(time==""){
        return "0秒";
    }
    let newtime="";
    var min=Math.floor(time%3600);

    let hours=Math.floor(time/3600)
    let minutes=Math.floor(min/60)
    let seconds=time%60;
    if(hours==0 && minutes==0 && seconds==0){
        return "0秒"
    }
    if(minutes==0){
        minutes=hours!=0 && seconds!=0? "0分":"";
        hours=hours!=0?hours+"小时":"";
        seconds=seconds!=0?seconds+"秒":"";
        
        return hours+minutes+seconds
    }else{
        hours=hours!=0?hours+"小时":"";
        minutes=minutes!=0?minutes+"分":"";
        seconds=seconds!=0?seconds+"秒":"";
        return hours+minutes+seconds
    }
}
// 获取小程序已经向用户请求过的权限
const getSetting=(key)=>{
    const p = new Promise(function (resolve, reject) {
        wx.getSetting({
            success: res => {
                // console.log('res',res);
                let  authSetting=res.authSetting || {};
                resolve({authSetting:authSetting, permission:res.authSetting[key]})
            },
            fail: (erro) => {
                console.log('获取权限列表失败 erro:',erro);
                resolve({authSetting:{}, permission:false})
            }
        })
    })
    return p;
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
  ajaxFns:ajaxFns,
  isSupportBluetooth:isSupportBluetooth,
  geturl:geturl,
  ab2hex:ab2hex,
  timetransform:timetransform,
  getSetting:getSetting,
}
