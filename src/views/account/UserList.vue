// 用户列表
<template>
<div class="tdetail">
  <PageHeader :title="title"/>
  <div class="tdetail-cont">
    <div class="cont-header">
      <div class="search-view clearfix">
        <div class="search-tit">关键词搜索</div>
        <el-input class="search-input" v-model.trim="searchTxt"></el-input>
        <el-button type="primary" class="search-btn action-btn" @click="handleSearchUsr">查询</el-button>
        <el-button class="action-btn search-btn search-btn_cls" @click="handleClearSearch">清空</el-button>
      </div>
      <div class="action-view">
        <el-button icon="el-icon-plus" type="primary" class="action-btn" @click="handleSelected">{{srcInfo.doneTxt}}</el-button>
      </div>
    </div>
    <div class="cont-main">
      <div class="user-total">共 {{pager.total_cnt}} 人</div>
      <el-table
        ref="table"
        v-loading="loading"
        :data="userList[pager.which_page - 1]"
        border
        style="width: 100%"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column
          type="selection">
        </el-table-column>
        <el-table-column
          prop="sysId"
          label="系统ID">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别">
        </el-table-column>
        <el-table-column
          prop="group"
          label="组别">
        </el-table-column>
        <el-table-column
          prop="date"
          label="出生年月">
        </el-table-column>
        <el-table-column
          prop="idcard"
          label="身份证号">
        </el-table-column>
        <el-table-column
          prop="size"
          label="衣服码数">
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
</div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import usrApi from '@/model/user'
import teamApi from '@/model/team'
import gameApi from '@/model/game'
import { PAGE_SIZE, PAD_TXT, PAGE_SIZES } from '@/utils/constant'

const funcs = {}
funcs['team'] = {
  getBasicInfo (cmp) {
    teamApi.searchTeam({
      teamId: cmp.srcInfo.teamId
    }).then((res) => {
      if (res.data && res.data.ret === 0) {
        const teamInfo = res.data.info.list[0]
        cmp.title = teamInfo.name
        cmp.srcInfo.joinCode = teamInfo.joinCode
      }
    })
  },
  addUsr (cmp) {
    const userList = cmp._getSelectedItem()

    // TODO 暂不支持批量
    if (userList.length !== 1) {
      cmp.$message({
        type: 'warning',
        message: userList.length ? '暂时仅支持选择一人加入' : '还没有选择要加入的人员'
      })
      return
    }

    teamApi.addTeamForUsr({
      teamId: cmp.srcInfo.teamId,
      uid: userList[0].uid,
      joinCode: cmp.srcInfo.joinCode
    }).then((res) => {
      if (res.data && res.data.ret === 0) {
        // 加入成功
        cmp.$message({
          type: 'success',
          message: '加入成功'
        })
        cmp.$router.back()
      } else {
        return Promise.reject(new Error(res.data.retMsg))
      }
    }).catch((err) => {
      console.log(err)
      cmp.$message({
        type: 'error',
        message: '加入球队失败，稍后重试'
      })
    })
  }
}
funcs['game'] = {
  getBasicInfo (cmp) {
    gameApi.searchGame({
      gameId: cmp.srcInfo.gameId
    }).then((res) => {
      if (res.data && res.data.ret === 0) {
        const gameInfo = res.data.info.list[0]
        cmp.title = gameInfo.name
        cmp.srcInfo.passCode = gameInfo.passCode

        gameInfo.gmList.some((gm) => {
          if (gm.id === Number(cmp.srcInfo.pid) && gm.passCode) {
            cmp.srcInfo.groupPassCode = gm.passCode
            return true
          }
        })
      }
    })
  },
  addUsr (cmp) {
    const userList = cmp._getSelectedItem()

    if (!userList.length) {
      cmp.$message({
        type: 'warning',
        message: '还没有选择要加入的人员'
      })
      return
    }
    let gmList = []
    userList.forEach((usr) => {
      gmList.push({
        uidList: [usr.uid]
      })
    })

    gameApi.batchJoinGame({
      gameId: cmp.srcInfo.gameId,
      passCode: cmp.srcInfo.passCode,
      gmList
    }).then((res) => {
      if (res.data && res.data.ret === 0) {
        // 加入成功
        cmp.$message({
          type: 'success',
          message: '加入成功'
        })
        cmp.$router.back()
      } else {
        return Promise.reject(new Error(res.data.retMsg))
      }
    }).catch((err) => {
      console.log(err)
      cmp.$message({
        type: 'error',
        message: '加入比赛失败，稍后重试'
      })
    })
  }
}
funcs['group'] = {
  getBasicInfo: funcs['game'].getBasicInfo,
  addUsr (cmp) {
    const userList = cmp._getSelectedItem()

    // TODO 暂不支持批量
    if (userList.length !== 1) {
      cmp.$message({
        type: 'warning',
        message: userList.length ? '暂时仅支持选择一人加入' : '还没有选择要加入的人员'
      })
      return
    }

    const usr = userList[0]

    gameApi.joinGame({
      gameId: cmp.srcInfo.gameId,
      passCode: cmp.srcInfo.groupPassCode,
      groupId: cmp.srcInfo.pid,
      uid: usr.uid
    }).then((res) => {
      if (res.data && res.data.ret === 0) {
        // 加入成功
        cmp.$message({
          type: 'success',
          message: '加入成功'
        })
        cmp.$router.back()
      } else {
        return Promise.reject(new Error(res.data.retMsg))
      }
    }).catch((err) => {
      console.log(err)
      cmp.$message({
        type: 'error',
        message: err.toString()
      })
    })
  }
}

export default {
  name: 'UserList',
  data () {
    const { query } = this.$route
    let srcInfo = null

    if (+query.tid) {
      srcInfo = {
        type: 'team',
        teamId: query.tid,
        joinCode: '',
        doneTxt: '添加人员到球队'
      }
    } else if (+query.gid) {
      srcInfo = {
        type: '',
        gameId: query.gid,
        pid: query.pid,
        passCode: '', // game
        doneTxt: '',
        groupPassCode: '' // 组合
      }

      srcInfo.type = +query.pid ? 'group' : 'game'
      srcInfo.doneTxt = +query.pid ? '添加人员到组合' : '添加人员到比赛'
    }

    return {
      searchTxt: '',
      userList: [[]], // 二维数组
      pager: {
        page_size: PAGE_SIZE,
        total_cnt: 0,
        which_page: 1
      },
      title: '',
      loading: true,
      srcInfo: srcInfo,
      PAGE_SIZES
    }
  },
  components: {
    PageHeader
  },
  mounted () {
    this._renderUsrList()
    this._renderSrcInfo()

    // 非渲染数据
    this.__inner_data__ = {
      selectedUids: [] // 缓存选中的 uid（暂时只需要 uid，后续可缓存整条数据）
    }
  },
  methods: {
    handleSearchUsr () {
      this._renderUsrList(this.searchTxt.trim(), 1, true)
    },

    handleClearSearch () {
      this.searchTxt = ''
    },

    handleCurrPageChange (page) {
      const currList = this.userList[page - 1]

      // 没有才调接口
      if (!currList || !currList.length) {
        this._renderUsrList(this.searchText, page)
      } else {
        const table = this.$refs['table']
        currList.forEach((item) => table.toggleRowSelection(item, item.selected))
      }
    },

    handleSizeChange (pageSize) {
      this._renderUsrList(this.searchTxt, 1, true, pageSize)
    },

    handleSelect (selection, row) {
      row.selected = !row.selected
      this._cacheSelectedRow(row)
    },

    handleSelectAll (selection) {
      const currPage = this.pager.which_page
      const currTable = this.userList[currPage - 1]

      let updator = selection.length ? selection : currTable
      const selected = !!selection.length
      updator.forEach((item) => {
        item.selected = selected
        this._cacheSelectedRow(item)
      })
    },

    handleSelected () {
      funcs[this.srcInfo.type].addUsr(this)
    },

    _renderUsrList (usrName = '', page = 1, refresh = false, pageSize = this.pager.page_size) {
      this.loading = true
      usrApi.searchUser({
        searchTxt: usrName,
        page: page,
        pageSize
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          const { info = {} } = res.data
          const list = (info.list || []).map((usr, idx) => {
            // 解析内部 json 数据
            let jsonInfo = {}
            let extData = {}
            if (usr.udList) {
              jsonInfo = usr.udList.find((ud) => ud.type === 5) || {} // type 5 代表用户信息
              let strval = jsonInfo.strval
              if (strval) {
                extData = JSON.parse(strval) || {}
              }
            }

            return {
              sysId: usr.id,
              uid: jsonInfo.uid || usr.id,
              udList: usr.udList,
              infoId: jsonInfo.id,
              name: usr.name || PAD_TXT,
              tel: extData.tel || PAD_TXT, // 无【手机号】字段
              sex: extData.sex || PAD_TXT, // 无【性别】字段
              group: extData.group || PAD_TXT, // 无【组别】字段
              date: extData.date || PAD_TXT, // 无【出生年月】字段
              idcard: extData.idcard || PAD_TXT, // 无【身份证号】字段
              size: extData.size || PAD_TXT, // 无【衣服码数】字段
              selected: false // 是否选中
            }
          })
          const currPage = info.pageInfo.which_page

          if (refresh) {
            this.userList = []
            this.userList[currPage - 1] = list
          } else {
            this.$set(this.userList, currPage - 1, list)
          }

          this.pager.total_cnt = info.pageInfo.total_cnt
          this.pager.which_page = currPage
          if (pageSize) {
            this.pager.page_size = pageSize
          }

          // 修改选择状态
          if (list.length) {
            const table = this.$refs['table']
            const curr = this.userList[currPage - 1]
            curr.forEach((usr) => {
              this.$nextTick(() => {
                if (this.__inner_data__.selectedUids.indexOf(usr.uid) > -1) {
                  table.toggleRowSelection(usr, true)
                  usr.selected = true
                }
              })
            })
          }
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    },

    _renderSrcInfo () {
      this.srcInfo && funcs[this.srcInfo.type].getBasicInfo(this)
    },

    _getSelectedItem () {
      let sels = []
      this.userList.forEach((list) => {
        list.forEach((usr) => {
          usr.selected && sels.push(usr)
        })
      })

      return sels
    },

    _cacheSelectedRow (row) {
      let cacheRows = this.__inner_data__.selectedUids
      const cacheIdx = cacheRows.indexOf(row.uid)

      if (cacheIdx < 0) {
        !cacheRows.selected && cacheRows.push(row.uid)
      } else {
        !cacheRows.selected && cacheRows.splice(cacheIdx, 1)
      }
    }
  }
}
</script>

<style scoped lang="stylus">
mainColor = #0045AD   // 主色

.tdetail
  box-sizing border-box
  height 100%
  position relative

.cont-view
  height 100%

.main-veiw
  padding 0
  background #E8E8E8

.tdetail-cont
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
    margin-top 20px
    text-align left

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
  margin-top 0

.user-total
  font-size 12px
  color #595959
  line-height 28 + 12px
  text-align right

.cont-footer
  margin-top 30px
</style>
