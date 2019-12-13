// 创建球队 dialog
<template>
<el-dialog title="创建球队" center show-close :visible.sync="dialogVisible" :before-close="handleClose" destroy-on-close>
  <el-form :model="form" ref="teamForm" :rules="formRule" >
    <el-form-item prop="name" label="名称" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入球队名称"></el-input>
    </el-form-item>
    <el-form-item prop="mark" label="说明" :label-width="formLabelWidth">
      <el-input v-model.trim="form.mark" autocomplete="off" placeholder="例：企业/高校/专业/业余"></el-input>
    </el-form-item>
    <el-form-item prop="joinCode" label="暗号" :label-width="formLabelWidth">
      <el-input v-model.trim="form.joinCode" autocomplete="off" placeholder="请输入4位数字球队暗号(选填）"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" round @click="handleCreateTeam('teamForm')">创建球队</el-button>
  </div>
</el-dialog>
</template>

<script>
import teamApi from '@/model/team'

export default {
  name: 'CreateTeamDialog',
  data () {
    const validateJoinCode = (rule, value, callback) => {
      if (value) {
        (/[0-9]{4}/).test(value) ? callback() : callback(new Error('请输入4位数字球队暗号'))
      } else {
        callback()
      }
    }

    return {
      form: {
        name: '',
        mark: '',
        joinCode: ''
      },
      formRule: {
        name: [{ required: true, message: '请输入球队名称', trigger: 'blur' }],
        joinCode: [{ validator: validateJoinCode, trigger: 'blur' }]
      },
      formLabelWidth: '120px'
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false
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
    handleCreateTeam (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          teamApi.createTeam({
            name: this.form.name,
            mark: this.form.mark,
            joinCode: this.form.joinCode
          }).then((res) => {
            if (res.data && res.data.ret === 0) {
              this.dialogVisible = false
              this.$message({
                type: 'success',
                message: `球队【${this.form.name}】已创建成功`
              })
              this._reset()
              this.$emit('create-team-success')
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
        name: '',
        mark: '',
        joinCode: ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
