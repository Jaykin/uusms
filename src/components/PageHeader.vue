// 页头组件
<template>
<div class="phead-view">
  <div class="phead-title"><div class="tit">{{title}}</div></div>
  <div class="phead-action">
    <el-button icon="el-icon-refresh" class="act-refresh" @click="handleRefresh">刷新</el-button>
  </div>
</div>
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleRefresh () {
      window.location.reload()
    }
  }
}
</script>

<style scoped lang="stylus">
.phead-view
  box-sizing border-box
  width 100%
  height 42px
  line-height 42px
  font-size 14px
  color #262626
  text-align left
  background-color #fff
  padding 0 30px

.phead-title
  float left
  .tit
    display inline-block
    line-height 15px
    padding-left 6px
    border-left 2px solid #0045AD
    vertical-align middle

.phead-action
  float right
  .act-refresh
    height 22px
    padding 0
    font-size 12px
    color #0045AD
    font-weight 400
    line-height 1
    padding 5px 8px
</style>
