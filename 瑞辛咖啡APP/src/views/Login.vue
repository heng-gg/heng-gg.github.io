<template>
<!-- 登录页面 -->
  <div class="login">
    <!-- 顶部导航栏 -->
    <van-nav-bar class="login-top">
      <template #left>
        <div class="login-img"></div>
        <div class="login-test">Luckin Coffee</div>
      </template>
      <template #right>
        <div class="login-return" @click="onclick">首页</div>
      </template>
    </van-nav-bar>
    <!-- 导航栏结束 -->

    <!-- 中间的欢迎回来层 -->
    <div class="login-welcome">
      <h1>欢迎回来!</h1>
      <p>
        Please login to your
        <br />accounts
      </p>
    </div>
    <!-- 欢迎回来层结束 -->

    <!-- 输入账号密码框 -->
    <!-- 输入账号 -->
    <van-form class="login-ipt">
      <!-- <van-cell-group> -->
      <van-field class="login-ipts" label="手机号" placeholder="手机号" v-model="userLoginInfo.phone" />
      <!-- 输入密码 -->

      <van-field
        class="login-ipts"
        label="密码"
        placeholder="密码"
        :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
        v-model="userLoginInfo.password"
        :type="isPassword ? 'password' : 'test'"
        @click-right-icon="viewPassword"
      />

      <!-- 忘记密码? -->
      <div class="login-forget">
        <span @click="loginForgot">忘记密码?</span>
      </div>
      <!-- 登录 -->
      <div style="margin: 16px;">
        <van-button class="login-submit" @click="register" round block type="info">登&nbsp;&nbsp;录</van-button>
      </div>
      <!-- 注册 -->
      <div style="margin: 16px;">
        <van-button
          class="van-button--normal van-button--block van-button--round"
          is-link
          @click="showPopup"
          type="default"
        >注&nbsp;&nbsp;册</van-button>
        <van-popup
          class="login-register"
          v-model="show"
          position="bottom"
          round
          :style="{ height: '60%'}"
        >
          <p>注册</p>
          <!-- 输入昵称 -->
          <van-field
            class="login-registers"
            label="昵称"
            placeholder="请输入昵称2~8位"
            v-model="userLoginRegisters.nickName"
          />
          <!-- 输入手机号码 -->
          <van-field
            class="login-registers"
            label="手机号"
            placeholder="手机号 中国(+86)"
            v-model="userLoginRegisters.phone"
          />
          <!-- 输入设置的密码 -->
          <van-field
            class="login-registers"
            label="密码"
            placeholder="密码(8~16位)"
            v-model="userLoginRegisters.password"
            :right-icon="isPasswordRegisters ? 'closed-eye' : 'eye-o'"
            :type="isPasswordRegisters ? 'password' : 'test'"
            @click-right-icon="viewPasswordRegisters"
          />
          <!-- 注册 -->
          <div class="login-skip" style="margin: 16px;">
            <van-button round block type="info" @click="loginRegisters">注册</van-button>
          </div>
        </van-popup>
      </div>
    </van-form>
    <!-- 输入账号密码框结束 -->
  </div>
</template>


<script>
// 引入less文件和JS文件
import "../assets/less/login.less";
import {utils} from '../assets/js/utils'
export default {
  // 数据存放
  data() {
    return {
      userLoginInfo: {
        // 登录手机号码  // 登录密码
        phone: "",
        password: "",
      },
      // 注册页面的手机号和密码
      userLoginRegisters: {
        nickName: "",
        phone: "",
        password: "",
      },
      // 用于判断密码是否显示
      isPassword: true,
      isPasswordRegisters: true,
      // 用于判断弹框是否弹出
      show: false,
    };
  },
  methods: {
    // 点击去首页
    onclick() {
      this.$router.push({name:"Home"});
    },
    // 显示登录界面的密码显示
    viewPassword() {
      this.isPassword = !this.isPassword;
    },

    // 点击忘记密码
    loginForgot(){
      this.$router.push({name:"Forgot"});
    },
    // 点击登录
    register() {
      let userInfo = this.userLoginInfo;
     
      // 判断手机号吗格式是否正确
      if (!/^1[3456789]\d{9}$/.test(this.userLoginInfo.phone)) {
        this.$notify("手机号码格式错误");
        return ;
      }
       // 判断密码的格式是否正确
      if (!/^[A-Za-z]\w{7,15}$/.test(this.userLoginInfo.password)) {
        this.$notify("密码格式错误");
        return ;
      }
      // 正则判断成功后  登录成功
      //验证通过
      this.$toast.loading({
        message: '加载中...',
        forbidClick: true,
        duration: 0,
        loadingType: 'spinner'
      })

      //复制userInfo
      let info = Object.assign({}, userInfo);
      info.appkey = this.appkey;

      //参数序列化
      let data = utils.queryString(info);

      this.axios({
        method: 'POST',
        url: '/login',
        data
      }).then(result => {
        this.$toast.clear();
        
        if (result.data.code == 200) {
          localStorage.setItem('CSTK', result.data.token);
          this.$router.push({name: 'Home'});
        } else {
          this.$notify({
            type: 'warning', 
            message: result.data.msg
          })
        }
      }).catch(err => {
        this.$toast.clear();

      })
      
    },
    // 显示注册界面的密码显示
    viewPasswordRegisters() {
      this.isPasswordRegisters = !this.isPasswordRegisters;
    },
    // 点击注册后上弹注册界面
    showPopup() {
      this.show = true;
    },
    // 判断注册是否满足正则   手机号11位,密码8~16位,密码
    loginRegisters() {

      let userInfo = this.userLoginRegisters;

      // 判断昵称格式是否正确
      if (
        !/^[\u0391-\uFFE5A-Za-z0-9]{2,8}$/.test(
          this.userLoginRegisters.nickName
        )
      ) {
        this.$notify("昵称格式错误");
        return;
      }

      // 判断手机号吗格式是否正确
      if (!/^1[3456789]\d{9}$/.test(this.userLoginRegisters.phone)) {
        this.$notify("手机号码格式错误");
        return;
      }

      // 判断密码的格式是否正确
      if (!/^[A-Za-z]\w{7,15}$/.test(this.userLoginRegisters.password)) {
        this.$notify("密码格式错误");
        return;
      }
      //发起请求
      //开启加载提示
      this.$toast.loading({
        message: '加载中...',
        //防止穿透
        forbidClick: true,

        //显示时间, 如果时间为0，则不会自动关闭
        duration: 0,

        loadingType: 'spinner'
      })

      //序列化参数
      //复制对象
      let info = Object.assign({}, userInfo);
      info.appkey = this.appkey;
      let data = utils.queryString(info);

      this.axios({
        method: 'POST',
        //请求参数
        url: '/register',
        data
      }).then(result => {
        //关闭加载提示
        this.$toast.clear();

        //如果注册成功
        if (result.data.code == 100) {
          this.isRegister = false;
          //清空注册表单的数据
          for (let key in userInfo) {
            userInfo[key] = '';
          }
        } else {
          //如果注册失败,则提示
          this.$notify({
            type: 'warning', 
            message: result.data.msg
          })
        }
      }).catch(err => {
         this.$toast.clear();
        
      })
    },
  },
};
</script>