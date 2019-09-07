// pages/wallet/wallet.js
import {portUrls, showToast, ajaxFns } from "../../utils/util";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        banner:{
            image:"../../imgs/bana.png", //"../../imgs/bana.png"
            redirecturl:"",
        },/***套餐 */
        package:{
            title:app.globalData.programName+"套餐",
            des:"限时优惠进行中",
            summary:"更划算",
            buttonShow:true,
            button_text:"购买",
            redirecturl:"/pages/purchaseCard/purchaseCard",
        },
        balance:"", //余额
        redEnvelope:"0",
        coupon:"0",  
        point:'', //积分
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
        this.getInfo().then((res)=>{
            console.log('res',res);
            if(res.data){
                const resData=res.data;
                this.setData({
                    balance:resData.balance,
                    point:resData.point,
                })
            }
        });
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

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    tolink: function (e) {
        let link = e.currentTarget.dataset.link || "";
        if(link!=""){
            wx.navigateTo({
                url: link,
            })
        } 
    },
    getInfo:function(){
        let userInfo = wx.getStorageSync('userInfo') || {};
        const p = new Promise(function (resolve, reject) {
            ajaxFns({
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                },
                success(res) {
                    resolve(res)
                }
            },portUrls.account)
        })
        return p;

    }
})