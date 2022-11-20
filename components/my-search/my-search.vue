<template>
  <view
    class="my-search-container"
    :style="{ 'background-color': bgcolor }"
    @click="searchBoxHandler"
  >
    <view class="my-search-box" :style="{ 'border-radius': `${radius}px` }">
      <!-- 使用 uni-ui 提供的图标组件 -->
      <uni-icons type="search" size="17"></uni-icons>
      <text class="placeholder">搜索 </text>
    </view>
  </view>
</template>

<script>
export default {
  name: "my-search",
  data () {
    return {

    }
  },
  props: {
    // 背景颜色
    bgcolor: {
      type: String,
      default: '#c00000'
    },
    // 圆角尺寸
    radius: {
      type: Number,
      default: 18   // px
    }
  },
  methods: {
    searchBoxHandler () {
      console.log('~~~')
      this.$emit('click')
    }
  }
}
</script>

<style lang="scss">
.my-search-container {
  height: 50px;
  // background-color: #c00000;
  display: flex;
  align-items: center;
  padding: 0 10px;
  .my-search-box {
    width: 100%;
    height: 36px;
    background-color: #fff;
    // 通过props 控制圆角和背景色
    // border-radius: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    .placeholder {
      font-size: 15px;
      margin-left: 5px;
    }
  }
}
</style>