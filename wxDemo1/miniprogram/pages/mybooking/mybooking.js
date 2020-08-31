import {tools} from '../../js/tools.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {

    //偏移数据量
    skip: 0,
    //查询数据量
    limit: 20,

    isHasData: true,

    myBookingData: [],

    isLoading: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMyBookingData();
  },

  //获取我的记账数据
  getMyBookingData() {
    //加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数【get_booking_data_bylimit】
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_booking_data_bylimit',
      data: {
        skip: this.data.skip,
        limit: this.data.limit
      }
      
    }).then(result => {
      wx.hideLoading();

      

      result.result.data.map(v => {
        v.money = tools.thousandthPercentile(Number(v.money).toFixed(2));
        this.data.myBookingData.push(v);
      })

       //修改偏移量
      this.setData({
        skip: this.data.skip + this.data.limit,
        myBookingData: this.data.myBookingData,
        isLoading: false
      })

      if (result.result.data.length  < 20) {

        //如果本次查询数据不足20条数据,下次查询不可能有数据
        this.setData({
          isHasData: false
        })
       
      }

      
      
      
    }).catch(err => {
      wx.hideLoading();
      
    })
  },

  //删除我的记账数据
  removeMyBookingData(e) {
    //加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数【remove_booking_data_byid】
    wx.cloud.callFunction({
      //云函数名称
      name: 'remove_booking_data_byid',
      data: {
        _id: e.currentTarget.dataset.id,
      }
      
    }).then(result => {
      wx.hideLoading();

      

      if (result.result.stats.removed == 1) {
        this.data.myBookingData.splice(e.currentTarget.dataset.index, 1);
        this.setData({
          myBookingData: this.data.myBookingData
        })
      }
      
    }).catch(err => {
      wx.hideLoading();
      
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    

    if (!this.data.isHasData) {
      return;
    }
    
    this.getMyBookingData();
  }

})