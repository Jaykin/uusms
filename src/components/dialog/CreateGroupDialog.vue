// 创建组合 dialog
<template>
<el-dialog title="创建组合" center show-close :visible.sync="dialogVisible" :before-close="handleClose" destroy-on-close>
  <el-form :model="form" ref="groupForm" :rules="formRule" >
    <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
      <el-input v-model.trim="form.groupName" autocomplete="off" placeholder="请输入4字内组合名称"></el-input>
    </el-form-item>
    <!-- <el-form-item prop="mark" label="姓名" :label-width="formLabelWidth">
      <el-input v-model.trim="form.usrName" autocomplete="off" placeholder="请输入真实姓名"></el-input>
    </el-form-item> -->
    <el-form-item prop="joinCode" label="暗号" :label-width="formLabelWidth">
      <el-input v-model.trim="form.passCode" autocomplete="off" placeholder="请输入组合暗号"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" round @click="handleCreateGroup('groupForm')">创建组合</el-button>
  </div>
</el-dialog>
</template>

<script>
import gameApi from '@/model/game'

export default {
  name: 'CreateGroupDialog',
  data () {
    return {
      form: {
        groupName: '',
        // usrName: '',
        passCode: ''
      },
      formRule: {
        groupName: [{ required: true, message: '请输入组合名称', trigger: 'change' }]
        // usrName: [{ required: true, message: '请输入真实姓名', trigger: 'change' }]
      },
      formLabelWidth: '120px'
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    gameInfo: {
      type: Object,
      default: () => ({
        gameId: 0
      })
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (v) {
        this.$emit('update:visible', v)
      }
    }
  },
  methods: {
    handleCreateGroup (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // 加入比赛即创建组合
          let params = {
            gameId: this.gameInfo.gameId,
            gmList: [{
              name: this.form.groupName,
              uidList: []
            }]
          }
          if (this.form.passCode) params.gmList[0].passCode = this.form.passCode
          gameApi.batchJoinGame(params).then((res) => {
            if (res.data && res.data.ret === 0) {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: `组合【${this.form.groupName}】已创建成功`
              })
              this._reset()
              this.$emit('create-group-success')
            } else {
              throw new Error(res.data.retMsg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message({
              type: 'error',
              message: err.toString()
            })
          })
        }
      })
    },

    handleClose (done) {
      this._reset()
      done()
    },

    // 清除数据
    _reset () {
      this.form = {
        groupName: '',
        // usrName: '',
        passCode: ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
