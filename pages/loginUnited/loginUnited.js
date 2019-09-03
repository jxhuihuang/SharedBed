import {navigateBack, showToast, showLoading, hideLoading, portUrls} from "../../utils/util";
let app = getApp()
const globalDatas=app.globalData;
Page({
    data: {
        pageShow: "loginUnited",
        code:"",
        userInfo:null,
        phoneNumber:null,
        channelLoginBtn: {
            isShow: !0,
            text: "用户快速登录",
            action: "channelLogin",
            type: "channelLogin",
            event_id: "trd_party_login",
            event_name: "bottom_btn"
        },
        phoneLoginBtn: {
            text: "手机号注册/登录",
            action: "showPhoneLogin",
            type: "phoneLogin",
            event_id: "phone_login",
            event_name: "bottom_btn"
        },
        showuserPhoneModal:false,
        confirmModalData:{
            icon:null,
            title:"小单车申请使用你的手机号码",
            bindtap:"openSetting",
            confirmBtn:"确定",
            open_type:"getPhoneNumber",
        },
        phoneCaptcha:{
            isShow:true,
            codeIndex:[],
            code:[]
        }
    },
    onShow: function () {
        showLoading()
        this.wxlogin() 
    },
    onLoad: function (){
        
        
    },
    ofoDispatch: function(e) {
        this.setData({
            pageShow: "phoneLoginBtn",
        })
    },/***微信自动登录 获取code*/
    wxlogin:function(){
        wx.login({
            success: res => {
                if(res.code){
                    this.setData({
                        code:res.code
                    })
                }
                console.log('wxlogin_code',res.code);
                hideLoading()
            }
        })
    },/***微信获取用户信息*/
    wxGetInfo: function(e) {
        const $this=this;
        const code=this.data.code;
        if(code===""){
            showToast("请先登录")
            return false;
        }
        if(e.detail.userInfo){
            let code=this.data.code;
            let wxuserInfo=e.detail.userInfo;
            let iv=e.detail.iv;
            let encryptedData=e.detail.encryptedData;
            let userSecret={
                iv:iv,
                encryptedData:encryptedData
            }
            wxuserInfo.userSecret=userSecret;
            // let global_userInfo=app.globalData.userInfo || {};
            // global_userInfo.wxInfo=wxuserInfo;
            // app.globalData.wxUserInfo=global_userInfo;
            this.setData({
                showuserPhoneModal:true,
                userInfo:{wxuserInfo:wxuserInfo}
            })
        }else{
            wx.showToast({
                title: "授权已取消,请重新授权",
                icon: 'none',
                duration: 2000
            });
            this.setData({
                showuserPhoneModal:true,
                userInfo:null
            })
        }
    },
     /****微信获取用户手机号 并ajax登录 */
     wxgetPhoneNumber:function(e){
        let $this=this;
        let userInfo=this.data.userInfo;
        let iv=e.detail.iv || "";
        let encryptedData=e.detail.encryptedData || "";
        if(iv==="" || encryptedData===""){
            this.setData({
                showuserPhoneModal:false,
            },()=>{
                showToast("授权已取消,请重新授权");
            })
            return false;
        }
        let phoneNumbers={
            iv:iv,
            encryptedData:encryptedData
        }
        userInfo.wxuserInfo.phoneSecret=phoneNumbers;
        this.setData({
            phoneNumber:phoneNumbers,
            showuserPhoneModal:false,
        },()=>{
            if(globalDatas.isajax){
                this.loginAjax().then((res)=>{
                    let resData=res.data;
                    userInfo.accessToken=resData.access_token || "";
                    userInfo.refreshToken=resData.refresh_token || "";
                    app.globalData.userInfo =userInfo;
                    // wx.setStorageSync('userInfo', userInfo);
                    navigateBack() //返回
                }).catch((erro) => {
                    console.log('erro',erro);
                    showToast("登录失败，请重新登录");
                })
            }else{
                wx.setStorageSync('userInfo', userInfo);
                navigateBack()
            }
        })
    },/***用户登录ajax */
    loginAjax:function(){
        var $this=this
        let p = new Promise(function(resolve,reject){
            let code=$this.data.code;
            let wxuserInfo=$this.data.userInfo.wxuserInfo;
            wx.request({
                method:"POST",
                url: portUrls.login,
                data:{
                    code:code,
                    userInfo:wxuserInfo.userSecret,
                    phoneNumber:wxuserInfo.phoneSecret,
                },
                success(res) {
                    if(!res.data){
                        showToast("登录失败");
                        $this.wxlogin();
                        return false;
                    }
                    const resData=res.data;
                    if(res && resData.state==1){
                        resolve(res.data)
                    }else{
                        showToast("登录失败");
                        $this.wxlogin();
                    }
                }
            })
        })
        return p;
    },/****手机号登录 */
    phoneLogin:function(){
        var $this=this
        let p = new Promise(function(resolve,reject){
            let userInfo=$this.data.userInfo;
            wx.request({
                method:"POST",
                url: portUrls.phoneLogin,
                data:{
                    phoneNumber:"",
                    verificationCode:"",
                },
                success(res) {
                    if(!res.data){
                        showToast("登录失败，请重新登录");
                        return false;
                    }
                    const resData=res.data;
                    if(res && resData.state==1){
                        resolve(res.data)
                    }else{
                        showToast("登录失败，请重新登录");
                    }
                }
            })
        })
        return p;
    },/****发送验证码 */
    setcode:function(){
        var $this=this
        let p = new Promise(function(resolve,reject){
            let userInfo=$this.data.userInfo;
            wx.request({
                method:"POST",
                url: portUrls.setCode,
                data:{
                    phoneNumber:'15907099513',
                    verificationCode:"login",
                },
                header: {
                    // 'Authorization': 'Bearer ' + userInfo.access_toke
                },
                success(res) {
                    if(!res.data){
                        showToast("获取验证码失败");
                        return false;
                    }
                    const resData=res.data;
                    if(res && resData.state==1){
                        resolve(res.data)
                    }else{
                        showToast("验证码失败");
                    }
                }
            })
        })
        return p;

    }
})