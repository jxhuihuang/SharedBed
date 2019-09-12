import {showToast, ajaxFns, portUrls } from "../../utils/util";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        balance:0,
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
        let link=e.currentTarget.dataset.link || "";
        if(link!=""){
            wx.navigateTo({
                url: link,
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