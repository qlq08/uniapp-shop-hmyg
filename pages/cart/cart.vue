<template>
  <view class="cart-container" v-if="cart.length !== 0">
    <!-- 收获地址组件  -->
    <my-address />
    <!-- 商品列表的标题区域 -->
    <view class="cart-title">
      <!-- 左侧的图标 -->
      <uni-icons type="shop" size="18" />
      <!-- 右侧的文本 -->
      <text class="cart-title-text">购物车 </text>
    </view>
    <!-- 循环渲染购物车中的商品信息 -->

    <uni-swipe-action>
      <block v-for="(goods, i) in cart" :key="i">
        <uni-swipe-action-item
          :right-options="options"
          @click="swiperItemClickHandler(goods)"
          :auto-close="autoClose"
        >
          <!-- 购物车展示数字选择框 -->
          <my-goods
            :goods="goods"
            :showRadio="true"
            @radio-change="radioChangeHandler"
            :showNum="true"
            @num-change="numberChangeHandler"
          />
        </uni-swipe-action-item>
      </block>
    </uni-swipe-action>

    <!-- 使用自定义的结算组件-->
    <my-settle />
  </view>

  <!-- 空白购物车的区域 -->
  <view class="empty-cart" v-else>
    <image class="empty-img" src="/static/cart_empty@2x.png" />
    <text class="tip-text"> 空空如也 </text>
  </view>
</template>

<script>
import badgeMix from '../../mixins/tabbar_badge'
import { mapState, mapMutations } from 'vuex'
import myGoods from '../../components/my-goods/my-goods.vue'
export default {
  components: { myGoods },
  mixins: [badgeMix],
  computed: {
    // 将 m_cart 模块中的 cart 数组映射到当前页面中使用
    ...mapState('m_cart', ['cart'])
  },
  data () {
    return {
      options: [{
        text: '删除',
        style: {
          backgroundColor: '#c00000'
        }
      }
      ]
    }
  },
  methods: {
    ...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
    // 商品的勾选状态发生了变化
    radioChangeHandler (e) {
      // console.log(e)
      this.updateGoodsState(e)
    },
    // 商品的数量发生了变化
    numberChangeHandler (e) {
      // console.log(e)
      this.updateGoodsCount(e)
    },
    // 点击了滑动操作按钮
    swiperItemClickHandler (goods) {
      // console.log(goods)
      this.removeGoodsById(goods.goods_id)
    }
  }
}
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 50px;
}
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;
  .empty-img {
    width: 90px;
    height: 90px;
  }
  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
