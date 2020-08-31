import Vue from 'vue'
import { Notify } from 'vant'
// 全局注册
Vue.use(Notify)

class ValidForm {

  //验证表单
  valid(o) {
    for (let key in o) {
      if (!o[key].reg.test(o[key].value)) {
        //提示
        Notify({
          type: 'warning', 
          message: o[key].errorMsg
        })
        //验证失败
        return false;
      }
    }

    //验证通过
    return true;
  }

}

export const validForm = new ValidForm();