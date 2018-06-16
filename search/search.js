// search/search.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },
  startSearch: function (e) {
    console.log(e.detail.value);
    let keyWord = e.detail.value;
    if (keyWord != '') {
      this.search(keyWord);
    } else {
      this.setData({
        searchData: []
      });
    }
  },
  search: function (keyWord) {
    let that = this;
    let keyWordQuery = new wx.BaaS.Query();
    keyWordQuery.contains('content', keyWord);
    let locationQuery = new wx.BaaS.Query();
    locationQuery.contains('locationName', keyWord);
    let orQuery = new wx.BaaS.Query.or(locationQuery, keyWordQuery);
    let tableID = app.globalData.tableID.tips;
    let tipsTableObject = new wx.BaaS.TableObject(tableID);
    tipsTableObject.setQuery(orQuery).find().then(function (res) {
      if (res.data.objects.length != 0) {
        that.setData({
          searchData: res.data.objects
        });
      } else {
        that.setData({
          searchData: []
        });
      }
    }, function (err) {
      console.log(err);
      wx.showToast({
        title: '网络故障',
        image: '../image/netError.png'
      });
    })
  },
  showDetail: function (e) {
    console.log(e.currentTarget.dataset.tip);
    app.globalData.currentTip = e.currentTarget.dataset.tip;
    wx.navigateTo({
      url: '../detail/detail?page=' + 'home'
    });
  },
})