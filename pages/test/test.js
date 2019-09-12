
import { portUrls, showToast, ajaxFns, timetransform, hexCharCodeToStr,DateFormat } from "../../utils/util";
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {

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
        const accountInfo = wx.getAccountInfoSync(); //获取小程序appid
        // this.getDict() 
        let times="3600"
        console.log('时间转换：'+times+"秒：",timetransform(times));
        let newOder_id=times.toString();
        newOder_id=newOder_id.padStart(10, '0') // 'xxx';
        let arry1=[1,2,3,4]
        let arry2=[5,6,7,8]
        let date="2019-09-12T08:02:08"
        console.log('DateFormat：',DateFormat(date));
        
        console.log('arrys:',[...arry1, ...arry2]);
        
        // wx.getSystemInfo({
        //     success(res) {
        //         console.log(res)
        //         console.log(res.model)
        //         console.log(res.pixelRatio)
        //         console.log(res.windowWidth)
        //         console.log(res.windowHeight)
        //         console.log(res.language)
        //         console.log(res.version)
        //         console.log(res.platform)
        //     }
        // })
    },
     /** 创建订单*/
    /**
    * 获取字典信息
    */
    getDict: function () {
        let userInfo = wx.getStorageSync('userInfo') || {};
        ajaxFns({
            method: "POST",
            data:{
                purchaseId: 2,
                number:123
            },
            header: {
                'Authorization': 'Bearer ' + userInfo.accessToken
            },
            success(res) {
               
            }
        },portUrls.order)
    },
    createOrder:function(){
        wx.navigateTo({
            url: "/pages/map/map",
        })
    }
   
})