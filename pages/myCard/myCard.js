// pages/cardRoll/cardRoll.js
import {tolinks} from "../../utils/util";
Page({

  /**
   * 页面的初始数据
   */
  data: {
        cardData:[
            {
                name:"单车骑行卡",
                des:" 单次骑行前30分钟免费",
                validCount:"7",
                state:"1",
                duringType:"1", //1 ：天  2： 次
                image:"../../imgs/stake-learn-bg.png",
            },
            {
                name:"单车骑行次卡",
                des: "在一周时间内免费骑行7次",
                validCount:"0",
                state:"1",
                duringType:"2", 
                image:"../../imgs/stake15-learn-bg.png",
            }
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  tolink:function(e){
    
    tolinks(e)
  }

})