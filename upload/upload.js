// upload/upload.js
//PYTBZ-W6MRF-MSCJS-JUYGZ-ZLD6S-36BKY
let QQMapWX = require('../libs/qqmap-wx-jssdk.min.js');
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerIndex: 0,
    typeArr: ["饮食", "娱乐", "生活", "出行"],
    position: {},
    picSrc: [],
    videoSrc: [],
    isPicSelected: false,
    isVideoSelected: false,
    picPath: '',
    videoPath: '',
    content: '',
    index: 0,
    picUrls: [],
    picSrcLength: 0,
    haveBeenUpdated: false,
    markers: []
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
    let that = this;
    that.formReset();
    let qqmapsdk = new QQMapWX({
      key: 'PYTBZ-W6MRF-MSCJS-JUYGZ-ZLD6S-36BKY' // 必填
    });
    wx.showLoading({
      title: '正在加载',
    });
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (addressRes) {
            wx.hideLoading();
            console.log(addressRes);
            let position = {
              longitude: res.longitude,
              latitude: res.latitude,
              name: addressRes.result.formatted_addresses.recommend,
              address: addressRes.result.address
            };
            that.setData({ position: position });
          }
        });

      },
    })
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
  bindPickerChange: function (e) {
    console.log(e);
    let pickerIndex = parseInt(e.detail.value);
    this.setData({pickerIndex: pickerIndex});
  },
  formSubmit: function (e) {
    let that = this;
    let index = that.data.picSrc.length - that.data.picSrcLength;
    wx.showLoading({
      title: '正在提交',
    });
    if (that.data.picSrc.length != 0 && that.data.videoSrc.length == 0) {
      let pic = new wx.BaaS.File();
      let fileParams = { filePath: that.data.picSrc[index] };
      console.log(fileParams);
      let metaData = { categoryName: 'SDK' };

      pic.upload(fileParams, metaData).then(function (res) {
        console.log(res.data.path);
        let picUrls = that.data.picUrls;
        picUrls.push(res.data.path);
        that.setData({ picSrcLength: that.data.picSrcLength - 1 });
        that.setData({
          picUrls: picUrls,
          content: that.data.haveBeenUpdated ? that.data.content : e.detail.value["input"],
          index: that.data.haveBeenUpdated ? that.data.index : e.detail.value["picker"],
          haveBeenUpdated: true
        });

        console.log(typeof that.data.picUrls);
        if (that.data.picSrcLength > 0) {
          console.log(that.data);
          //that.setData({ picSrcLength: that.data.picSrcLength - 1 });
          that.formSubmit({});
        } else if (that.data.picSrcLength == 0) {
          that.createTableObjectAndUpdate();
        }

      }, function (err) {
        console.log(err);
        wx.showToast({
          title: '网络故障',
          image: '../image/netError.png'
        });
      })
    }
    if (that.data.videoSrc.length != 0 && that.data.picSrc.length == 0) {
      let video = new wx.BaaS.File();
      let fileParams = { filePath: that.data.videoSrc }
      let metaData = { categoryName: 'SDK' }
      video.upload(fileParams, metaData).then(function (res) {
        console.log(res);
        that.setData({
          videoPath: res.data.path,
          content: e.detail.value["input"],
          index: e.detail.value["picker"]
        });
        that.createTableObjectAndUpdate();
      }, function (err) {
        console.log(err);
        wx.showToast({
          title: '网络故障',
          image: '../image/netError.png'
        });
      })
    }

    if (that.data.videoSrc.length != 0 && that.data.picSrc.length != 0) {
      let index = that.data.picSrc.length - that.data.picSrcLength;
      let pic = new wx.BaaS.File();
      let fileParams_out = { filePath: that.data.picSrc[index] };
      let metaData = { categoryName: 'SDK' }
      pic.upload(fileParams_out, metaData).then(function (res) {
        console.log(res.data.path);
        let picUrls = that.data.picUrls;
        picUrls.push(res.data.path);
        that.setData({ picSrcLength: that.data.picSrcLength - 1 });
        that.setData({
          picUrls: picUrls,
          content: that.data.haveBeenUpdated ? that.data.content : e.detail.value["input"],
          index: that.data.haveBeenUpdated ? that.data.index : e.detail.value["picker"],
          haveBeenUpdated: true
        });
        if (that.data.picSrcLength > 0) {
          console.log(that.data);
          that.formSubmit({});
        } else if (that.data.picSrcLength == 0) {
          let video = new wx.BaaS.File();
          let fileParams_in = { filePath: that.data.videoSrc };
          video.upload(fileParams_in, metaData).then(function (res) {
            that.setData({ videoPath: res.data.path });
            that.createTableObjectAndUpdate();
          }, function (err) {
            console.log(err);
            wx.showToast({
              title: '网络故障',
              image: '../image/netError.png'
            });
          })
        }
      }, function (err) {
        console.log(err);
        wx.showToast({
          title: '网络故障',
          image: '../image/netError.png'
        });
      })
    } else if (that.data.videoSrc.length == 0 && that.data.picSrc.length == 0) {
      that.setData({
        content: e.detail.value["input"],
        index: e.detail.value["picker"]
      });
      that.createTableObjectAndUpdate();
    }

  },
  createTableObjectAndUpdate: function (p) {
    let latitude = this.data.position.latitude;
    let longitude = this.data.position.longitude;
    let point = new wx.BaaS.GeoPoint(longitude, latitude);
    let tip = {
      tipType: this.data.typeArr[this.data.index],
      content: this.data.content,
      longitude: longitude,
      latitude: latitude,
      position: point,
      isVerified: false,
      participantID: [],
      locationName: this.data.position.name,
      locationAddress: this.data.position.address,
      videoPath: this.data.videoPath,
      picPath: this.data.picUrls
    }
    console.log(tip)
    let tipTableObject = new wx.BaaS.TableObject(app.globalData.tableID.tips);
    let tipTable = tipTableObject.create();
    tipTable.set(tip).save().then(function (res) {
      wx.showToast({
        title: '提交成功',
        image: '../image/success.png'
      });
    }, function (err) {
      console.log(err);
    })
  },
  formReset: function () {
    console.log('form表单重置');
    this.setData({
      picSrc: [],
      videoSrc: '',
      picPath: '',
      videoPath: '',
      isPicSelected: false,
      isVideoSelected: false
    });
  },
  bindChooseLocation: function (e) {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        console.log(res);
        wx.showToast({
          title: '地点选择成功',
          image: '../image/success.png'
        });
        let longitude = res.longitude;
        let latitude = res.latitude;
        let position = {
          longitude: longitude,
          latitude: latitude,
          name: res.name,
          address: res.address
        }
        that.setData({ 
          position: position,
          markers: [{
            latitude: latitude,
            longitude: longitude
          }]
        });
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  selectPics: function (e) {
    let that = this;
    wx.chooseImage({
      count: 9,
      success: function (res) {
        console.log(res);
        let src = res.tempFilePaths;
        that.setData({
          picSrc: src,
          isPicSelected: true,
          picSrcLength: src.length
        });
        console.log(that);
      },
      fail: function (err) {
        console.log(err);
      }
    });

  },
  selectVideo: function (e) {
    let that = this;
    wx.chooseVideo({
      success: function (res) {
        let src = res.tempFilePath;
        that.setData({
          videoSrc: src,
          isVideoSelected: true
        });
      }
    });
  }
})