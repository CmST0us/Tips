// tasks/tasks.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipsData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  showTaskDetail: function(e){
    wx.navigateTo({
      url: '../tasksDetail/tasksDetail?tipID=' + e.currentTarget.dataset.tip
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
    let tableID = app.globalData.tableID.tips;
    let uid = wx.BaaS.storage.get('uid');
    let query = new wx.BaaS.Query();
    let that = this;
    query.compare('isVerified', '=', false);
    query.compare('created_by', '=', uid);
    let tips = new wx.BaaS.TableObject(tableID);
    wx.showLoading({
      title: '加载未验证tips',
    });
    tips.setQuery(query).find().then(function (res) {
      wx.hideLoading();
      that.setData({ tipsData: res.data.objects });
    }, function (err) {
      console.log(err);
      wx.showToast({
        title: '网络连接中断',
        image: '../image/netError.png',
        duration: 2000
      });
    })
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