<template>
  <div class="search">
    <!-- 顶部搜索框 -->
    <form action="/" class="search-top">
      <van-search
        v-model="value"
        show-action
        placeholder="请输入搜索关键词(拿铁、瑞纳冰)"
        @input="onSearch"
        @cancel="onCancel"
      />
    </form>
    <van-skeleton class="searchfish" title :row="8" v-if="isShouFish" />
    <!-- 搜索出来的数据摆放样式 -->
    <div class="menu-product">
        <div
          class="product-list"
          :class="{'not-first': index > 0}"
          v-for="(item, index) in searchData"
          :key="index"
          @click="viewProductInfo(item.pid)"
        >
          <div class="pro-box">
            <div class="pro-img">
              <img class="auto-img" :src="item.smallImg" alt />
            </div>
            <div class="pro-info">
              <div class="pro-text fl">
                <div class="ch-name">{{item.name}}</div>
                <div class="en-name">{{item.enname}}</div>
              </div>
              <div class="pro-price fr">￥{{item.price}}</div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
// 引入less文件
import "../assets/less/search.less";
export default {
  // 搜索框数据
  data() {
    return {
      value: "",
      searchData: [],
      isShouFish:true,
    };
  },
  methods: {
    // 搜索时触发
    onSearch(val) {
      this.getAllSearchData();
    },
    // 点击取消时触发  返回上一级页面
    onCancel() {
      this.$router.go('-1');
    },

    // 获取搜索出来的数据
    getAllSearchData() {
      if(this.value == ""){
        this.isShouFish = true;
        return this.searchData = []
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      this.axios({
        method: "GET",
        url: "/search",
        params: {
          appkey: this.appkey,
          name: this.value,
        },
      })
        .then((result) => {
          this.$toast.clear();
          this.searchData = result.data.result;
          this.isShouFish = false;
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },
    //查看商品详情 跳转
    viewProductInfo(pid) {
      this.$router.push({ name: "Detail", query: { pid } });
    },
  },
};
</script>