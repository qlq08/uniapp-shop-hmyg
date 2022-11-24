<template>
  <view class="goods-item">
    <!-- 商品左侧的图片区域   -->
    <view class="goods-item-left">
      <radio
        :checked="goods.goods_state"
        color="#c00000"
        v-if="showRadio"
        @click="radioClickHandler"
      />
      <image :src="goods.goods_small_logo || defaultPic" class="goods-pic" />
    </view>

    <!-- 右侧的盒子 -->
    <view class="goods-item-right">
      <!-- 商品名称 -->
      <view class="goods-name"> {{ goods.goods_name }}</view>
      <view class="goods-info-box">
        <view class="goods-price">￥{{ goods.goods_price | tofixed() }} </view>
        <!-- 数字选择框 -->
        <uni-number-box
          :min="1"
          :value="goods.goods_count"
          v-if="showNum"
          @change="numChangeHandler"
        />
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "my-goods",
  props: {
    goods: {
      type: Object,
      default: {}
    },
    // 是否展示单选框
    showRadio: {
      type: Boolean,
      default: false
    },
    // 是否展示 number-box组件
    showNum: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      // 默认的图片
      defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
    }
  },
  filters: {
    tofixed (num) {
      return Number(num).toFixed(2)
    }
  },
  methods: {
    // radio组件的 点击事件
    radioClickHandler () {
      this.$emit("radio-change", {
        goods_id: this.goods.goods_id,
        // 拿到单选框最新的状态
        goods_state: !this.goods.goods_state
      })
    },
    // 监听到了 NumberBox 组件数量变化的事件
    numChangeHandler (val) {
      this.$emit("num-change", {
        goods_id: this.goods.goods_id,
        goods_count: +val
      })
    }

  }
}
</script>

<style lang="scss">
.goods-item {
  width: 750rpx;
  box-sizing: border-box;
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;
  .goods-item-left {
    margin-right: 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }
  .goods-item-right {
    display: flex;
    // 占满剩余区域
    flex: 1;
    flex-direction: column;
    justify-content: space-between;
    .goods-name {
      font-size: 13px;
    }
    .goods-info-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .goods-price {
        color: #c00000;
        font-size: 16px;
      }
    }
  }
}
</style>