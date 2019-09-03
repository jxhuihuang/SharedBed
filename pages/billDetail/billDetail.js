import {portUrls, showToast} from "../../utils/util";
// pages/billDetail/billDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailList:[
            {
                created_at:"2019-09-01 18:08", //'创建时间',
                mode:"recharge", //'recharge 充值/order 下单/commission 佣金/refund 退款/rebate 返利/exchange 兑换/timeout 超时',
                amount: "52", //金额
                point:"",// 积分,
                active: "1"  //
            },
            {
                created_at:"2019-09-01 18:08", //'创建时间',
                mode:"order", //'recharge 充值/order 下单/commission 佣金/refund 退款/rebate 返利/exchange 兑换/timeout 超时',

                amount: "67", //金额
                point:"",// 积分,
                active: "1"  //
            },
            {
                created_at:"2019-09-01 18:08", //'创建时间',
                mode:"commission", //'recharge 充值/order 下单/commission 佣金/refund 退款/rebate 返利/exchange 兑换/timeout 超时',

                amount: "98", //金额
                point:"",// 积分,
                active: "1"  //
            },
            {
                created_at:"2019-09-01 18:08", //'创建时间',
                mode:"exchange", //'recharge 充值/order 下单/commission 佣金/refund 退款/rebate 返利/exchange 兑换/timeout 超时',

                amount: "125", //金额
                point:"",// 积分,
                active: "1"  //
            }

        ],
        modeObj:{
            recharge:"充值",
            order:"下单",
            commission:"佣金",
            refund:"退款",
            rebate:"返利",
            exchange:"兑换",
            timeout: "超时",
        }
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
    getInfo: function () {
        let userInfo = wx.getStorageSync('userInfo') || {};
        const p = new Promise(function (resolve, reject) {
            wx.request({
                url: portUrls.bill,
                data:{
                    'page': '1',
                    'perPage': '10'
                },
                header: {
                    'Authorization': 'Bearer ' + userInfo.access_token
                },
                success(res) {
                    if (res.data) {
                        resolve(res.data)
                    } else {
                        showToast("获取信息失败")
                    }
                }
            })

        })
        return p;

    }
})