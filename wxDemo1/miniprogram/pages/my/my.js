
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [
      {title: '我的记账', pageUrl: '../mybooking/mybooking'}
      // {title: '疫情监控', pageUrl: '../yiqing/yiqing'}
    ],
    isAuth: false,
    userInfo: {},
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      isAuth: app.globalData.isAuth
    })

    if (this.data.isAuth) {
      wx.getUserInfo({
        success: res => {
          
          this.setData({
            userInfo: {
              nickName: res.userInfo.nickName,
              avatarUrl: res.userInfo.avatarUrl
            },
            isLoading: false
          })
        }
      })
    } else {
      this.setData({
        isLoading: false
      })
    }
  },

  goPage(e) {
    // 
    wx.navigateTo({
      url: e.currentTarget.dataset.pageurl
    })
  },

  
})