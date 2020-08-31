//ES6规范
// export 导出
// import 导入
import {
  tools
} from '../../js/tools.js'

//commonJs规范
// module.exports 或者 exports 导出
// require 导入
let wxCharts = require('../../js/wxcharts.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

    condition: ['年', '月', '日'],
    currentCondition: 1,
    text: '月',

    dateRange: {
      start: '',
      end: ''
    },

    date: '',

    dateText: '',

    //30天月份
    day30: ['04', '06', '09', '11'],

    //收入支出标题
    bookingTitle: [{
        title: '收入',
        isActive: true,
        total: 0,
        type: 'shouru'
      },
      {
        title: '支出',
        isActive: false,
        total: 0,
        type: 'zhichu'
      }
    ],

    //收入支出
    booking: {
      shouru: {

      },
      zhichu: {

      }
    },

    //展示数据
    bookingData: [],

    isLoading: true

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOnlineDate();
  },

  //切换年月日查询
  toggleTime() {
    if (this.data.currentCondition == this.data.condition.length - 1) {
      this.data.currentCondition = 0;
    } else {
      this.data.currentCondition++;
    }

    this.setData({
      currentCondition: this.data.currentCondition,
      text: this.data.condition[this.data.currentCondition]
    })

    this.getBokingDateByTime();

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
      let end = tools.formatDate(new Date(), 'yyyy-MM-dd');
      this.data.dateRange.end = end;

      this.setData({
        dateRange: this.data.dateRange,
        date: end
      })

      this.getBokingDateByTime();

      this.formatDateByTime(end);

    }).catch(err => {
      wx.hideLoading();
      
    })
  },

  //根据年月日处理显示时间
  formatDateByTime(end) {

    if (this.data.currentCondition == 0) {
      this.data.dateText = end.slice(0, 4);
    } else if (this.data.currentCondition == 1) {
      this.data.dateText = end.slice(0, 7);
    } else {
      this.data.dateText = end;
    }

    this.setData({
      dateText: this.data.dateText
    })
  },

  //选择日期
  selectDate(e) {

    //如果按年查询, 需要判断是否同年
    //如果按月查询, 先判断同年，再判断同月
    //如果按日查询, 先判断同年，再判断同月，再判断同日
    let date = this.data.date;

    let curDate = e.detail.value;

    if (this.data.currentCondition == 0) {
      if (date.substr(0, 4) == curDate.substr(0, 4)) {
        
        return;
      }
    } else if (this.data.currentCondition == 1) {
      if (date.substr(0, 7) == curDate.substr(0, 7)) {
        
        return;
      }
    } else {
      if (date == curDate) {
        
        return;
      }
    }

   

    this.setData({
      date: e.detail.value
    })

    this.getBokingDateByTime();

    this.formatDateByTime(e.detail.value);

  },

  //按年月日查询记账数据
  getBokingDateByTime() {

    let date = {

    };

    //获取当前日期
    let currentDate = this.data.dateRange.end.split('-');
    

    //获选择日期
    let selectDate = this.data.date.split('-');
    

    //按年查询
    if (this.data.currentCondition == 0) {

      date.start = `${selectDate[0]}-01-01`;

      //判断同年
      if (currentDate[0] == selectDate[0]) {
        date.end = this.data.dateRange.end;
      } else {
        date.end = `${selectDate[0]}-12-31`;
      }

    } else if (this.data.currentCondition == 1) {
      //按月查询
      date.start = `${selectDate[0]}-${selectDate[1]}-01`;
      //判断同年
      if (currentDate[0] == selectDate[0]) {

        //判断同月
        if (currentDate[1] == selectDate[1]) {
          date.end = this.data.dateRange.end;
        } else {

          //如果不是本月
          //判断是2月份
          if (selectDate[1] == '02') {

            //判断闰年平年
            if (selectDate[0] % 400 == 0 || (selectDate[0] % 4 == 0 && selectDate[0] % 100 != 0)) {
              date.end = `${selectDate[0]}-${selectDate[1]}-29`;
            } else {
              date.end = `${selectDate[0]}-${selectDate[1]}-28`;
            }

          } else {
            //不是2月份, 4, 6, 9 , 11 ==> 30天
            if (this.data.day30.indexOf(selectDate[1]) > -1) {
              date.end = `${selectDate[0]}-${selectDate[1]}-30`;
            } else {
              date.end = `${selectDate[0]}-${selectDate[1]}-31`;
            }
          }

        }
      } else {
        //不是同年
        //如果不是本月
        //判断是2月份
        if (selectDate[1] == '02') {

          //判断闰年平年
          if (selectDate[0] % 400 == 0 || (selectDate[0] % 4 == 0 && selectDate[0] % 100 != 0)) {
            date.end = `${selectDate[0]}-${selectDate[1]}-29`;
          } else {
            date.end = `${selectDate[0]}-${selectDate[1]}-28`;
          }

        } else {
          //不是2月份, 4, 6, 9 , 11 ==> 30天
          if (this.data.day30.indexOf(selectDate[1]) > -1) {
            date.end = `${selectDate[0]}-${selectDate[1]}-30`;
          } else {
            date.end = `${selectDate[0]}-${selectDate[1]}-31`;
          }
        }
      }

    } else {
      //按日查询
      date.start = this.data.date

    }

    
    //根据年月日处理显示时间
    this.formatDateByTime(date.start);

    //加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数【get_booking_data_bytime】
    wx.cloud.callFunction({
      //云函数名称
      name: 'get_booking_data_bytime',
      data: date
    }).then(result => {
      wx.hideLoading();
      
      this.setData({
        isLoading: false
      })

      for (let i = 0; i < this.data.bookingTitle.length; i++) {
        this.data.bookingTitle[i].total = 0;
      }

      this.data.booking = {
        shouru: {},
        zhichu: {}
      };


      if (result.result.data.length == 0) {
        this.setData({
          bookingData: [],
          booking: this.data.booking,
          bookingTitle: this.data.bookingTitle
        })
        return;
      }


      //按照收入和支出分类
      result.result.data.map(v => {

        //总金额
        if (!this.data.booking[v.bookingType.type].total) {
          this.data.booking[v.bookingType.type].total = Number(v.money);
        } else {
          this.data.booking[v.bookingType.type].total += Number(v.money);
        }

        //按照餐饮，出行，学习...分类
        if (!this.data.booking[v.bookingType.type][v.bookingStyle.type]) {
          //如果不存在，则初始化一个数组

          //随机生成颜色
          let r = Math.ceil(Math.random() * 255);
          let g = Math.ceil(Math.random() * 255);
          let b = Math.ceil(Math.random() * 255);

          this.data.booking[v.bookingType.type][v.bookingStyle.type] = {
            total: Number(v.money),
            count: 1,
            typeData: [v],
            url: v.bookingStyle.url,
            title: v.bookingStyle.title,
            color: `rgb(${r},${g},${b})`,
            type: v.bookingType.type,
            _ids: v._id,

            //饼图数据
            name: v.bookingStyle.title,
            data: Number(v.money),
            format: value => {
              return ` ${v.bookingStyle.title} ${(value * 100).toFixed(3)}% `;
            }
          };
        } else {
          this.data.booking[v.bookingType.type][v.bookingStyle.type].typeData.push(v);
          this.data.booking[v.bookingType.type][v.bookingStyle.type].total += Number(v.money);
          this.data.booking[v.bookingType.type][v.bookingStyle.type].count++;
          this.data.booking[v.bookingType.type][v.bookingStyle.type].data += Number(v.money);
          this.data.booking[v.bookingType.type][v.bookingStyle.type]._ids += '-' + v._id;
        }

      })

      //统计 餐饮，出行，学习 的百分比
      for (let key in this.data.booking) {

        

        //设置收入和支出的总金额
        let total = this.data.booking[key].total || 0;



        for (let i = 0; i < this.data.bookingTitle.length; i++) {
          if (key == this.data.bookingTitle[i].type) {
            this.data.bookingTitle[i].total = tools.thousandthPercentile(total.toFixed(2));
            break;
          }
        }

        for (let k in this.data.booking[key]) {
          if (k == 'total') {

            continue;
          }

          this.data.booking[key][k].percent = this.data.booking[key][k].total / this.data.booking[key].total;

          this.data.booking[key][k].total = tools.thousandthPercentile(this.data.booking[key][k].total.toFixed(2));

        }


      }

      
      this.setData({
        bookingTitle: this.data.bookingTitle,
        booking: this.data.booking
      })

      this.getBookingDataByType();

    }).catch(err => {
      wx.hideLoading();
      
    })

  },

  //切换收入支出标题
  toggleBookingTitle(e) {
    if (e.currentTarget.dataset.active) {
      return;
    }

    for (let i = 0; i < this.data.bookingTitle.length; i++) {
      if (this.data.bookingTitle[i].isActive) {
        this.data.bookingTitle[i].isActive = false;
        break;
      }
    }

    this.data.bookingTitle[e.currentTarget.dataset.index].isActive = true;

    this.setData({
      bookingTitle: this.data.bookingTitle
    })

    this.getBookingDataByType();
  },

  //根据收入和支出切换数据
  getBookingDataByType() {

    this.data.bookingData = [];

    //根据收入或者支出筛选数据
    for (let i = 0; i < this.data.bookingTitle.length; i++) {
      if (this.data.bookingTitle[i].isActive) {
        let currentBookingData = this.data.booking[this.data.bookingTitle[i].type];
        for (let key in currentBookingData) {
          if (key == 'total') {
            continue;
          }
          this.data.bookingData.push(currentBookingData[key]);
        }
        break;
      }
    }

    this.setData({
      bookingData: this.data.bookingData
    })

    

    //绘制饼图
    this.drawPie(this.data.bookingData);

  },

  //绘制饼图
  drawPie(pieData) {

    

    if (pieData.length == 0) {
      
      //如果绘制的饼图数据为空，则不绘制饼图
      return;
    }

    //获取屏幕宽度
    let screenWidth = wx.getSystemInfoSync().screenWidth;
    

    new wxCharts({
      //canvas的id
      canvasId: 'pieCanvas',

      //绘制图形类型
      type: 'pie',

      //绘制图形的数据
      series: pieData,

      //绘制图形宽度
      width: screenWidth,

      //绘制图形高度
      height: 300,

      //数据标签
      dataLabel: true
    });

  },

  //跳转记账详情页面
  goDetail(e) {

    //参数序列化
    let params = '';
    for (let key in e.currentTarget.dataset) {
      params += key + '=' + e.currentTarget.dataset[key] + '&'
    }

    params = params.slice(0, -1);

    wx.navigateTo({
      url: '../detail/detail?' + params
    })
  }

})