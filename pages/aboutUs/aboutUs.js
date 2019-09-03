// pages/aboutUs/aboutUs.js
const app = getApp();
const globalDatas=app.globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        program_title: app.globalData.programName,
        program_icon: "../../imgs/deposit_withdraw_modal_2_1_freeriding.png",
        program_des: "box-shadow 向框添加一个或多个阴影。该属性是由逗号分隔的阴影列表，每个阴影由 2-4 个长度值、可选的颜色值以及可选的 inset 关键词来规定。",
        customer_phone: "15789968966",
        customer_email: "47885@163.com",
        programIcon:app.globalData.programIcon,
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
        const accountInfo = wx.getAccountInfoSync();
        console.log('accountInfo', accountInfo);
        wx.getSystemInfo({
            success(res) {
                console.log(res)
                console.log(res.model)
                console.log(res.pixelRatio)
                console.log(res.windowWidth)
                console.log(res.windowHeight)
                console.log(res.language)
                console.log(res.version)
                console.log(res.platform)
            }
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

    }
})