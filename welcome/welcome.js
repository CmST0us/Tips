// welcome/welcome.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    screenSafeHeight: 0,
    currentTab: 0,
  },
  userInfoHandler: function (data) {
    let that = this;
    wx.BaaS.handleUserInfo(data).then(res => {
      wx.reLaunch({
        url: '../home/home',
      });
    }, res => {
      console.log(res);
      wx.showToast({
        title: '网络故障',
        image: '../image/netError.png'
      });
    });    
  },
  swiperChange: function (e) {
    let currentTabIndex = e.detail.current;
    this.setData({
      currentTab: currentTabIndex
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //检查是否是第一次使用
    let userInfo = wx.BaaS.storage.get('userinfo')
    if (userInfo != '') {
      // 不是第一次进入，直接跳转到home/home
      wx.reLaunch({
        url: '../home/home',
      })
    }
    this.setData({
      screenSafeHeight: app.globalData.systemInfo.windowHeight
    });
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})