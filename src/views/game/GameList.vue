// 赛事列表
<template>
<div class="tlist">
  <PageHeader title="单项赛运动员信息"/>
  <div class="tlist-cont">
    <div class="cont-header">
      <div class="search-view">
        <div class="search-tit">关键词搜索</div>
        <el-input class="search-input" v-model.trim="searchText"></el-input>
        <el-button type="primary" class="search-btn action-btn" @click="handleSearchGame">查询</el-button>
        <el-button class="action-btn search-btn search-btn_cls" @click="handleClearSearch">清空</el-button>
      </div>
    </div>
    <div class="cont-main">
      <el-table
        v-loading="loading"
        :data="gameList[pager.which_page - 1] || []"
        border
        style="width: 100%">
        <el-table-column
          prop="gameId"
          label="比赛ID">
        </el-table-column>
        <el-table-column
          prop="gameName"
          label="赛事名称">
        </el-table-column>
        <el-table-column
          prop="statusTxt"
          label="状态">
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
          prop="passCode"
          label="比赛暗号">
          <template slot-scope="scope">
            <span>{{scope.row.passCode || PAD_TXT}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gameType"
          label="比赛类型">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <router-link v-if="scope.row.isSingle" :to="{ name: 'gamedetail', query: { gid: scope.row.gameId } }">
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
  <CreateTeamDialog :visible.sync="dialogVisible" />
</div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import CreateTeamDialog from '@/components/dialog/CreateTeamDialog.vue'
import gameApi from '@/model/game'
import { dateFormat } from '@/utils/index'
import { PAGE_SIZE, PAD_TXT, PAGE_SIZES } from '@/utils/constant'

const STATUS_TXT = {
  '1': '报名中',
  '2': '报名截止',
  '3': '已有赛程',
  '4': '比赛中',
  '5': '比赛结束'
}

export default {
  name: 'TeamList',
  data () {
    return {
      searchText: '',
      gameList: [[]],
      pager: {
        page_size: PAGE_SIZE,
        total_cnt: 0,
        which_page: 1
      },
      loading: false,
      dialogVisible: false,
      PAD_TXT,
      PAGE_SIZES
    }
  },
  components: {
    PageHeader,
    CreateTeamDialog
  },
  mounted () {
    this._renderGameList()
  },
  methods: {
    handleCreateTeam () {
      this.dialogVisible = true
    },

    handleSearchGame () {
      this._renderGameList(this.searchText.trim(), 1, true)
    },

    handleClearSearch () {
      this.searchText = ''
    },

    handleCurrPageChange (page) {
      const currList = this.gameList[page - 1]

      // 没有才调接口
      if (!currList || !currList.length) {
        this._renderGameList(this.searchText, page)
      }
    },

    handleSizeChange (pageSize) {
      this._renderGameList(this.searchTxt, 1, true, pageSize)
    },

    _renderGameList (gameName = '', page = 1, refresh = false, pageSize = this.pager.page_size) {
      this.loading = true
      gameApi.searchGame({
        searchTxt: gameName,
        page: page,
        pageSize
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          const { info = {} } = res.data
          const list = (info.list || []).map((game, idx) => {
            let isSingle = false
            let singleGamePlayerNum = 0
            let playerStr = ''

            game.gsList.some((gs) => {
              if (gs.type === 1) {
                isSingle = gs.valInt === 2 // 单项赛
              } else if (gs.type === 6) {
                singleGamePlayerNum = isSingle ? gs.valInt3 : 0 // 单项赛选手数
                playerStr = isSingle ? gs.valStr : '' // 比赛项目
                return true
              }
            })

            return {
              gameId: game.id,
              gameName: game.name,
              status: game.status,
              statusTxt: STATUS_TXT[game.status] || game.status,
              createTime: dateFormat(game.createTm, '{YYYY}-{MM}-{DD}'),
              creator: game.usrName,
              passCode: game.passCode,
              gameType: isSingle ? '单项/' + playerStr : '团队',
              isSingle,
              playerNum: singleGamePlayerNum // 比赛人数：单人、双人、三人
            }
          })
          const currPage = info.pageInfo.which_page

          if (refresh) {
            this.gameList = []
            this.gameList[currPage - 1] = list
          } else {
            this.$set(this.gameList, currPage - 1, list)
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

.cont-main
  margin-top 28 + 24px

.cont-footer
  margin-top 30px
</style>
