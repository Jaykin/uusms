// 信息校验相关
import vm from '../main'

// TODO 规则需要优化
export const usrCellRule = {
  name: {
    require: true,
    msg: '请输入姓名'
  },
  sex: {
    require: true,
    rule: /^[\u7537\u5973]{1}$/,
    msg: '性别格式有误'
  },
  date: {
    require: true,
    rule: /^[1-9]{1}[0-9]{3}\/[0-9]{2}\/[0-9]{2}$/,
    msg: '出生年月日格式有误, 格式为 2019/02/01'
  },
  tel: {
    require: true,
    rule: /^[0-9]{11}$/,
    msg: '请输入11位的手机号'
  },
  group: '',
  idcard: {
    rule: /^[0-9X]{18}$/,
    msg: '请输入18位的身份证信息'
  },
  size: {
    rule: /^[a-zA-Z]+$/,
    msg: '衣服尺码格式有误，仅支持英文字母'
  }
}

// 检验用户信息的格式
export function validateUsrCell (usrInfo) {
  return Object.keys(usrCellRule)
    .every((k) => {
      const sett = usrCellRule[k]
      let valid = false

      if (!sett || !sett.require) {
        valid = true
      }

      if (sett.require && !usrInfo[k]) {
        valid = false
      }

      if (usrInfo[k] && !sett.rule) {
        valid = true
      }

      if (usrInfo[k] && sett.rule && sett.rule.test(usrInfo[k])) {
        valid = true
      }

      !valid && vm.$message({
        type: 'error',
        message: usrCellRule[k].msg
      })

      return valid
    })
}

export default {
  usrCellRule,
  validateUsrCell
}
