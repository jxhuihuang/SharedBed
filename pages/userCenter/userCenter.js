import {portUrls, showToast} from "../../utils/util";
const app = getApp();
// pages/userCenter/userCenter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        phone:'',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {


    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        let userInfo = wx.getStorageSync('userInfo') || {};
        this.getUserInfo().then((res)=>{
            if(res.data){
                let resData=res.data;
                let resUser=resData.user || {};
                let nickname=resData.nickname || "";
                let avatar=resUser.avatar || "";
                let phone=resUser.phone || "";
                let only_phone=resData.only_phone || "";
                nickname!=""?userInfo.nickname=nickname:"";
                avatar!=""?userInfo.avatar=avatar:"";
                userInfo.phone=phone;
                userInfo.only_phone=only_phone;
                let reg=/^([0-9]{3})([0-9]*?)([0-9]{4})?$/
                if(phone!="" && reg.exec(phone)){
                    userInfo.treatphone=phone.replace(reg,'$1****$3');
                }else{
                    userInfo.treatphone=""
                }
                wx.setStorageSync('userInfo', userInfo);
                this.setData({
                    userInfo: userInfo,
                })
                
            }
           
        })
        // console.log('userInfo', userInfo);
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    tolink: function (e) {
        let link=e.currentTarget.dataset.link || "";
        if(link!=""){
            wx.navigateTo({
                url: link,
            })
        }
    },
    getUserInfo:function(){
        let userInfo = app.globalData.userInfo || {};
        const p = new Promise(function (resolve, reject) {
            wx.request({
                url: portUrls.member,
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                    // 'content-type': 'application/x-www-form-urlencoded'
                    // 'content-type': 'application/json' // 默认值
                },
                success(res) {
                    if(res.data){
                        resolve(res.data)
                    }else{
                        showToast("获取信息失败")
                    }
                }
            })

        })
        return p;
    }
})