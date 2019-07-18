// pages/test/test.js
const app = getApp()
var ImageFileID = app.globalData.ImageFileID;//获得图片地址
var rate = app.globalData.rate;//单词错误率
var rat=1-rate;//单词正确率
const innerAudioContext = wx.createInnerAudioContext()//音频播放函数
var i = 0
var j= 0
//获取用户信息
Page({
   data: {
    inputValue: null,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),//获取用户权限   
    output:"",
    count:1,
    DetectedText:"",
    rate:"",
    rat:"",
    length:""
  },
  //页面加载函数
   onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  TTS(e) {
    var that = this
    var plugin = requirePlugin("WechatSI")
    //调用云函数，名字“find”，传递图片地址为参数
    wx.cloud.callFunction({
      name: 'find',
      data: {
        fileID: app.globalData.ImageFileID,
        
      },
      //返回识别到的文本，此处为英文单词，并统计单词数量
      success: res => {
        that.setData({
          DetectedText: res.result.TextDetections[i].DetectedText,//返回识别的文本
          count: that.data.count + 1,
          length: res.result.TextDetections.length
        })
        //若成功调用，控制台打印获取的英文单词和标号
        console.log("好了")
        i = i % res.result.TextDetections.length//单词标号
        console.log(i)
        console.log(res.result.TextDetections[i].DetectedText + " ")
        //调用同声传译插件，将获得的文本转换为语音播放
        plugin.textToSpeech({
          lang: "en_US",//语言为英语
          tts: true,
          content: res.result.TextDetections[i].DetectedText,//图象识别结果作为参数传给tts
          //若调用成功，返回音频并播放
          success(res) {
            console.log("succ tts", res.filename)
            innerAudioContext.src = res.filename;
            innerAudioContext.play()
          },
          //若调用失败         
          fail: function (res) {
            console.log("fail tts", res)
          },  
        })      
      },
      fail: err => {
        console.log("哥我错了")
        console.log(err)
      },
    })    
    i = i + 1//单词标号递增
    that.setData({
      'inputValue': ''
    })
  },
  //统计单词正确率
  searchBox: function (e) {
    const that = this;
    that.output=e.detail.value
    console.log(that.data.DetectedText)
    console.log(that.output.in_put)
    //播放所有单词
    for (var n = 0; n < that.data.DetectedText; n++) {
      if (that.output.indexOf(that.data.DetectedText[i]) === -1) { 
         j=j;
      }
      else{j = j + 1;}
    }    
    console.log(j) 
    if (that.data.count == that.data.length) {//播放完毕
      that.setData({
        rate: j / that.data.length,  
        //错误率
        rat:1-rate,//正确率
        count: 1,
      })
      this.popup.showPopup();
    }        
  },
  onLoad: function (options) {
    wx.cloud.init({
      env: 'exploit-3vijw'
    })
  }, 
  onReady: function () {
    this.popup = this.selectComponent("#popup");
  },
  showPopup() {    
    this.setData({
      'inputValue': ''
    })
    this.popup.showPopup();
  },
  _error() {
    console.log('你点击了取消');
    this.popup.hidePopup();
  },
  //确认事件
  _success() {
    console.log('你点击了确定');
    this.popup.hidePopup();
  },
   onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})
