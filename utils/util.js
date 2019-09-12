// 接口
let loadingIsShow = false;
let portUrls = {
    'login': 'http://bed.079l.com/api/1_0/wechat/login', //微信登录接口
    'phoneLogin': 'http://bed.079l.com/api/1_0/phone/login',
    'member': 'http://bed.079l.com/api/1_0/member',       //获取会员信息
    'account': 'http://bed.079l.com/api/1_0/account',      //获取账户信息
    'bill': 'http://bed.079l.com/api/1_0/bill',         //获取账单列表
    'setCode': 'http://bed.079l.com/api/1_0/sms/verification/code', //发送验证码
    'order': 'http://bed.079l.com/api/1_0/order', //订单接口
    'dict': 'http://bed.079l.com/api/1_0/dict',   //字典接口
    'feedback': 'http://bed.079l.com/api/1_0/feedback', //意见反馈
    'bedInfo': 'http://bed.079l.com/api/1_0/bed',  //获取床信息
    'usage': 'http://bed.079l.com/api/1_0/bed/usage',//更新床使用信息
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
const checkNull = (obj) => {
    var isNull = false;
    if (obj === null || typeof (obj) === "undefined") {
        isNull = true;
    } else {
        var type = (typeof (obj)).toLowerCase();
        if (type === "string" && (obj.toString()).replace(/(^\s*)|(\s*$)/g, "") === "") {
            isNull = true;
        }
        if (type == "object") {
            isNull = false;
        }
    }
    return isNull;
}
const showLoading = (text = "加载中...") => {
    if (!loadingIsShow) {
        loadingIsShow = true;
        wx.showLoading({
            title: text,
        })
    }
}

const hideLoading = (callBack = () => { }) => {
    if (loadingIsShow) {
        loadingIsShow = false;
        wx.hideLoading();
        setTimeout(() => {
            callBack()
        }, 500);
    } else {

        callBack()

    }
}

// /登录状态 是否过期
const loginType = () => {
    const app = getApp()
    const userInfo = wx.getStorageSync('userInfo') || {};
    let accessToken = userInfo.accessToken || "";
    let p = new Promise(function (resolve, reject) {
        showLoading()
        wx.checkSession({
            success(res) {
                if (accessToken != "") {
                    hideLoading()
                    resolve('随便什么数据');
                } else {
                    console.log('accessToken不存在');
                    // reject("erro")
                    hideLoading()
                    wx.navigateTo({ url: "/pages/loginUnited/loginUnited" })
                   
                }
            },
            fail(erro) {
                let errCode=erro.errCode || "";
                console.log('errCode:', errCode);
                if(errCode=="-13001"){
                    hideLoading(()=>{
                        console.log('登录状态失效');
                        wx.navigateTo({url:"/pages/loginUnited/loginUnited"})
                    })
                    return false;
                }
                hideLoading(() => {
                    showToast("获取登录状态失败,请检查你的网络是否正常")
                })
                console.log('获取登录状态失败 erro:', erro);
                reject("erro")
                // wx.navigateTo({url:"/pages/loginUnited/loginUnited"})

            }
        })
    });
    return p
}

/***返回 */
const navigateBack = (n = 1) => {
    wx.navigateBack({
        delta: n
    })
}
const assigns = Object.assign || function (e) {
    for (var t = 1; t < arguments.length; t++) {
        var o = arguments[t];
        for (var n in o) Object.prototype.hasOwnProperty.call(o, n) && (e[n] = o[n]);
    }
    return e;
}


const finishLoading = () => {
    this.setData({
        waitingState: false,
    }), hideLoading();
}

const showToast = (text = "", { icon = "none", duration = 2000, success = () => { } } = {}) => {
    if (text == "") return "";
    if (loadingIsShow) {
        hideLoading(() => {
            wx.showToast({
                title: text,
                icon: icon,
                duration: duration,
                success: function () {
                    setTimeout(() => {
                        success()
                    }, duration);
                }
            })
        })
    } else {
        wx.showToast({
            title: text,
            icon: icon,
            duration: duration,
            success: function () {
                setTimeout(() => {
                    success()
                }, duration);
            }
        })
    }
}

const tolinks = (e) => {
    let link = e.currentTarget.dataset.link || "";
    if (link != "") {
        wx.navigateTo({
            url: link,
        })
    }
} 
/**判断是否包含 */
function indexof(obj, strings){
    var ishas="";
    if(!obj){
        ishas=false;
        return false;
    }
    if(checkNull(strings)){
        ishas=false;
    }else{
        strings=strings.toString()
        if(obj.indexOf(strings)==-1){
            ishas=false;
        }else{
            ishas=true;
        }
    }
    return ishas;
}
const ajaxFns = ({
    method = "Get",
    data = {},
    header = {},
    success = () => { },
    fail = () => { },
    isShowLoading = false,
    erroText = "获取信息失败",
} = {}, ajaxUrl = "") => {
    if (ajaxUrl == "") {
        showToast("接口地址不能为空")
        return false;
    }
    // if (isShowLoading) {
    //     showLoading()
    // }
    wx.request({
        url: ajaxUrl,
        method: method,
        data: data,
        header: header,
        success(res) {
            console.log('request_res:',res);
            const rest = res || {};
            if(rest.statusCode=="200"){
                let resData = res.data;
                let state = resData.state || "";
                if (state != "1") {
                    let errorMessage = resData.message || erroText;
                    console.log('request state!=1  errorMessage：', errorMessage);
                    fail(errorMessage);
                    return false;
                }
                success(res.data)
            }else{
                let statusCode=rest.statusCode;
                console.log('statusCode：',statusCode);
                switch (statusCode) {
                    case 500:
                        console.log('500');
                        fail("接口异常");
                    break;
                    default:
                            var objtype = (typeof (rest.data)).toLowerCase();
                            let errMsg = "";
                            if (objtype == "string") {
                                errMsg = rest.data
                            } else {
                                let datas = rest.data || {}
                                console.log('datas',datas);
                                errMsg = datas.msg || erroText
                            }
                            console.log('request rest.statusCode!=200 errorMessage：', errMsg);
                            if (errMsg == "Token has expired") {
                                console.log('用户登录超时');
                                wx.navigateTo({ url: "/pages/loginUnited/loginUnited" })
                                return false;
                            } 
                            fail(errMsg);
                    break;
                }
            }
        },
        fail(erro) {
            let errorMessage='';
            console.log('request fail：', erro);
            let errMsg=erro.errMsg || "";
            errMsg=erroDeal(errMsg);
            if(indexof(errMsg, "似乎已断开与互联网的连接")){
                console.log("网络异常，请检查你的网络");
                errorMessage = "网络异常，请检查你的网络";
            }
            console.log('errMsg1', errMsg);
            errorMessage = errorMessage==""?"接口异常":errorMessage;
            // showToast(errorMessage)
            fail(errorMessage);
        },
        complete() {
            if (isShowLoading) {
                // hideLoading()
            }
        }
    })
}
/***错误信息处理   去除像request:fail的字符 */
const erroDeal=function(str=""){
    if(str==""){
        return str;
    }
    if(str.indexOf("request:fail")!=-1){
        str=str.replace("request:fail","");
    }
    return str
}
//系统版本比较 
const versionCompare = function (ver1, ver2) {
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
const isSupportBluetooth = () => {
    let p = new Promise(function (resolve, reject) {
        const app = getApp();
        let sysinfo = app.globalData.sysinfo; //系统信息
        let model = sysinfo.model;     //系统
        let version = sysinfo.version;
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
        } else {
            console.log('支持蓝牙');
            resolve('支持蓝牙')
        }
    })
    return p;
}
//获取url参数
function geturl(name, url = "location.href") {
    var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i");
    if (reg.test(url)) return decodeURI(RegExp.$2.replace(/\+/g, " ")); return "";
}
// ArrayBuffer转16进度字符串示例
function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )
    return hexArr.join('');
}/***分秒时转换 */
const timetransform = (time = "") => {
    time = time != "" ? parseFloat(time) : "";
    if (time == "") {
        return "0秒";
    }
    let newtime = "";
    var min = Math.floor(time % 3600);

    let hours = Math.floor(time / 3600)
    let minutes = Math.floor(min / 60)
    let seconds = time % 60;
    if (hours == 0 && minutes == 0 && seconds == 0) {
        return "0秒"
    }
    if (minutes == 0) {
        minutes = hours != 0 && seconds != 0 ? "0分" : "";
        hours = hours != 0 ? hours + "小时" : "";
        seconds = seconds != 0 ? seconds + "秒" : "";

        return hours + minutes + seconds
    } else {
        hours = hours != 0 ? hours + "小时" : "";
        minutes = minutes != 0 ? minutes + "分" : "";
        seconds = seconds != 0 ? seconds + "秒" : "";
        return hours + minutes + seconds
    }
}
// 获取小程序已经向用户请求过的权限
const getSetting = (key) => {
    const p = new Promise(function (resolve, reject) {
        wx.getSetting({
            success: res => {
                console.log('res', res);
                let authSetting = res.authSetting || {};
                let permission = "";
                if (authSetting[key] === null || typeof (authSetting[key]) === "undefined") {
                    permission = "";
                } else {
                    permission = authSetting[key] ? "true" : "false";
                }
                console.log('permission1', permission);
                resolve({ authSetting: authSetting, permission: permission })
            },
            fail: (erro) => {
                console.log('获取权限列表失败 erro:', erro);
                let errMsg = erro.errMsg ? erro.errMsg : "获取权限失败";
                if (errMsg == 'getSetting:fail 需要重新登录') {
                    wx.navigateTo({ url: "/pages/loginUnited/loginUnited" })
                    hideLoading()
                    return false;
                }
                resolve({ authSetting: {}, permission: "" })
            }
        })
    })
    return p;
}
// ArrayBuffer转为16进制数
function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)
        }
    )
    return hexArr.join('');
}
// 16进制数转ASCLL码
function hexCharCodeToStr(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr = trimedStr.substr(0, 2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
    var len = rawStr.length;
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
        curCharCode = parseInt(rawStr.substr(i, 2), 16);
        resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
}

/**
 * 大小写转换    
 * type: upper:转成大写， lower：转换成小写
 */     
function toCase(text,type){
    type=type || "lower";
    var texts=type=="upper"?text.toUpperCase():text.toLowerCase ();
    return texts
}//格式化日期 DateFormat('yyyy-MM-dd hh:mm:ss:SS 星期w 第q季度') w 星期 小写为数字 大写为中文 
function DateFormat(date,format) { 
    date=date?new Date(date):new Date();
    format=format || "yyyy-MM-dd";
    var Week = ['日', '一', '二', '三', '四', '五', '六'];  
    var o = {  
        "y+": date.getYear(), //year  
        "M+": date.getMonth() + 1, //month   
        "d+": date.getDate(), //day   
        "h+": date.getHours(), //hour   
        "H+": date.getHours(), //hour  
        "m+": date.getMinutes(), //minute   
        "s+": date.getSeconds(), //second   
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter   
        "S": date.getMilliseconds(), //millisecond   
        "w": date.getDay(),
        "W": Week[date.getDay()]  
    }  
    if (/(y+)/.test(format)) {  
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));  
    }  
    for (var k in o) {  
        if (new RegExp("(" + k + ")").test(format)) {  
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));  
        }  
    }  
    return format;  
}  
module.exports = {
    portUrls: portUrls,
    formatTime: formatTime,
    loginType: loginType,
    formatNumber: formatNumber,
    navigateBack: navigateBack,
    assigns: assigns,
    showLoading: showLoading,
    hideLoading: hideLoading,
    showToast: showToast,
    tolinks: tolinks,
    ajaxFns: ajaxFns,
    isSupportBluetooth: isSupportBluetooth,
    geturl: geturl,
    ab2hex: ab2hex,
    timetransform: timetransform,
    getSetting: getSetting,
    hexCharCodeToStr:hexCharCodeToStr,
    toCase:toCase,
    indexof:indexof,
    DateFormat:DateFormat,
}
