import { portUrls, showToast, ajaxFns } from "../../utils/util";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: [
            {
                id:1,
                number:"78899",
                amount: "0",
                timeout_amount:"10",
                created_at: "2019-08-24",
                userTime: "8分57秒",
                state: "已完成",
            }, {
                id:1,
                number:"78899",
                amount: "0",
                timeout_amount:"10",
                created_at: "2019-08-24",
                userTime: "8分57秒",
                state: "已完成",
            }, {
                id:1,
                number:"78899",
                amount: "0",
                timeout_amount:"10",
                created_at: "2019-08-24",
                userTime: "8分57秒",
                state: "已完成",
            }, {
                id:1,
                number:"78899",
                amount: "0",
                timeout_amount:"10",
                created_at: "2019-08-24",
                userTime: "8分57秒",
                state: "已完成",
            }, {
                id:1,
                number:"78899",
                amount: "0",
                timeout_amount:"10",
                created_at: "2019-08-24",
                userTime: "8分57秒",
                state: "已完成",
            }, {
                id:1,
                number:"78899",
                amount: "0",
                timeout_amount:"10",
                created_at: "2019-08-24",
                userTime: "8分57秒",
                state: "已完成",
            }, {
                id:1,
                number:"78899",
                amount: "0",
                timeout_amount:"10",
                created_at: "2019-08-24",
                userTime: "8分57秒",
                state: "已完成",
            }, {
                id:1,
                number:"78899",
                amount: "0",
                timeout_amount:"10",
                created_at: "2019-08-24",
                userTime: "8分57秒",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            }, {
                dateTime: "2019-08-24",
                userTime: "8分57秒",
                spendAmount: "0",
                state: "已完成",
            },
        ]
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
        this.getorderList().then((res)=>{
            console.log('res:',res);
            
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
        console.log('下拉');

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('页面上拉触底');
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },/****获取订单列表 */
    getorderList: function () {
        var $this = this
        let p = new Promise(function (resolve, reject) {
            let userInfo = wx.getStorageSync('userInfo') || {};
            ajaxFns({
                // method: "POST",
                url: portUrls.orderList,
                data: {
                    page: 1,
                    perPage: 15,
                },
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken,
                },
                erroText:"获取订单列表失败",
                success(res) {
                    resolve(res)
                }

            },portUrls.orderList)
        })
        return p;
    },
    createOrder:function(e){
        var $this = this
        let p = new Promise(function (resolve, reject) {
            let userInfo = wx.getStorageSync('userInfo') || {};
            ajaxFns({
                // method: "POST",
                url: portUrls.orderList,
                data: {
                    purchaseId: 1,
                    number: 15,
                },
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken,
                },
                erroText:"创建订单失败",
                success(res) {
                    resolve(res)
                }

            },portUrls.orderList)
        })
        return p;
    }
})