import { portUrls, showToast, ajaxFns, DateFormat} from "../../utils/util";
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderList: [], //列表
        orderStates:["使用中","交易成功","交易取消","已超时","已退超时费用"],
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
        this.getorderList().then((res)=>{
            let resData=res.data;
            let orders=resData.orders || []
            let pageCount=resData.pages || 0;
            this.setData({
                orderList:orders,
                pageCount:pageCount
            })
            console.log('res:',res);
            
        }).catch((erro)=>{
            console.log('获取订单列表失败:',erro);
            showToast("获取订单列表失败:"+erro)  
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
        console.log('下拉');

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
                this.getorderList().then((res)=>{
                    let orderList=this.data.orderList;
                    let resData=res.data;
                    let orders=resData.orders || []
                    orderList=[...orderList,...orders]
                    this.setData({
                        orderList:orderList,
                        showLoadMore:false,
                    })
                    console.log('res:',res);
                    
                }).catch((erro)=>{
                    console.log('获取订单列表失败:',erro);
                    this.setData({
                        showLoadMore:false,
                    })
                    showToast("获取订单列表失败:"+erro)  
                    
                })
            })

        }
        
        console.log('页面上拉触底');
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },/****获取订单列表 */
    getorderList: function () {
        var $this = this
        let p = new Promise(function (resolve, reject) {
            let userInfo = wx.getStorageSync('userInfo') || {};
            ajaxFns({
                // method: "POST",
                data: {
                    page: $this.data.page,
                    perPage: $this.data.perPage,
                },
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken,
                },
                erroText:"获取订单列表失败",
                success(res) {
                    if(!res.data){
                        reject("获取订单列表失败");
                        return false;
                    }
                    let resData=res.data;
                    let orders=resData.orders || []
                    orders.map((obj)=>{
                        obj.created_at=DateFormat(obj.created_at,"yyyy-MM-dd hh:mm:ss")
                    })
                    
                    resolve(res)
                },
                fail(erro){
                    reject(erro)
                }
            },portUrls.order)
        })
        return p;
    },
})