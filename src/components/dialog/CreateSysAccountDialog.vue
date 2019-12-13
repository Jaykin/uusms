// 创建系统账号 dialog
<template>
<el-dialog title="创建账号" center show-close :visible.sync="dialogVisible" :before-close="handleClose" destroy-on-close>
  <el-form :model="form" ref="usrForm" :rules="formRule">
    <el-form-item label="姓名" prop="name" :label-width="formLabelWidth">
      <el-input v-model.trim="form.name" autocomplete="off" placeholder="请输入真实姓名"></el-input>
    </el-form-item>
    <el-form-item label="账号" prop="account" :label-width="formLabelWidth">
      <el-input v-model.trim="form.account" autocomplete="off" placeholder="请输入账号(选填)"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="pwd" :label-width="formLabelWidth">
      <el-input v-model.trim="form.pwd" autocomplete="off" placeholder="请输入密码(选填)"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button type="primary" round @click="handleCreateUsr('usrForm')">创建账号</el-button>
  </div>
</el-dialog>
</template>

<script>
import usrApi from '@/model/user'

export default {
  name: 'CreateUserDialog',
  data () {
    return {
      dialogFormVisible: true,
      form: {
        account: '',
        name: '',
        pwd: ''
      },
      formRule: {
        // account: [{ required: true, message: '请输入账号' }],
        name: [{ required: true, message: '请输入姓名' }]
        // pwd: [{ required: true, message: '请输入密码' }]
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
    handleCreateUsr (formName) {
      this.$refs[formName].validate((valid) => {
        valid && this._registerUsr(this.form)
      })
    },

    handleClose (done) {
      // 清除数据
      this._reset()
      done()
    },

    // 注册用户
    _registerUsr (useInfo) {
      const { account, pwd, name } = useInfo

      usrApi.register({
        account,
        pwd,
        nickname: name
      }).then((usrRes) => {
        if (usrRes.data && usrRes.data.ret === 0) {
          this.dialogVisible = false
          this.$message({
            type: 'success',
            message: `【${name}】已创建成功`
          })
          this._reset()
          this.$emit('create-usr-success')
        }
      }).catch((err) => {
        console.log(err)
        this.$message({
          type: 'error',
          message: err.toString()
        })
      })
    },

    // 清除数据
    _reset () {
      this.form = {
        account: '',
        name: '',
        pwd: ''
      }
    }
  }
}
</script>

<style scoped lang="stylus">
</style>
