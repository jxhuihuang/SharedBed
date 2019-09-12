import {navigateBack, showToast, isSupportBluetooth, geturl, ajaxFns, portUrls, timetransform, showLoading, hideLoading, ab2hex, hexCharCodeToStr , toCase} from "../../utils/util";

const app = getApp();
const globalData = app.globalData;
Page({
    data: {
        pageBanner: "https://ofo.oss-cn-qingdao.aliyuncs.com/alipayTinyApp/rebuild/usebike_pic.png",
        pageTitle: "欢迎使用" + app.globalData.programName,
        manuToRide: false,   //是否显示手动输入框
        hitMsg: "输入床编号，获取解锁码",
        pageSubtitle: "规范用床，文明你我",
        authtype: 2,   //多少钱一小时
        inputNumber: "", //输入的编号
        bedNumber: "", //获取的床编号
        bedInfo: {}, //床信息
        isbluetoothready: false,
        device: [], //搜索的蓝牙设备
        stopSearchTime: 60000, //搜素蓝牙设备的时间 ，超过就停止搜索
        available: false, //蓝牙适配器是否可用
        discovering: false,  //蓝牙是否正在搜索设备
        services:[],  //蓝牙services集
        servicesId:"",
        recv_value:"",  //接收的数据
        recv_number:0,  //接收的数据才长度
        ridingBtn: {
            text: "立即用床",
        },
        send_content:null,
        showPackageModel: false, //是否显示选择套餐model
        purchase: { //套餐数据
            cardNname: "陪护床套餐",
            cardDes: "陪护床套餐",
            cardImage: "../../imgs/stake-learn-bg.png",
            list: [],
            selectPurchase: {

            }
        }, //套餐数据

    },

    onLoad: function () {
        
    },
    onShow: function () {
        //获取套餐信息
        this.getDict();
    },
    onHide: function () {
        let discovering = this.data.discovering;
        if (discovering) {
            this.stopBluetoothDevicesDiscovery(); //停止搜索
        }
        this.closeBluetoothAdapter();//关闭蓝牙适配器
        console.log("隐藏");
    },
    onUnload: function () {
        console.log("卸载");
        let discovering = this.data.discovering;
        if (discovering) {
            this.stopBluetoothDevicesDiscovery(); //停止搜索
        }
        this.closeBluetoothAdapter(); //关闭蓝牙适配器
    },/***点击获取编号按钮  type scanToRide:扫码获取   manuToRide：手动输入*/
    clickRideBtn: function (e) {
        const $this = this;
        const type = e.currentTarget.dataset.type || "";
        showLoading()
        this.getBedNumber(type, e).then((number) => {  //获取扫描或输入的床编号
            $this.getbedInfo(number).then((res) => {  //获取床数据 
                console.log('获取床数据成功', res);
                let bedInfo = $this.data.bedInfo;
                let { content = "" } = bedInfo;
                this.bluetoothAdapter().then((res) => { //初始化蓝牙
                    this.monitorBluetooth();  //监听蓝牙状态
                    $this.getDeviceFound().then((res) => { //搜索蓝牙设备，并获取设备信息
                        let bedInfo = $this.data.bedInfo;
                        console.log('bedInfo', bedInfo);
                        if (!bedInfo.deviceId) {
                            showToast("设备不存在");
                            return false;
                        }
                        if (content == "") {  //没有下单， 去下单
                            $this.setData({
                                showPackageModel: true,
                            })
                        } else {    //已经下单 ，直接连接
                            /**存在content */
                            console.log('content', content);
                            $this.sentData().then((res)=>{
                                showLoading("正在为您开锁")
                                console.log('sedcontent:', res);
                                $this.connectionBluetooth().then(() => {

                                }).catch((erro)=>{
                                    showToast("开锁失败："+erro)
                                })
                            })
                            
                        }
                    })
                }).catch((error) => {
                    console.log('蓝牙初始化失败:', error);
                    showToast("请在设置中打开你的蓝牙设备");
                    return false;
                })
            }).catch((error) => {
                console.log('获取床数据失败:', error);
                showToast("获取床数据失败或床不存在");
                return false;
            })
        })
    },/***提交选择的套餐 */
    ajaxPurchase: function () {
        const $this = this;
        let purchase = this.data.purchase;
        let { selectPurchase } = purchase;
        console.log('开始创建订单');
        this.createdOrder().then((res) => {
            let resData=res.data;
            console.log('创建订单成功：', res);
            let bedInfo = $this.data.bedInfo;
            bedInfo.content=resData.content;
            bedInfo.order_id=resData.order_id;
            $this.setData({
                bedInfo:bedInfo,
                showPackageModel: false,
            },()=>{
                console.log('bedInfo', bedInfo);
                let { content = "" } = bedInfo;
                console.log('content', content);
                $this.sentData().then((res)=>{
                    showLoading("正在为您开锁")
                    console.log('sedcontent:', res);
                    $this.connectionBluetooth().then(() => {


                    }).catch((erro)=>{
                        showToast("开锁失败："+erro)
                    })
                })
            })
            
            
        }).catch(()=>{
            navigateBack();
        })
    },
    /**获取床编号  type scanToRide:扫码获取   manuToRide：手动输入*/
    getBedNumber: function (type) {
        const $this = this;
        let p = new Promise(function (resolve, reject) {
            if (type == "scan_unlock") {  //扫码获取
                wx.scanCode({   //扫描二维码
                    scanType: ['qrCode'],
                    success(res) {
                        // console.log("scanUnlock_res:",res)
                        if (res.path) {

                            wx.showModal({
                                content: "编号有误, 请重试"
                            })
                            return false;
                        }
                        let reust = res.result || "";
                        let number = geturl("number", reust)
                        $this.setData({
                            bedNumber: number
                        })
                        resolve(number)
                    },
                    fail(erro) {
                        const erros = erro || { errMsg: "扫描发生错误" }
                        const errosText = erro.errMsg;
                        if (errosText != "scanCode:fail cancel") {
                            console.log('扫描发生错误:', erros);
                            showToast("扫描发生错误")
                        }
                    }
                })
            }
            if (type == "manuToRide") { //手动输入
                let number = $this.data.inputNumber;
                if (number == "") {
                    showToast("编号不能为空")
                    return false;
                }
                $this.setData({
                    bedNumber: number
                })
                resolve(number)
            }
        })
        return p;
    },
    inputPlate: function (e) {
        let value = e.detail.value || "";
        // let reg=/^([1-9]\d*|[0]{1,1}){3}?$/
        // if(!reg.exec(value)){
        //     wx.showModal({
        //         content:"编号有误, 请重试"
        //     })
        //     return false;
        // }
        if (value != "") {
            this.setData({
                inputNumber: value
            })
        }
    },/*** 获取套餐信息*/
    getDict: function () {
        const $this = this;
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
                    if (res.data) {
                        let resData = res.data;
                        let purchaseList = [];
                        if (resData.children) {
                            resData.children.map((obj) => {
                                let newObj = {};
                                let name = obj.name;
                                let sub = name.split(",")
                                let price = sub[0];
                                let time = sub[1]
                                let title = timetransform(time)
                                purchaseList.push({
                                    id: obj.id,
                                    price: price,
                                    time: time,
                                    title: title,
                                })
                            })
                            let purchase = $this.data.purchase
                            purchase.list = purchaseList;
                            $this.setData({
                                purchase: purchase
                            })
                            resolve(purchase);
                            console.log('purchaseList:', purchaseList);
                        }
                    }
                    resolve(res)
                },
                fail(erro){
                    reject(erro)
                }
            }, portUrls.dict)
        })
        return p;
    },
    showManuUnlock: function () {
        this.setData({
            manuToRide: true
        })
    },/**根据编号获取床信息 */
    getbedInfo: function (bedNumber) {
        const $this = this;
        const p = new Promise(function (resolve, reject) {
            let userInfo = app.globalData.userInfo || {};
            if (bedNumber == "") {
                reject("编号不能为空");
                return false;
            }
            ajaxFns({
                data: {
                    'number': bedNumber
                },
                erroText: "获取床编号失败或者编号不存在",
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                },
                success(res) {
                    if(!res.data){
                        reject("获取床编号失败或者编号不存在");
                        return false;
                    }
                    let resData=res.data;
                    let bedInfo = $this.data.bedInfo;
                    resData.content?bedInfo.content=resData.content:"";
                    bedInfo.device_id=resData.device_id;
                    bedInfo.device_name=resData.device_name;
                    resData.order_id?bedInfo.order_id=resData.order_id:"";
                    $this.setData({
                        bedInfo: bedInfo,
                    }, () => {
                        resolve(bedInfo)
                    })
                },
                fail(erro){
                    console.log('获取床信息失败：',erro);
                    reject(erro)
                }
            }, portUrls.bedInfo)
        })
        return p;

    },/***选择套餐 */
    selectCard: function (e) {
        let id = e.currentTarget.dataset.id || "";
        let purchase = this.data.purchase;
        let newpurchase = {};
        purchase.list.map((res) => {
            if (res.id == id) {
                newpurchase = res
            }
        })
        purchase.selectPurchase = newpurchase
        this.setData({
            purchase: purchase
        })
    },//创建订单
    createdOrder: function () {
        const $this = this;
        
        const p = new Promise(function (resolve, reject) {
            let purchase = $this.data.purchase;
            let { selectPurchase } = purchase;
            const bedNumber = $this.data.bedNumber;
            let userInfo = wx.getStorageSync('userInfo') || {};
            ajaxFns({
                method: "POST",

                data: {
                    purchaseId: selectPurchase.id,
                    number: bedNumber
                },
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                },
                success(res) {
                    /***content */
                    resolve(res)
                },
                fail(error){
                    reject(error)
                }
            }, portUrls.order)

        })
        return p;
    },
    //跟新陪护床数据
    updataBedData: function () {
        const $this = this;
        const p = new Promise(function (resolve, reject) {
            let userInfo = wx.getStorageSync('userInfo') || {};
            let bedInfo = $this.data.bedInfo;
            let recv_value=$this.data.recv_value?toCase($this.data.recv_value,"upper"):"";
            let orderId=bedInfo.order_id;
            console.log('recv_value', recv_value);

            let recv_value1=recv_value.substring(0,2) //帧头
            let recv_value2=recv_value.substring(2,4) //帧头2
            let recv_value3=recv_value.substring(4,20) //扰码（8月19年16时16日15分632毫秒23秒）
            let recv_value4=recv_value.substring(20,22)  //操作结果：01（开锁成功）
            let recv_value5=recv_value.substring(22,32) //上次订单号
            let recv_value6=recv_value.substring(32,38) //上次实际使用时长
            let CRC1=recv_value.substring(38,40)       //计算得到的CRC值：
            let CRC2=recv_value.substring(40,42)       //计算得到的CRC值：
            console.log('当前订单号：', orderId);
            console.log('帧头 ：',  recv_value1+" "+recv_value2);
            console.log('扰码：',  recv_value3);
            console.log('操作结果：',  recv_value4);
            console.log('上次订单号 ：',  recv_value5);
            console.log('上次实际使用时长 ：',  recv_value6);
            console.log('计算得到的CRC值 ：',  CRC1+" "+CRC2);
            let newOder_id=orderId.toString();
            newOder_id=newOder_id.padStart(recv_value5.length, '0') // 'xxx';
            if (recv_value == "") {
                reject("跟新陪护床数据失败")
                return false;
            }
            if(recv_value5=="0000000000"){
                reject("此床正在使用中")
                return false;
            }
            if(recv_value5==newOder_id){
                reject("开锁失败")
                return false;
            }
           
            ajaxFns({
                method: "POST",
                data: {
                    'content': recv_value
                },
                header: {
                    'Authorization': 'Bearer ' + userInfo.accessToken
                },
                success:(res)=>{
                    resolve(res)
                },
                fail:(erro)=>{
                    reject(erro)
                }
            }, portUrls.usage)
        })
        return p;
    },
    sentData:function(){
        let $this=this;
        let bedInfo = this.data.bedInfo;
        let { content } = bedInfo;
        const p = new Promise(function (resolve, reject) {
           
            /* 判断字节是否超过20字节 */
            if (content.length > 20) {     //当字节超过20的时候，采用分段发送
                var write_array = [];
                let sentContent=[]

                var value_initial_exceed = content;       //将输入框的值取过来，方便循环
                var value_initial_average = Math.ceil(value_initial_exceed.length / 20);        //将value_initial_exceed的长度除以20，余数再向上取一，确定循环几次
                console.log('需要循环的次数', value_initial_average);
                for (var i = 0; i < value_initial_average; i++) {
                    if (value_initial_exceed.length > 20) {
                        var value_initial_send = value_initial_exceed.slice(0, 20);      //截取前20个字节
                        console.log('截取到的值', value_initial_send);
                        value_initial_exceed = value_initial_exceed.substring(20);      //value_initial_exceed替换为取掉前20字节后的数据
                        write_array.push(value_initial_send);       //将所有截取的值放在一个数组
                    } else {
                        write_array.push(value_initial_exceed);
                    }
                }
                console.log('write_array数组', write_array);
                write_array.map(function (val, index) {
                    var value_set = val;
                    // console.log('value_set', value_set);
                    sentContent.push(value_set);
                });
                /* 发送的值的字节 */
                var send_number_1 = $this.data.send_number + value_initial_exceed.length / 2;
                var send_number = Math.floor(send_number_1);
                $this.setData({
                    send_content: sentContent,
                    send_number: send_number
                },()=>{
                    resolve(sentContent)
                });
            }else{
                let sentContent=[];
                sentContent.push(content);
                var send_number_1 = $this.data.send_number + content.length;
                var send_number = Math.round(send_number_1);
                /* 当选择了以Hex十六进制发送的时候 */
                $this.setData({
                    send_content: content,
                    send_number: send_number
                },()=>{
                    resolve(send_content)
                });
            }
        })
        return p;
    },
    /**搜索匹配蓝牙设备*/
    getDeviceFound: function () {
        const $this = this;
        let bedInfo = this.data.bedInfo;
        let {deviceId}=bedInfo; 
        const p = new Promise(function (resolve, reject) {
            if(deviceId && deviceId!=""){  //deviceld存在 ，说明已经搜索过，可以直接连接
                hideLoading()
                resolve()
            }else{
                wx.startBluetoothDevicesDiscovery({  //搜索附近设备
                    services: [],
                    allowDuplicatesKey: false,
                    success: function (res) {
                        console.log("开始搜索蓝牙设备");
                        setTimeout(() => { //搜索超时
                            let discovering = $this.data.discovering;
                            // console.log('discovering', discovering);
                            if (discovering) {
                                showToast("没有找到匹配的蓝牙设备")
                                wx.stopBluetoothDevicesDiscovery({
                                    success: function (res2) {
                                        console.log("搜索超时,停止搜索");
                                    },
                                    fail(err) {
                                        hideLoading()
                                        showToast("停止搜索蓝牙设备失败")
                                        console.log("err", err)
                                    }
                                })
                                hideLoading()
                                return false;
                            }
                        }, $this.data.stopSearchTime);
                        wx.onBluetoothDeviceFound(function (res1) { //监听寻找到新设备的事件
                            console.log("开始匹配搜索的蓝牙设备");
                            let deviceName = res1.devices[0].name;
                            if (bedInfo.device_name == deviceName) {
                                let deviceId = res1.devices[0].deviceId;
                                var device_RSSI_1 = res1.devices[0].RSSI;
                                var device_RSSI_2 = Number(device_RSSI_1);
                                var device_RSSI = Math.abs(device_RSSI_2);
                                bedInfo.deviceId = deviceId;
                                console.log("匹配device", res1);
                                console.log('device_RSSI', device_RSSI);
                                wx.stopBluetoothDevicesDiscovery({
                                    success: function (res2) {
                                        console.log("停止搜索成功");
                                        $this.setData({ bedInfo: bedInfo }, () => {
                                            hideLoading()
                                            resolve();
                                        })
                                    },
                                    fail(err) {
                                        hideLoading()
                                        showToast("停止搜索蓝牙设备失败")
                                        console.log("err", err)
                                    }
                                })

                            }
                            // console.log(devices[0].advertisData)
                        })
                    },
                    fail(err) {
                        hideLoading()
                        showToast("搜索蓝牙设备失败")
                        console.log("err", err)
                    }
                })
            }

        })
        return p;
    },/**蓝牙发送返回数据 */
    connectionBluetooth: function () {
        let $this = this;
        let bedInfo = $this.data.bedInfo;
        let { content, deviceId } = bedInfo;
        let p = new Promise(function (resolve, reject) {
            $this.setData({
                recv_value: "",
                recv_number:0,
            });
            //连接找到的蓝牙设备
            $this.createBLEConnection().then((createRes)=>{ 
                console.log('连接蓝牙成功', createRes);
                /** 获取蓝牙设备所有服务(service) **/
                $this.getBLEDeviceServices().then((servicesRes)=>{
                    console.log('获取蓝牙设备所有服务(service)成功', servicesRes);
                    let services = []
                    let servicesId ="";
                    servicesRes.services.map((objs) => {
                        if (objs.isPrimary) {
                            let  uuid=objs.uuid;
                            let  UUID_slice = uuid.slice(4, 8);   //截取4到8位
                            if (UUID_slice == 'FEE0' || UUID_slice == 'fee0') {
                                servicesId=uuid
                            }
                        }
                    })
                    console.log('servicesId：',servicesId);
                    $this.setData({
                        services:services,
                        servicesId:servicesId,
                    },()=>{
                        // 获取蓝牙设备某个服务中所有特征值(characteristic) 
                        $this.getBLEDeviceCharacteristics().then((objs) => {
                            let bedInfo=$this.data.bedInfo;
                            // console.log('bedInfo', bedInfo);
                            // console.log('objs', objs);
                            if(!objs.serviceId){
                                reject("获取蓝牙信息失败")
                                return false;
                            }
                            console.log('开始启用 notify 功能')
                            // 启用 notify 功能
                            $this.notifyBLECharacteristicValueChange().then((notifyRes)=>{
                                console.log('启用 notify 功能成功:', notifyRes);
                                //监听到返回数据更新
                                wx.onBLECharacteristicValueChange(function (onNotityChangeRes) {
                                    setTimeout(() => {
                                        let recv_values=$this.data.recv_value;
                                        let recv_numbers=$this.data.recv_number;
                                        if(recv_number!=21){
                                            reject("返回数据失败")
                                            return false;
                                        }
                                    }, 2000);
                                    // console.log('监听到特征值更新', onNotityChangeRes);
                                    var result = onNotityChangeRes.value;
                                    var hex = ab2hex(result);
                                    // console.log('返回的值:', hex);
                                    let recv_value=$this.data.recv_value + hex;
                                    /* 成功接收到的值的展示 */
                                    $this.setData({
                                        recv_value: recv_value
                                    });
                                    /* 接收成功的值的字节 */
                                    var recv_number_1 = $this.data.recv_number + hex.length / 2;
                                    var recv_number = Math.round(recv_number_1);
                                    $this.setData({
                                        recv_number: recv_number
                                    });
                                    // console.log('recv_value', recv_value);
                                    // console.log('recv_number', recv_number);
                                    if(recv_number==21){ //接收数据完毕
                                        console.log('开始更新床数据');
                                        $this.updataBedData().then((bedDataRes)=>{
                                            console.log('更新床数据成功：', bedDataRes);
                                            resolve(bedDataRes)
                                            
                                        }).catch((erro)=>{
                                            console.log('更新床数据失败:',erro);
                                            reject("更新床数据失败 "+erro)
                                           
                                        })
                                    }
                                })
                                 /**发送数据 */
                                let sedcontent=$this.data.send_content;
                                console.log('sedcontent', sedcontent);
                                sedcontent.map((objs,index)=>{
                                    setTimeout(function () {
                                        console.log('开始发送数据:');
                                        $this.writeBLECharacteristicValue(objs).then((writeRes)=>{
                                            console.log('发送数据成功:',writeRes);
                                        }).catch((erro)=>{
                                            console.log('发送数据失败:',erro);
                                            reject("发送数据失败")
                                           
                                        })
                                    }, index * 100)
                                })
                            }).catch((erro)=>{
                                console.log('启用 notify 功能失败:',erro);
                                reject("启用 notify 功能失败")
                                
                            })
                           
                            
                        }).catch((erro)=>{
                            console.log('获取characteristic失败:',erro);
                            reject("获取characteristic失败")
                            
                        })
                    })
                }).catch((erro)=>{
                    console.log('获取service失败:',erro);
                    reject("获取service失败")
                    
                })

            }).catch((erro)=>{
                console.log('连接设备失败:',erro);
                reject("连接设备失败")
                
            })
        })
        return p;
    },
    /**连接蓝牙设备 */
    createBLEConnection: function () {
        let $this = this;
        let bedInfo = $this.data.bedInfo;
        let {deviceId } = bedInfo
        let p = new Promise(function (resolve, reject) {
            wx.createBLEConnection({ //连接匹配的设备
                deviceId: deviceId,
                success: (res) => {
                    resolve(res)
                },
                fail(erro) {
                    hideLoading()
                    console.log("erro", erro)
                    const erroCode = erro.erroCode
                    reject(erro)
                }
            })

        })
        return p;
    },/***获取蓝牙设备所有服务(service) */
    getBLEDeviceServices: function () {
        let $this = this;
        let bedInfo = $this.data.bedInfo;
        let {deviceId } = bedInfo
        let p = new Promise(function (resolve, reject) {
            wx.getBLEDeviceServices({
                // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                deviceId,
                success(res) {
                    resolve(res)
                },
                fail(erro){
                    hideLoading()
                    console.log("erro", erro)
                    reject(erro)
                }
            })

        })
        return p;
    },
    
    /***获取蓝牙设备某个服务中所有特征值(characteristic) */
    getBLEDeviceCharacteristics: function () {
        let $this = this;
        let bedInfo = $this.data.bedInfo;
        let {deviceId } = bedInfo
        let service=this.data.services;
        let servicesId=this.data.servicesId;
        let p = new Promise(function (resolve, reject) {
            wx.getBLEDeviceCharacteristics({
                // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                deviceId,
                // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
                serviceId: servicesId,
                success(res) {
                    var characteristics = res.characteristics;      //获取到所有特征值
                    var characteristics_length = characteristics.length;    //获取到特征值数组的长度
                    console.log('获取到特征值', characteristics);
                    console.log('获取到特征值数组长度', characteristics_length);
                    /* 遍历数组获取notycharacteristicsId */
                    for (var index = 0; index < characteristics_length; index++) {
                        var noty_characteristics_UUID = characteristics[index].uuid;    //取出特征值里面的UUID
                        var characteristics_slice = noty_characteristics_UUID.slice(4, 8);   //截取4到8位
                        /* 判断是否是我们需要的FEE1 */
                        if (characteristics_slice == 'FEE1' || characteristics_slice == 'fee1') {
                            var index_uuid = index;
                            bedInfo.serviceId=servicesId;
                            bedInfo.characteristicId=characteristics[index_uuid].uuid;
                            bedInfo.notycharacteristicsId=characteristics[index_uuid].uuid
                            $this.setData({
                                bedInfo:bedInfo
                            });
                            /* 遍历获取characteristicsId */
                            for (var index = 0; index < characteristics_length; index++) {
                                var characteristics_UUID = characteristics[index].uuid;    //取出特征值里面的UUID
                                var characteristics_slice = characteristics_UUID.slice(4, 8);   //截取4到8位
                                /* 判断是否是我们需要的FEE2 */
                                if (characteristics_slice == 'FEE2' || characteristics_slice == 'fee2') {
                                    var index_uuid = index;
                                    bedInfo.characteristicId=characteristics[index_uuid].uuid
                                    $this.setData({
                                        bedInfo:bedInfo      //确定的写入UUID
                                    });
                                };
                            };
                        };
                    };
                    resolve(bedInfo)
                    console.log('使能characteristicsId', $this.data.notycharacteristicsId);
                    console.log('写入characteristicsId', $this.data.characteristicsId);
                },
                fail(erro) {
                    console.log("createBLEConnection错误", erro)
                    reject(erro)
                }
            })
            
        })
        return p;
    },// 启用 notify 功能
    notifyBLECharacteristicValueChange:function(){
        let $this = this;
        let bedInfo = $this.data.bedInfo;
        let {deviceId ,serviceId, characteristicId,notycharacteristicsId} = bedInfo
        let p = new Promise(function (resolve, reject) {
            wx.notifyBLECharacteristicValueChange({
                state: true,
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: notycharacteristicsId,
                success: function (res) {
                    resolve(res)
                },
                fail(erro) {
                    console.log("createBLEConnection错误", erro)
                    reject(erro)
                }
            })
        })
        return p;
    },
    //监听到返回数据更新
    onBLECharacteristicValueChange:function(){
        let $this = this;
        let p = new Promise(function (resolve, reject) {
            wx.onBLECharacteristicValueChange(function (onNotityChangeRes) {
                resolve(onNotityChangeRes)
            })
        })
        return p;
    },
    /**发送数据 */
    writeBLECharacteristicValue:function(sentContents){
        console.log("sentContents：", sentContents)
        let $this = this;
        let bedInfo = $this.data.bedInfo;
        let {deviceId ,serviceId, characteristicId, content} = bedInfo;
        // 向蓝牙设备发送一个0x00的16进制数据
        var hex = sentContents
        var typedArray = new Uint8Array(hex.match(/[\da-f]{2}/gi).map(function (h) {
            return parseInt(h, 16)
        }))
        var buffer1 = typedArray.buffer
        console.log("发送内容：", buffer1)
        let p = new Promise(function (resolve, reject) {                  
            wx.writeBLECharacteristicValue({
                deviceId: deviceId,
                serviceId: serviceId,
                characteristicId: characteristicId,
                value: buffer1,
                success: function (res) {
                    resolve(res)
                },
                fail: function (error) {
                    reject(error)
                }
            })
        })
        return p;
    },
    // 初始化蓝牙适配器 获取蓝牙适配器状态
    bluetoothAdapter: function () {
        let $this = this;
        let isbluetoothready = this.data.isbluetoothready;  //蓝牙是否已经初始化
        console.log('初始化蓝牙适配器');
        console.log('isbluetoothready', isbluetoothready);
        
        let p = new Promise(function (resolve, reject) {
            if(isbluetoothready){
                resolve()
            }else{
                isSupportBluetooth().then(() => {
                    wx.openBluetoothAdapter({
                        success(res1) {
                            console.log("初始化蓝牙成功", res1)
                            //获取蓝牙适配器状态
                            wx.getBluetoothAdapterState({
                                success(res) {
                                    // console.log("getBluetoothState",res)  
                                    console.log("获取蓝牙状态成功", res)
                                    $this.setData({
                                        available: res.available,
                                        discovering: res.discovering,
                                        isbluetoothready: true
                                    }, () => {
                                        resolve(res)
                                    })
                                },
                                fail: function (err) {
                                    let erroText = err.errMsg || "获取蓝牙状态失败";
                                    console.log(erroText)
                                    $this.setData({
                                        available: false,
                                        discovering: false,
                                        isbluetoothready: false,
                                    })
                                    reject(erroText)
                                }
                            })
                        },
                        fail: function (error) {
                            let erroText = error.errMsg || "初始化蓝牙失败";
                            console.log("初始化蓝牙失败:", erroText)
                            $this.setData({
                                isbluetoothready: false,
                            })
                            reject(erroText)
                        }
                    })
                })
            }
        })
        return p;
    },
    //监听蓝牙适配器
    monitorBluetooth: function () {
        const $this = this;
        wx.onBluetoothAdapterStateChange(function (res) {
            console.log('监听蓝牙适配器', res)
            $this.setData({
                available: res.available,
                discovering: res.discovering
            })
        })
    },

    /***关闭蓝牙适配器 */
    closeBluetoothAdapter: function () {
        const $this = this;
        const p = new Promise(function (resolve, reject) {
            wx.closeBluetoothAdapter({
                success: function (res) {
                    $this.setData({
                        available: false,
                        discovering: false,
                        isbluetoothready: false,
                    })
                    resolve(res)
                },
                fail: function (err) {
                    let erroText = err.errMsg || "关闭蓝牙适配器失败";
                    console.log("关闭蓝牙适配器失败：", erroText)
                    // showToast("获取蓝牙状态失败")
                }
            })
        })
        return p;
    },
    /****停止搜索*****/
    stopBluetoothDevicesDiscovery:function(){
        const $this = this;
        const p = new Promise(function (resolve, reject) {
            wx.stopBluetoothDevicesDiscovery({
                success: function (res) {
                    resolve(res)
                    console.log("停止搜索成功", res);
                },
                fail: function (err) {
                    let erroText = err.errMsg || "停止搜索失败";
                    console.log("停止搜索失败：", erroText)
                }
            })
        });
        return p;
    }
})
