import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../views/Home.vue'
import Login from '../views/login/Login.vue'
import SysAccount from '../views/account/SysAccount.vue'
import GameList from '../views/game/GameList.vue'
import GameDetail from '../views/game/GameDetail.vue'
import TeamList from '../views/team/TeamList.vue'
import TeamDetail from '../views/team/TeamDetail.vue'
import AdCarousel from '../views/operation/AdCarousel.vue'
import UserList from '../views/account/UserList.vue'
// 测试 & 管理页面
import Tool from '../views/tools/Tool.vue'

Vue.use(VueRouter)

// 导航路由名称
export const navRoutes = [
  'teamlist',
  'gamelist',
  'sysaccount',
  'adcarousel'
]

// 是否为导航路由
export function isNavRoute (routeName) {
  return navRoutes.indexOf(routeName) > -1
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      isFullScreen: true // 全屏页面
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      isFullScreen: true // 全屏页面
    }
  },
  {
    path: '/sysaccount',
    name: 'sysaccount',
    component: SysAccount,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/gamelist',
    name: 'gamelist',
    component: GameList,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/gamedetail',
    name: 'gamedetail',
    component: GameDetail,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/teamlist',
    name: 'teamlist',
    component: TeamList,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/teamdetail',
    name: 'teamdetail',
    component: TeamDetail,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/adcarousel',
    name: 'adcarousel',
    component: AdCarousel,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/userlist',
    name: 'userlist',
    component: UserList,
    meta: {
      keepAlive: true
    }
  },
  {
    path: '/tool',
    name: 'tool',
    component: Tool
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL, // '/'
  routes
})

export default router
