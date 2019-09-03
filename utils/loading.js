var num = 0
const showLoading=()=>{
    wx.showLoading({
        title: '加载中...',
    })
}

const hideLoading=()=>{
    wx.hideLoading()
}

const hideAll=()=>{

}

export {
    showLoading, 
    hideLoading
}