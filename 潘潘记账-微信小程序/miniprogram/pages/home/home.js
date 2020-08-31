const { tools } = require("../../js/tools");

// miniprogram/pages/home/home.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {

		dateRange: {
			start: '',
			end: ''
		},

		currentDate: '',

		dateBookingData: [],

		dateMoney: {
			shouru: 0,
			zhichu: 0
		},

		monthMoney: {
			shouru: 0,
			zhichu: 0
		},

		//结余
		jieyu: {
			intNum: 0,
			decimal: 0
		},

		//是否显示骨架屏
		isLoading: true

	},

	onShow() {

		this.getCurrentDate();

		this.getBookingDataByDate(this.data.dateRange.end);

		this.getBookingDataByMonth();
	},

	//获取当前时间
	getCurrentDate() {
		//获取当前时间
		let date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		month = month >= 10 ? month : '0' + month;

		let d = date.getDate();
		d = d >= 10 ? d : '0' + d;

		this.setData({
			dateRange: {
				start: `${year}-${month}-01`,
				end: `${year}-${month}-${d}`
			},
			currentDate: `${month}月${d}日`
		})
	},

	//根据日期查询记账数据
	getBookingDataByDate(date) {
		//加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数【get_booking_data_bydate】
    wx.cloud.callFunction({
      //云函数名称
			name: 'get_booking_data_bydate',
			data:{
				date
			}
    }).then(result => {
      wx.hideLoading();
			

			this.setData({
				dateMoney: {
					shouru: 0,
					zhichu: 0
				}
			})

			result.result.data.map(v => {
				this.data.dateMoney[v.bookingType.type] += Number(v.money);
				v.money = tools.thousandthPercentile(Number(v.money).toFixed(2));
			})

			for (let key in this.data.dateMoney) {
				this.data.dateMoney[key] = tools.thousandthPercentile(this.data.dateMoney[key].toFixed(2));
			}
			
			this.setData({
				dateBookingData: result.result.data,
				dateMoney: this.data.dateMoney
			})
      
    }).catch(err => {
      wx.hideLoading();
      
    })
	},

	//选择日期
	selectDate(e) {
		
		let date = e.detail.value.split('-');

		let currentDate = `${date[1]}月${date[2]}日`;
		if (currentDate == this.data.currentDate) {
			return;
		}

		this.setData({
			currentDate
		})
		this.getBookingDataByDate(e.detail.value);
	},

	//查询当月记账数据
	getBookingDataByMonth() {
		//加载提示
    wx.showLoading({
      title: '加载中...',
      mask: true
    })

    //调用云函数【get_booking_data_bymonth】
    wx.cloud.callFunction({
      //云函数名称
			name: 'get_booking_data_bymonth',
			data: this.data.dateRange
    }).then(result => {
      wx.hideLoading();
			

			this.setData({
				monthMoney: {
					shouru: 0,
					zhichu: 0
				}
			})

			result.result.data.map(v => {
				this.data.monthMoney[v.bookingType.type] += Number(v.money);
			})

			//结余
			let jieyu = (this.data.monthMoney.shouru - this.data.monthMoney.zhichu).toFixed(2).split('.');
			this.data.jieyu.intNum = tools.thousandthPercentile(jieyu[0]);
			this.data.jieyu.decimal = jieyu[1];

			for (let key in this.data.monthMoney) {
				this.data.monthMoney[key] = tools.thousandthPercentile(this.data.monthMoney[key].toFixed(2));
			}
 
			this.setData({
				monthMoney: this.data.monthMoney,
				jieyu: this.data.jieyu,
				isLoading: false
			})
      
    }).catch(err => {
      wx.hideLoading();
      
    })
	}

})