// 头部组件
<template>
  <el-header height="44px">
    <div class="logo-view" @click="handleClickLogo">
      <span class="logo-img"></span>
      <span class="logo-name">UU体育管理后台</span>
    </div>
    <div class="acct-view">
      <template v-if="usrName">
        <span class="acct-welcome">欢迎您</span>
        <span class="acct-user">{{usrName}}</span>
        <span class="acct-logout" @click="handleLogout">退出登录</span>
      </template>
      <span v-else @click="handleLogin">请先登录</span>
    </div>
  </el-header>
</template>

<script>
import userApi from '@/model/user'
import router from '@/router/index'
import { VERSION } from '@/utils/constant'

let count = 0

export default {
  name: 'Header',
  data () {
    return {
      usrName: localStorage.getItem('usrName')
    }
  },
  methods: {
    handleClickLogo () {
      if (++count > 10) {
        this.$alert(`版本：${VERSION}`).catch((err) => console.log(err))
        count = 0
      }
    },

    handleLogin () {
      router.replace('/login')
    },

    handleLogout () {
      userApi.logout()
        .then((res) => {
          if (res.data && res.data.ret === 0) {
            localStorage.removeItem('token')
            // localStorage.removeItem('usrName')
            router.replace('/login')
          } else {
            return Promise.reject(res.data.retMsg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message({
            type: 'error',
            message: '退出登录失败，请重试'
          })
        })
    }
  }
}
</script>

<style lang="stylus">
.el-header
  background-color #0045AD
  padding 0 11px
  text-align left
  color #fff
  // font-size 0
  line-height 44px

.logo-view
  cursor pointer
  float left
  .logo-img
    display inline-block
    width 86px
    height 17px
    vertical-align middle
    background center / 86px 18px url("../assets/uu-logo.png") no-repeat
    padding-left 9px
    margin-right 11px

  .logo-name
    vertical-align middle
    font-size 16px
    padding-left 11px
    border-left 1px solid #fff
    cursor pointer
.acct-view
  float right
  font-size 12px
  .acct-welcome
    margin-right 20px

  .acct-user
    margin-right 96px
    cursor pointer

  .acct-logout
    cursor pointer
    margin-right 10px

</style>
