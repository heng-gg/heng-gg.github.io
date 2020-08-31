let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //获取用户信息
  getUserAuthInfo(e) {
    

    if (e.detail.userInfo) {
      //允许授权
      app.globalData.isAuth = true;

      //返回上一级页面
      wx.navigateBack({
        delta: 1
      })
    }
  }
})