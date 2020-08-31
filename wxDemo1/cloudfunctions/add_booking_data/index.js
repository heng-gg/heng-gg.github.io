// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

//获取数据库引用
let db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {

  // 

  try {

    return await db.collection('booking').add({
      //添加的数据, 类型object
      data: event
    })
    
  } catch (error) {
    
  }

}