class Tools {


  //格式化日期
  formatDate(value, format) {
    //value: 需要格式化的数据
    //format: 指定格式 yyyy-MM-dd hh:mm:ss

    // 

    let date = new Date(value);

    //获取年份
    let year = date.getFullYear();
    // 
    if (/(y+)/.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // 
      format = format.replace(content, year.toString().slice(4 - content.length));

      // 
    }

    let o = {
      M: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds()
    };

    for (let key in o) {
      //构造动态正则
      let reg = new RegExp(`(${key}+)`);
      // 
      if (reg.test(format)) {
        //获取匹配组的内容
        let content = RegExp.$1;
        // 
        let k = o[key] >= 10 ? o[key] : content.length == 2 ? '0' + o[key] : o[key];
        // 
        format = format.replace(content, k);
        // 
      }
    }

    return format;
  }


  //千分位
  thousandthPercentile(value) {
    //158124534.12
    //158124521
    //分成整数和小数
    value = value.toString().split('.');
    //整数124534
    //小数12

    // let intNum = value[0].split('');

    let nums = [];
    for (let i = value[0].length - 1; i >= 0; i -= 3) {
      // i = 6, 4, 7
      // i = 3, 1, 4
      // i = 0, -2, 1
      let index = i - 2 < 0 ? 0 : i - 2;
      nums.unshift(value[0].slice(index, i + 1));
    }

    nums = nums.join(',');

    if (value[1]) {
      nums += '.' + value[1];
    }

    // 

    return nums;


  }
}

export const tools = new Tools();