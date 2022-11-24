<template>
  <!-- 轮播图区域 -->
  <view v-if="goods_info.goods_name" class="goods-detail-container">
    <swiper
      :indicator-dots="true"
      :autoplay="true"
      :interval="3000"
      :duration="1000"
      :circular="true"
    >
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <!-- 把当前点击的图片的索引，传递到 preview() 处理函数中 -->
        <image :src="item.pics_big" @click="preview(i)" />
      </swiper-item>
    </swiper>
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{ goods_info.goods_price }} </view>
      <!-- 商品信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品的名字 -->
        <view class="goods-name"> {{ goods_info.goods_name }} </view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray" />
          <text> 收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递:免运费</view>
    </view>
    <!-- 商品详情信息  -->
    <rich-text :nodes="goods_info.goods_introduce" />

    <!-- 商品导航组件区域 -->

    <view class="goods_nav">
      <uni-goods-nav
        :options="options"
        :fill="true"
        :button-group="buttonGroup"
        @click="onClick"
        @buttonClick="buttonClick"
      />
    </view>
  </view>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  watch: {
    // 页面首次加载完毕后，不会调用这个侦听器
    /*   total (newVal) {
        // 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
        const findResult = this.options.find(x => x.text === "购物车")
        if (findResult) {
          findResult.info = newVal
        }
      } */
    total: {
      handler (newVal) {
        // 1. 监听 total 值的变化，通过第一个形参得到变化后的新值
        const findResult = this.options.find(x => x.text === "购物车")
        if (findResult) {
          findResult.info = newVal
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      goods_info: {},
      options: [{
        icon: 'shop',
        text: '店铺',
        infoBackgroundColor: '#007aff',
        infoColor: "#f5f5f5"
      }, {
        icon: 'cart',
        text: '购物车',
        info: 0
      }],
      buttonGroup: [{
        text: '加入购物车',
        backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
        color: '#fff'
      },
      {
        text: '立即购买',
        backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
        color: '#fff'
      }
      ],
      customButtonGroup: [{
        text: '加入购物车',
        backgroundColor: 'linear-gradient(90deg, #1E83FF, #0053B8)',
        color: '#fff'
      },
      {
        text: '立即购买',
        backgroundColor: 'linear-gradient(90deg, #60F3FF, #088FEB)',
        color: '#fff'
      }
      ],
      customButtonGroup1: [{
        text: '立即购买',
        backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
        color: '#fff'
      }]
    }
  },
  computed: {
    // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
    // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
    ...mapState('m_cart', ['cart']),
    // 把 m_cart 模块中名称为 total 的 getter 映射到当前页面中使用
    ...mapGetters('m_cart', ['total'])
  },
  onLoad (options) {
    // 获取商品 Id
    const goods_id = options.goods_id
    // 调用请求商品详情数据的办法
    this.getGoodsDetail(goods_id)
  },
  methods: {
    ...mapMutations('m_cart', ['addToCart']),
    async getGoodsDetail (goods_id) {
      const { data: res } = await uni.$http.get("/api/public/v1/goods/detail", { goods_id })
      // 请求失败
      if (res.meta.status !== 200) return uni.$showMsg()

      // 使用字符串的 replace() 方法，为 img 标签添加行内的 style 样式，从而解决图片底部空白间隙的问题
      res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;"').replace(/webp/g, 'jpg')

      // 请求成功
      this.goods_info = res.message
    },
    // 实现轮播图的预览效果
    preview (i) {
      uni.previewImage({
        // 预览时，默认显示图片的索引
        current: i,
        // 所有图片 url 地址的数组
        urls: this.goods_info.pics.map(x => x.pics_big)
      })
    },
    onClick (e) {
      if (e.content.text === '购物车') {
        // swtichTab适合跳转到tabbar页面，navigateTo适合跳转到非tabBar页面
        uni.switchTab({
          url: '/pages/cart/cart',
        })

      }
    },
    buttonClick (e) {
      if (e.content.text === "加入购物车") {
        // 组织商品的信息对象
        // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
        const goods = {
          goods_id: this.goods_info.goods_id,
          goods_name: this.goods_info.goods_name,
          goods_price: this.goods_info.goods_price,
          goods_count: 1,
          goods_small_logo: this.goods_info.goods_small_logo,
          goods_state: true,

        }

        // 调用 addToCart

        this.addToCart(goods)
        /*   uni.switchTab({
            url: '/pages/cart/cart'
          }) */
      }
    }
  },

}
</script>

<style lang="scss">
swiper {
  height: 750rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.goods-info-box {
  padding: 10px;
  padding-right: 0;
  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }
  .goods-info-body {
    display: flex;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
      margin-right: 10px;
    }
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid #ccc;
      color: gray;
    }
  }
  .yf {
    font-size: 12px;
    color: gray;
    margin: 10px 0;
  }
}
.goods_nav {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.goods-detail-container {
  padding-bottom: 50px;
}
</style>
