// 左侧边栏组件
<template>
<el-aside width="auto">
  <el-menu
    class="menu-view"
    :default-active="activeMenu"
    background-color="#282B33"
    text-color="#ccc"
    active-text-color="#fff"
    :collapse="isCollapse"
    router
  >
    <div class="collapse-btn" @click="handleCollapse">
      <!-- <i v-bind:class="[isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold']"></i> -->
      <i class="el-icon-menu"></i>
    </div>
    <el-menu-item index="teamlist">
      <i class="el-icon-basketball"></i>
      <span slot="title">球队运动员信息</span>
    </el-menu-item>
    <el-menu-item index="gamelist">
      <i class="el-icon-trophy-1"></i>
      <span slot="title">单项赛运动员信息</span>
    </el-menu-item>
    <el-menu-item index="sysaccount">
      <i class="el-icon-user"></i>
      <span slot="title">创建系统账号</span>
    </el-menu-item>
    <el-menu-item index="adcarousel">
      <i class="el-icon-picture-outline"></i>
      <span slot="title">广告轮播图上传</span>
    </el-menu-item>
  </el-menu>
</el-aside>
</template>

<script>
import { navRoutes } from '@/router'
const whiteRouteList = navRoutes // 触发 active 的路由名称

export default {
  name: 'Aside',
  data () {
    return {
      isCollapse: false,
      activeMenu: this.$route.name
    }
  },
  watch: {
    $route: function (val) {
      const newIndex = val.name
      if (newIndex && whiteRouteList.indexOf(newIndex) >= 0 && this.activeItem !== newIndex) {
        this.activeMenu = newIndex
      }
    }
  },
  methods: {
    handleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style scoped lang="stylus">
.el-aside
  font-size 14px
  color #fff
  background-color #282B33
  text-align left

.collapse-btn
  padding-left 20px
  padding 10px 0 10px 20px
  cursor pointer
  font-size 18px

.menu-view
  // width 170px
  height 100%
  text-align left
  border none
  /deep/ .el-menu-item
    font-size 14px
</style>
