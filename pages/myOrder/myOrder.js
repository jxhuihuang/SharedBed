// pages/myOrder/myOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList:[
        {
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
        },{
            dateTime:"2019-08-24",
            userTime:"8分57秒",
            spendAmount:"0",
            state:"已完成",
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
  getorderList:function(){
    var $this=this
    let p = new Promise(function(resolve,reject){
        let userInfo=$this.data.userInfo;

        wx.request({
            method:"POST",
            url: portUrls.login,
            data:{
                code:code,
                userInfo:userInfo,
                phoneNumber:phoneNumber,
            },
            header: {
                'Authorization': 'Bearer ' + userInfo.access_token,
            },
            success(res) {
                if(!res.data){
                    showToast("登录失败");
                    $this.login();
                    return false;
                }
                const resData=res.data;
                if(res && resData.state==1){
                    resolve(res.data)
                }else{
                    showToast("登录失败");
                    $this.login();
                }
            }
        })
    })
    return p;
  }
})