import {portUrls, showToast, ajaxFns,DateFormat} from "../../utils/util";
// pages/billDetail/billDetail.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        detailList:[],
        modeObj:{
            recharge:"充值",
            order:"下单",
            commission:"佣金",
            refund:"退款",
            rebate:"返利",
            exchange:"兑换",
            timeout: "超时",
        },
        page:1,
        perPage:10,
        showLoadMore:false, //是否显示加载更多
        showLoadMoreText:"正在加载...",
        pageCount:0,  //总页数
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
            let resData=res.data;
            let detailList=resData.bills || []
            let pageCount=resData.pages || 0;
            this.setData({
                detailList:detailList,
                pageCount:pageCount
            })
            console.log("deail_res",res);
        }).catch((erro)=>{
            console.log('获取交易明细失败:',erro);
            showToast("获取交易明细失败:"+erro)  
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
        let page=this.data.page;
        let showLoadMore=this.data.showLoadMore;
        let pageCount=this.data.pageCount;
        if(!showLoadMore){
            let nowPage=page+1;
            console.log('nowPage：',nowPage);
            
            if(nowPage>pageCount){
                this.setData({
                    showLoadMoreText:"已经到顶了",
                    showLoadMore:true,
                })
                setTimeout(() => {
                    this.setData({
                        showLoadMore:false,
                    })
                    
                }, 1000);
                return false;
            }

            this.setData({
                page:page+1,
                showLoadMore:true,
                showLoadMoreText:"正在加载...",
            },()=>{
                this.getInfo().then((res)=>{
                    let detailList=this.data.detailList;
                    let resData=res.data;
                    let detail=resData.bills || []
                    detailList=[...detailList,...detail]
                    this.setData({
                        detailList:detailList,
                        showLoadMore:false,
                    })
                    console.log('res:',res);
                    
                }).catch((erro)=>{
                    console.log('获取交易明细失败:',erro);
                    this.setData({
                        showLoadMore:false,
                    })
                    showToast("获取交易明细失败:"+erro)  
                    
                })
            })

        }
        console.log('页面上拉触底');
    },
    getInfo: function () {
        let userInfo = wx.getStorageSync('userInfo') || {};
        const p = new Promise(function (resolve, reject) {
            ajaxFns({
                data:{
                    'page': '1',
                    'perPage': '10'
                },
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                },
                erroText:"获取交易明细失败",
                success(res) {
                    if(!res.data){
                        reject("获取交易明细失败");
                        return false;
                    }
                    let resData=res.data;
                    let bills=resData.bills || []
                    bills.map((obj)=>{
                        obj.created_at=DateFormat(obj.created_at,"yyyy-MM-dd hh:mm:ss")
                    })
                    resolve(res)
                },
                fail(erro){
                    reject(erro)
                }
            },portUrls.bill)
        })
        return p;
    }
})