//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },/***微信登录ajax */
  loginAjax:function(){
      var $this=this
      let p = new Promise(function(resolve,reject){
          let code=$this.data.code;
          let userInfo=$this.data.userInfo;
          let phoneNumber=$this.data.phoneNumber;
          wx.request({
              method:"POST",
              url: portUrls.login,
              data:{
                  code:code,
                  userInfo:userInfo,
                  phoneNumber:phoneNumber,
              },
              header: {
                  // 'content-type': 'application/x-www-form-urlencoded'
                  // 'content-type': 'application/json' // 默认值
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
  },
  globalData: {
    userInfo: null
  }
})