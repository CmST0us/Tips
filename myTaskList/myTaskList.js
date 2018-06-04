// myTaskList/myTaskList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myTaskList: [],
    listType: '',
    listWord: ''
  },
  currentPage: 0,
  rowPerPage: 20,
  hasNext: true,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      listType: options.listtype,
      listWord: options.listtype == 'tipsList' ? '我的tips列表' : '我的任务列表'
    });
  },
  showMyTaskList: function (listType) {
    let that = this;
    let app = getApp();
    let tableId;
    if (listType != 'tipsList') {
      tableId = app.globalData.tableID.userTaskList;
    } else {
      tableId = app.globalData.tableID.tips;
    }
    let tableObject = new wx.BaaS.TableObject(tableId);
    let query = new wx.BaaS.Query();
    let uid = app.globalData.currentUserInfo.id;
    query.compare('created_by', '=', uid);
    tableObject.setQuery(query).find().then(res => {
      console.log(res);
      let objects = res.data.objects;
      // 请求objects数据库
      if (objects != null && objects.length > 0) {
        if (listType == 'tipsList') {
          that.setData({
            myTaskList: res.data.objects
          });
        } else {
          let tipsTableId = app.globalData.tableID.tips;
          let tipTableObject = new wx.BaaS.TableObject(tipsTableId);
          let tipQuery = new wx.BaaS.Query();
          tipQuery.in('id', objects[0].myTaskList);
          tipTableObject.setQuery(tipQuery).find().then(res => {
            that.setData({
              myTaskList: res.data.objects
            });
          }, e => {
            console.log(e);
            e;
          });
        }
      }
    }, err => {
      console.log(err);
    });
  },
  fetchDataAtCurrentPageAndRender: function () {
    let that = this;
    let app = getApp();
    let tableId;
    if (listType != 'tipsList') {
      tableId = app.globalData.tableID.userTaskList;
    } else {
      tableId = app.globalData.tableID.tips;
    }
    let query = new wx.BaaS.Query();
    let uid = app.globalData.currentUserInfo.id;
    query.compare('created_by', '=', uid);
    let tableObject = this.createTableObject(userTaskListTableId, query);

    tableObject.find().then(res => {
      console.log(res);

      let objects = res.data.objects;
      // 请求objects数据库
      if (objects != null && objects.length > 0) {
        if (listType == 'tipsList') {
          that.setData({
            myTaskList: res.data.objects
          });
        } else {
          let tipsTableId = app.globalData.tableID.tips;
          let tipQuery = new wx.BaaS.Query();
          tipQuery.in('id', objects[0].myTaskList);
          let tipTableObject = that.createTableObject(tipsTableId, tipQuery, that.currentPage);

          tipTableObject.find().then(res => {
            if (res.data.meta.next == null) {
              that.hasNext = false;
            } else {
              that.hasNext = true;
            }

            let taskList = that.data.myTaskList.concat(res.data.objects);
            that.setData({
              myTaskList: taskList
            });

          }, e => {
            console.log(e);
          });
        }
      }
    }, err => {
      console.log(err);
    });
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
  showDetail: function (e) {
    let app = getApp();
    console.log(e.currentTarget.dataset.tip);
    app.globalData.currentTip = e.currentTarget.dataset.tip;
    let word = this.data.listType == 'tipsList' ? 'whatever' : 'my';
    wx.navigateTo({
      url: '../detail/detail?page=' + word,
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
    this.showMyTaskList(this.data.listType);
    console.log(this.data);
  },
  onPullDownRefresh: function () {
    this.currentPage = 0;
    this.data.myTaskList = [];
    this.fetchDataAtCurrentPageAndRender(this.data.listType);
  },
  onReachBottom: function () {
    if (this.hasNext == true) {
      this.currentPage += 1;
      this.fetchDataAtCurrentPageAndRender(this.data.listType);
    }
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