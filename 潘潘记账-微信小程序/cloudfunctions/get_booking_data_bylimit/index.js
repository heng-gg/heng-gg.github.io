// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  
  try {
    //skip(偏移数据量)
    //limit(查询数据量)
    return await db.collection('booking').where({
      userInfo: event.userInfo
    }).skip(event.skip).limit(event.limit).get();
    
  } catch (error) {
    
  }

}