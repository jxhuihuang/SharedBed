import {showToast,isSupportBluetooth,geturl, ajaxFns,portUrls, timetransform, showLoading, hideLoading} from "../../utils/util";
const app = getApp();
const globalData=app.globalData;
Page({
    data: {
        pageBanner: "https://ofo.oss-cn-qingdao.aliyuncs.com/alipayTinyApp/rebuild/usebike_pic.png",
        pageTitle:"欢迎使用"+app.globalData.programName,
        manuToRide:false,   //是否显示手动输入框
        hitMsg: "输入床编号，获取解锁码",
        pageSubtitle: "规范用床，文明你我",
        authtype:2,   //多少钱一小时
        inputNumber:"", //输入的编号
        bedNumber:"", //获取的床编号
        bedInfo:{}, //床信息
        device:[], //搜索的蓝牙设备
        stopSearchTime:600000, //搜素蓝牙设备的时间 ，超过就停止搜索
        available:false, //蓝牙适配器是否可用
        discovering:false,  //蓝牙是否正在搜索设备
        ridingBtn:{
            text: "立即用床",
        },
        showPackageModel:false, //是否显示选择套餐model
        purchase:{ //套餐数据
            cardNname:"陪护床套餐",
            cardDes:"陪护床套餐",
            cardImage:"../../imgs/stake-learn-bg.png",
            list:[],
            footerShow:false,
            selectPrice:'',

        }, //套餐数据
    },

    onLoad: function () {
        console.log("隐藏");
        this.bluetoothAdapter().then((res)=>{ //初始化蓝牙
            this.monitorBluetooth();  //监听蓝牙状态
            this.getBluetoothState(); //获取蓝牙状态
        })
    },
    onShow:function(){
        
    },
    onHide:function(){
        let discovering=this.data.discovering;
        if(discovering){
            wx.stopBluetoothDevicesDiscovery({
                success: function(res2) {
                    console.log("停止搜索成功", res2);
                }
            })
        }
        console.log("隐藏");
    },
    onUnload:function(){
        console.log("卸载");
        let discovering=this.data.discovering;
        if(discovering){
            wx.stopBluetoothDevicesDiscovery({
                success: function(res2) {
                    console.log("停止搜索成功", res2);
                }
            })
        }
    },
    ofoDispatch:function(e){
        console.log('ofoDispatch');
        const action=e.currentTarget.dataset.action || "";
        console.log('action:',action);
        if(action=="scanUnlock"){
            this.scanUnlock()
        }
    },/***点击获取编号按钮  type scanToRide:扫码获取   manuToRide：手动输入*/
    clickRideBtn:function(e){
        const $this=this;
        const type=e.currentTarget.dataset.type || "";
        console.log('type:',type);
        
        const available=this.data.available;
        if(!available){
            showToast("请在设置中打开你的蓝牙设备");
            return false;
        }
        this.getBedNumber(type,e).then((number)=>{
            $this.getbedInfo(number).then((res)=>{  //获取床数据  bedInfo
                console.log('获取床数据成功',res);
                if(!res.data){
                    showToast("设备不存在");
                    return false;
                }
                let bedInfo=res.data;
                $this.setData({
                    bedInfo:bedInfo,
                },()=>{
                    $this.getServices().then((res)=>{ //搜索连接蓝牙设备，并获取设备信息
                        let bedInfo=$this.data.bedInfo;
                        console.log('bedInfo',bedInfo);
                        $this.getDict().then(()=>{ //获取套餐信息
                            $this.setData({
                                showPackageModel:true,
                            })
                        })
                    })
                })
            })
        })
    },
    /**获取床编号  type scanToRide:扫码获取   manuToRide：手动输入*/
    getBedNumber:function(type){
        const $this=this;
        let p = new Promise(function(resolve,reject){
            if(type=="scan_unlock"){  //扫码获取
                wx.scanCode({   //扫描二维码
                    scanType:['qrCode'],
                    success (res) {
                        // console.log("scanUnlock_res:",res)
                        if(res.path){
                            wx.showModal({
                                content:"编号有误, 请重试"
                            })
                            return false;
                        }
                        let reust=res.result || "";
                        let number=geturl("number",reust)
                        resolve(number)
                    },
                    fail(erro){
                        const erros=erro || {errMsg:"扫描发生错误"}
                        const errosText=erro.errMsg;
                        if(errosText !="scanCode:fail cancel"){
                            console.log('扫描发生错误:', erros);
                            showToast("扫描发生错误",)
                        }
                    }
                })
            }
            if(type=="manuToRide"){ //手动输入
                let number=$this.data.inputNumber;
                if(number==""){
                    showToast("编号不能为空")
                    return false;
                }
                resolve(number)
            }
        })
        return p;
    },
    inputPlate:function(e){
        let value=e.detail.value || "";
        // let reg=/^([1-9]\d*|[0]{1,1}){3}?$/
        // if(!reg.exec(value)){
        //     wx.showModal({
        //         content:"编号有误, 请重试"
        //     })
        //     return false;
        // }
        if(value!=""){
            this.setData({
                inputNumber:value
            })
        }
    },//跟新陪护床数据
    updataBedData:function(){
        let bedInfo=this.data.bedInfo;
        const $this=this;
        const p = new Promise(function (resolve, reject) {
            let userInfo = app.globalData.userInfo || {};
            if(bedNumber==""){
                return false;
            }
            ajaxFns({
                method: "POST",
                data:{
                    'content': bedInfo.services
                },
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                },
                success(res) {
                    resolve(res)
                }
            },portUrls.usage)
        })
        return p;
    },/*** 获取套餐信息*/
    getDict: function () {
        const $this=this;
        const p = new Promise(function (resolve, reject) {
            let userInfo = wx.getStorageSync('userInfo') || {};
            ajaxFns({
                data: {
                    code: 'purchase',
                },
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken,
                },
                success(res) {
                    if(res.data){
                        let resData=res.data;
                        let purchaseList=[];
                        if(resData.children){
                            resData.children.map((obj)=>{
                                let newObj={};
                                let name=obj.name;
                                let sub=name.split(",")
                                let price=sub[0];
                                let time=sub[1]
                                let title=timetransform(time)
                                purchaseList.push({
                                    id:obj.id,
                                    price:price,
                                    time:time,
                                    title:title,
                                })
                            })
                            let purchase=$this.data.purchase
                            purchase.list=purchaseList;
                            $this.setData({
                                purchase:purchase
                            })
                            resolve(purchase);
                            console.log('purchaseList:',purchaseList);
                        }
                    }
                    resolve(res)
                }
            }, portUrls.dict)
        })
        return p;
    },
    showManuUnlock:function(){
        this.setData({
            manuToRide:true
        })
    },/**根据编号获取床信息 */
    getbedInfo:function(bedNumber){
        const $this=this;
        const p = new Promise(function (resolve, reject) {
            let userInfo = app.globalData.userInfo || {};
            if(bedNumber==""){
                return false;
            }
            ajaxFns({
                data:{
                    'number': bedNumber
                },
                erroText:"获取床编号失败或者编号不存在",
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                },
                success(res) {
                    resolve(res)
                }
            },portUrls.bedInfo)
        })
        return p;

    },
    // 初始化蓝牙适配器
    bluetoothAdapter:function(){ 
        let p = new Promise(function(resolve,reject){
            isSupportBluetooth().then(()=>{
                wx.openBluetoothAdapter({
                    success (res) {  
                        console.log("初始化蓝牙成功",res)
                        resolve(res)
                    },
                    fail: function (err) {
                        let erroText=err.errMsg || "初始化蓝牙失败";
                        console.log("初始化蓝牙失败:",erroText)  
                        // showToast("请在设置中打开你的蓝牙设备")
                    }
                })
            })
        })
        return p;
    },
    //监听蓝牙适配器
    monitorBluetooth:function(){
        const $this=this;
        wx.onBluetoothAdapterStateChange(function (res){
            console.log('监听蓝牙适配器', res)
            $this.setData({
                available:res.available,
                discovering:res.discovering
            })
        })
    },
    //获取蓝牙适配器状态
    getBluetoothState:function(){
        const $this=this;
        let p = new Promise(function(resolve,reject){
            wx.getBluetoothAdapterState({
                success (res) { 
                    // console.log("getBluetoothState",res)  
                    $this.setData({
                        available:res.available,
                        discovering:res.discovering
                    },()=>{
                        resolve(res)
                    })
                },
                fail: function (err) {
                    let erroText=err.errMsg || "获取蓝牙状态失败";
                    $this.setData({
                        available:res.available,
                        discovering:res.discovering
                    })
                    console.log(erroText)  
                    // showToast("获取蓝牙状态失败")
                }
            })
        })
        return p;
    },
    /**搜索连接蓝牙设备斌获取services */
    getServices:function(){
        const $this=this;
        let bedInfo=this.data.bedInfo;
        console.log('bedInfo',bedInfo);
        const p = new Promise(function (resolve, reject) {
            wx.startBluetoothDevicesDiscovery({  //搜索附近设备
                services: [],
                allowDuplicatesKey: false,
                success: function(res) {
                    setTimeout(() => { //搜索超时
                        let discovering=$this.data.discovering;
                        if(discovering){
                            wx.stopBluetoothDevicesDiscovery({
                                success: function(res2) {
                                    console.log("搜索超时,停止搜索");
                                    resolve("");
                                }
                            })
                        }
                    }, $this.data.stopSearchTime);
                    wx.onBluetoothDeviceFound(function(res1) { //监听寻找到新设备的事件
                        let deviceName=res1.devices[0].name;
                        if(bedInfo.device_name==deviceName){
                            let deviceId=res1.devices[0].deviceId;
                            var device_RSSI_1 = res1.devices[0].RSSI;
                            var device_RSSI_2 = Number(device_RSSI_1);
                            var device_RSSI = Math.abs(device_RSSI_2);
                            bedInfo.deviceId=deviceId;
                            console.log("匹配device", res1);
                            console.log('device_RSSI',device_RSSI);
                            wx.stopBluetoothDevicesDiscovery({
                                success: function(res2) {
                                    console.log("停止搜索成功");
                                    console.log("开始连接匹配的设备");
                                    showLoading("正在为您链接设备")
                                    wx.createBLEConnection({ //连接匹配的设备
                                        deviceId:deviceId,
                                        success: (res3) => {
                                            hideLoading()
                                            $this.setData({bedInfo: bedInfo},()=>{
                                                resolve(res3);
                                                wx.closeBLEConnection({
                                                    deviceId,
                                                    success (res1) {
                                                        console.log("断开连接成功")
                                                    }
                                                })
                                            })
                                        },
                                        fail(err) {
                                            hideLoading()
                                            console.log("err",err)
                                            showToast("链接设备失败")
                                           const erroCode=erroCode
                                        }
                                    })
                                }
                            })
                        }
                        // console.log(devices[0].advertisData)
                    })
                },
                fail(err) {
                    console.log("err",err)
                }
            })

        })
        return p;
    },
    /***关闭蓝牙适配器 */
    closeBluetoothAdapter:function(){
        const $this=this;
        const p = new Promise(function (resolve, reject) {
            wx.closeBluetoothAdapter({
                success: function (res) {
                    resolve(res)
                },
                fail: function (err) {
                    let erroText=err.errMsg || "关闭蓝牙适配器失败";
                    console.log(erroText)  
                    // showToast("获取蓝牙状态失败")
                }
            })
        })
        return p;
        
    }
    
})