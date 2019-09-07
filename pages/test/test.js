
import { portUrls, showToast, ajaxFns, timetransform } from "../../utils/util";
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
        this.getDict() 
        let times=3001
        console.log('时间转换：'+times+"秒：",timetransform(times));
        
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
    /**
    * 获取字典信息
    */
    getDict: function () {
        let userInfo = wx.getStorageSync('userInfo') || {};
        ajaxFns({
            data: {
                code: 'purchase',
            },
            header: {
                'Authorization': 'Bearer ' + userInfo.accessToken,
            },
            success(res) {
                console.log('getDict_res：', res);
                let resData=res.data;
                let purchaseList=[];
                if(resData.children){
                    resData.children.map((obj)=>{
                        let newObj={};
                        let name=obj.name;
                        let sub=name.split(",")
                        let price=sub[0];
                        let time=sub[1]
                        let title=timetransform(time)
                        purchaseList.push({
                            id:obj.id,
                            price:price,
                            time:time,
                            title:title,
                        })
                    })
                    console.log('purchaseList:',purchaseList);
                    
                }
            }
        }, portUrls.dict)
    },
   
})