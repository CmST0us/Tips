// tasksDetail/tasksDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipData: {},
    isApply: false,
    btnWord: '申请验证',
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tipID = options.tipID;
    let tableID = app.globalData.tableID.tips;
    let tip = new wx.BaaS.TableObject(tableID);
    let that = this;
    wx.showLoading({
      title: '正在加载'
    });
    tip.get(tipID).then(function (res) {
      wx.hideLoading();
      that.setData({ tipData: res.data });
      that.setData({
        markers: [{
          latitude: res.data.position.coordinates[1],
          longitude: res.data.position.coordinates[0]
        }]
      })
      let uid = wx.BaaS.storage.get('uid');
      console.log(uid);
      console.log(res.data.position.coordinates);
      if (res.data.participantID.indexOf(uid) != -1) {
        that.setData({
          isApply: true,
          btnWord: '您已申请'
        });
      }
      console.log(this.data.isApply);
    }, function (err) {
      console.log(err);
      wx.showToast({
        title: '网络连接中断',
        image: '../image/netError.png'
      });
    })
  },
  participateTask: function (e) {
    let tableID = app.globalData.tableID.tips;
    let that = this;
    let tip = new wx.BaaS.TableObject(tableID);
    wx.showLoading({
      title: '正在申请'
    });
    tip.get(this.data.tipData.id).then(function (res) {
      let tipItem = res.data;
      let participants = res.data.participantID;
      if (participants.length >= 10) {
        wx.showToast({
          title: '人数已达到上限',
          image: '../image/commonErr.png',
          duration: 2000
        });
      } else {
        let uid = wx.BaaS.storage.get('uid');
        participants.push(uid);
        let tipRecord = tip.getWithoutData(tipItem.id);
        tipRecord.set('participantID', participants);
        tipRecord.update().then(function (currentRes) {
          let tempTaskList = new wx.BaaS.TableObject('38593');
          let query = new wx.BaaS.Query();
          query.compare('created_by', '=', uid);
          tempTaskList.setQuery(query).find().then(function (taskListRes) {
            let myTaskList = new wx.BaaS.TableObject(app.globalData.tableID.userTaskList);
            if (taskListRes.data.objects.length == 0) {
              let taskListRecord = myTaskList.create();
              taskListRecord.set({
                myTaskList: [currentRes.data.id]
              }).save().then(function (saveRes) {
                console.log(saveRes);
              }, function (saveErr) {
                console.log(saveErr);
              })

            } else {
              let taskList = taskListRes.data.objects[0].myTaskList;
              taskList.push(currentRes.data.id);
              let taskListRecord = myTaskList.getWithoutData(taskListRes.data.objects[0].id);
              taskListRecord.set({
                myTaskList: taskList
              });
              taskListRecord.update().then(function (res) {
                console.log(res);
              }, function (err) {
                console.log(err);
              })
            }

          }, function (err) {
            console.log(err);
            wx.showToast({
              title: '网络故障',
              image: '../image/netError.png'
            });
          })
          that.setData({
            tipData: res.data,
            isApply: true,
            btnWord: '您已申请'
          });
          wx.showToast({
            title: '申请成功',
            image: '../image/success.png'
          })
        }, function (err) {
          console.log(err);
          wx.showToast({
            title: '申请失败',
            image: '../image/commonErr.png'
          });
        })
      }
    }, function (err) {
      wx.showToast({
        title: '网络连接中断',
        image: '../image/netError.png'
      });
    })
  },
  bindNavigation: function (e) {
    let that = this;
    wx.openLocation({
      latitude: that.data.tipData.position.coordinates[1],
      longitude: that.data.tipData.position.coordinates[0],
      name: that.data.tipData.locationName,
      address: that.data.tipData.locationAddress
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