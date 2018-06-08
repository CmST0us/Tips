// my/my.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isLoginIn: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的',
    });
    let userInfo = wx.BaaS.storage.get('userinfo');
    if (userInfo != '') {
      this.setData({
        userInfo: userInfo,
        isLoginIn: true
      });
    }
  },
 
  userInfoHandler(data) {
    let that = this;
    wx.BaaS.handleUserInfo(data).then(res => {
      wx.showToast({
        title: '登录成功',
        image: '../image/success.png'
      });
      console.log(res)
      that.setData({
        isLoginIn: true,
        userInfo: res
      });
      that.showMyTaskList();
    }, res => {
      console.log(res);
      wx.showToast({
        title: '网络故障',
        image: '../image/netError.png'
      });
    })
  },
  showMyTaskList: function(e){
    app.globalData.currentUserInfo = this.data.userInfo;
    wx.navigateTo({
      url: '../myTaskList/myTaskList?listtype=' + e.currentTarget.dataset.listtype,
    });
  },
  showMyTipsList: function(e){
    app.globalData.currentUserInfo = this.data.userInfo;
    wx.navigateTo({
      url: '../myTaskList/myTaskList?listtype=' + e.currentTarget.dataset.listtype,
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


  /**
   * 页面上拉触底事件的处理函数
   */
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})