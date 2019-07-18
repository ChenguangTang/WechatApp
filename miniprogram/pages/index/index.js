// pages/index/index.js
const app = getApp()
const innerAudioContext = wx.createInnerAudioContext()//音频播放
var ImageFileID = app.globalData.ImageFileID;//获得图像路径
var i = 0
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    DetectedText:"",    
  },
  //获取用户头像等信息
  UploadImage() {
    var random = Date.parse(new Date()) + Math.ceil(Math.random() * 1000)
    var that = this
   //
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths[0]
        console.log(tempFilePaths)
        wx.cloud.uploadFile({
          cloudPath: random + '.png',
          filePath: tempFilePaths, // 文件路径
          success: res => {
            app.globalData.ImageFileID = res.fileID
            console.log(app.globalData.ImageFileID)
            console.log(res.fileID)
            that.setData({ imageSrc: res.fileID ,              
            })               
          },
          fail: err => {
            console.log(res.result)
          }
        })
      }
    })
  },
  //调用同声传译插件，将文本转换为语音
  TTS:function() {
    wx.navigateTo({ url: "../test/test", })
  },  
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
