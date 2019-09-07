import {showToast, showLoading, hideLoading, portUrls, ajaxFns} from "../../utils/util";
let app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        programName:app.globalData.programName,
        feedBackContent:"",
        textarea_maxLength: 140,
        currentLength: 0,
        feedBackSuccess:false, //是否反馈成功 显示成功页面
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
    textareaChange: function (e) {
        let value = e.detail.value || "";
        let length = value === "" ? 0 : value.length;
        
        this.setData({
            currentLength: length,
            feedBackContent: value,
        })
    },
    submitFeedBack:function(e){
        const feedBackContent=this.data.feedBackContent;
        let userInfo = wx.getStorageSync('userInfo') || {};
        const $this=this;
        if(feedBackContent.length<=0){
            showToast("反馈内容不能为空");
            return false;
        }
        ajaxFns({
            method:"POST",
            data: {
                'content': feedBackContent,
            },
            header: {
                'Authorization': 'Bearer ' + userInfo.accessToken,
            },
            success(res) {
                // showToast("问题反馈成功");
                $this.setData({
                    feedBackContent:"",
                    feedBackSuccess:true,
                })
                
            }
        }, portUrls.feedback)
        console.log('feedBackContent：',feedBackContent);
    }

})