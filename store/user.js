export default {
  // 开启命名空间
  namespaced: true,
  state: () => ({
    address: JSON.parse(uni.getStorageSync('address') || '{}')
  }),
  // 方法
  mutations: {
    // 更新收获地址
    updateAddress (state, address) {
      // 更新收获地址
      state.address = address

      this.commit("m_user/saveAddressToStorage")
    },
    // 持久化存储 address
    saveAddressToStorage (state) {
      uni.setStorageSync('address', JSON.stringify(state.address))
    }
  },
  // 数据包装器
  getters: {
    addstr (state) {
      // 如果不存在
      if (!state.address.provinceName) return ''

      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}