//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)
    
        
    },
    onShow:function(){
        let userInfos = wx.getStorageSync('userInfo') || null
        this.globalData.userInfo = userInfos
    },
    onHide:function(){

        
    },
    onPageNotFound(res) {
  
    },
    globalData: {
        programName:"易陪物联",
        programIcon:"/imgs/programIcon.png",
        wxUserInfo:null,
        userInfo: {},
        isajax:true,
        loginType:"1",
        access_token:"",
        refresh_token:"",
    },
})