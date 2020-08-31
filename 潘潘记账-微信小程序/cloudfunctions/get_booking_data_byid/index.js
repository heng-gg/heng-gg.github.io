// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

let db = cloud.database();

let _ = db.command;

// 云函数入口函数
exports.main = async (event, context) => {
  
  let _id = event.ids.split('-');

  try {
    return await db.collection('booking').where({
      userInfo: event.userInfo,
      _id: _.in(_id)
    }).get();
  } catch (error) {
    consolr.log('error ==> ', error)
  }
}