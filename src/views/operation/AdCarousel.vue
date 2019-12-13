// 运营 - 广告轮播图管理
<template>
<div class="ad-imgs">
  <PageHeader title="广告轮播图上传"/>
  <div class="ad-cont">
    <div class="ad-header">
      <el-upload
        class="uploader"
        :show-file-list="false"
        auto-upload
        :accept="imgMimes"
        :action="uploadAction"
        :on-change="handleUploaderChange">
        <el-button icon="el-icon-plus" type="primary" class="btn-normal">上传图片</el-button>
      </el-upload>
      <span class="img-tips">请上传尺寸为 750x300 像素的图片,否则会被截取</span>
    </div>
    <div class="img-wrapper">
      <div class="ad-img" v-for="(img, index) in imgList" v-bind:key="index" :data-id="img.id" :data-seqno="img.seqno">
        <el-radio v-model="selected" :label="index" class="img-radio"></el-radio>
        <el-image style="width: 225px; height: 90px" :src="img.url" fit="cover" :preview-src-list="[img.url]">
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline"></i>
          </div>
        </el-image>
      </div>
    </div>

    <div class="ad-footer">
      <el-button type="danger" class="btn-normal btn-del" @click="handleDelImg">删除</el-button>
    </div>
  </div>
</div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import usrApi from '@/model/user'
import operateApi from '@/model/operate'
// import { PAGE_SIZE } from '@/utils/constant'
import loading from '@/utils/loading'

export default {
  name: 'AdCarousel',
  components: {
    PageHeader
  },
  data () {
    return {
      selected: 0,
      imgList: [],
      pager: {
        page_size: 100,
        total_cnt: 0,
        which_page: 1
      },
      // 暂时只支持上传小程序支持的图片类型 https://developers.weixin.qq.com/miniprogram/dev/component/image.html
      imgMimes: 'image/jpeg,image/png,image/svg+xml,image/webp',
      uploadAction: operateApi.getUploadCommFsService()
    }
  },
  mounted () {
    this._renderAdList()
  },
  beforeRouteEnter (to, from, next) {
    usrApi.isLogin() && next()
  },
  methods: {
    handleUploaderChange (file) {
      const { status } = file

      if (status === 'ready') {
        loading.showLoading(this, {
          text: '上传中...',
          background: 'rgba(0, 0, 0, .4)'
        })
      } else if (status === 'success') {
        const res = file.response
        let fail = false

        if (res.ret !== 0) {
          console.log(file)
          fail = true
        } else {
          this._renderAdList()
        }

        loading.hideLoading()
        this.$message({
          type: fail ? 'error' : 'success',
          message: fail ? '上传失败，请稍后重试' : '上传成功'
        })
      } else if (status === 'fail') {
        loading.hideLoading()
        this.$message({
          type: 'error',
          message: '上传失败，请稍后重试'
        })
      }
    },

    handleDelImg () {
      this.$confirm('确认删除已选图片', {
        type: 'warning',
        confirmButtonText: '确认'
      }).then(() => {
        this._delImg(this.selected)
      }).catch((err) => {
        console.log(err)
      })
    },

    _renderAdList (page = 1, pageSize = this.pager.page_size) {
      this.loading = true
      operateApi.searchCommFs({
        page: page,
        pageSize
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          const { info = {} } = res.data
          const list = info.list.map((img) => {
            return {
              id: img.id,
              url: img.url,
              seqno: img.seqno
            }
          })

          this.imgList = list
          // 修改上传图片所需的 seqno
          this.uploadAction = operateApi.getUploadCommFsService({
            seqno: list[list.length - 1].seqno + 1
          })
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    },

    _delImg (imgIdx) {
      const imgId = this.imgList[imgIdx].id
      operateApi.delCommFs({
        imgId
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.imgList.splice(imgIdx, 1)
        } else {
          return Promise.reject(new Error(res.data.retMsg))
        }
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'error',
          message: err.toString()
        })
      })
    }
  }
}
</script>

<style scoped lang="stylus">
.ad-imgs
  box-sizing border-box
  height 100%
  position relative

.cont-view
  height 100%

.main-veiw
  padding 0
  background #E8E8E8

.ad-cont
  box-sizing border-box
  background-color #fff
  margin 12px
  padding 28px 36px
  border-radius 3px;
  color #262626
  font-size 12px
  text-align left
  .ad-img
    position relative
    display inline-block
    width 225px
    height 90px
    // background-color #ccc
    margin 11px 15px

  .ad-header
    padding-left 15px

  .img-wrapper
    padding 20px 0

  .img-radio
    position absolute
    top 6px
    left 6px
    z-index 10
    /deep/ .el-radio__label
      display none
    /deep/ .el-radio__inner:hover
      border-color #F56C6C

  .img-radio.is-checked
    /deep/ .el-radio__inner
      border-color #F56C6C
      background #F56C6C

  .uploader
    display inline-block

  .btn-normal
    font-size 12px
    font-weight 400
    padding 0 13px
    line-height 24px

  .img-tips
    display inline-block
    padding-left 24px
    color #0045AD
    vertical-align bottom

  .ad-footer
    display flex
    justify-content flex-end
</style>
