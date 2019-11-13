import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 导入全局样式控制文件
import '@/assets/css/global.css'

// 导入element组件库
import ElementUI from 'element-ui'

// 引入axios
import axios from 'axios'
// 配置公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// 将axios通过原型继承方式配置给Vue成员
Vue.prototype.$http = axios

// 注册
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
