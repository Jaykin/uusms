<template>
  <div class='home'></div>
</template>

<script>
import usrApi from '@/model/user'

export default {
  name: 'Home',
  mounted () {
    // const loading = this.$loading({
    //   lock: true,
    //   text: '系统载入中',
    //   spinner: 'el-icon-loading',
    //   background: 'rgba(0, 0, 0, 0.3)',
    //   customClass: 'loading'
    // })

    this.$router.replace(usrApi.isLogin() ? '/teamlist' : '/login')
    // loading.close()
  }
}
</script>
