<template>
  <div class="login">
    <div class="wrapper">
      <div class="sys-name">
        <p class="sys-name_cn">UU体育管理后台</p>
        <p class="sys-name_en">UU SPORTS MANAGEMENT BACKGROUND</p>
      </div>
      <el-form ref="loginForm" :model="form" :rules="formRule" class="login-form">
        <div class="form-title">
          用户登录
        </div>
        <div class="form-input">
          <el-form-item prop="account" :show-message="false">
            <el-input v-model.trim="form.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item prop="pwd" :show-message="false">
            <el-input v-model.trim="form.pwd" placeholder="请输入6位纯数字密码" show-password></el-input>
          </el-form-item>
          <div class="form-input_code">
            <el-form-item prop="code" :show-message="false">
              <el-input v-model.trim="form.code" placeholder="请输入验证码"></el-input>
            </el-form-item>
            <div class="vercode" @click="handleChangeVerCode">
              <div class="code">{{verCode}}</div>
            </div>
          </div>
        </div>
        <el-checkbox v-model="form.remember" label="记住密码" name="remember" class="form-remember"></el-checkbox>
        <el-button type="primary" class="form-btn" @click="handleLogin('loginForm')">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import utils from '@/utils/index'
import userApi from '@/model/user'
import { reverseStr } from '@/utils'

export default {
  name: 'Login',
  data () {
    const validateVerCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入验证码'))
      } else if (value !== this.verCode) {
        callback(new Error('请输入正确的验证码'))
      } else {
        callback()
      }
    }

    return {
      form: {
        account: '',
        pwd: '',
        code: '',
        remember: true
      },
      formRule: {
        account: [{ required: true, message: '请输入账号' }],
        pwd: [
          { required: true, message: '请输入密码' },
          { type: 'string', pattern: /^[0-9]{6}$/, message: '请输入6位纯数字密码' }
        ],
        code: [{ validator: validateVerCode }]
      },
      verCode: utils.getVerCode()
    }
  },
  mounted () {
    const usrName = localStorage.getItem('usrName')
    const usrPwd = reverseStr(localStorage.getItem('pwd'))
    const remember = localStorage.getItem('remember')

    // 自动填充最近登录账号
    if (usrName) {
      this.form.account = usrName
    }

    if (remember && usrPwd) {
      this.form.pwd = usrPwd
    }
  },
  methods: {
    handleLogin (formName) {
      this.$refs[formName].validate((valid, fields) => {
        if (valid) {
          userApi.login({
            account: this.form.account,
            pwd: this.form.pwd
          }).then((res) => {
            // 登录成功
            let data = null
            if (res && (data = res.data)) {
              let token = ''
              if (data.ret === 0 && data.info && (token = data.info.token)) {
                localStorage.setItem('token', token)
                localStorage.setItem('usrName', this.form.account)
                localStorage.setItem('usrId', data.info.uinfo.id)
                this.$router.replace('/teamlist')
              } else {
                this.$message({
                  message: data.retMsg || '登录失败，请稍后重试',
                  type: 'error'
                })
              }
            }
            // 记住密码
            if (this.form.remember) {
              // TODO 简单反转下
              localStorage.setItem('pwd', reverseStr(this.form.pwd))
              localStorage.setItem('remember', 1)
            } else {
              localStorage.removeItem('pwd')
              localStorage.setItem('remember', 0)
            }
          }).catch((err) => {
            // 登录失败
            console.error(err)
            this.$message({
              message: err.toString(),
              type: 'error'
            })
          })
        } else {
          const k = Object.keys(fields)[0]

          k && this.$message({
            message: fields[k][0].message,
            type: 'error'
          })
          return false
        }
      })
    },

    handleChangeVerCode () {
      this.verCode = utils.getVerCode()
    }
  }
}
</script>

<style lang="stylus" scoped>
.login
  min-height 100%
  background center / cover url(../../assets/big_bg.jpeg) no-repeat
  color #fff

.wrapper {
  width 440px
  max-width 50%
  margin 0 auto
  padding 100px 0
}

.sys-name
  font-size 35px

.sys-name_en
  font-size 17px
  padding-top 16px
  padding-bottom 40px

.login-form
  padding 28px 47px 60px 47px
  background-color #fff
  color #323232
  border-radius 8px
  text-align left

  .form-input
    border 1px solid rgba(219, 219, 219, 1)
    border-radius 3px

    .el-form-item
      margin 0

    /deep/ .el-input__inner
      border none
      border-radius 0
      border-bottom 1px solid rgba(219, 219, 219, 1)

  .form-input_code
    position relative
    /deep/ .el-input
      width 184px
      .el-input__inner
        border-bottom none

  .vercode
    width 90px
    height 100%
    box-sizing border-box
    position absolute
    top 0
    right 0
    padding 6px 0
    text-align center
    font-size 24px
    cursor pointer
    .code
      height 100%
      border-left 1px solid #DBDBDB
      letter-spacing 3px

  .form-title
    padding-bottom 19px
    font-size 23px

  .form-remember
    padding-top 12px
    padding-bottom 16px
    /deep/ .el-checkbox__label
      font-size 9px
      font-weight normal

  .form-btn
    display block
    width 100%
    background-color #0045AD
    border-color #0045AD
</style>
