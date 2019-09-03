import { formatNumber, loginType, showToast, showLoading, hideLoading } from "../../utils/util";
const app = getApp();
const $this = this;
Page({
    data: {

        showMap: false,
        waitingState: true,
        isFirstRun: true,
        modelShow: false,
        isgetPosition: false,
        isStakeCity: false,
        markers: [],
        circles:[],
        polygons:[],
        // circles:[{
        //     latitude: 28.68295,
        //     longitude: 115.96292,
        //     // color: "#FE6363AA",
        //     fillColor: "#FE636322",
        //     radius:  6378.137,
        //     strokeWidth: .1
        // }],
        // polygons:[{
        //     points:[
        //             {
        //             latitude:29.297044483637816,
        //             longitude:115.9018853125,
        //         },{
        //             latitude:28.951543180183002,
        //             longitude:115.2866509375
        //         },{
        //             latitude:28.266756877050085,
        //             longitude:115.85519341796875
        //         },{
        //             latitude:28.421464008685255,
        //             longitude:116.396270078125
        //         }
        //     ],
        //     fillColor:"#FE636322",//rgb(236,26,66,50%),
        //     strokeColor: "#e8afbf",
        // }],
        mapId: "myMaps",
        marker: {
            normal: {
                iconPath: "/imgs/location.png",
                width: 50,
                height: 50
            },
            redPacket: {
                iconPath: "/imgs/redpacket.png",
                width: 40,
                height: 46,
                anchorX: .5,
                anchorY: .5
            }
        },
        initPosition: {
            latitude: 28.68202,
            longitude: 115.85794
        },
        position: null,
        blueBar: {
            showNoticeBanner: false,
            type: "blueBar",
            event_name: "",
            event_id: "forbidden",
            redirecturl: "/pages/purchaseCard/purchaseCard",
            action: "ofoJump",
            hasNoticeMore: true,
            moreBtn: "../../imgs/noticebar_link.png",
            warnIcon: "../../imgs/noticebar_attention.png",
            noticeIcon: "", // "../../imgs/noticebar_msg.png",
            infoType: "",

            noticeText: "畅骑一夏，月卡低至一折，限量发售"
        },
        activityIcon: { //活动图标
            showActivity: true,
            redirecturl: "",
            showType: "topBanner", //blueBar  topBanner
            iconPath: "../../imgs/map_icon_rpyc.png"
        },
        topActivity: { //活动
            showActivity: true,
            redirecturl: "",
            title: "畅骑一夏，限量发售",
            showType: "topBanner", //blueBar  topBanner
            iconPath: "../../imgs/deposit_withdraw_modal_1.png", //imgs/deposit_withdraw_modal_1.png
            redirecturl: "/pages/purchaseCard/purchaseCard",
        },
        coverGroups: {
            usecar: {
                name: "扫描用车",
                redirecturl: "/pages/unlock/unlock"
            },
            position: {
                name: "定位",
                redirecturl: ""
            },
            wallet: {
                name: "钱包",
                redirecturl: "/pages/wallet/wallet"
            },
            malfunction: {
                name: "故障报修",
                redirecturl: "/pages/malfunction/malfunction",
            },
            userCenter: {
                name: "用户中心",
                redirecturl: "/pages/userCenter/userCenter"
            },
            activity: {
                name: "活动中心",
                redirecturl: "/pages/activity/activity"
            }

        },
        positionModal: {
            icon: "/imgs/icondingwei1.png",
            title: "小单车申请使用你的位置信息",
            bindtap: "openSetting",
            confirmBtn: "去设置",
        },
        scale: 16
    },
    onLoad: function (option) {
        const $this = this;
    },

    initMaps: function (callBack) {
        callBack = callBack ? callBack : function () { };
        const $this = this;
        $this.userLocation().then((res) => {
            const positions = {
                latitude: res.latitude,
                longitude: res.longitude
            }
            console.log('positions', positions);
            $this.setData({
                position: positions,
                showMap: true,
                scale: this.data.scale,
            }, function () {
                callBack(positions)
                hideLoading()
            })
        }).catch((erro) => {
            $this.setData({
                showMap: true,
                modelShow: true
            })
            hideLoading()
        });
    },
    onShow: function () {
        let userInfo=app.globalData.userInfo;
        console.log('userInfo',userInfo);
        const $this = this;
        this.initMaps((positions) => {
            this.markertap();
            if (this.data.isFirstRun) {
                loginType().then((data) =>{
                    hideLoading()
                }).catch((t) => {
                    hideLoading()
                })
            }
        })
    },
    onHide: function () {
        // console.log("onHide")
        this.setData({
            isFirstRun: false,
            modelShow: false
        })
    },
    onReady:function(){
        let mapId = this.data.mapId;
        this.mapCtx = wx.createMapContext(mapId)
    },
    userLocation: function () {
        const p = new Promise(function (resolve, reject) {
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userLocation'] === false) {
                        reject("erro");
                    } else {
                        wx.getLocation({
                            type: 'gcj02',
                            success(res) {
                                resolve(res)
                            },
                            fail: (res) => {
                                reject("erro");
                            }
                        })
                    }
                },
                fail: (res) => {
                    reject("erro");
                }
            })
        })
        return p
    },
    ofoDispatch: function (e) {
        var $this = this;
        loginType().then((data) => {
            hideLoading();
            if (!e.currentTarget && !e.currentTarget.dataset) return false;
            const itemtype = e.currentTarget.dataset.itemtype || "";
            const evtobj = e.currentTarget.dataset.evtobj || "";
            const redirecturl = e.currentTarget.dataset.redirecturl || "";
            switch (itemtype) {
                case "position":
                    $this.initMaps()
                    break;
                case "map-cover":
                    const coverGroups = $this.data.coverGroups;
                    if (evtobj == "" || !coverGroups[evtobj]) return false;
                    const objs = coverGroups[evtobj] || {};
                    const link = redirecturl || objs.redirecturl || "";
                    if (link != "") {
                        wx.navigateTo({
                            url: link,
                        })
                    }
                break;

                default:
                    if (redirecturl != "") {
                        wx.navigateTo({
                            url: redirecturl,
                        })
                    }
                    break;
            }
        }).catch((t) => {
            hideLoading()
        })
    },/*****跳转权限设置页面 */
    openSetting: function () {
        const $this = this
        wx.openSetting({
            success(res) {
                $this.setData({
                    modelHidden: true
                })
            }
        })
    },
    markertap: function () {
        let marks = [];
        marks.push({
            id: 99,
            iconPath: "/imgs/location.png",
            width: 50,
            height: 50,
            latitude: 28.68298,
            longitude: 115.96199,
            anchorY: 1,
            anchorX: .5
        })
        
        let position=this.data.position;
        // let circles=this.data.circles;
        // circles[0].latitude=position.latitude;
        // circles[0].longitude=position.longitude;
        this.setData({
            // markers: marks,
            // circles:circles
        })
    },
    regionchange(e) {
        var $this = this;
        if (e.type == "end") {
            // console.log("regionchange",e)
            this.mapCtx.getCenterLocation({
                success: function (es) {
                    let latitude = es.latitude;
                    let longitude = es.longitude
                }
            })
        }
        // console.log(e.type)
    },
})