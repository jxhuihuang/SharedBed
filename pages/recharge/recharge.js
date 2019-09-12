// pages/recharge/recharge.js
import {showToast, ajaxFns, portUrls } from "../../utils/util";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        rechargeData: [
            {
                amount: 100,
            },{
                amount: 50,
            },{
                amount: 30,
            },{
                amount: 20,
            }
        ],
        balance:"1.00",
        seletAmount:0,
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
        let rechargeData=this.data.rechargeData;
        this.getInfo().then((res)=>{
            const resData=res.data;
            let balance=resData.balance || 0;
            let point=resData.point || 0;
            this.setData({
                balance:balance,
                point:point,
            })
        }).catch((erro)=>{
            console.log("获取数据失败：", erro);
            
           showToast("获取数据失败："+erro);
        })
        this.setData({
            seletAmount:rechargeData[rechargeData.length-1].amount?rechargeData[rechargeData.length-1].amount:"0"
        })

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

    
    selectAmount:function(e){
        var selectAmounts=e.currentTarget.dataset.amount || "";
        let rechargeData=this.data.rechargeData;
        this.setData({
            seletAmount:selectAmounts,
        })
    },
    tolink:function(e){
        let link=e.currentTarget.dataset.link || ""; 
        if(link!=""){
            wx.navigateTo({
                url: href,
            })
        }
    },/***获取账户信息 */
    getInfo:function(){
        let userInfo = wx.getStorageSync('userInfo') || {};
        const p = new Promise(function (resolve, reject) {
            ajaxFns({
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                },
                success(res) {
                    if(!res.data){
                        reject("数据不存在");
                        return false;
                    }
                    resolve(res)
                },
                fail(error){
                    reject(error)
                }
            },portUrls.account)
        })
        return p;
    }
})