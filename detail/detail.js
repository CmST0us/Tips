// detail/detail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tipData: {},
    btnWord: '关注',
    isFollowed: false,
    isFromMy: false,
    isVerified: false,
    checkBtnWord: '验证通过',
    failBtnWord: '无效',
    isFromHome: true,
    isFailed: false,
    markers: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '正在加载',
    });
    let tip = app.globalData.currentTip;
    let uid = wx.BaaS.storage.get('uid');
    let that = this;
    if (options.page == 'my') {
      that.setData({
        isFromMy: true,
        isFromHome: false
      });
      let verifiedTableObject = new wx.BaaS.TableObject(app.globalData.tableID.isVerified);
      let query = new wx.BaaS.Query();
      query.compare('created_by', '=', uid);
      verifiedTableObject.setQuery(query).find().then(function (res) {
        if (res.data.objects.length != 0 && res.data.objects[0].verifiedTips.indexOf(tip.id) != -1) {
          that.setData({
            isVerified: true,
            checkBtnWord: '您已验证'
          });
        }
      }, function (err) {
        wx.showToast({
          title: '网络故障',
          image: '../image/netError.png'
        });
      })
    }
    that.setData({
      tipData: tip,
      markers: [{
        latitude: tip.position.coordinates[1],
        longitude: tip.position.coordinates[0]
      }]
    });
    if (this.data.isFromHome) {
      let tipTableObject = new wx.BaaS.TableObject(app.globalData.tableID.tips);
      tipTableObject.get(tip.id).then(function (res) {
        if (res.data.verifyNum == 0) {
          that.setData({
            isFailed: true,
            failBtnWord: '已经无效'
          });
        }
      }, function (err) {
        wx.showToast({
          title: '网络故障',
          image: '../image/netError.png'
        });
      })
    }
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
  bindCheck: function (e) {
    wx.showLoading({
      title: '正在提交',
    });
    let that = this;
    let uid = wx.BaaS.storage.get('uid');
    let tip = app.globalData.currentTip;
    let tipTableObject = new wx.BaaS.TableObject(app.globalData.tableID.tips);
    tipTableObject.get(tip.id).then(function (res) {
      console.log(res);
      let verifyNum = res.data.verifyNum + 1;
      let tipRecord = tipTableObject.getWithoutData(tip.id);
      tipRecord.set({
        verifyNum: verifyNum,
        isVerified: verifyNum == 10 ? true : false
      });
      tipRecord.update().then(function (saveRes) {
        wx.showToast({
          title: '验证成功',
          image: '../image/success.png'
        });
        let verifiedTableObject = new wx.BaaS.TableObject(app.globalData.tableID.isVerified);
        let query = new wx.BaaS.Query();
        query.compare('created_by', '=', uid);
        verifiedTableObject.setQuery(query).find().then(function (res) {
          if (res.data.objects.length != 0) {
            let verifiedTipsArr = res.data.objects[0].verifiedTips;
            verifiedTipsArr.push(tip.id);
            let verifiedTipsRec = verifiedTableObject.getWithoutData(res.data.objects[0].id);
            verifiedTipsRec.set({ verifiedTips: verifiedTipsArr });
            verifiedTipsRec.update().then(function (saveRes) {
              console.log(saveRes);
            }, function (saveErr) {
              wx.showToast({
                title: '网络故障',
                image: '../image/netError.png'
              });
            })
          } else {
            let verifiedTipsRec = verifiedTableObject.create();
            verifiedTipsRec.set({ verifiedTips: [tip.id] });
            verifiedTipsRec.save().then(function (res) {
              console.log(res);
            }, function (err) {
              wx.showToast({
                title: '网络故障',
                image: '../image/netError.png'
              });
            })
          }
          that.setData({
            isVerified: true,
            checkBtnWord: '您已验证'
          });
        }, function (err) {
          wx.showToast({
            title: '网络故障',
            image: '../image/netError.png'
          });
        })

      }, function (saveErr) {
        wx.showToast({
          title: '网络故障',
          image: '../image/netError.png'
        });
      })
    }, function (err) {
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
            wx.showToast({
              title: '关注成功',
              image: '../image/follow.png'
            })
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
            wx.showToast({
              title: '取消关注成功',
              image: '../image/unfollow.png'
            })
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
  bindFail: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    console.log(id);
    let tipTableObject = new wx.BaaS.TableObject(app.globalData.tableID.tips);
    wx.showLoading({
      title: '正在加载',
    });
    tipTableObject.get(id).then(function (res) {
      wx.hideLoading();
      if (res.data.verifyNum != 0) {
        let verifyNum = res.data.verifyNum - 1;
        let tipRecord = tipTableObject.getWithoutData(id);
        tipRecord.set({
          verifyNum: verifyNum,
          isVerified: verifyNum == 0 ? false : true
        });
        tipRecord.update().then(function (saveRes) {
          that.setData({
            isFailed: saveRes.data.isVerified,
            failBtnWord: '已经无效'
          });
        }, function (saveErr) {
          wx.showToast({
            title: '网络故障',
            image: '../image/netError.png'
          });
        })
      } else {
        wx.showToast({
          title: '已经无效',
          image: '../image/commonErr.png'
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
  bindNavigation: function (e) {
    let that = this;
    wx.openLocation({
      latitude: that.data.tipData.position.coordinates[1],
      longitude: that.data.tipData.position.coordinates[0],
      name: that.data.tipData.locationName,
      address: that.data.tipData.locationAddress
    });
  },
  savePic: function (e) {
    let itemList;
    if(!!e.target.dataset.picpath){
      itemList = ['保存图片到本地'];
    } else {
      itemList = ['保存视频到本地'];
    }
    console.log(e);
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        console.log(res);
        if (res.tapIndex == 0) {
          wx.downloadFile({
            url: e.currentTarget.dataset.picpath,
            success: function (res) {
              console.log(res);
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function (res) {
                  console.log(res);
                  wx.showToast({
                    title: '保存成功',
                    image: '../image/success.png'
                  });
                }
              })
            },
            fail: function (err) {
              console.log(err);
              wx.showToast({
                title: '网络故障',
                image: '../image/netError.png'
              });
            }
          })
        } else {
          wx.downloadFile({
            url: e.currentTarget.dataset.videopath,
            success: function(res){
              wx.saveVideoToPhotosAlbum({
                filePath: res.tempFilePath,
                success: function(res){
                  wx.showToast({
                    title: '保存成功',
                    image: '../image/success.png'
                  });
                },
                fail: function(err){
                  console.log(err);
                  wx.showToast({
                    title: '网络故障',
                    image: '../imgae/netError.png'
                  });
                }
              })
            },
            fail: function(err){
              console.log(err);
              wx.showToast({
                title: '网络故障',
                image: '../image/netError.png'
              });
            }

          })
        }
      }
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