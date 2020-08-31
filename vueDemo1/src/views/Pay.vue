<template>
<!-- 提交订单 -->
  <div class="pay">
    <van-nav-bar
      title="提交订单"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="back"
    />
    <!-- 选择收货地址 -->
    <div class="address-box">
      <div class="address">
        <div class="clearfix" @click="openAddressBox">
          <div class="fl address-title">选择收货地址</div>
          <div class="fl arrow-box">
            <van-icon name="arrow" class="arrow-icon" />
          </div>
        </div>
        <div class="address-content">
          <div class="clearfix">
            <div class="fl name">{{currentAddress.name}}</div>
            <div class="fl phone">{{currentAddress.tel}}</div>
          </div>
          <div class="address-info">{{currentAddress.address}}</div>
        </div>
      </div>
    </div>
    <!-- 订单详情 -->
    <div class="order-info">
      <div class="order-box">
        <div class="order-title">订单信息</div>

        <div>

          <div class="clearfix cell-box" v-for="(item, index) in shopbagData" :key="index">
            <div class="fl pro-img">
              <img class="auto-img" :src="item.small_img" alt="">
            </div>
            <div class="fl pro-info">
              <div class="text-box">
                <div class="clearfix">
                  <div class="fl text-name">{{item.name}}</div>
                  <div class="fl text-rule">{{item.rule}}</div>
                </div>
                <div class="text-enname">{{item.enname}}</div>
              </div>
              <div class="price-box">
                <div class="fl price">￥{{item.price}}</div>
                <div class="fr count">x{{item.count}}</div>
              </div>
            </div>
          </div>

        </div>
        <div class="pro-box">
          <div class="clearfix pro-boxing">
            <div class="fl pro-count">共计 {{product.count}} 件商品</div>
            <div class="fr pro-total">合计 ￥{{product.total}}</div>
          </div>
          <div class="left-box left"></div>
          <div class="left-box right"></div>
        </div>

      </div>
    </div>
    <!-- 立即结算按钮 -->
    <div class="pay-btn">
      <van-button round block color="#0C34BA" @click="pay">立即结算</van-button>
    </div>
    <!-- 选择收货的地址 -->
    <van-popup v-model="isOpen" position="bottom" closeable>
      <div class="address-title-box">选择收货地址</div>
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="默认"
        @select="selectAddress"
        @add="newAddress"
      />
    </van-popup>
  </div>
</template>

<script>
// 引入less文件和JS文件
  import '../assets/less/pay.less'
  import {utils} from '../assets/js/utils'
  export default {
    // 提交订单页面的数据
    data() {
      return {
        isOpen: false,
        chosenAddressId: '',
        //地址列表数据
        list: [],
        //选择地址数据
        currentAddress: {
          name: '',
          tel: '',
          address: ''
        },
        //购物袋数据
        shopbagData: [],

        product: {
          count: 0,
          total: 0
        },

        sids: []
      }
    },
    
    created() {
      this.sids = this.$route.query.sids.split('-');

      this.getReceiveAddress();

      this.getShopbagDataBySids();
    },

    methods: {
      //返回上一级
      back() {
        this.$router.go(-1);
      },

      openAddressBox() {
        this.isOpen = true;
      },

      //选择地址
      selectAddress(item, index) {
        this.isOpen = false;
        
        
        for (let key in this.currentAddress) {
          this.currentAddress[key] = item[key];
        }
      },

      //新增地址
      newAddress() {
        this.$router.push({name: 'NewAddress'});
      },

      //查询收货地址
      getReceiveAddress() {
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
          url: '/findAddress',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 20000) {
            
            result.data.result.map(v => {
              let address = v.province + v.city + v.county + v.addressDetail;
              this.list.push({
                id: v.aid,
                name: v.name,
                tel: v.tel,
                address,
                isDefault: Boolean(v.isDefault)
              })

              if (Boolean(v.isDefault)) {
                this.chosenAddressId = v.aid,
                this.currentAddress.name = v.name;
                this.currentAddress.tel = v.tel;
                this.currentAddress.address = address;
              }

            })
          }
          
        }).catch(err => {
          this.$toast.clear();
          
        })

      },

      //根据sids查询购物袋数据
      getShopbagDataBySids() {
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
          url: '/commitShopcart',
          params: {
            appkey: this.appkey,
            tokenString,
            sids: JSON.stringify(this.sids)
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 50000) {
            
            result.data.result.map(v => {
              this.product.count += v.count;
              this.product.total += v.count * v.price;
            })
            
            this.shopbagData = result.data.result;
 
          }
          
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //立即结算
      pay() {
        //判断是否选择地址
        if (this.chosenAddressId == '') {
          this.$toast('请选择收货地址');
          return;
        }

        //获取token字符串
        let tokenString = localStorage.getItem('CSTK');
        if (!tokenString) {
          return;
        }

        //参数序列化
        let data = utils.queryString({
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
          phone: this.currentAddress.tel,
          address: this.currentAddress.address,
          receiver: this.currentAddress.name
        })

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })

        this.axios({
          method: 'POST',
          url: '/pay',
          data
        }).then(result => {
          this.$toast.clear();
          
          this.$toast(result.data.msg);
          if (result.data.code == 60000) {
            this.$router.push({name: 'Order'});
          }
          
        }).catch(err => {
          this.$toast.clear();
          
        })
      }
    }
  }
</script>
