// detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipData: {},
    btnWord: '关注',
    isFollowed: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    })
    let that = this;
    let uid = wx.BaaS.storage.get('uid');
    let tip = app.globalData.currentTip;
    that.setData({ tipData: tip });
    let followTableObject = new wx.BaaS.TableObject(app.globalData.tableID.follow);
    let followQuery = new wx.BaaS.Query();
    followQuery.compare('created_by', '=', uid);
    followTableObject.setQuery(followQuery).find().then(function (res) {
      wx.hideLoading();
      if (res.data.objects.length != 0) {
        let followTipsArr = res.data.objects[0].myFollowTips;
        if (followTipsArr.indexOf(tip.id) != -1) {
          that.setData({
            btnWord: '取消关注',
            isFollowed: true
          });
        }
      }
    }, function (err) {
      console.log(err);
      wx.showToast({
        title: '网络故障',
        image: '../image/netError.png'
      });
    })
  },
  bindFollow: function (e) {
    let that = this;
    let tip = app.globalData.currentTip;
    let uid = wx.BaaS.storage.get('uid');
    let followTableObject = new wx.BaaS.TableObject(app.globalData.tableID.follow);
    let followQuery = new wx.BaaS.Query();
    followQuery.compare('created_by', '=', uid);
    followTableObject.setQuery(followQuery).find().then(function (res) {
      console.log(res);
      if (res.data.objects.length != 0) {
        let followTipsArr = res.data.objects[0].myFollowTips;
        if (!that.data.isFollowed) {
          followTipsArr.push(tip.id);
          let followRecord = followTableObject.getWithoutData(res.data.objects[0].id);
          followRecord.set({ myFollowTips: followTipsArr });
          followRecord.update().then(function (saveRes) {
            console.log(saveRes);
          }, function (saveErr) {
            console.log(saveErr);
            wx.showToast({
              title: '网络故障',
              image: '../image/netError.png'
            });
          });
          that.setData({
            btnWord: '取消关注',
            isFollowed: true
          });
        } else {
          let index = followTipsArr.indexOf(tip.id);
          followTipsArr.splice(index, index);
          let followRecord = followTableObject.getWithoutData(res.data.objects[0].id);
          followRecord.set({ myFollowTips: followTipsArr });
          followRecord.update().then(function (saveRes) {
            console.log(saveRes);
          }, function (saveErr) {
            console.log(saveErr);
            wx.showToast({
              title: '网络故障',
              image: '../image/netError.png'
            });
          });
          that.setData({
            btnWord: '关注',
            isFollowed: false
          });
        }

      } else {
        let followRecord = followTableObject.create();
        followRecord.set({
          myFollowTips: [tip.id]
        }).save().then(function (saveRes) {
          console.log(saveRes);
        }, function (saveErr) {
          console.log(saveErr);
        })
      }
    }, function (err) {
      wx.showToast({
        title: '网络故障',
        image: '../image/netError.png'
      });
    })
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