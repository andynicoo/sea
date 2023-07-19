import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
Vue.use(Router)
import Layout from '@/layout/index'
// 匹配除index.js以外所有文件
const context = require.context('./', true, /^(?!.*index\.js).*\.js$/)
const keys = context.keys()
const routesList = keys.reduce((initial, key) => {
  const module = context(key)
  // 场景比较少, 就不使用 es2015-module-commonjs 来兼容了, 直接手工处理
  return initial.concat(module instanceof Array ? module : module.default)
}, [])

const routes = [
  {
    path: '/redirect',
    name: 'redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        meta: { auth: true },
        component: () =>
          import(/* webpackChunkName: "redirect" */ '@/view/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/view/login')
  },
  {
    path: '/',
    name: 'overview',
    component: Layout,
    redirect: '/overview/index',
    children: [
      {
        path: '/overview/index',
        name: 'overview_index',
        component: () =>
          import(
            /* webpackChunkName: "overview" */ '@/view/overview/index.vue'
          ),
        meta: { title: '首页', icon: 'dashboard', affix: true }
      },
      {
        path: '/overview/analysis',
        name: 'overview_analysis',
        component: () =>
          import(
            /* webpackChunkName: "overview" */ '@/view/overview/Analysis.vue'
          ),
        meta: { title: '运营统计分析', icon: 'dashboard', affix: true }
      }
    ]
  },
  ...routesList,
  {
    path: '*',
    name: 'error',
    component: () => import(/* webpackChunkName:"error" */ '@/view/error/Error')
  }
]
const createRouter = () =>
  new Router({
    mode: 'hash',
    scrollBehavior: () => ({ y: 0 }),
    linkActiveClass: 'active',
    routes
  })

const router = createRouter()

router.beforeEach((to, from, next) => {
  const token = store.getters.getAccessToken
  store.commit('setVars', { routeName: to.name })
  if (to.name !== 'login') {
    if (token) {
      // routePush(to, from, next)
      next()
    } else {
      next({ path: '/login' })
    }
  } else {
    next()
  }
})
// eslint-disable-next-line no-unused-vars
function routePush(to, from, next) {
  console.log(to, from)
  const treeMenu = store.state.vars?.auth?.treeMenu ?? []
  const routeAuthMap = store.state.vars?.auth?.routeAuthMap ?? []
  // const auth = to.meta?.auth
  // 如果没权限重定向到菜单第一页面
  if (!routeAuthMap.includes(to.name)) {
    const [first] = treeMenu
    if (first) {
      if (first.children) {
        next({ name: first.children[0].menuCode })
      } else {
        next({ name: first.menuCode })
      }
    }
    next()
  } else {
    next()
  }
}
export default router
