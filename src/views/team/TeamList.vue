// 球队列表
<template>
<div class="tlist">
  <PageHeader title="球队运动员信息"/>
  <div class="tlist-cont">
    <div class="cont-header">
      <div class="search-view">
        <div class="search-tit">关键词搜索</div>
        <el-input class="search-input" v-model.trim="searchText"></el-input>
        <el-button type="primary" class="search-btn action-btn" @click="handleSearchTeam">查询</el-button>
        <el-button class="action-btn search-btn search-btn_cls" @click="handleClearSearch">清空</el-button>
      </div>
      <div class="action-view">
        <el-upload
          class="uploader"
          :limit="1"
          :show-file-list="false"
          auto-upload
          accept="application/vnd.ms-excel,application/x-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :action="uploadAction"
          :on-change="handleUploaderChange">
          <el-button class="action-btn action-normal">批量导入</el-button>
        </el-upload>
        <el-button icon="el-icon-plus" type="primary" class="action-btn" @click="handleCreateTeam">创建球队</el-button>
      </div>
    </div>
    <div class="cont-main">
      <el-table v-loading="loading" :data="teamList[pager.which_page - 1] || []" border style="width: 100%">
        <el-table-column
          prop="id"
          label="球队ID">
        </el-table-column>
        <el-table-column
          prop="teamName"
          label="球队名称">
        </el-table-column>
        <el-table-column
          prop="mark"
          label="说明">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="creator"
          label="创建者">
        </el-table-column>
        <el-table-column
          prop="joinCode"
          label="暗号">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <router-link :to="{ name: 'teamdetail', query: { tid: scope.row.id } }">
              <el-button type="text" size="small">查看</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="cont-footer">
      <el-pagination
        :page-size="pager.page_size"
        :total="pager.total_cnt"
        :current-page.sync="pager.which_page"
        background
        layout="sizes,prev,pager,next,total,jumper"
        :page-sizes="PAGE_SIZES"
        @current-change="handleCurrPageChange"
        @size-change="handleSizeChange"
      >
      </el-pagination>
    </div>
  </div>
  <CreateTeamDialog :visible.sync="dialogVisible" @create-team-success="handleCreateTeamSuccess" />
</div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import CreateTeamDialog from '@/components/dialog/CreateTeamDialog'
import teamApi from '@/model/team'
import usrApi from '@/model/user'
import { dateFormat } from '@/utils/index'
import { PAGE_SIZE, PAGE_SIZES } from '@/utils/constant'
import loading from '@/utils/loading'

export default {
  name: 'TeamList',
  data () {
    return {
      searchText: '',
      teamList: [[]], // 二维数组
      pager: {
        page_size: PAGE_SIZE,
        total_cnt: 0,
        which_page: 1
      },
      loading: false,
      dialogVisible: false,
      PAGE_SIZES,
      uploadAction: teamApi.getBatchImportTeamService()
    }
  },
  components: {
    PageHeader,
    CreateTeamDialog
  },
  mounted () {
    this._renderTeamList()
  },
  beforeRouteEnter (to, from, next) {
    usrApi.isLogin() && next()
  },
  methods: {
    handleCreateTeam () {
      this.dialogVisible = true
    },

    handleSearchTeam () {
      this._renderTeamList(this.searchText.trim(), 1, true)
    },

    handleClearSearch () {
      this.searchText = ''
    },

    handleCreateTeamSuccess () {
      // 刷新下列表
      this._renderTeamList(this.searchText, this.pager.which_page, true)
    },

    handleCurrPageChange (page) {
      const currList = this.teamList[page - 1]

      // 没有才调接口
      if (!currList || !currList.length) {
        this._renderTeamList(this.searchText, page)
      }
    },

    handleSizeChange (pageSize) {
      this._renderTeamList(this.searchText, 1, true, pageSize)
    },

    handleUploaderChange (file) {
      const { status } = file

      if (status === 'ready') {
        loading.showLoading(this, {
          text: '导入中...',
          background: 'rgba(0, 0, 0, .4)'
        })
      } else if (status === 'success') {
        const res = file.response
        let fail = false

        if (res.ret !== 0) {
          console.log(file)
          fail = true
        } else {
          this._renderTeamList(this.searchText, this.pager.which_page, true)
        }

        loading.hideLoading()
        this.$message({
          type: fail ? 'error' : 'success',
          message: fail ? '导入失败，请稍后重试' : '导入成功'
        })
      } else if (status === 'fail') {
        loading.hideLoading()
        this.$message({
          type: 'error',
          message: '导入失败，请稍后重试'
        })
      }
    },

    _renderTeamList (teamName = '', page = 1, refresh = false, pageSize = this.pager.page_size) {
      this.loading = true
      teamApi.searchTeam({
        searchTxt: teamName,
        page: page,
        pageSize
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          const { info = {} } = res.data
          const list = (info.list || []).map((team, idx) => {
            return {
              id: team.id,
              teamName: team.name || '无',
              mark: team.mark || '无',
              createTime: team.regtm ? dateFormat(team.regtm, '{YYYY}-{MM}-{DD}') : '无',
              creator: team.usrCreated ? team.usrCreated.name : '无',
              joinCode: team.joinCode || '无'
            }
          })
          const currPage = info.pageInfo.which_page

          if (refresh) {
            this.teamList = []
            this.teamList[currPage - 1] = list
          } else {
            this.$set(this.teamList, currPage - 1, list)
          }

          this.pager.total_cnt = info.pageInfo.total_cnt
          this.pager.which_page = currPage
          if (pageSize) {
            this.pager.page_size = pageSize
          }
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    }
  }
}
</script>

<style scoped lang="stylus">
mainColor = #0045AD   // 主色

.tlist
  box-sizing border-box
  height 100%
  position relative

.cont-view
  height 100%

.main-veiw
  padding 0
  background #E8E8E8

.tlist-cont
  box-sizing border-box
  background-color #fff
  margin 12px
  padding 28px 36px
  border-radius 3px;
  color #262626
  font-size 12px

.cont-header
  line-height 24px
  .search-view
    float left
    .search-tit
      float left
      border 1px solid #D9D9D9
      border-radius 3px
      padding 0 48px

    .search-btn
      float left

    .search-btn_cls
      background-color #fff
      border-color #D9D9D9
    .search-btn_cls:hover
      color mainColor

    .search-input
      width 290px
      float left
      padding 0 10px

    /deep/ .el-input__inner
      height 26px

  .action-view
    float right

  .action-btn
    font-size 12px
    font-weight 400
    padding 0 13px
    line-height 24px
    background-color mainColor
    border-color mainColor

  .action-normal
    background-color #fff
    color mainColor

.cont-main
  margin-top 28 + 24px

.cont-footer
  margin-top 30px

.uploader
  display inline-block
  margin-right 14px
</style>
