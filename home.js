// home/home.js
var amapFile = require('../libs/amap-wx.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipData: [],
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      currentTab: e.detail.current,
    })
  },
  showDetail: function (e) {
    console.log(e.currentTarget.dataset.tip);
    app.globalData.currentTip = e.currentTarget.dataset.tip;
    wx.navigateTo({
      url: '../detail/detail'
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
    var that = this;
    let tableID = app.globalData.tableID.tips;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        let longitude = res.longitude;
        let latitude = res.latitude;
        let currentPoint = new wx.BaaS.GeoPoint(longitude, latitude);
        let tip = new wx.BaaS.TableObject(tableID);
        let query = new wx.BaaS.Query();
        query.withinCircle('position', currentPoint, 2);
        tip.setQuery(query).find().then(function (res) {
          console.log(res.data);
          that.setData({ tipData: res.data.objects });
        }, function (err) {
          console.log(err);
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
            console.log(res);
          }, function (err) {
            console.log(err);
          })
        }
      }
    }, function (err) {

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

  },
  userInfoHandler(data) {
    console.log(data)
    wx.BaaS.handleUserInfo(data).then(res => {
      console.log(res);
    }, res => {
      console.log(res);
    })
  }
})