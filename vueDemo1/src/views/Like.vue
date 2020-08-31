<template>
  <!-- 我的收藏页面 -->
  <div class="like">
    <van-nav-bar title="我的收藏" left-text="返回" left-arrow :fixed="true" @click-left="back" />
    <div class="like-bg"></div>
    <div class="like-box">
      <div class="product-box clearfix" v-if="likeData.length > 0">
        <div
          class="product-item fl"
          :class="[index % 2 == 0 ? 'p-left' : 'p-right']"
          v-for="(item, index) in likeData"
          :key="index"
        >
          <div class="p-img" @click="viewProductInfo(item.pid)">
            <img class="auto-img" :src="item.smallImg" alt />
          </div>
          <div class="pro-name one-text">{{item.name}}</div>
          <div class="clearfix">
            <div class="pro-price fl">￥{{item.price}}</div>
            <div class="pro-remove fr" @click="removeLike(item.pid, index)">
              <van-icon name="delete" />
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <van-empty description="收藏商品空空如也，去逛一逛!">
          <van-button round color="#0C34BA" class="bottom-button" @click="goMenu">
            去逛一逛
          </van-button>
        </van-empty>
      </div>
    </div>
  </div>
</template>

<script>
// 引入less文件和JS文件
import "../assets/less/like.less";
import {utils} from '../assets/js/utils'

export default {
  data() {
    return {
      //我的收藏商品数据
      likeData: [],
    };
  },

  created() {
    this.getAllLikeData();
  },

  methods: {
    // 点击去逛逛  跳转菜单页面
    goMenu() {
      return this.$router.push({name: 'Menu'});
    },
    // 点击返回   跳转上一级
    back() {
      this.$router.go(-1);
    },

    //获取我的收藏商品数据
    getAllLikeData() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/findAllLike",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 2000) {
            this.likeData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    //查看商品详情
    viewProductInfo(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },

    //删除收藏商品数据
    removeLike(pid, index) {
      //pid: 商品id
      //index: 下标

      //获取token字符串
        let tokenString = localStorage.getItem('CSTK');
        if (!tokenString) {
          return this.$router.push({name: 'Login'});
        }

        let data = utils.queryString({
          appkey: this.appkey,
          tokenString,
          pid
        })

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })

        this.axios({
          method: 'POST',
          url: '/notlike',
          data
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 700) {
            return this.$router.push({name: 'Login'});
          }

          if (result.data.code == 900) {
            this.likeData.splice(index, 1);
            this.$toast('删除收藏商品成功');

          } else {
            this.$toast('删除收藏商品失败');
          }

        }).catch(err => {
          this.$toast.clear();
          
        })
    }
  }
};
</script>