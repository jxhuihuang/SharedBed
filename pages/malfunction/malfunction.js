import {showToast} from "../../utils/util";
Page({
    data: {
        malfData:[
            {
                name:"锁",
                icon:"../../imgs/gz/gz1.png",
                isselect:false
            },
            {
                name:"刹车",
                icon:"../../imgs/gz/gz2.png",
                isselect:false
            },
            {
                name:"链条",
                icon:"../../imgs/gz/gz3.png",
                isselect:false
            },
            {
                name:"脚踏",
                icon:"../../imgs/gz/gz4.png",
                isselect:false
            },
            {
                name:"二维码",
                icon:"../../imgs/gz/gz5.png",
                isselect:false
            },
            {
                name:"车把",
                icon:"../../imgs/gz/gz6.png",
                isselect:false
            },
            {
                name:"车轮",
                icon:"../../imgs/gz/gz7.png",
                isselect:false
            },
            {
                name:"其他部位",
                icon:"../../imgs/gz/gz8.png",
                isselect:false
            }
        ],
        selectMalfData:[],
        eqCode:"",
        textarea_maxLength:140,
        currentLength:0,
        nalfunctionImage:[],
        maxImg:3,
        imgNum:0,
        nalfunctionText:"",
    },
    onLoad: function () {
      
    },
    onShow: function() {
        this.setData({
            imgNum:this.data.maxImg,
        })
    },
    selectMalf:function(e){
        let index=e.currentTarget.dataset.scan || "";
        if(index!=""){
            index=index-1
            let malfData=this.data.malfData;
            let newselectMalfData=[];
            malfData[index].isselect=!malfData[index].isselect;
            malfData.map((res)=>{
                if(res.isselect){
                    newselectMalfData.push(res)
                }
            })
            /***无选择时清楚选择的图片 */
            if(newselectMalfData.length<=0){
                this.setData({
                    nalfunctionImage:[],
                    imgNum:this.data.maxImg,
                    nalfunctionText:"",
                })

            }
            this.setData({
                malfData:malfData,
                selectMalfData:newselectMalfData,
            })
        }
    },
   
    onBlur:function(e){
        let vals=e.detail .value || "";
        vals=vals.replace(/(^\s*)|(\s*$)/g,"")
        let reg=/^([1-9]\d*|[0]{1,1}){3}?$/
        if(vals=="") return false;
        if(!reg.exec(vals) || vals.length!=8){
            wx.showModal({
                content:"车牌有误, 请重试"
            })
            this.setData({
                eqCode: ""
            })
            return false;
        }else{
            this.setData({
                eqCode: vals
            })
        }
    },
    inputPlate:function(e){
       
        
    },
    
    textareaChange:function(e){
        let value=e.detail.value || "";
        let length=value===""?0:value.length;
        this.setData({
            currentLength:length,
            nalfunctionText:value,
        })
    },/***扫描二维码*****/
    scanUnlock:function(){
        wx.scanCode({
            scanType:['qrCode'],
            success (res) {
                if(res.path){
                    wx.showModal({
                        content:"二维码有误, 请重试"
                    })
                    return false
                }
                let reg=/^([1-9]\d*|[0]{1,1}){3}?$/
                let reust=res.result || "";
                if(!reg.exec(reust) || reust.length!=8){
                    wx.showModal({
                        content:"二维码有误, 请重试"
                    })
                    return false;
                }
                this.setData({
                    eqCode:reust
                })
            },
            fail(erro){
                // showToast("扫描发生错误")
                const erros=erro || {errMsg:"扫描发生错误"}
                const errosText=erro.errMsg;
               
                if(errosText !="scanCode:fail cancel"){
                    showToast("扫描发生错误",)
                }
                
            }
        })
    },/****选择图片 */
    chooseImage:function(){
        var $this=this;
        let imgNum=this.data.imgNum;
        wx.chooseImage({
            count: imgNum,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
                let maxImg=$this.data.maxImg;
                let nalfunctionImages=[...$this.data.nalfunctionImage, ...res.tempFiles]
                let Remai=maxImg-(nalfunctionImages.length);
                console.log('Remai', Remai);
                $this.setData({
                    nalfunctionImage:nalfunctionImages,
                    imgNum:Remai,
                })
                // console.log('nalfunctionImages', nalfunctionImages);
              // tempFilePath可以作为img标签的src属性显示图片
              const tempFilePaths = res.tempFilePaths
            }
        })
    },
    closeImg:function(e){
        let src=e.currentTarget.dataset.src || "";
        let nalfunctionImage=this.data.nalfunctionImage;
        let maxImg=this.data.maxImg;
        let newNalfunctionImage=[];
        
        nalfunctionImage.map((res)=>{
            if(res.path!=src){
                newNalfunctionImage.push(res)
            }
        })
        let Remai=maxImg-(newNalfunctionImage.length);
        this.setData({
            nalfunctionImage:newNalfunctionImage,
            imgNum:Remai,
        })
    }
})