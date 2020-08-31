<template>
<!-- 商品详情页面 -->
  <div class="detail">
    <van-nav-bar
      title="商品详情"
      left-text="返回"
      left-arrow
      :fixed="true"
      @click-left="back"
    />
    <div class="detail-box">
      <img class="auto-img" :src="product.large_img" alt="">
      <div class="pro-name">
        <div>{{product.name}}</div>
      </div>
    </div>
    <div class="detail-info">
      <div class="rule-box">

        <div class="rule-item clearfix" v-for="(item, index) in product.rules" :key="index">
          <div class="fl rule-item-title">{{item.title}}</div>
          <div class="fl clearfix">
            <div class="fl rule-item-tag" :class="{active: v.isActive}" v-for="(v, i) in item.rules" :key="i" @click="toggleRule(v, index)">{{v.title}}</div>
          </div>
        </div>

      </div>
      <div class="desc-box">
        <div class="desc-title">商品描述</div>
        <div class="desc-content">
          <div class="desc-text" v-for="(item, index) in product.desc" :key="index">{{index + 1}}、{{item}}</div>
        </div>
      </div>
      <div class="clearfix desc-price-count">
        <div class="fl price">￥{{product.price}}</div>
        <div class="fr count">
          <van-stepper v-model="count" theme="round" button-size="24" disable-input />
        </div>
      </div>
    </div>

    <van-goods-action>
      <van-goods-action-icon icon="bag" text="购物袋" :badge="bagCount == 0 ? '' : bagCount" color="#999" @click="goShopbag" />
      <van-goods-action-icon icon="like" text="收藏" :color="isLike ? '#0C34BA' : '#999'" @click="likeAndNotLike" />
      <van-goods-action-button
        color="#6A91EC"
        text="加入购物袋"
        @click="addShopbag"
      />
      <van-goods-action-button
        color="#0C34BA"
        text="立即购买"
        @click="buyNow"
      />
    </van-goods-action>
  </div>
</template>

<script>
// 引入less文件和JS文件
  import '../assets/less/detail.less'
  import {utils} from '../assets/js/utils'

  export default {
    // 数据存放
    data() {
      return {
        count: 0,
        pid: '',
        product: {},
        isLike: false,
        bagCount: 0
      };
    },
    
    created() {
      this.pid = this.$route.query.pid;
      //根据商品pid获取商品数据
      this.getProductByPid();

      //查询商品是否被收藏
      this.findLike();

      //查询购物袋的数目
      this.findShopbag();
    },

    methods: {

      //返回
      back() {
        this.$router.go(-1);
      },

      //回到购物袋
      goShopbag() {
        this.$router.push({name: 'Shopbag'});
      },

      //根据商品pid获取商品数据
      getProductByPid() {
        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })
        this.axios({
          method: 'GET',
          url: '/productDetail',
          //如果get请求，参数需要放在params, 如果是post请求,参数需要放在data
          params: {
            appkey: this.appkey,
            pid: this.pid
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 600) {

            //处理商品描述数据
            result.data.result[0].desc = result.data.result[0].desc.split(/\n/);

            let ruleItems = ['tem', 'sugar', 'cream', 'milk'];
            let rulesData = [];
            ruleItems.map(v => {
              if (result.data.result[0][v] == '') {
                return;
              }

              let rule = {
                title: result.data.result[0][v + '_desc'],
                rules: []
              };

              let r = result.data.result[0][v].split('/');
              r.map((value, index) => {
                let o = {
                  title: value,
                  isActive: index == 0 
                };
                rule.rules.push(o);
              })

              rulesData.push(rule);
            })

            result.data.result[0].rules = rulesData;

            this.product = result.data.result[0];
          }
        }).catch(err => {
          this.$toast.clear();
          
        })
      },

      //切换规格
      toggleRule(v, index) {
        if (v.isActive) {
          return;
        }
        let ruleData = this.product.rules[index].rules;
        for (let i = 0; i < ruleData.length; i++) {
          if (ruleData[i].isActive) {
            ruleData[i].isActive = false;
            break;
          }
        }
        v.isActive = true;
      },

      //查询商品是否被收藏
      findLike() {
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
          url: '/findlike',
          params: {
            appkey: this.appkey,
            tokenString,
            pid: this.pid
          }
        }).then(result => {
          this.$toast.clear();
          
          if (result.data.code == 1000) {
            if (result.data.result.length == 1) {
              this.isLike = true;
            }
          }
        }).catch(err => {
          this.$toast.clear();
        })
      },

      //收藏
      likeAndNotLike() {
        //获取token字符串
        let tokenString = localStorage.getItem('CSTK');
        if (!tokenString) {
          return this.$router.push({name: 'Login'});
        }

        let data = utils.queryString({
          appkey: this.appkey,
          tokenString,
          pid: this.pid
        })

        let url = this.isLike ? '/notlike' : '/like';

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
          
          if (result.data.code == 700) {
            return this.$router.push({name: 'Login'});
          }

          this.$toast(result.data.msg);

          if (result.data.code == 800) {
            this.isLike = true;
          } else if (result.data.code == 900) {
            this.isLike = false;
          }
        }).catch(err => {
          this.$toast.clear();
        })
      },

      //查询购物袋的数目
      findShopbag() {

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
          url: '/findAllShopcart',
          params: {
            appkey: this.appkey,
            tokenString
          }
        }).then(result => {
          this.$toast.clear();
          if (result.data.code == 5000) {
            this.bagCount = result.data.result.length;
          } else {
            this.$toast(result.data.msg);
          }
        }).catch(err => {
          this.$toast.clear();
        })
      },

      //加入购物袋
      addShopbag(isBuy) {
        //获取token字符串
        let tokenString = localStorage.getItem('CSTK');
        if (!tokenString) {
          return this.$router.push({name: 'Login'});
        }

        //获取选择的规格
        let rules = this.product.rules;

        // console.log('rules ==> ', rules);

        let rule = [];

        rules.map(v => {
          for (let i = 0; i < v.rules.length; i++) {
            if (v.rules[i].isActive) {
              rule.push(v.rules[i].title);
              break;
            }
          }
        })

        //序列化参数
        let data = utils.queryString({
          appkey: this.appkey,
          tokenString,
          pid: this.pid,
          count: this.count,
          rule: rule.join('/')
        })

        console.log('data ==> ', data);

        this.$toast.loading({
          message: '加载中...',
          forbidClick: true,
          duration: 0,
          loadingType: 'spinner'
        })

        this.axios({
          method: 'POST',
          url: '/addShopcart',
          data
        }).then(result => {
          this.$toast.clear();
          console.log('result ==> ', result);
          this.$toast(result.data.msg);
          if (result.data.code == 3000) {
            if (result.data.status == 1) {
              //累加徽章数量, 购物车数据，而不是购物车商品总数量
              this.bagCount++;
            }

            if (isBuy === true) {
              //立即购买
              setTimeout(() => {
                this.$router.push({name: 'Pay', query: {sids: result.data.sid}});
              }, 600)
            }
          }

         }).catch(err => {
          this.$toast.clear();
          console.log('err ==> ', err);
        })
      },

      //立即购买
      buyNow(){
        this.addShopbag(true);
      }
    }

  }
</script>
