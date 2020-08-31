import {tools} from '../../js/tools.js'

//获取小程序实例
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //类型数据
    typeData: [
      {
        title: '收入',
        type: 'shouru',
        isActive: true
      },
      {
        title: '支出',
        type: 'zhichu',
        isActive: false
      }
    ],

    //图标数据
    iconsData: [],


    //账户选择数据
    accountData: [
      {
        title: '现金',
        isActive: true
      },
      {
        title: '支付宝',
        isActive: false
      },
      {
        title: '微信',
        isActive: false
      },
      {
        title: '储蓄卡',
        isActive: false
      },
      {
        title: '信用卡',
        isActive: false
      }
    ],

    //日期
    date: '请选择日期',

    //金额
    money: 0,

    //备注
    comment: '',

    dateRange: {
      start: '',
      end: ''
    },

    isLoading: true

  },

  onLoad() {
    
    //获取项目上线时间
    this.getOnlineDate();

    //获取图标数据
    this.getIconData();
  },

  //切换标签
  toggleTag(e) {
    

    if (e.currentTarget.dataset.active) {
      
      return;
    }

    let data = this.data[e.currentTarget.dataset.name];

    for (let i = 0; i < data.length; i++) {
      if (data[i].isActive) {
        data[i].isActive = false;
        break;
      }
    }

    data[e.currentTarget.dataset.index].isActive = true;

    //响应页面数据
    this.setData({
      [e.currentTarget.dataset.name]: data
    })

  },


  //获取图标数据
  getIconData() {
    //加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数【get_icon_data】
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_icon_data'
      
    }).then(result => {
      wx.hideLoading();
      
      this.setData({
        iconsData: result.result.data
      })
    }).catch(err => {
      wx.hideLoading();
      
    })

  },

  //选择日期, 输入金额, 输入备注
  inputValue(e) {
    
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })

    

  },

  //获取项目上线时间
  getOnlineDate() {
    //加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数【get_date】
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_date'
      
    }).then(result => {
      wx.hideLoading();
      
      this.data.dateRange.start = result.result.data[0].date;

      //获取当前时间
      let end = tools.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
      this.data.dateRange.end = end;
      this.setData({
        dateRange: this.data.dateRange,

        isLoading: false
      })
      
    }).catch(err => {
      wx.hideLoading();
      
    })
  },

  //保存
  save() {

    //先判断用户是否授权
    let isAuth = app.globalData.isAuth;
    

    if (!isAuth) {
      return wx.navigateTo({
        url: '../auth/auth'
      })
    }

    //记账数据
    let bookingData = {};

    //判断是否选择记账方式, 出行，人情...
    let isHas = false;
    for (let i = 0; i < this.data.iconsData.length; i++) {
      if (this.data.iconsData[i].isActive) {
        bookingData.bookingStyle = {
          url: this.data.iconsData[i].url,
          title: this.data.iconsData[i].title,
          type: this.data.iconsData[i].type
        };
        isHas = true;
        break;
      }
    }

    if (!isHas) {
      return wx.showToast({
        title: '请选择记账方式',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }

    //判断是否选择日期
    if (this.data.date == '请选择日期') {
      return wx.showToast({
        title: '请选择日期',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }

    //判断金额是否填写
    if (this.data.money == 0 || this.data.money == '') {
      return wx.showToast({
        title: '请输入金额',
        icon: 'none',
        duration: 2000,
        mask: true
      })
    }

    //获取记账类型 收入-支出
    bookingData.bookingType = {};
    for (let i = 0; i < this.data.typeData.length; i++) {
      if (this.data.typeData[i].isActive) {
        bookingData.bookingType.title = this.data.typeData[i].title;
        bookingData.bookingType.type = this.data.typeData[i].type;
        break;
      }
    }

    //获取账户
    for (let i = 0; i < this.data.accountData.length; i++) {
      if (this.data.accountData[i].isActive) {
        bookingData.account = this.data.accountData[i].title;
        break;
      }
    }

    //获取日期
    bookingData.date = this.data.date;

    //获取金额
    bookingData.money = this.data.money;

    //获取备注信息
    bookingData.comment = this.data.comment;

    

    //加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数【add_booking_data】
    wx.cloud.callFunction({
      //云函数名称
      name: 'add_booking_data',

      //参数
      data: bookingData
      
    }).then(result => { 
      wx.hideLoading();
      
    }).catch(err => {
      wx.hideLoading();
      
    })


  }

})