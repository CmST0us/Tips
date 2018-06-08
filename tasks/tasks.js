// tasks/tasks.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipsData:[],
    listRowHeight: 75
  },
  // 分页
  currentPage: 0,
  rowPerPage: 20,
  hasNext: true,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '任务列表',
    });
    this.fetchDataAtCurrentPageAndRender()
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
  fetchDataAtCurrentPageAndRender: function() {
    let tableID = app.globalData.tableID.tips;
    let uid = wx.BaaS.storage.get('uid');
    let query = new wx.BaaS.Query();
    let that = this;
    query.compare('isVerified', '=', false);
    let tips = this.createTableObject(tableID, query, this.currentPage)
    wx.showLoading({
      title: '加载未验证tips',
    });
    tips.find().then(function (res) {
      if (res.data.meta.next == null) {
        that.hasNext = false
      } else {
        that.hasNext = true
      }
      wx.hideLoading();
      let tipsData = that.data.tipsData.concat(res.data.objects)
      that.setData({ tipsData: tipsData });
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
      this.currentPage = 0
      this.data.tipsData = []
      this.fetchDataAtCurrentPageAndRender();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.hasNext == true) {
      this.currentPage += 1;
      this.fetchDataAtCurrentPageAndRender();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})