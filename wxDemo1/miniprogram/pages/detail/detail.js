
import {tools} from '../../js/tools.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookingDataDetail: [],
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //截取参数
    

    wx.setNavigationBarTitle({
      title: options.title + '记账详情'
    })

    this.getBookingDataById(options.ids);

  },

  //根据记账id查询记账数据
  getBookingDataById(ids) {
    //加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数【get_booing_data_byid】
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_booking_data_byid',
      data: {
        ids
      }
      
    }).then(result => {
      wx.hideLoading();
      

      //保留两个小数，千分位处理
      result.result.data.map(v => {
        v.money = tools.thousandthPercentile(Number(v.money).toFixed(2));
      })

      this.setData({
        bookingDataDetail: result.result.data,
        isLoading: false
      })

    }).catch(err => {
      wx.hideLoading();
      
    })
  }

  
})