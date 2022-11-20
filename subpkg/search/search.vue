<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar
        @input="input"
        :radius="100"
        :cancelButton="none"
        placeholder="请输入搜索内容"
      />
    </view>

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length !== 0">
      <view
        class="sugg-item"
        v-for="(item, i) in searchResults"
        :key="i"
        @click="gotoDetail(item)"
      >
        <view class="goods-name"> {{ item.goods_name }}</view>
        <uni-icons type="arrowright" size="16" />
      </view>
    </view>

    <!-- 搜索历史  -->
    <view class="history-box" v-else>
      <!-- 标题区域-->
      <view class="history-title">
        <text> 搜索历史</text>
        <uni-icons type="trash" size="17" @click="clean" />
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag
          :text="item"
          v-for="(item, i) in histories"
          :key="i"
          inverted="true"
          type="primary"
          @click="gotoGoodsList(item)"
        ></uni-tag>
      </view>
    </view>
  </view>
</template>

<script>


export default {

  data () {
    return {
      // 延时器的 timerid
      timer: null,
      // 搜索关键词
      kw: '',
      // 搜索的结果列表
      searchResults: [],
      // 搜索历史的数组
      // historyList: ['a', 'app', 'apple'],
      historyList: [],
    }
  },
  onLoad () {
    this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
  },
  methods: {
    // input 输入事件的处理函数
    input (e) {
      // console.log(e)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        // console.log(e)
        this.kw = e
        this.getSearchList()
      }, 500)
    },
    async getSearchList () {
      // 判断搜索关键词是否为空
      if (this.kw.length === 0) {
        this.searchResults = []
        return
      }
      const { data: res } = await uni.$http.get("/api/public/v1/goods/qsearch", { query: this.kw })
      if (res.meta.status !== 200) return uni.$getMsg()  // 请求失败
      // 请求成功
      this.searchResults = res.message

      // 1. 查询到搜索建议之后，调用 saveSearchHistory() 方法保存搜索关键词
      this.saveSearchHistory()
    },
    // 点击搜索建议的 Item 项，跳转到商品详情页面
    gotoDetail (item) {
      // console.log(item.goods_id)
      uni.navigateTo({
        url: `/subpkg/goods_detail/goods_detail?goods_id=${item.goods_id}`
      })
    },
    // 2. 保存搜索关键词的方法
    saveSearchHistory () {
      // 无法去重
      // this.historyList.push(this.kw)

      // 1. 将 Array 数组转化为 Set 对象
      const set = new Set(this.historyList)
      // 2. 调用 Set 对象的 delete 方法，移除对应的元素
      set.delete(this.kw)
      // 3. 调用 Set 对象的 add 方法，向 Set 中添加元素
      set.add(this.kw)
      // 4. 将 Set 对象转化为 Array 数组
      this.historyList = Array.from(set)

      // 对搜索历史进行持久化的存储
      uni.setStorageSync('kw', JSON.stringify(this.historyList))

    },
    // 清空搜索历史记录
    clean () {
      // 清空 data 中保存的搜索历史
      this.historyList = []
      // 清空本地存储中记录的搜索历史
      uni.setStorageSync('kw', '[]')
    },
    // 点击跳转到商品列表页面
    gotoGoodsList (kw) {
      uni.navigateTo({
        url: `/subpkg/goods_list/goods_list?query=${kw}`
      })
    }
  },
  computed: {
    histories () {
      // 注意：由于数组是引用类型，所以不要直接基于原数组调用 reverse 方法，以免修改原数组中元素的顺序
      // 而是应该新建一个内存无关的数组，再进行 reverse 反转
      return [...this.historyList].reverse()
    }
  }
}
</script>

<style lang="scss">
.search-box {
  position: sticky;
  top: 0;
  z-index: 999;
}
.sugg-list {
  padding: 0 5px;
  .sugg-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    padding: 13px 0;
    border-bottom: 1px solid #efefef;
    .goods-name {
      // 文字不允许换行（单行文本）
      white-space: nowrap;
      // 溢出部分隐藏
      overflow: hidden;
      // 文本溢出后，使用 ... 代替
      text-overflow: ellipsis;
    }
  }
}
.history-box {
  padding: 0 5px;
  .history-title {
    display: flex;
    justify-content: space-between;
    height: 40px;
    align-items: center;
    font-size: 13px;
    border-bottom: 1px solid #efefef;
  }
  .history-list {
    display: flex;
    flex-wrap: wrap;
    .uni-tag {
      margin-top: 5px;
      margin-right: 5px;
    }
  }
}
</style>
