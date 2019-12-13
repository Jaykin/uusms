<template>
  <div id="app">
    <router-view v-if="$route.meta.isFullScreen"></router-view>
    <el-container v-else direction="vertical">
      <Header />
      <el-container>
        <Aside />
        <el-main>
          <keep-alive :include="includes">
            <router-view />
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Aside from '@/components/Aside'

export default {
  name: 'App',
  data () {
    return {
      includes: []
    }
  },
  components: {
    Header,
    Aside
  },
  watch: {
    $route: function (val, oldVal) {
      // const cName = oldVal.name.charAt(0).toUpperCase() + oldVal.name.slice(1)
      // let newIncs = []
      // this.includes.forEach((inc) => {
      //   if (inc === cName) {
      //     oldVal.meta.keepAlive && newIncs.push(inc)
      //   } else {
      //     newIncs.push(inc)
      //   }
      // })
      // this.includes = newIncs
      // console.log(this.includes)
    }
  }
}
</script>

<style lang="stylus">
html, body
  height 100%
  background #282B33

body, p
  margin 0
  padding 0

#app {
  font-family: Microsoft YaHei, 'Avenir', Helvetica, Arial, sans-serif;
  text-align: center;
  background-color: #fff;
  height: 100%;
  min-width: 1000px;
}

// 保证 el-main 滑动
.el-container {
  height 100%
  overflow auto
}

.el-main
  background-color #E8E8E8
  padding 0 !important

.el-table
  text-align center
.el-table td, .el-table th
  text-align center !important
  padding 4px 0 !important

.clearfix
  zoom 1
.clearfix:after
  content ""
  display block
  height 0
  clear both

</style>
