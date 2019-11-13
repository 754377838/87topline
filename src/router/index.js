import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  // @别名：代表src目录的绝对路径名地址(vuecli准备好的)
  // E:\Vue86-87\87\87everyday\02daypro\topline87\src\
  // index.vue文件是默认索引文件，不用设置，自动寻找
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  { path: '/home', name: 'home', component: () => import('@/views/home') }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 非登录用户，若要访问非登录页面，强制去登录
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next() // 放行
})

export default router
