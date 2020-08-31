const util = require('../../utils/utils.js')

Page({
  data: {
    logs: [],
    activeIndex:0,
    dayList:[],
    list:[],
    sum:[
      {
        title:'今日潘潘次数',
        val:'0'
      },
      {
        title:'累计潘潘次数',
        val:'0'
      },
      {
        title:'今日专注时长',
        val:'0分钟'
      },
      {
        title:'累计专注时长',
        val:'0分钟'
      }
    ],
    cateArr:[
      {
        icon: 'work',
        text: '工作'
      },
      {
        icon: 'study',
        text: '学习'
      },
      {
        icon: 'think',
        text: '思考'
      },
      {
        icon: 'write',
        text: '写作'
      },
      {
        icon: 'sport',
        text: '运动'
      },
      {
        icon: 'read',
        text: '阅读'
      }
    ],
  },
  onShow() {
    // 获取本地存储
    var logs = wx.getStorageSync('logs') || [];
    var day = 0;
    var total = logs.length;
    var dayTime = 0;
    var totalTime = 0;
    var dayList = [];
    // 如果本地存储有数据
    if(logs.length > 0){
      for(var i = 0;i < logs.length;i++){
        if(logs[i].date.substr(0,10) == util.formatTime(new Date).substr(0,10)){
          day = day + 1;
          dayTime = dayTime + parseInt(logs[i].time);
          dayList.push(logs[i]);
          this.setData({
            dayList:dayList,
            list:dayList
          })
        }
        totalTime = totalTime + parseInt(logs[i].time);
      }
      this.setData({
        'sum[0].val':day,
        'sum[1].val':total,
        'sum[2].val':dayTime+'分钟',
        'sum[3].val':totalTime+'分钟'
      })
    }
  },
  // 点击按钮切换分类统计
  changeType(e){
    var index = e.currentTarget.dataset.index;
    if(index == 0){
      this.setData({
        list:this.data.dayList
      })
    }else if(index == 1){
      var logs = wx.getStorageSync('logs') || [];
      this.setData({
        list:logs
      })
    }
    this.setData({
      activeIndex:index
    })
  }
})
