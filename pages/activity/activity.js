// pages/activity/activity.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        success: !1,
        details: [{
            content: "骑行时间超过3分钟，且距离大于1公里，则每分钟可收集1.8g能量"
        }, {
            content: "每人每次骑行收集能量不超过30分钟，每天不超过88分钟"
        }, {
            content: "骑行后第二天可在蚂蚁森林收集能量"
        }, {
            content: "查看我的蚂蚁森林：支付宝首页-更多-蚂蚁森林"
        }],
        chooseWXPay: !0,
        activityBannerUrl: "https://ofo.oss-cn-qingdao.aliyuncs.com/alipayTinyApp/ant/antwood_headpic.png",
        redirectTarget: "activity"
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

    }
})