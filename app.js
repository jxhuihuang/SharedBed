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
        let sysinfo = wx.getSystemInfoSync();
        this.globalData.sysinfo=sysinfo; //系统信息
    },
    onHide:function(){

        
    },
    onPageNotFound(res) {
  
    },
    globalData: {
        programCompany:"易陪物联",
        programName:"陪护床",
        programIcon:"/imgs/programIcon.png",
        userInfo: {},
        isajax:true,
    },
})