App({
  globalData:{
    tableID: {
      tips: '37869',
      userTaskList: '38593',
      follow: '38936',
      isVerified: '39061'
    },
    tipsData:[],
    currentTaskTipID: '',
    currentTip: {},
    systemInfo: {},
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {
    try {
      let info = wx.getSystemInfoSync();
      this.globalData.systemInfo = info;
    } catch (e) {
      wx.showToast({
        title: '获取系统信息出错',
      });
    }
    require('./libs/sdk-v1.4.0');
    let clientID = 'fe4e7217a0ff01da81f8';
    let ret = wx.BaaS.init(clientID);
    console.log('success');
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function (options) {
    
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
