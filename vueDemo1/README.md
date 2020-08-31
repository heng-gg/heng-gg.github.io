```txt
安装vant
  cnpm i vant -S

安装按需导入vant组件插件
  cnpm babel-plugin-import --save-dev

在babel.config.js文件添加以下代码
  module.exports = {
    plugins: [
      ['import', {
        libraryName: 'vant',
        libraryDirectory: 'es',
        style: true
      }, 'vant']
    ]
  }

在main.js写入以下代码
  导入vant框架的组件
  import { Button } from 'vant'

  全局注册
  Vue.use(Button)

测试Button组件
  <van-button type="info">信息按钮</van-button>
```

```
配置rem, px自动转换rem

安装 postcss-pxtorem、lib-flexible插件
  cnpm i postcss-pxtorem lib-flexible --save-dev

在项目根目录创建postcss.config.js文件，写入一下内容
  module.exports = {
    plugins: {
      autoprefixer: {
        browsers: ['Android >= 4.0', 'iOS >= 8'],
      },
      'postcss-pxtorem': {
        rootValue: 37.5,
        propList: ['*']
      },
    }
  }

在main.js导入lib-flexible.js
  import 'lib-flexible/flexible'

##### 页面布局时，需要在iphone6标准屏幕进行布局，这样才可以适配所有屏幕
```


# coffeshop接口文档

```txt
邮箱正则：/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
```

```txt
配置axios
npm i axios vue-axios --save

在main.js引入
import axios from 'axios'
import VueAxios from 'vue-axios'

Vue.use(VueAxios, axios)
```

```txt
局部配置携带cookie
withCredentials 表示跨域请求时是否需要使用凭证
withCredentials: false, // 默认的

配置请求基础路径
axios.defaults.baseURL = 'http://192.168.48.131:10002'

全局配置请求时携带cookie
axios.defaults.withCredentials = true

配置请求头
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

```

```txt
vue-cookies

参考链接 https://www.jianshu.com/p/60c13168cc8f

安装
npm i vue-cookies --save

使用
import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

设置cookie
过期时间以秒为单位
this.$cookies.set(键名, 值, 过期时间)

```

```txt
  //修改底部按钮颜色
      // this.$nextTick(() => {

      //   let ele = document.querySelectorAll(".van-button--danger");
      //   let ele2 = document.querySelectorAll(".van-radio__icon");

      //   for (let i = 0; i < ele.length; i++) {
      //     ele[i].style.backgroundColor = "#1989fa";
      //     ele[i].style.border = "1px solid #1989fa";
      //   }
      // })
```

```txt
vscode 当前项目全局匹配 ctrl+shift+f

比如删除所有

?


vue-cli4 打包

1、删除路由的hisotry模式
2、保证vue项目没有任何vue抛出的警告或者错误
3、去除所有语句
4、在根目录下创建vue.config.js, 写入 module.exports = {publicPath: './'}
```

# 0C34BA 主题色
# 646566 灰色

```txt
早上6-12
下午12-18
晚上18-24
深夜24-06
```

```txt
登录怎么实现的？
登录后怎么存储数据的？（如何保持登录状态）

前后端分离， 使用token验证登录

前端后端混合，服务器生成一个session(会话), 服务器返回一个sessionId给前端，前端使用cookie将sessionId保存，后面每次访问有关于用户信息的页面，都必须携带sessionId到后台验证，如果验证通过，则允许访问，否则直接拦截

token是一个加密字符串
前端使用一个正确的账号和密码跟服务器换取一个合法token，服务器将token返回给前端，前端将token保存在cookie或者本地存储，后面每次访问有关于用户信息的页面，都必须携带token到后台验证，如果验证通过，则允许访问，否则直接拦截
```

# appkey 
```txt
  U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=
```

```txt

  注册接口
  请求地址：http://www.kangliuyong.com:10002/register
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    nickName: 昵称,
    password: 密码,
    phone: 手机号
  }

```

```txt

  登录接口
  请求地址：http://www.kangliuyong.com:10002/login
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    password: 密码,
    phone: 手机号
  }


  返回数据含有token
    token: 一个加密字符串
    token一般用于身份验证

    前端使用一个正确的账号和正确密码，向后台服务器换取一个合法token, 然后将token返回到前端，前端将token保存在cookie中，然后如果访问有关于用户个人信息的页面时，必须携带token到后台服务器验证，后台服务器验证通过，则放行，否则，则拦截操作
```

```txt
keep-alive: 保持失活的路由组件状态, 如果访问过的路由组件，则再次访问时，不会触发组件的生命周期钩子
```

```txt
  搜索商品接口
  请求地址：http://www.kangliuyong.com:10002/search
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    name: 商品关键字
  }
```

```txt

  banner接口
  请求地址：http://www.kangliuyong.com:10002/banner
  请求类型： GET
  请求参数： {
    appkey: 你的appkey
  }

```

```txt

  商品类型接口
  请求地址：http://www.kangliuyong.com:10002/type
  请求类型： GET
  请求参数： {
    appkey: 你的appkey
  }

```

```txt

  根据商品类型获取商品接口
  请求地址：http://www.kangliuyong.com:10002/typeProducts
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    key: '商品类型键名',
    value: '商品类型值'
  }

  例如查看最新推荐商品
    {
      appkey: 你的appkey,
      key: 'isHot',
      value: 1
    },

  例如查看咖啡类型商品
    {
      appkey: 你的appkey,
      key: 'type',
      value: 'coffee'
    }
```
```txt
  查看商品详情接口
  请求地址：http://www.kangliuyong.com:10002/productDetail
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    pid: 商品pid
  }
```

```txt
  收藏商品接口
  请求地址：http://www.kangliuyong.com:10002/like
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    pid: 商品pid,
    tokenString: token字符串
  }
```

```txt
  取消收藏商品接口
  请求地址：http://www.kangliuyong.com:10002/notlike
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    pid: 商品pid,
    tokenString: token字符串
  }
```

```txt
  查询收藏商品接口
  请求地址：http://www.kangliuyong.com:10002/findlike
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    pid: 商品pid,
    tokenString: token字符串
  }
```

```txt
  查询用户所有收藏商品接口
  请求地址：http://www.kangliuyong.com:10002/findAllLike
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
  }
```

```txt
  添加购物车商品接口
  请求地址：http://www.kangliuyong.com:10002/addShopcart
  请求类型： POST
  请求参数： {
    pid: 商品pid,
    count: 商品数量,
    rule: 商品规格,
    appkey: 你的appkey,
    tokenString: token字符串
  }

  其中商品rule格式为: 无糖/默认奶油,

  返回值的
    {
      msg: '',
      code: '',
      status: ''
    }

  其中status = 0, 表示修改数量
      status = 1, 添加一条新的数据
```

```txt
  查询购物车商品总数量接口
  请求地址：http://www.kangliuyong.com:10002/shopcartCount
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
  }

```

```txt
  查询用户所有购物车条数接口
  请求地址：http://www.kangliuyong.com:10002/findAllShopcart
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
  }

```

```txt
  修改购物车商品数量接口
  请求地址：http://www.kangliuyong.com:10002/modifyShopcartCount
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    sid: 购物车唯一标识,
    count: 商品数量
  }

```

```txt

  删除 一个或者多个 购物车商品接口 该接口为：逻辑删除(假删除，数据仍在数据库中，但不能查询，以便后续客服手动恢复)
  请求地址：http://www.kangliuyong.com:10002/removeShopcart
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    sids: sid购物车唯一标识集合字符串
  }

  其中 sids 值为 JSON.stringify([sid1, sid2, sid3])

```

```txt

  删除 一个或者多个 购物车商品接口 该接口为：物理删除(真删除，数据不在数据库中)
  请求地址：http://www.kangliuyong.com:10002/deleteShopcart
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    sids: sid购物车唯一标识集合字符串
  }

  其中 sids 值为 JSON.stringify([sid1, sid2, sid3])

```

```txt
  获取购物车商品条目 (不是商品总数量)
  请求地址：http://www.kangliuyong.com:10002/shopcartRows
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
  }

```

```txt
  新增地址接口
  请求地址：http://www.kangliuyong.com:10002/addAddress
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    name: 姓名,
    tel: 电话,
    province: 省份,
    city: 市,
    county: 区县,
    addressDetail: 详细地址,
    areaCode: 地区编号,
    postalCode: 邮政编码,
    isDefault: 默认地址
  }

  其中 isDefault 的值只能为 0 或者 1, ==> 0: 非默认地址, 1: 默认地址

```

```txt
  删除地址接口
  请求地址：http://www.kangliuyong.com:10002/deleteAddress
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    aid: 地址唯一标识
  }

```

```txt
  查询地址接口
  请求地址：http://www.kangliuyong.com:10002/findAddress
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
  }

```

```txt
  编辑地址接口
  请求地址：http://www.kangliuyong.com:10002/editAddress
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
    aid: 地址的唯一标识
    name: 姓名,
    tel: 电话,
    province: 省份,
    city: 市,
    county: 区县,
    addressDetail: 详细地址,
    areaCode: 地区编号,
    postalCode: 邮政编码,
    isDefault: 默认地址
  }

  其中 isDefault 的值只能为 0 或者 1, ==> 0: 非默认地址, 1: 默认地址

```

```txt
  根据地址aid查询地址接口
  请求地址：http://www.kangliuyong.com:10002/findAddressByAid
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    aid: 地址的唯一标识
  }

```
```txt
  结算页面查询需要购买商品接口
  请求地址：http://www.kangliuyong.com:10002/commitShopcart
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    sids: 购物车唯一标识集合
  }
  其中 sids 值为 JSON.stringify([sid1, sid2, sid3])
```

```txt
  立即结算接口
  请求地址：http://www.kangliuyong.com:10002/pay
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    sids: 购物车唯一标识集合,
    phone: 手机号,
    address: 收货地址,
    receiver: 收货人
  }

  其中 sids 值为 JSON.stringify([sid1, sid2, sid3])
```

```txt
  查询订单接口
  请求地址：http://www.kangliuyong.com:10002/findOrder
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    status: 订单状态
  }


  其中 status 值为 0, 1, 2 ==> 0: 全部，1: 待收货，2: 已收货
```

```txt
  确认收货接口
  请求地址：http://www.kangliuyong.com:10002/receive
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    oid: 订单oid
  }

```

```txt
  删除订单接口
  请求地址：http://www.kangliuyong.com:10002/removeOrder
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    oid: 订单oid
  }

```
```txt
  我的接口
  请求地址：http://www.kangliuyong.com:10002/findMy
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
  }

```

```txt
  账号管理接口
  请求地址：http://www.kangliuyong.com:10002/findAccountInfo
  请求类型： GET
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
  }

```

```txt
  修改昵称接口
  请求地址：http://www.kangliuyong.com:10002/updateNickName
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    nickName: 你的昵称
  }

```

```txt
  修改简介接口
  请求地址：http://www.kangliuyong.com:10002/updateDesc
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    desc: 简介
  }

```

```txt
  修改密码接口
  请求地址：http://www.kangliuyong.com:10002/updatePassword
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    password: 新密码
    oldPassword: 旧密码
  }

```

```txt
  退出登录接口
  请求地址：http://www.kangliuyong.com:10002/logout
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
  }

```

```txt
  注销账号接口
  请求地址：http://www.kangliuyong.com:10002/destroyAccount
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串
  }

```

```txt
  上传头像接口
  请求地址：http://www.kangliuyong.com:10002/updateAvatar
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    imgType: 图片类型jpg,jpeg,png.....
    serverBase64Img: 图片base64码
  }

```

```txt
  上传用户背景接口
  请求地址：http://www.kangliuyong.com:10002/updateUserBg
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    tokenString: token字符串,
    imgType: 图片类型jpg,jpeg,png.....
    serverBase64Img: 图片base64码
  }

```

```txt
  获取邮箱验证码接口
  请求地址：http://www.kangliuyong.com:10002/emailValidCode
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    email: 接收验证码邮箱
  }

```

```txt
  验证码验证接口
  请求地址：http://www.kangliuyong.com:10002/checkValidCode
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    validCode: 你的验证码
  }

```

```txt
  找回密码接口
  请求地址：http://www.kangliuyong.com:10002/retrievePassword
  请求类型： POST
  请求参数： {
    appkey: 你的appkey,
    phone: 注册时的手机号,
    password: 新密码
  }

```