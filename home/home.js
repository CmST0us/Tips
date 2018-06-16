// home/home.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testTipData: [],
    tipData: [],
    myFollowData: [],
    recommendTipData: [],
    currentTab: 0,
    listRowHeight: 300,
    listSafeAreaHeight: 1080,
    myFollowTipsID: [],
  },
  isTab1Loading: false,
  isTab2Loading: false,
  isTab3Loading: false,
  // 分页
  currentPage: 0,
  rowPerPage: 20,
  hasNext: true,

  // 我的关注分页
  myFollowCurrentPage: 0,
  myFollowHasNext: true,
  myFollowIds: [],
  myFollowHasLoad: false,

  // 随机推荐分页
  recommendTipHasLoad: false,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    this.updateSwiperHeight();
    this.fetchTipsAndShow();
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#ffffff',
    });
  },

  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  swiperChange: function (e) {
    let currentTabIndex = e.detail.current;

    if (currentTabIndex == 1) {
      if (this.myFollowHasLoad == false) {
        this.onMyFollowTipTabLoad();
        this.myFollowHasLoad = true;
      }
      this.onMyFollowTipTabShow();
    } else if (currentTabIndex == 2) {
      if (this.recommendTipHasLoad == false) {
        this.onRecommendTipTabLoad();
        this.onRecommendTipHasLoad = true;
      }
      this.onRecommendTipTabShow();
    }

    this.setData({
      currentTab: currentTabIndex,
    });
  },

  updateSwiperHeight: function () {
    var swiperHeight = app.globalData.systemInfo.windowHeight - 45;

    this.setData({
      listSafeAreaHeight: swiperHeight
    });

  },

  showDetail: function (e) {
    console.log(e.currentTarget.dataset.tip);
    app.globalData.currentTip = e.currentTarget.dataset.tip;
    wx.navigateTo({
      url: '../detail/detail?page=' + 'home'
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
    // this.fetchTipsAndShow();
    // this.updateSwiperHeight();
    let that = this;
    that.setData({isFromUser: false});
    let myFollowTipsTable = new wx.BaaS.TableObject(app.globalData.tableID.follow);
    let uid = wx.BaaS.storage.get('uid');
    let query = new wx.BaaS.Query();
    query.compare('created_by', '=', uid);
    myFollowTipsTable.setQuery(query).find().then(function (res) {
      console.log(res);
      that.setData({
        myFollowTipsID: res.data.objects[0].myFollowTips
      });
      console.log(that.data.myFollowTipsID);
    }, function (err) {
      console.log(err);
      wx.showToast({
        title: '网络故障',
        image: '../image/netError.png'
      });
    })
  },

  onMyFollowTipTabShow: function () {
    console.log("myFollowTipShow");
  },
  onMyFollowTipTabLoad: function () {
    this.fetchMyFollowIds(
      this.fetchMyFollowDataAtCurrentPageAndRender
    );
  },

  onRecommendTipTabShow: function () {
    console.log("myFollowTipShow");
  },
  onRecommendTipTabLoad: function () {
    this.fetchRecommendTipDataAndRender();
  },

  // f: 取回成功的回调,可为空
  fetchMyFollowIds: function (f) {
    let that = this;
    let uid = wx.BaaS.storage.get('uid');
    let followTableId = app.globalData.tableID.follow;
    let tipTableId = app.globalData.tableID.tips;
    let query = new wx.BaaS.Query();
    query.compare("created_by", '=', uid);

    let followIdTableObject = this.createTableObject(followTableId, query, 0);
    wx.showLoading({
      title: '加载中',
    });

    followIdTableObject.find().then(res => {
      that.myFollowIds = res.data.objects[0].myFollowTips;
      if (f != undefined) {
        f();
      }
      wx.hideLoading();
    }, err => {
      that.isTab2Loading = false;
      wx.hideLoading();
      console.log(err);
    });

  },

  fetchMyFollowDataAtCurrentPageAndRender: function () {
    let that = this;
    let followTips = that.myFollowIds;
    let tipsTableId = app.globalData.tableID.tips;
    let tipQuery = new wx.BaaS.Query();
    tipQuery.in('id', followTips);

    let tipTableObject = that.createTableObject(tipsTableId, tipQuery, that.myFollowCurrentPage);
    tipTableObject.find().then(res => {
      if (res.data.meta.next == null) {
        that.myFollowHasNext = false;
      } else {
        that.myFollowHasNext = true;
      }
      let myFollow = that.data.myFollowData.concat(res.data.objects)
      that.setData({ myFollowData: myFollow });
      that.isTab2Loading = false;
    }, err => {
      that.isTab2Loading = false;
      console.log(err);
    });

  },

  fetchRecommendTipDataAndRender: function () {
    let tableId = app.globalData.tableID.tips;
    let query = new wx.BaaS.Query();
    query.compare('isVerified', '=', true);

    let tableObject = this.createTableObject(tableId, query, 0);
    tableObject.find().then(res => {
      this.setData({
        recommendTipData: res.data.objects
      });
      that.isTab3Loading = false;
    }, err => {
      that.isTab3Loading = false;
      console.log(err);
    });
  },

  fetchTipsAndShow: function () {
    var that = this;
    let tableID = app.globalData.tableID.tips;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let longitude = res.longitude;
        let latitude = res.latitude;
        let currentPoint = new wx.BaaS.GeoPoint(longitude, latitude);
        let query = new wx.BaaS.Query();
        query.withinCircle('position', currentPoint, 2);
        let tip = that.createTableObject(tableID, query, that.currentPage);
        tip.find().then(function (res) {
          if (res.data.meta.next == null) {
            that.hasNext = false;
          } else {
            that.hasNext = true;
          }
          var tipData = that.data.tipData;
          var concatData = tipData.concat(res.data.objects);
          that.setData({ tipData: concatData });
          that.isTab1Loading = false;
        }, function (err) {
          console.log(err);
          that.isTab1Loading = false;
          wx.showToast({
            title: '网络故障',
            image: '../image/netError.png'
          });
        })
      }
    })
  },

  catchFollow: function (e) {
    let tip = e.currentTarget.dataset.tip;
    console.log(tip);
    let tableID = app.globalData.tableID.follow;
    let uid = wx.BaaS.storage.get('uid');
    let followTableObject = new wx.BaaS.TableObject(tableID);
    let query = new wx.BaaS.Query();
    query.compare('created_by', '=', uid);
    followTableObject.setQuery(query).find().then(function (res) {
      let followTableObject = new wx.BaaS.TableObject(tableID);
      console.log(res);
      if (res.data.objects.length == 0) {
        let followRecord = followTableObject.create();
        followRecord.set({
          myFollowTips: [tip.id]
        }).save().then(function (saveRes) {
          wx.showToast({
            title: '关注成功',
            image: '../image/follow.png'
          })
          console.log(saveRes);
        }, function (saveErr) {
          console.log(saveErr);
        })

      } else {
        console.log('else');
        let followList = res.data.objects[0].myFollowTips;
        if (followList.indexOf(tip.id) != -1) {
          wx.showToast({
            title: '您已关注',
          });
        } else {
          console.log(followList);
          followList.push(tip.id);
          console.log(followList);
          let followRecord = followTableObject.getWithoutData(res.data.objects[0].id);
          followRecord.set({
            myFollowTips: followList
          });
          followRecord.update().then(function (res) {
            wx.showToast({
              title: '关注成功',
              image: '../image/follow.png'
            })
            console.log(res);
          }, function (err) {
            console.log(err);
          })
        }
      }
    }, function (err) {

    })
  },
  bindFollow: function(e){
    console.log(e.currentTarget.dataset.tip);
    let currentTip = e.currentTarget.dataset.tip;
    wx.showLoading({
      title: '正在关注',
    });
    let that = this;
    let uid = wx.BaaS.storage.get('uid');
    let myFollowTable = new wx.BaaS.TableObject(app.globalData.tableID.follow);
    let followQuery = new wx.BaaS.Query();
    followQuery.compare('created_by', '=', uid);
    myFollowTable.setQuery(followQuery).find().then(function(res){
      console.log(res);
      let id = res.data.objects[0].id;
      let myFollowTips = res.data.objects[0].myFollowTips;
      if(res.data.objects.length == 0){
        let newFollowTip = myFollowTable.create();
        newFollowTip.set({ myFollowTips: [currentTip.id]});
        newFollowTip.save().then(function(res){
          wx.showToast({
            title: '关注成功',
          });
          that.onShow();
        }, function(err){
          console.log(err);
          wx.showToast({
            title: '网络故障',
            image: '../image/netError.png'
          });
        })
      } else {
        let index = myFollowTips.indexOf(currentTip.id);
        let updateFollowTip = myFollowTable.getWithoutData(id);
        if(index == -1){
          myFollowTips.push(currentTip.id);
          updateFollowTip.set({ myFollowTips: myFollowTips});
          updateFollowTip.update().then(function(updateRes){
            wx.showToast({
              title: '关注成功',
            });
            that.setData({
              btnWord: '取消关注',
            });
            that.onShow();
          }, function(updateErr){
            console.log(updateErr);
            wx.showToast({
              title: '网络故障',
              image: '../image/netError.png'
            });
          })
        } else {
          myFollowTips.splice(index, index);
          updateFollowTip.set({ myFollowTips: myFollowTips});
          updateFollowTip.update().then(function (updateRes) {
            wx.showToast({
              title: '取消关注成功',
              image: '../image/unfollow.png'
            });
            that.setData({
              btnWord: '关注',
            });
            that.onShow();
          }, function (updateErr) {
            console.log(updateErr);
            wx.showToast({
              title: '网络故障',
              image: '../image/netError.png'
            });
          })
        }
      }
    }, function(err){

    })
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
    var that = this;
    that.setData({ refreshing: true });
    if (that.data.currentTab == 0 && that.isTab1Loading == false) {
      console.log("onPullDownRefresh");
      that.currentPage = 0;
      that.isTab1Loading = true;
      that.data.tipData = [];
      that.fetchTipsAndShow();
    } else if (that.data.currentTab == 1 && that.isTab2Loading == false) {
      console.log("onPullDownRefresh");
      that.myFollowCurrentPage = 0;
      that.myFollowIds = [];
      that.data.myFollowData = [];
      that.isTab2Loading = true;
      that.fetchMyFollowIds(
        that.fetchMyFollowDataAtCurrentPageAndRender
      )
    } else if (that.data.currentTab == 2 && that.isTab3Loading == false) {
      console.log("onPullDownRefresh");
      that.isTab3Loading = true;
      that.fetchRecommendTipDataAndRender();
    }
    //wx.hideLoading();
  },


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  onScrollViewReachBottom: function () {
    if (this.data.currentTab == 0 && this.isTab1Loading == false) {
      if (this.hasNext == true) {
        console.log('scrollViewReachBottom')
        this.isTab1Loading = true;
        this.currentPage += 1;
        this.fetchTipsAndShow();
      }
    } else if (this.data.currentTab == 1 && this.isTab2Loading == false) {
      if (this.myFollowHasNext == true) {
        console.log('scrollViewReachBottom')
        this.isTab2Loading = true;
        this.myFollowCurrentPage += 1;
        this.fetchMyFollowDataAtCurrentPageAndRender();
      }
    }
  },
  onScrollViewReachTop: function () {
    this.onPullDownRefresh();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  userInfoHandler(data) {
    console.log(data)
    wx.BaaS.handleUserInfo(data).then(res => {
      console.log(res);
    }, res => {
      console.log(res);
    })
  },
  showSearch: function(e){
    wx.navigateTo({
      url: '../search/search',
    });
  }
})
