<template>
  <!-- 地址管理页面 -->
  <div class="my-address">
    <van-nav-bar title="地址管理" left-text="返回" left-arrow @click-left="back" :fixed="true" />
    <van-address-list
      v-model="chosenAddressId"
      :list="list"
      default-tag-text="默认"
      @add="newAddress"
      @edit="editAddress"
    />
  </div>
</template>

<script>
// 引入less文件和JS文件
import "../assets/less/address.less";
export default {
  // 数据存放区
  data() {
    return {
      //选择地址的ID
      chosenAddressId: "",
      //地址列表数据
      list: [],
    };
  },

  created() {
    //查询收货地址
    this.getReceiveAddress();
  },

  methods: {
    //点击返回  跳转上一级
    back() {
      this.$router.go(-1);
    },

    // 查询收货地址
    getReceiveAddress() {
      // 获取token字符串
      let tokenString = localStorage.getItem("CSTK");
      if (!tokenString) {
        return;
      }
      // 开启加载中图标
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
        loadingType: "spinner",
      });

      //   获取数据
      this.axios({
        method: "GET",
        url: "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((result) => {
          this.$toast.clear();
          
          if (result.data.code == 20000) {
            result.data.result.map((v) => {
              let address = v.province + v.city + v.county + v.addressDetail;
              this.list.push({
                id: v.aid,
                name: v.name,
                tel: v.tel,
                address,
                isDefault: Boolean(v.isDefault),
              });
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          
        });
    },

    // 新增收货地址
    newAddress(){
        this.$router.push({name:"NewAddress"});
    },

    //编辑地址
    editAddress(item){
        this.$router.push({name:"NewAddress",query:{aid:item.id}});
    }
  },
};
</script>