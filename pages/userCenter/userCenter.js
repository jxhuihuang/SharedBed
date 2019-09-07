import {portUrls, ajaxFns, showToast} from "../../utils/util";
const app = getApp();
// pages/userCenter/userCenter.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        phone:'',
        showTestHtml:true,
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
        this.getUserInfo()
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
    },/***获取用户信息 */
    getUserInfo:function(){
        const $this=this;
        let userInfo = app.globalData.userInfo || {};
        const p = new Promise(function (resolve, reject) {
            ajaxFns({
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                },
                success(res) {
                    let resData=res.data || {};
                    let resUser=resData.user || {};
                    let phone=resUser.phone || "";
                    userInfo.nickname=resData.nickname || "";
                    userInfo.avatar=resUser.avatar || "";
                    userInfo.phone=resUser.phone || "";
                    userInfo.only_phone=resData.only_phone;
                    let reg=/^([0-9]{3})([0-9]*?)([0-9]{4})?$/
                    if(phone!="" && reg.exec(phone)){
                        userInfo.treatphone=phone.replace(reg,'$1****$3');
                    }else{
                        userInfo.treatphone=""
                    }
                    // console.log('userCenter_userInfo',userInfo);
                    wx.setStorageSync('userInfo', userInfo);
                    $this.setData({
                        userInfo: userInfo,
                    })
                    resolve(res)
                }
            },portUrls.member)
        })
        return p;
    }
})