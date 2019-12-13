// 球队详情
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
        <el-button icon="el-icon-plus" type="primary" class="action-btn" @click="handleCreateUser">创建账号</el-button>
        <!-- <el-button class="action-btn action-normal" @click="handleDel">删除</el-button> -->
        <!-- <el-button class="action-btn action-normal">批量导入</el-button> -->
      </div>
    </div>
    <div class="cont-main">
      <div class="user-total">共 {{pager.total_cnt}} 人</div>
      <el-table
        v-loading="loading"
        @selection-change="handleSelectionChange"
        :data="userList[pager.which_page - 1]"
        border
        style="width: 100%"
      >
        <!-- <el-table-column
          type="selection">
        </el-table-column> -->
        <el-table-column
          prop="sysId"
          label="系统ID">
        </el-table-column>
        <el-table-column
          prop="ucode"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="name"
          label="姓名">
          <template slot="header">
            <span>姓名</span>
            <div class="label-required">(必填)</div>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.name || PAD_TXT}}</span>
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
            <span v-if="scope.row.status">{{scope.row.sex || PAD_TXT}}</span>
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
            <span v-if="scope.row.status">{{scope.row.date || PAD_TXT}}</span>
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
            <span v-if="scope.row.status">{{scope.row.tel || PAD_TXT}}</span>
            <el-input v-else v-model.trim="scope.row.tel" placeholder="请输入手机号" maxlength="11"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="group"
          label="组别">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.group || PAD_TXT}}</span>
            <el-input v-else v-model.trim="scope.row.group" placeholder="填写组别"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="idcard"
          label="身份证号">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.idcard || PAD_TXT}}</span>
            <el-input v-else v-model.trim="scope.row.idcard" placeholder="填写身份证号"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="size"
          label="衣服码数">
          <template slot-scope="scope">
            <span v-if="scope.row.status">{{scope.row.size || PAD_TXT}}</span>
            <el-input v-else v-model.trim="scope.row.size" placeholder="填写码数"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          prop="pwd"
          label="密码">
        </el-table-column>
        <el-table-column
          label="操作"
          prop="status">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status" type="text" size="small" @click="handleUsrAction(scope.row)">修改</el-button>
            <template v-else>
              <el-button type="text" size="small" @click="handleUsrAction(scope.row)">确定</el-button>
              <el-button type="text" size="small" @click="handleUsrAction(scope.row, true)">取消</el-button>
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
  <CreateSysAccountDialog
    :visible.sync="dialogVisible"
    @create-usr-success="handleCreateUsrSuccess"
  />
</div>
</template>

<script>
import PageHeader from '@/components/PageHeader'
import CreateSysAccountDialog from '@/components/dialog/CreateSysAccountDialog'
import usrApi from '@/model/user'
import { validateUsrCell } from '@/utils/validator'
// import crypto from '@/utils/crypto'
import { PAGE_SIZE, PAD_TXT, PAGE_SIZES } from '@/utils/constant'

export default {
  name: 'SysAccount',
  data () {
    return {
      searchTxt: '',
      userList: [[]], // 二维数组
      pager: {
        page_size: PAGE_SIZE,
        total_cnt: 0,
        which_page: 1
      },
      dialogVisible: false,
      title: '创建系统账号',
      loading: true,
      PAD_TXT,
      PAGE_SIZES
    }
  },
  components: {
    PageHeader,
    CreateSysAccountDialog
  },
  mounted () {
    this._renderUsrList()

    // 非渲染数据
    this.__inner_data__ = {
      cachedUsrList: {}
    }
  },
  methods: {
    handleSearchUsr () {
      this._renderUsrList(this.searchTxt.trim(), 1, true)
    },

    handleClearSearch () {
      this.searchTxt = ''
      this._renderUsrList(this.searchTxt, 1, true)
    },

    handleCreateUser () {
      this.dialogVisible = true
    },

    handleUsrAction (row, cancel = false) {
      const { cachedUsrList } = this.__inner_data__
      const currPage = this.pager.which_page
      if (row.status === 1) {
        // 点击【修改】
        if (cachedUsrList[currPage]) {
          cachedUsrList[currPage][row.seq] = JSON.stringify(row)
        } else {
          cachedUsrList[currPage] = {
            [row.seq]: JSON.stringify(row)
          }
        }
        row.status = 0
      } else if (cancel) {
        // 点击【取消】
        // 注意使用 splice 更新
        this.userList[currPage - 1].splice(row.seq, 1, JSON.parse(cachedUsrList[currPage][row.seq]))
      } else {
        // 点击【确定】
        if (validateUsrCell(row)) {
          this._updateUsr(row)
        }
      }
    },

    handleCreateUsrSuccess () {
      // 刷新下列表
      this._renderUsrList(this.searchText, this.pager.which_page, true)
    },

    handleCurrPageChange (page) {
      const currList = this.userList[page - 1]

      // 没有才调接口
      if (!currList || !currList.length) {
        this._renderUsrList(this.searchText, page)
      }
    },

    handleSizeChange (pageSize) {
      this._renderUsrList(this.searchTxt, 1, true, pageSize)
    },

    handleSelectionChange (sel) {
      // this._innerData_.selUids = sel.map(item => item.uid)
    },

    handleDel () {
      this._delSelectedItems()
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
              seq: idx,
              sysId: usr.id,
              uid: jsonInfo.uid || usr.id,
              name: usr.name || '无',
              tel: extData.tel || '', // 无【手机号】字段
              sex: extData.sex || '', // 无【性别】字段
              group: extData.group || '', // 无【组别】字段
              date: extData.date || '', // 无【出生年月】字段
              idcard: extData.idcard || '', // 无【身份证号】字段
              size: extData.size || '', // 无【衣服码数】字段
              // pwd: usr.pass ? crypto.decrypt(usr.pass) : '无', // 密码 TODO 解密出错
              pwd: '',
              extId: jsonInfo.id, // 关联 jsonInfo，更新球员信息时用
              ucode: usr.ucode || '无',
              status: 1
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
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    },

    _updateUsr (usrInfo) {
      usrApi.updateUsr({
        extId: usrInfo.extId,
        uid: usrInfo.uid,
        extData: {
          tel: usrInfo.tel || '', // 【手机号】字段
          sex: usrInfo.sex || '', // 【性别】字段
          group: usrInfo.group || '', // 【组别】字段
          date: usrInfo.date || '', // 【出生年月】字段
          idcard: usrInfo.idcard || '', // 【身份证号】字段
          size: usrInfo.size || '' // 【衣服码数】字段
        }
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          return usrApi.updateUsrName({
            uid: usrInfo.uid,
            usrName: usrInfo.name
          })
        } else {
          return Promise.reject(res.data.retMsg)
        }
      }).then((res) => {
        if (res.data && res.data.ret === 0) {
          this.$message({
            type: 'success',
            message: '用户信息修改成功'
          })
          // 更新列表项
          usrInfo.status = 1
          // this.$set(this.userList, `${this.pager.which_page - 1}[${usrInfo.seq}]`, usrInfo)
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

    _delSelectedItems () {
      this.$message({
        type: 'info',
        message: '系统账号暂不支持删除'
      })
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

.label-required
  display block
  color #C81313
  font-size 12px
  font-weight 400
  line-height 14px
  padding 0
</style>
