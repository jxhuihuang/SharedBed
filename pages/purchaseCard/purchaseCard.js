// pages/purchaseCard/purchaseCard.js
var WxParse = require('../../utils/wxParse/wxParse.js');
import {noticeData} from "./config"
Page({

    /**
     * 页面的初始数据
     */
    data: {
        footerShow: true,
        selectPrice:"11.9",
        cardInfo: {
            name:"单车骑行卡",
            des:" 单次骑行前30分钟免费",
            RemainingDate:"7",
            state:"1",
            unit:"天",
            image:"../../imgs/stake-learn-bg.png",
            list:[
                {
                    title:"30天",
                    price:"11.9",
                    original_rice:"20",
                    des:"不限次",
                    discount:"5.0折",
                },{
                    title:"90天",
                    price:"35",
                    original_rice:"60",
                    des:"不限次",
                    discount:"5.9折",
                },{
                    title:"30天",
                    price:"4.2",
                    original_rice:"6",
                    des:"6次骑行",
                    discount:"",
                },
                
            ],
           

        },
        noticeData:[
            {
                title:"骑行套餐购卡须知",
                content:`<div style="text-align:center;">《静夜思》· 李白<br />床前明月光，<br />疑是地上霜。 <br />举头望明月， <br />低头思故乡。<br /><img src="http://www.xiexingcun.com/Poetry/6/images/53e.jpg" alt="" /><br /><img src="http://www.xiexingcun.com/Poetry/6/images/53.jpg" alt="" /><br /><br /><img src="http://www.xiexingcun.com/Poetry/6/images/53b.jpg" alt="" /><br /></div>`,
            }
        ],
        // articles:[]
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
        let that=this;
       
        
        noticeData.map(function(res){
            let content=res.content;
            let articles=WxParse.wxParse('articles', 'html', content, that, 5) || "";
            console.log('articles',articles.articles);
            res.newcontent=articles.articles
        })
        console.log('noticeData',noticeData);
        this.setData({
            noticeData:noticeData
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
    selectCard:function(e){
        let price=e.currentTarget.dataset.price || "";
        this.setData({
            selectPrice:price
        })
        console.log('price',price);
        
    }
})