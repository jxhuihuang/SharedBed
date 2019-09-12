/**是否支持蓝牙 */
const isSupportBluetooth = () => {
    let p = new Promise(function (resolve, reject) {
        const app = getApp();
        let sysinfo = app.globalData.sysinfo; //系统信息
        let model = sysinfo.model;     //系统
        let version = sysinfo.version;
        if (model == 'android' && this.versionCompare('6.5.7', version)) {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，请更新至最新版本',
                showCancel: false
            })
        }
        else if (model == 'ios' && this.versionCompare('6.5.6', version)) {
            wx.showModal({
                title: '提示',
                content: '当前微信版本过低，请更新至最新版本',
                showCancel: false
            })
        } else {
            console.log('支持蓝牙');
            resolve('支持蓝牙')
        }
    })
    return p;
}

// 初始化蓝牙适配器
const bluetoothAdapter =function () {
    let $this = this;
    let p = new Promise(function (resolve, reject) {
        isSupportBluetooth().then(() => {
            wx.openBluetoothAdapter({
                success(res) {
                    console.log("初始化蓝牙成功", res)
                    resolve(res)
                },
                fail: function (erro) {
                    console.log("初始化蓝牙失败:", erro)
                    let erroText = erro.errMsg || "初始化蓝牙失败";
                    reject(erro);
                }
            })
        })
    })
    return p;
}
//获取蓝牙适配器状态
getBluetoothAdapterState=function(){
    wx.getBluetoothAdapterState({
        success(res) {
            console.log("获取蓝牙状态成功", res)
            resolve(res)
        },
        fail: function (erro) {
            console.log("获取蓝牙状态失败",erro)
            let erroText = erro.errMsg || "获取蓝牙状态失败";
            reject(erro);
        }
    })
}
 
//监听蓝牙适配器
const monitorBluetooth=function () {
    const $this = this;
    wx.onBluetoothAdapterStateChange(function (res) {
        console.log('监听蓝牙适配器', res)
        $this.setData({
            available: res.available,
            discovering: res.discovering
        })
    })
}