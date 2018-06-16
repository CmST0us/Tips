// search/search.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchData: [],
    isSearchValid: false,
    isSearch: false
  },
  // 分页
  currentPage: 0,
  rowPerPage: 20,
  hasNext: true,
  searchKeyWord: "",
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
    if (this.hasNext) {
      this.currentPage += 1;
      this.search(this.searchKeyWord);
    }
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
        searchData: [],
        isSearch: false
      });
    }
  },
  search: function (keyWord) {
    let that = this;
    if (keyWord != undefined && keyWord != "") {
      that.searchKeyWord = keyWord
    }
    that.setData({isSearch: true});
    let keyWordQuery = new wx.BaaS.Query();
    keyWordQuery.contains('content', that.searchKeyWord);
    let locationQuery = new wx.BaaS.Query();
    locationQuery.contains('locationName', that.searchKeyWord);
    let orQuery = new wx.BaaS.Query.or(locationQuery, keyWordQuery);
    let tableID = app.globalData.tableID.tips;

    let tipsTableObject = that.createTableObject(tableID, orQuery, that.currentPage);
    tipsTableObject.find().then(function (res) {
      if (res.data.meta.next == null) {
        that.hasNext = false
      } else {
        that.hasNext = true
      }
      if (res.data.objects.length != 0) {
        let searchData = that.data.searchData.concat(res.data.objects);
        that.setData({
          searchData: searchData,
          isSearchValid: true
        });
      } else {
        that.setData({
          searchData: [],
          isSearchValid: false
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
  confirmSearch: function(e){
    let keyWord = e.detail.value;
    this.search(keyWord);
  },
  // 创建TableObject对象
  // id: table ID
  // query: wx.BaaS.Query 对象
  // pageNum: 请求的页面
  createTableObject: function (tableId, query, pageNum) {
    if (pageNum == undefined) {
      pageNum = 0;
    }
    if (query == undefined) {
      query = new wx.BaaS.Query();
    }
    let limit = this.rowPerPage;
    let offset = pageNum * limit;
    let tipObejct = new wx.BaaS.TableObject(tableId);
    tipObejct.setQuery(query).limit(limit).offset(offset);
    return tipObejct;
  },
})