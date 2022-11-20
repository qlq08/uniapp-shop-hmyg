
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

// 按需导入 $http 对象,导入网络请求的包
import { $http } from '@escook/request-miniprogram'
// 将按需导入的 $http 挂载到 uni 顶级对象之上，方便全局调用
uni.$http = $http

// 请求的根路径
$http.baseUrl = 'https://www.uinav.com'
// 配置请求拦截器，展示loading效果
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...'
  })
}

//配置响应拦截器,隐藏loading效果
$http.afterRequest = function () {
  uni.hideLoading()
}

// 封装弹框的方法
uni.$showMsg = function (title = '数据请求失败!', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp () {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif