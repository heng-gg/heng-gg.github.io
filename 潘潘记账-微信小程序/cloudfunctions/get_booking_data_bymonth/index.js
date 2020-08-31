// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

let db = cloud.database({
  env: cloud.DYNAMIC_CURRENT_ENV
});

//获取查询指令引用
let _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  // 

  try {
    return await db.collection('booking').where({
      userInfo: event.userInfo,
      date: _.gte(event.start).and(_.lte(event.end))
    }).get();
  } catch (error) {
    
  }
}