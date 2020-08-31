const app = getApp()

const util = require('../../utils/utils.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickShow:false,
    time:'5',
    mTime:300000,
    daotime:'05:00',
    indexFuHeight:0,
    rate:'',
    timer:null,
    cateArr:[
      {
        icon:"gongzuo.png",
        text:"工作"
      },
      {
        icon:"xuexi.png",
        text:"学习"
      },
      {
        icon:"sikao.png",
        text:"思考"
      },
      {
        icon:"xiezuo.png",
        text:"写作"
      },
      {
        icon:"yundong.png",
        text:"运动"
      },
      {
        icon:"yuedu.png",
        text:"阅读"
      },
    ],
    isActive:'0',
    returnShow:false,
    pauseShow:true,
    continueShow:false,
  },
  sliderChange(e){
    // console.log(e);
    this.setData({
      time:e.detail.value
    })
  },
  // 切换任务  点击高亮
  clickEvent(e){
    // console.log(e);
    this.setData({
      isActive:e.currentTarget.dataset.index,
    })
  },
  // 点击按钮  开始专注
  clickbtn(e){
    this.setData({
      // 切换主副页面
      clickShow:true,
      // 设置时间
      mTime:this.data.time*60*1000,
      daotime:parseInt(this.data.time) >= 10 ? this.data.time+":00" : "0"+this.data.time+":00"
    })
    this.drawBg();
    this.drawBg_active();
  },
  //canvas 画圆  低圆
  drawBg(){
    let lineWidth = 10 / this.data.rate;
    let ctx = wx.createCanvasContext('progress_bg');
    ctx.setLineWidth(lineWidth);
    ctx.setStrokeStyle("#000000");
    ctx.setLineCap("round");
    ctx.beginPath();
    ctx.arc(400/this.data.rate/2,400/this.data.rate/2,400/this.data.rate/2-2*lineWidth,0,2*Math.PI,false);
    ctx.stroke();
    ctx.draw();
  },
  //canvas 画圆  动态圆
  drawBg_active(){
    let _this = this;
    let timer = setInterval(function(){
      let angle = 1.5 + 2*(_this.data.time*60*1000 - _this.data.mTime)/(_this.data.time*60*1000);
      let currentTime = _this.data.mTime - 100;
      _this.setData({
        mTime:_this.data.mTime -100,
      })
      // angle < 3.5 表示canvas画了一个圆
      if(angle < 3.5){
        // 当倒计时等于整秒时
        if(currentTime % 1000 == 0){
          var timeStr1 = currentTime / 1000;  //秒数
          var timeStr2 = parseInt(timeStr1 / 60);  //分数
          var timeStr3 = (timeStr1-timeStr2*60) >= 10 ? (timeStr1-timeStr2*60) : '0'+(timeStr1-timeStr2*60);  //格式化时间
          var timeStr2 = timeStr2 >= 10 ? timeStr2 : '0'+timeStr2;
          _this.setData({
            daotime:timeStr2+':'+timeStr3
          })
        }
        let lineWidth = 10 / _this.data.rate;
        let ctx = wx.createCanvasContext('progress_active');
        ctx.setLineWidth(lineWidth);
        ctx.setStrokeStyle("#ffffff");
        ctx.setLineCap("round");
        ctx.beginPath();
        ctx.arc(400/_this.data.rate/2,400/_this.data.rate/2,400/_this.data.rate/2-2*lineWidth,1.5*Math.PI,angle*Math.PI,false);
        ctx.stroke();
        ctx.draw();
      }else{
        // 将数据存储到微信缓存
        var logs = wx.getStorageSync('logs') || [];
        logs.unshift({
          date:util.formatTime(new Date),
          cate: _this.data.isActive,
          time: _this.data.time
        });
        wx.setStorageSync('logs', logs);

        // 设置数据
        _this.setData({
          daotime:"00:00",
          returnShow:true,
          pauseShow:false,
          continueShow:false
        })
        clearInterval(timer);
      }
    },100);
    _this.setData({
      timer:timer
    })
  },

  // 点击暂停按钮
  pause(){
    clearInterval(this.data.timer);
    this.setData({
      pauseShow:false,
      continueShow:true,
      returnShow:false,
    })
  },
  // 点击继续按钮
  continue(){
    this.drawBg_active();
    this.setData({
      pauseShow:true,
      continueShow:false,
      returnShow:false,
    })
  },
  // 点击放弃按钮
  giveUp(){
    clearInterval(this.data.timer);
    this.setData({
      pauseShow:true,
      continueShow:false,
      returnShow:false,
      clickShow:false
    })
  },
  // 点击返回按钮
  return(){
    this.setData({
      pauseShow:true,
      continueShow:false,
      returnShow:false,
      clickShow:false
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(){
    // 获取手机的相关信息
    var res = wx.getSystemInfoSync();
    var rate = 750 / res.windowWidth;
    this.setData({
      rate: rate,
      indexFuHeight: rate * res.windowHeight,
    })
  },
})