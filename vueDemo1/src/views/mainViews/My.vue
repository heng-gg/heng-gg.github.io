<template>
<!-- 我的页面 -->
  <div class="my">
    <div class="my-bg" :style="{backgroundImage: `url(${userInfo.userBg})`}">
      <van-uploader v-if="isLogin" class="uploader-box" :after-read="upload" />
    </div>
    <div class="my-content">

      <div class="my-boxing">

        <div v-if="isLogin" class="my-box">
          <div class="my-img">
            <div class="img-box" :style="{borderColor:vipColor}">
              <img class="auto-img"  :src="userInfo.userImg" alt="">
            </div>
            <div class="my-info">
              <div class="nickname">{{userInfo.nickName}} <span class="nickvip" :style="{backgroundColor:vipColor}" @click="onvipName">{{vipname}}</span> </div>
              <van-popup v-model="shouvipName" class="shouvipName">
                <button @click="onButton(item.vipname,item.color)" v-for="(item,index) in vipNameList" :key="index" class="vipButton">{{item.vipname}}</button>
              </van-popup>
              <div class="desc">{{userInfo.desc == '' ? '这个家伙很懒，什么都没留下' : userInfo.desc}}</div>
            </div>
          </div>
        </div>
        <div class="not-login" v-else>
          <span @click="goLogin">点击登录</span> 
        </div>

        <div class="lists">
          <van-cell :title="item.title" :to="item.to" size="large" is-link v-for="(item, index) in lists" :key="index" />
        </div>
      </div>
    </div>
    <!-- 广告区域 -->
    <div class="myGG" v-if="isShow">
      <img src="../../assets/images/shopbag_bg.png" alt="">
      <span @click="myshow">X</span>
    </div>
  </div>
</template>

<script>
// 引入less文件和JS文件
  import '../../assets/less/my.less'
  import {utils} from '../../assets/js/utils'
  export default {
    // 数据存放
    data() {
      return {
        lists: [
          {title: '个人资料', to: {name: 'Account'}},
          {title: '我的订单', to: {name: 'Order'}},
          {title: '我的收藏', to: {name: 'Like'}},
          {title: '收货地址', to: {name: 'Address'}},
          {title: '安全中心', to: {name: 'Secure'}}
        ],
        isLogin: false,
        isShow: true,
        vipname:"黄金会员",
        vipColor:"goldenrod",
        vipNameList:[
          {vipname:"普通会员",color:"#dddddd"},
          {vipname:"黄金会员",color:"goldenrod"},
          {vipname:"铂金会员",color:"palegoldenrod"},
          {vipname:"至尊会员",color:"#0C34BA"},
        ],
        shouvipName:false,
        userInfo: {

        },
        maxSize: 1 * 1024 * 1024
      };
    },

    created() {
      this.getUserInfo();
    },

    methods: {
      // 点击登录
      goLogin() {
        this.$router.push({name: 'Login'});
      },

      //点击会员标签
      onvipName(){
        this.shouvipName = true;
      },

      // 选择会员等级
      onButton(name,color){
        this.vipname = name;
        this.vipColor = color;
        this.shouvipName = false;
      },

      //查询用户信息
      getUserInfo() {
        //获取token字符串
        let tokenString = localStorage.getItem('CSTK');
        if (!tokenString) {
          return;
        }

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })

        this.axios({
          method: 'GET',
          url: '/findMy',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 'A001') {
          
            if (result.data.result.length > 0) {
              this.isLogin = true;
              this.userInfo = result.data.result[0];

            }
            
          }
          
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //上传背景
      upload(file) {

        //获取token字符串
        let tokenString = localStorage.getItem('CSTK');
        if (!tokenString) {
          return;
        }

        //获取文件类型
        let type = file.file.type.split('/')[1];
        let imgTypes = ['png', 'gif', 'jpg', 'jpeg'];
        if (imgTypes.indexOf(type) === -1) {
          this.$notify({
            message: '图片类型只支持' + imgTypes.join(','),
            color: '#fff',
            background: '#0C34BA',
          });

          return
        }

        //大小
        if (this.maxSize < file.file.size) {
          this.$notify({
            message: '上传文件大小不能超过' + this.maxSize / 1024 + 'KB',
            color: '#fff',
            background: '#0C34BA',
          });
          return;
        }

        // 

        //获取base64
        let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64,/, '');

        //参数序列化
        let data = utils.queryString({
          appkey: this.appkey,
          tokenString,
          imgType: type,
          serverBase64Img: base64
        })

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })

        this.axios({
          method: 'POST',
          url: '/updateUserBg',
          data
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 'I001') {
            this.userInfo.userBg = result.data.userBg;
          }
          
        }).catch(err => {
          this.$toast.clear();
          
        })

      },

      // 去除广告
      myshow(){
        this.isShow = false;
      }
    }
  }
</script>