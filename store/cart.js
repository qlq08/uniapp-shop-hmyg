export default {
  // 为当前模块开启命名空间
  namespaced: true,
  state: () => ({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    // cart: [],
    cart: JSON.parse(uni.getStorageSync('cart') || '[]')

  }),
  mutations: {
    addToCart (state, goods) {
      // 2. 通过数组的 find() 方法，找到购物车按钮的配置对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      if (!findResult) {
        // 如果购物车中没有这件商品，则直接 push
        state.cart.push(goods)
      } else {
        // 如果购物车中有这件商品，则只更新数量即可
        findResult.goods_count++
      }
      // 通过 commit 方法，调用 m_cart 命名空间下的 saveToStorage 方法
      this.commit("m_cart/saveToStorage")
    },
    // 将购物车中的数据持久化存储到本地
    saveToStorage (state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    // 更新购物车中商品的勾选状态
    updateGoodsState (state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)

      // 有对应的商品信息对象
      if (findResult) {
        // 更新对应商品的勾选状态
        findResult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit("m_cart/saveToStorage")
      }

    },
    // 更新商品的数量
    updateGoodsCount (state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
      // 更新对应商品的数量
      if (findResult) {  // 存在
        findResult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit("m_cart/saveToStorage")
      }
    },
    // 根据 Id删除对应的商品
    removeGoodsById (state, goods_id) {
      // 调用数组的 filter 方法进行过滤
      // 如果不相等 ，则存到数组中，过滤后的新数组只包含不被删除的数据
      state.cart = state.cart.filter(x => x.goods_id !== goods_id)

      // 持久化存储到本地
      this.commit("m_cart/saveToStorage")
    },

    // 更新购物车中所有商品的勾选状态
    updateAllGoodsState (state, newState) {
      state.cart.forEach(x => x.goods_state = newState)

      // 持久化存储到本地
      this.commit("m_cart/saveToStorage")
    }
  },
  getters: {
    // 购物车中所有商品的总数量
    total (state) {
      /*   let c = 0
        state.cart.forEach(x => c += x.goods_count)
        return c */
      return state.cart.reduce((total, item) => total += item.goods_count, 0)
    },
    // 购物车中已选商品的总数量
    checkedCount (state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    // 已勾选商品的总价格
    checkedGoodsAmount (state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) =>
        total += item.goods_count * item.goods_price
        , 0).toFixed(2)
    }
  }
}