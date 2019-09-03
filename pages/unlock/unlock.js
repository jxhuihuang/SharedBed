import {showToast} from "../../utils/util";
Page({
    data: {
        pageBanner: "https://ofo.oss-cn-qingdao.aliyuncs.com/alipayTinyApp/rebuild/usebike_pic.png",
        pageTitle:"欢迎使用小单车",
        manuToRide:false,   //是否手动输入
        hitMsg: "输入车牌号，获取解锁码",
        pageSubtitle: "规范用车，文明你我",
        authtype:2,
        scanToRideBtn:{
            text: "扫码骑车",
            type: "scanToRide",
            event_id: "scan_unlock",
            event_name: "select_unlock_type",
            action: "scanUnlock"
        },
        manuToRideBtn:{
            text: "手动输入车牌号",
            type: "manuToRide",
            event_id: "manuToRide",
            event_name: "select_unlock_type",
            action: "showManuUnlock"
        },
        unlockType:'manu',
        isShowAd:true,
        ridingBtn:{
            text: "立即用车",
        }
    },
    onLoad: function () {
      
    },
    ofoDispatch:function(e){
        console.log('ofoDispatch');
        const action=e.currentTarget.dataset.action || "";
        console.log('action:',action);
        if(action=="scanUnlock"){
            this.scanUnlock()
        }
        
    },/***扫描二维码*****/
    scanUnlock:function(){
        wx.scanCode({
            scanType:['qrCode'],
            success (res) {
                console.log("scanUnlock_res:",res)
                if(res.path){
                    wx.showModal({
                        content:"车牌有误, 请重试"
                    })
                    return false;
                }
                let reg=/^([1-9]\d*|[0]{1,1}){3}?$/
                let reust=res.result || "";
                if(!reg.exec(reust) || reust.length!=8){
                    wx.showModal({
                        content:"车牌有误, 请重试"
                    })
                    return false;
                }
                
            },
            fail(erro){
                // showToast("扫描发生错误")
                const erros=erro || {errMsg:"扫描发生错误"}
                const errosText=erro.errMsg;
               
                if(errosText !="scanCode:fail cancel"){
                    showToast("扫描发生错误",)
                }
                
            }
        })
    },
    showManuUnlock:function(){
        this.setData({
            manuToRide:true
        })
        
    }
})