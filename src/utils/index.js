// 工具函数

function _getRandomStr (x = '0123456', len = 4) {
  let tmp = ''

  for (let i = 0; i < len; i++) {
    tmp += x.charAt(Math.ceil(Math.random() * 100000000) % x.length)
  }

  return tmp
}

// 生成 4 位验证码，数字(0-9) + 字母(a-z)
export function getVerCode (len = 4) {
  return _getRandomStr('0123456789abcdefghijklmnopqrstuvwxyz', len)
}

export function getRandomUUid () {
  return _getRandomStr('0123456789', 4) + (new Date().getTime())
}

export function dateFormat (date, format) {
  /**
   * 时间格式化
   * @param {Number} unixTime 当前时间，精确到秒
   * @param {Object} format 时间格式；例如：{YYYY}-{MM}-{DD} {HH}:{mm}:{ss}
   *  年:YYYY或YY,例如：2016或16
   *  月:MM或M,例如：03或3
   *  日:DD或D,例如：06或6
   *  时:hh或h(12小时制)HH或H(24小时制),
   *  分:mm或m,
   *  秒:ss或s,
   *  星期：W，
   */
  if (!date) {
    return ''
  }

  let time = new Date(date)
  let year = time.getFullYear() // 年
  let month = time.getMonth() + 1 // 月
  let day = time.getDate() // 日
  let week = time.getDay() // 星期
  let hour = time.getHours() // 时
  let minute = time.getMinutes() // 分
  let second = time.getSeconds() // 秒
  let weekEnum = {
    '0': '日',
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六'
  }
  let result = format
  result = result.replace(/\{YYYY\}/g, year)
  result = result.replace(/\{YY\}/g, year.toString().substr(2, 2))
  result = result.replace(/\{MM\}/g, month > 9 ? month : '0' + month)
  result = result.replace(/\{M\}/g, month)
  result = result.replace(/\{DD\}/g, day > 9 ? day : '0' + day)
  result = result.replace(/\{D\}/g, day)
  result = result.replace(/\{HH\}/g, hour > 9 ? hour : '0' + hour)
  result = result.replace(/\{H\}/g, hour)
  if (hour > 12) {
    hour = hour - 12
  }
  result = result.replace(/\{hh\}/g, hour > 9 ? hour : '0' + hour)
  result = result.replace(/\{h\}/g, hour)
  result = result.replace(/\{mm\}/g, minute > 9 ? minute : '0' + minute)
  result = result.replace(/\{m\}/g, minute)
  result = result.replace(/\{ss\}/g, second > 9 ? second : '0' + second)
  result = result.replace(/\{s\}/g, second)
  result = result.replace(/\{W\}/g, weekEnum[week])

  return result
}

// 字符串反转
export function reverseStr (str) {
  return str.split('').reverse().join('')
}

export default {
  getVerCode,
  dateFormat,
  reverseStr
}
