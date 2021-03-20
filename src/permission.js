import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404']
router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (store.getters.token) {
    // 登录了
    if (to.path === '/login') {
      next('/') // 跳到首页
    } else {
      if (!store.state.user.userInfo.userId) {
        await store.dispatch('user/getUserInfo')
      }
      next() // 放行
    }
  } else {
    if (whiteList.indexOf(to.path) > -1) {
      // 在白名单
      next()
    } else {
      // 不在白名单
      next('/login')
    }
  }
  NProgress.done() // 强制关闭进度条 为了解决 手动切换地址时  进度条的不关闭的问题
})
router.afterEach(() => {
  NProgress.done() // 关闭进度条
})
