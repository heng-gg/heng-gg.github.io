<template>
<!-- 个人资料页面 -->
  <div class="account">
    <van-nav-bar
      title="个人资料"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="back"
    />

    <div class="account-bg"></div>

    <div class="list-box">
      <van-cell title="头像">
        <div class="avatar fr">
          <img class="auto-img" :src="userInfo.userImg" alt="">
          <van-uploader class="uploader-box" :after-read="uploadUserImg" />
        </div>

      </van-cell>
      <van-cell title="用户id">
        <div class="fr">{{userInfo.userId}}</div>
      </van-cell>
      <van-cell title="手机号">
        <div class="fr">{{userInfo.phone}}</div>
      </van-cell>
      <van-cell title="昵称">
        <div class="fr">
          <input class="nickname" type="text" v-model="userInfo.nickName" @change="modifyUserInfo('nickName', '/updateNickName')">
        </div>
      </van-cell>
      
      <div class="desc-box">
        <div class="desc-title">简介</div>
        <div>
          <textarea v-model="userInfo.desc" class="text-area" placeholder="这家伙很懒，什么都没有留下" @change="modifyUserInfo('desc', '/updateDesc')"></textarea>
        </div>
      </div>

    </div>

    
  </div>
</template>

<script>
// 引入less文件和JS文件
  import '../assets/less/account.less'
  import {utils} from '../assets/js/utils'

  export default {
    // 数据存放
    data() {
      return {
        userInfo: {},
        maxSize: 1 * 1024 * 1024
      };
    },

    created() {
      this.getUserInfo();
    },

    methods: {
      // 点击返回
      back() {
        this.$router.go('-1');
      },

      //获取个人资料
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
          url: '/findAccountInfo',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 'B001') {
            this.userInfo = result.data.result[0];
            
          }
          
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //上传头像
      uploadUserImg(file) {
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
          url: '/updateAvatar',
          data
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 'H001') {
            this.userInfo.userImg = result.data.userImg;
          }
          
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //修改用户信息
      modifyUserInfo(key, url) {
        //获取token字符串
        let tokenString = localStorage.getItem('CSTK');
        if (!tokenString) {
          return;
        }

        //参数序列化
        let data = utils.queryString({
          appkey: this.appkey,
          tokenString,
          [key]: this.userInfo[key]
        })

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })

        this.axios({
          method: 'POST',
          url,
          data
        }).then(result => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
          
        }).catch(err => {
          this.$toast.clear();
          
        })
      }
    }
  }
</script>
