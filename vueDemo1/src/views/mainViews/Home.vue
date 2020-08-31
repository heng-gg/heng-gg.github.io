<template>
  <!-- 我的首页 -->
  <div class="home">
    <!-- 顶部搜索栏 -->
    <van-nav-bar :fixed="true">
      <template #left>
        <div class="home-title">
          {{timeText}}
          <span v-if="isLogin">,{{userInfo.nickName}}</span>
        </div>
      </template>
      <template #right>
        <van-search shape="round" placeholder="请输入商品名称" @focus="onfocus"/>
      </template>
    </van-nav-bar>
    <!-- 搜索栏结束 -->

    <!-- 轮播图层 -->
    <div class="home-banner">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#0C34BA">
        <van-swipe-item
          v-for="(item,index) in bannerData"
          :key="index"
          @click="viewProductInfo(item.pid)"
        >
          <img class="auto-img" :src="item.bannerImg" alt />
        </van-swipe-item>
      </van-swipe>
    </div>
    <!-- 轮播层结束 -->

    <!-- 内容上浮层 -->
    <div class="hot-product">
      <!-- hello层 -->
      <div class="home-hello">
        <div class="home-helloOne" @click="clickno">
          <img src="../../assets/images/btnLeft.png" alt />
        </div>
        <div class="home-helloTow" @click="clickno">
          <img src="../../assets/images/btnRight.png" alt />
        </div>
      </div>
      <!-- 彩虹屁 -->
      <div class="home-Rainbow">
        <span>{{rainbow}}</span>
      </div>

      <!-- 账户应用栏目 -->
      <div class="home-body">
        <div class="home-bodyA" @click="clickno" v-for="(item,index) in imgData" :key="index">
          <div class="home-body-img">
            <img :src="item.img" alt />
          </div>
          <span>{{item.title}}</span>
        </div>
      </div>

      <!-- 热门推荐层 -->
      <div class="hot-product-title">热门推荐</div>
      <div class="product-box clearfix">
        <div
          class="product-item"
          :class="[index %2 == 0 ? 'p-left' : 'p-right']"
          v-for="(item,index) in hotProducts"
          :key="index"
          @click="viewProductInfo(item.pid)"
        >
          <div class="p-img">
            <img class="auto-img" :src="item.smallImg" alt />
          </div>
          <div class="pro-name one-text">{{item.name}}</div>
          <div class="pro-price">￥{{item.price}}</div>
        </div>
      </div>
    </div>
    <!-- 热门推荐层结束 -->
  </div>
</template>

<script>
// 引入less文件和JS文件
import "../../assets/less/home.less";
export default {
  name: "Home",
  // 数据存放
  data() {
    return {
      timeText: "",
      bannerData: [],
      hotProducts: [],
      value: "",
      rainbow: "",
      imgData: [
        {
          img: require("../../assets/images/money.png"),
          title: "咖啡钱包",
        },
        {
          img: require("../../assets/images/gift.png"),
          title: "送Ta咖啡",
        },
        {
          img: require("../../assets/images/number.png"),
          title: "企业账户",
        },
        {
          img: require("../../assets/images/music.png"),
          title: "联系客服",
        },
      ],
      isLogin: false,
      userInfo: {},
    };
  },

  created() {
    //数据渲染前提前调用数据
    this.getTime();
    this.getRainbow();
    this.getbannerData();
    this.getHotProducts();
    this.getUserInfo();
  },

  methods: {
    // 搜索框获取焦点跳转  搜索框
    onfocus() {
      this.$router.push({ name: "Search" });
    },

    //获取时间段
    getTime() {
      let hours = new Date().getHours();
      if (hours >= 6 && hours < 12) {
        this.timeText = "早上好";
      } else if (hours >= 12 && hours < 18) {
        this.timeText = "下午好";
      } else if (hours >= 18 && hours < 24) {
        this.timeText = "晚上好";
      } else {
        this.timeText = "深夜啦";
      }
    },

    // 未开发的模块
    clickno() {
      this.$toast("暂未开发~");
    },

    // 获取今日份的彩虹屁
    getRainbow() {
      // 使用Promise封装Ajax
      class Ajax {
        // GET请求
        get(url) {
          return new Promise((resolved, rejected) => {
            // 创建Ajax对象
            let xhr = new XMLHttpRequest();

            // 监听Ajax的状态变化
            xhr.onreadystatechange = function () {
              if (this.readyState == 4 && this.status == 200) {
                // 凝固结果
                resolved(this.responseText);
              }
            };

            // 建立服务器
            xhr.open("GET", url, true);

            // 发送请求
            xhr.send();
          });
        }
      }

      let ajax1 = new Ajax();
      ajax1
        .get(
          "http://api.tianapi.com/txapi/saylove/index?key=f8077fa6e14a463ab55e510b8844368e"
        )
        .then((result) => {
          result = JSON.parse(result);
          this.rainbow = result.newslist[0].content;
        });
    },

    //获取banner
    getbannerData() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/banner",
        //如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
        params: {
          appkey: this.appkey,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //
          if (result.data.code == 300) {
            this.bannerData = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    //获取推荐商品数据
    getHotProducts() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/typeProducts",
        //如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((result) => {
          this.$toast.clear();
          //
          if (result.data.code == 500) {
            this.hotProducts = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
          //
        });
    },

    //获取推荐商品数据
    getHotProducts() {
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });
      this.axios({
        method: "GET",
        url: "/typeProducts",
        //如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == 500) {
            this.hotProducts = result.data.result;
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    //查看商品详情  轮播图和热门推荐皆可
    viewProductInfo(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },

    //获取用户信息
    getUserInfo() {
      //获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();

          if (result.data.code == "A001") {
            if (result.data.result.length > 0) {
              this.isLogin = true;
              this.userInfo = result.data.result[0];
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
  },
};
</script>