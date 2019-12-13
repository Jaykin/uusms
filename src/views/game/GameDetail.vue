// 赛事详情 - 单/双/三人
<template>
<div class="tdetail">
  <PageHeader :title="title"/>
  <div class="tdetail-cont">
    <div class="cont-header">
      <div class="search-view clearfix">
        <div class="search-tit">关键词搜索</div>
        <el-input class="search-input" v-model.trim="searchTxt"></el-input>
        <el-button type="primary" class="search-btn action-btn" @click="handleSearchGameUsr">查询</el-button>
        <el-button class="action-btn search-btn search-btn_cls" @click="handleClearSearch">清空</el-button>
      </div>
      <div class="action-view">
        <el-button v-if="playerNum" icon="el-icon-plus" type="primary" class="action-btn" @click="handleCreatAction">{{ playerNum > 1 ? '创建组合' : '添加人员'}}</el-button>
        <!-- <el-button class="action-btn action-normal">删除</el-button> -->
        <el-button class="action-btn action-normal" @click="handleExportUsr">批量导出</el-button>
      </div>
    </div>
    <div class="cont-main">
      <div class="user-total">共 {{pager.total_cnt}} {{playerNum > 1 ? '队' : '人'}}</div>
      <el-table
        ref="table"
        row-key="rowKey"
        v-loading="loading"
        :data="userList[pager.which_page - 1] || []"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        default-expand-all
        border
        style="width: 100%"
        :indent="4"
        @select="handleSelect"
        @select-all="handleSelectAll"
      >
        <el-table-column
          type="selection"
          :selectable="filterCheckbox">
        </el-table-column>
        <el-table-column
          v-if="playerNum === 1"
          prop="sysId"
          label="系统ID">
        </el-table-column>
        <el-table-column
          v-if="playerNum > 1"
          prop="groupName"
          label="组合名称">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
          <template slot="header">
            <span>姓名</span>
            <div class="label-required">(必填)</div>
          </template>
          <template slot-scope="scope">
            <el-button v-if="scope.row.status >= 2" type="primary" class="action-btn" @click="handleAddUsrForGroup(scope.row)">添加人员</el-button>
            <span v-else-if="scope.row.status == 1">{{scope.row.name || PAD_TXT}}</span>
            <el-input v-else v-model.trim="scope.row.name" placeholder="填写姓名"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别">
          <template slot="header">
            <span>性别</span>
            <div class="label-required">(必填)</div>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.status == 1 ? scope.row.sex || PAD_TXT : ''}}</span>
            <el-input v-else v-model.trim="scope.row.sex" placeholder="填写性别"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="date"
          label="出生年月">
          <template slot="header">
            <span>出生年月</span>
            <div class="label-required">(必填)</div>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.status == 1 ? scope.row.date || PAD_TXT : ''}}</span>
            <el-input v-else v-model.trim="scope.row.date" placeholder="填写出生年月"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="tel"
          label="手机号">
          <template slot="header">
            <span>手机号</span>
            <div class="label-required">(必填)</div>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.status == 1 ? scope.row.tel || PAD_TXT : ''}}</span>
            <el-input v-else v-model.trim="scope.row.tel" placeholder="请输入手机号" maxlength="11"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="group"
          label="组别">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.status == 1 ? scope.row.group || PAD_TXT : ''}}</span>
            <el-input v-else v-model.trim="scope.row.group" placeholder="填写组别"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="idcard"
          label="身份证号">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.status == 1 ? scope.row.idcard || PAD_TXT : ''}}</span>
            <el-input v-else v-model.trim="scope.row.idcard" placeholder="填写身份证号"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          label="衣服码数">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.status == 1 ? scope.row.size || PAD_TXT : ''}}</span>
            <el-input v-else v-model.trim="scope.row.size" placeholder="填写码数"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          prop="status">
          <template slot-scope="scope">
            <template v-if="scope.row.status == 1">
              <el-button type="text" size="small" @click="handleUsrAction(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="handleUsrAction(scope.row, { del: true })">删除</el-button>
            </template>
            <template v-else-if="scope.row.status == 0">
              <el-button type="text" size="small" @click="handleUsrAction(scope.row)">确定</el-button>
              <el-button type="text" size="small" @click="handleUsrAction(scope.row, { cancel: true })">取消</el-button>
            </template>
            <template v-else-if="scope.row.status == 3">
              <el-button type="text" size="small" @click="handleUsrAction(scope.row, { del: true })">删除</el-button>
            </template>
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
  <CreateGroupDialog
    :visible.sync="dialogVisible"
    :gameInfo="{ gameId: gameId }"
    @create-group-success="handleCreateGroupSuccess"
  />
</div>
</template>

<script>
import PageHeader from '@/components/PageHeader.vue'
import CreateGroupDialog from '@/components/dialog/CreateGroupDialog.vue'
import gameApi from '@/model/game'
import usrApi from '@/model/user'
import { validateUsrCell } from '@/utils/validator'
import { PAGE_SIZE, PAD_TXT, PAGE_SIZES } from '@/utils/constant'
import loading from '@/utils/loading'

export default {
  name: 'GameDetail',
  data () {
    const gameId = this.$route.query.gid || 0

    return {
      userList: [[]],
      pager: {
        page_size: PAGE_SIZE,
        total_cnt: 0,
        which_page: 1,
        total: 0 // total 缓存
      },
      searchTxt: '',
      title: '',
      loading: true,
      PAD_TXT,
      gameId,
      playerNum: 0,
      dialogVisible: false,
      PAGE_SIZES
    }
  },
  components: {
    PageHeader,
    CreateGroupDialog
  },
  mounted () {
    if (this.gameId) {
      this._renderGameUsrList()
    } else {
      this.$message({
        type: 'warning',
        message: '无效的比赛'
      })
    }

    // 非渲染数据
    this.__inner_data__ = {
      cachedUsrList: {}, // 缓存用户编辑前数据
      cachedJoinInfo: {} // 缓存每项的 jsonInfo
    }
  },
  methods: {
    handleSearchGameUsr () {
      this.searchTxt
        ? this._renderAllUsrForSearch()
        : this._renderGameUsrList(this.searchTxt, 1, true)
    },

    handleClearSearch () {
      this.searchTxt = ''
      this._renderGameUsrList(this.searchTxt, 1, true)
    },

    handleCreatAction () {
      if (this.playerNum > 1) {
        // 创建组合
        this.dialogVisible = true
      } else {
        // 添加人员
        this._addPlayer()
      }
    },

    handleAddUsrForGroup (row) {
      this._addPlayer(row.groupId)
    },

    // 添加人员
    _addPlayer (pid) {
      this.$router.push(`/userlist?gid=${this.gameId}&pid=${pid || 0}`)
    },

    handleCreateGroupSuccess () {
      // 刷新下列表
      this.searchTxt
        ? this._renderAllUsrForSearch(this.pager.total + 1)
        : this._renderGameUsrList(this.searchTxt, this.pager.which_page, true)
    },

    handleCurrPageChange (page) {
      const currList = this.userList[page - 1]

      // 没有才调接口
      if (!currList || !currList.length) {
        this._renderGameUsrList(this.searchTxt, page)
      } else {
        const table = this.$refs['table']
        currList.forEach((item) => table.toggleRowSelection(item, item.selected))
      }
    },

    handleSizeChange (pageSize) {
      this.searchTxt
        ? this._renderAllUsrForSearch(this.this.pager.total, pageSize)
        : this._renderGameUsrList(this.searchTxt, 1, true, pageSize)
    },

    handleSelect (selection, row) {
      row.selected = !row.selected
    },

    handleSelectAll (selection) {
      const currPage = this.pager.which_page
      const currTable = this.userList[currPage - 1]

      let updator = selection.length ? selection : currTable
      const selected = !!selection.length
      updator.forEach((item) => {
        item.selected = selected
      })
    },

    /**
     * opt.cancel - 取消
     * opt.del - 删除
    */
    handleUsrAction (row, opt = {}) {
      const { cachedUsrList } = this.__inner_data__
      const currPage = this.pager.which_page
      if (opt.cancel) {
        // 点击【取消】
        // 注意使用 splice 更新
        if (row.children) {
          this.userList[currPage - 1].splice(row.seq, 1, JSON.parse(cachedUsrList[currPage][row.rowKey]))
        } else {
          this.userList[currPage - 1][row.seq].children.splice(row.cSeq, 1, JSON.parse(cachedUsrList[currPage][row.rowKey]))
        }
        // row.status = 1
      } else if (opt.del) {
        // 点击删除
        const isEmptyGroup = row.status === 3
        const delTips = isEmptyGroup
          ? `确认删除组合` // 删除空组合
          : `确认删除人员${row.children && row.children[0].status === 2 ? ', 同时该组合也会被删除' : ''}` // 删除组合人员
        this.$confirm(delTips, {
          type: 'warning',
          confirmButtonText: '确认'
        }).then(() => {
          this._delGameUsr(row, isEmptyGroup)
        }).catch((err) => {
          console.log(err)
        })
      } else if (row.status === 1) {
        // 点击【修改】
        if (cachedUsrList[currPage]) {
          cachedUsrList[currPage][row.rowKey] = JSON.stringify(row)
        } else {
          cachedUsrList[currPage] = {
            [row.rowKey]: JSON.stringify(row)
          }
        }
        row.status = 0
      } else {
        // 点击【确定】
        if (validateUsrCell(row)) {
          this._updateGameUsr(row)
        }
      }
    },

    handleExportUsr () {
      loading.showLoading(this, {
        text: '导出中...'
      })
      usrApi.exportGameUsr({
        gameId: this.gameId
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          loading.hideLoading()
          this.$message({
            type: 'success',
            message: '导出成功'
          })
        } else {
          throw new Error(res.data.retMsg)
        }
      }).catch((err) => {
        console.error(err)
        loading.hideLoading()
        this.$message({
          type: 'error',
          message: err.toString()
        })
      })
    },

    filterCheckbox (row, index) {
      return this.playerNum > 1 ? !!row.groupName : true
    },

    _fetchGameUsrList ({ usrName = '', page = 1, pageSize = 0, success }) {
      this.loading = true
      gameApi.searchGameUsr({
        gameId: this.gameId,
        searchTxt: usrName,
        page: page,
        pageSize
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          success && success(res.data.info)
        }
        this.loading = false
      }).catch((err) => {
        console.log(err)
        this.loading = false
      })
    },

    _renderGameUsrList (usrName = '', page = 1, refresh = false, pageSize = this.pager.page_size) {
      const _this = this
      this._fetchGameUsrList({
        usrName,
        page,
        pageSize,
        success (info) {
          if (!info.list || !info.list.length) {
            _this._fetchGameDetail()
          }

          const list = _this._assembleUsrList(info.list)
          const currPage = info.pageInfo.which_page

          if (refresh) {
            _this.userList = []
            _this.userList[currPage - 1] = list
          } else {
            _this.$set(_this.userList, currPage - 1, list)
          }
          _this.pager.total_cnt = info.pageInfo.total_cnt
          _this.pager.total = info.pageInfo.total_cnt
          _this.pager.which_page = currPage
          if (pageSize) {
            _this.pager.page_size = pageSize
          }
        }
      })
    },

    _updateGameUsr (usrInfo) {
      let joinInfo = this.__inner_data__.cachedJoinInfo[usrInfo.sysId]
      const currInfo = {
        tel: usrInfo.tel || '', // 【手机号】字段
        sex: usrInfo.sex || '', // 【性别】字段
        group: usrInfo.group || '', // 【组别】字段
        date: usrInfo.date || '', // 【出生年月】字段
        idcard: usrInfo.idcard || '', // 【身份证号】字段
        size: usrInfo.size || '' // 【衣服码数】字段
      }
      let hasJoinInfo = false

      if (joinInfo) {
        joinInfo = JSON.parse(joinInfo).map((info) => {
          if (info.uid === usrInfo.uid) {
            hasJoinInfo = true
            info.strval = JSON.stringify(currInfo)
          }

          return info
        })
      } else {
        joinInfo = []
      }

      if (!hasJoinInfo) {
        joinInfo.push({
          uid: usrInfo.uid,
          strval: JSON.stringify(currInfo)
        })
      }

      gameApi.updateGameUsr({
        gmId: usrInfo.sysId, // 参赛列表 ID
        jsonInfo: joinInfo
      }).then((res) => {
        if (res && res.data && res.data.ret === 0) {
          return usrApi.updateUsrName({
            uid: usrInfo.uid,
            usrName: usrInfo.name
          })
        } else {
          return Promise.reject(res.data.retMsg)
        }
      }).then((res) => {
        if (res && res.data && res.data.ret === 0) {
          this.$message({
            type: 'success',
            message: '用户信息修改成功'
          })

          if (this.playerNum > 1) {
            // 刷新列表（同一人可能在多个组合中）
            this.searchTxt
              ? this._renderAllUsrForSearch()
              : this._renderGameUsrList(this.searchTxt, this.pager.which_page, true)
          } else {
            // 更新列表项
            usrInfo.status = 1
            // this.$set(this.userList, `${this.pager.which_page}[${usrInfo.seq - 1}]`, usrInfo)
          }
        } else {
          return Promise.reject(res.data.retMsg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'error',
          message: err.toString()
        })
      })
    },

    _assembleUsrList (list = []) {
      return list.length ? list.map((usr, index) => {
        let playerNum = 1 // 比赛人数

        usr.game.gsList.some((gs) => {
          if (gs.type === 6) {
            playerNum = gs.valInt3
            return true
          }
        })

        if (!this.title) {
          this.title = usr.game.name
        }

        if (!this.playerNum) {
          this.playerNum = playerNum
        }

        // 解析内部 json 数据
        let joinInfo = {}
        this.__inner_data__.cachedJoinInfo[usr.id] = usr.joinInfo // 缓存 joinInfo
        if (usr.joinInfo) {
          const joinArr = JSON.parse(usr.joinInfo) || []
          joinArr.forEach((item) => {
            let strval = item.strval ? JSON.parse(item.strval) : {}
            joinInfo[item.uid] = typeof strval === 'object' ? strval : {}
            joinInfo[item.uid].id = item.id
          })
        }

        // 组装前端数据
        let ret = {}
        usr.playerList.forEach((player, idx) => {
          let extData = joinInfo[player.uid] || {}
          let item = {
            cSeq: idx - 1, // 子序号,playerList 包含父，故需要减一
            seq: index, // 父序号
            rowKey: `${usr.id}_${player.uid}_${idx}`,
            groupId: usr.id,
            sysId: usr.id,
            uid: player.uid,
            name: player.uName || '无',
            playerNum,
            tel: extData.tel || '', // 【手机号】字段
            sex: extData.sex || '', // 【性别】字段
            group: extData.group || '', // 【组别】字段
            date: extData.date || '', // 【出生年月】字段
            idcard: extData.idcard || '', // 【身份证号】字段
            size: extData.size || '', // 【衣服码数】字段
            extId: extData.id, // 关联 joinInfo，更新球员信息时用
            status: 1, // 0-编辑中 1-完成 2-空数据
            selected: false // 是否选中
          }

          if (idx === 0) {
            item.children = []
            item.groupName = playerNum > 1 ? usr.name || '无' : ''
            ret = item
          } else {
            ret.children.push(item)
          }
        })
        // 填充空数据项
        const rNum = playerNum - (ret.children ? ret.children.length + 1 : 0)
        if (rNum) {
          (new Array(rNum).fill(1)).forEach((v, i) => {
            if (!ret.children) {
              ret = {
                rowKey: `${usr.id}-${i}`,
                groupName: playerNum > 1 ? usr.name || '无' : '',
                groupId: usr.id,
                status: 3,
                children: []
              }
            } else {
              ret.children.push({
                rowKey: `${usr.id}-${i}`,
                groupId: usr.id,
                status: 2
              })
            }
          })
        }
        return ret
      }) : list
    },

    // 删除参赛人员/组合
    _delGameUsr (info, isGroup) {
      const promise = isGroup
        ? gameApi.delGameMember({ id: info.groupId }) // 参赛 ID
        : gameApi.delGameUsr({ gmId: info.groupId, uid: info.uid }) // 如果组合内只有一人，删除该人员的话也会自动删除组合

      promise.then((res) => {
        if (res.data && res.data.ret === 0) {
          // 删除成功
          this.searchTxt
            ? this._renderAllUsrForSearch()
            : this._renderGameUsrList(this.searchTxt, this.pager.which_page, true)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
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
    },

    _renderAllUsrForSearch (total = 0, pageSize) {
      const _this = this
      const endIdx = pageSize

      this._fetchGameUsrList({
        teamId: this.teamId,
        page: 1,
        pageSize: total || this.pager.total,
        success (info) {
          const list = _this._assembleUsrList(info.list)
          let userList = [] // 二维数组
          let total = 0
          let i1 = -1 // userList 一维索引
          let i2 = -1 // userList 二维索引

          list.forEach((usr) => {
            // 姓名搜索
            if (_this._validateUsrForSearch(usr)) {
              if (++i2 % endIdx === 0) {
                userList[++i1] = []
              }
              usr.seq = userList[i1].length
              userList[i1].push(usr)
              total++
            }
          })
          _this.userList = userList
          _this.pager.total_cnt = total
          _this.pager.which_page = 1
          if (pageSize) {
            _this.pager.page_size = pageSize
          }
        }
      })
    },

    _fetchGameDetail () {
      gameApi.searchGame({
        gameId: this.gameId
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          const gameInfo = res.data.info.list[0]
          let playerNum = 1 // 比赛人数

          gameInfo.gsList.some((gs) => {
            if (gs.type === 6) {
              playerNum = gs.valInt3 // 单项赛选手数
              return true
            }
          })

          if (!this.title) {
            this.title = gameInfo.name
          }

          if (!this.playerNum) {
            this.playerNum = playerNum
          }
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
    },

    _validateUsrForSearch (usr) {
      const sTxt = this.searchTxt || ''
      let valid = false

      if (
        (usr.name && usr.name.indexOf(sTxt) >= 0) ||
        (usr.groupName && usr.groupName.indexOf(sTxt) >= 0)
      ) {
        return true
      }

      if (usr.children) {
        valid = usr.children.some((child) => child.name && child.name.indexOf(sTxt) >= 0)
      }

      return valid
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

.action-btn
  font-size 12px
  font-weight 400
  padding 0 13px
  line-height 24px
  background-color mainColor
  border-color mainColor

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

  .action-normal
    background-color #fff
    color mainColor

.cont-main
  margin-top 0
  /deep/ .el-checkbox.is-disabled
    display none

.user-total
  font-size 12px
  color #595959
  line-height 28 + 12px
  text-align right

.cont-footer
  margin-top 30px

.label-required
  display block
  color #C81313
  font-size 12px
  font-weight 400
  line-height 14px
  padding 0
</style>
