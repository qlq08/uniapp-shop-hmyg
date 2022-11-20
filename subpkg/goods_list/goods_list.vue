<template>
  <view class="goods-list">
    <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
      <my-goods :goods="goods"></my-goods>
    </view>
  </view>
</template>

<script>
export default {
  data () {
    return {
      // 请求参数对象
      queryObj: {
        // 查询关键词
        query: '',
        // 商品分类Id
        cid: '',
        pagenum: 1,
        // 页码值
        pagesize: 10
      },
      // 商品列表的数据
      goodsList: [],
      // 总数量，用来实现分页
      total: 0,
      // 是否正在请求数据,节流阀
      isloading: false
    }
  },
  onLoad (options) {
    this.queryObj.query = options.query || ''
    this.queryObj.cid = options.cid || ''
    // console.log(this.queryObj)

    this.getGoodsList()
  },
  methods: {
    async getGoodsList (cb) {
      // ** 打开节流阀
      this.isloading = true
      // 发网络请求，并且携带请求参数
      const { data: res } = await uni.$http.get("/api/public/v1/goods/search", this.queryObj)

      // 关闭节流阀
      this.isloading = false
      // 只要数据请求完毕，就立即按需调用 cb 回调函数
      cb && cb()

      // 请求失败
      if (res.meta.status !== 200) return uni.$showMsg()
      // 请求成功 为数据赋值
      // 老写法
      // this.goodsList = res.message.goods
      // 让旧数据和新数据进行拼接
      this.goodsList = [...this.goodsList, ...res.message.goods]
      this.total = res.message.total
    },
    // 点击跳转到商品详情页面
    gotoDetail (goods) {
      uni.navigateTo({
        url: `/subpkg/goods_detail/goods_detail?goods_id=${goods.goods_id}`
      })
    }
  },
  //  触底的事件
  onReachBottom () {

    if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg("数据加载完毕!")
    // 判断是否正在请求其它数据，如果是，则不发起额外的请求
    if (this.isloading) return
    // 让页码值自增+1
    this.queryObj.pagenum++
    // 重新获取列表数据
    this.getGoodsList()
  },
  // 下拉刷新的事件
  onPullDownRefresh () {
    //1.重置关键数据
    this.queryObj.pagenum = 1
    this.total = 0
    this.isloading = false
    this.goodsList = []

    // 重新发起数据请求
    this.getGoodsList(() => uni.stopPullDownRefresh()
    )
  },

}
</script>

<style lang="scss">
</style>
