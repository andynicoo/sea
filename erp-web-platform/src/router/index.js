import Vue from 'vue'
import Router from 'vue-router'
import { publicRoute } from './config'
import routers from './routers'
const routes = publicRoute.concat(routers)
import store from '@/store'
import { getQueryVariable } from '@/util'
import Cookies from 'js-cookie'

Vue.use(Router)
const router = new Router({
  mode: 'hash',
  linkActiveClass: 'active',
  routes: routes
})

// router gards
const WhiteList = [
  '/auth/register',
  '/auth/find-password',
  '/public/agreement',
  '/public/privacy'
]
// 设置当前菜单name
function setMenuName(to) {
  try {
    const path = to.path
    const menuList = store.state.vars?.menuArr || []
    let obj = menuList.find((item) => item.href === path)
    const languageObj = JSON.parse(obj?.menuI18n || null)
    const menuName = languageObj?.[Cookies.get('language')]
    store.commit('setVars', { menuName })
  } catch (error) {
    console.error(error)
  }
}
// 设置左侧菜单显示
function setLeftMenuShow(to) {
  if (to.name !== 'goodsedit' && store.state.vars?.hideLeftMenu) {
    store.commit('setVars', { hideLeftMenu: false })
  }
}
router.beforeEach((to, from, next) => {
  if (to.path.indexOf('/oms/') !== -1) {
    if (store.getters.getAccessToken === to.query.token) {
      next()
    } else {
      if (to.query.token) {
        store.commit('SET_ACCESS_TOKEN', to.query.token)
      }
      next()
    }
    return false
  }

  setMenuName(to)
  setLeftMenuShow(to, from)
  const token = store.getters.getAccessToken
  // 这里判断当前url是否有邀请码标识，需要携带防止丢失,可能是任何形式携带的
  const invitationCode =
    getQueryVariable('invitationCode') || to.query.invitationCode
  if (invitationCode) {
    sessionStorage.setItem('invitationCode', invitationCode)
  }
  // 无token并不在白名单内
  if (!token && !WhiteList.includes(to.path)) {
    if (to.name === 'login' || to.name === 'authorize') {
      next()
    } else {
      localStorage.setItem('redirectPath', to.path)
      next({ path: `/auth/login?redirect=${to.path}` })
    }
  }
  // 有token，指向登录时
  else if (token && to.name === 'login') {
    next({ path: '/overview' })
  } else {
    // if (to.path.includes('/o/')) {
    //   next('/wms-page?path=' + to.path)
    // } else {
    //   next()
    // }
    next()
  }
})

// 百度统计
router.afterEach((to, from, next) => {
  setTimeout(() => {
    //百度统计
    var _hmt = _hmt || []
    ;(function() {
      //每次执行前，先移除上次插入的代码
      document.getElementById('baidu_tj') &&
        document.getElementById('baidu_tj').remove()
      var hm = document.createElement('script')
      hm.src = 'https://hm.baidu.com/hm.js?72a2447b12c350b98d9d697d9f31c8c0'
      hm.id = 'baidu_tj'
      var s = document.getElementsByTagName('script')[0]
      s.parentNode.insertBefore(hm, s)
    })()
  }, 0)
})

router.afterEach(() => {
  window.scrollTo(0, 0)
})

/* 路由异常错误处理，尝试解析一个异步组件时发生错误，重新渲染目标页面 */
router.onError((error) => {
  const pattern = /Loading chunk (\d)+ failed/g
  const isChunkLoadFailed = error.message.match(pattern)
  const targetPath = router.history.pending.fullPath
  if (isChunkLoadFailed) {
    router.replace(targetPath)
  }
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
