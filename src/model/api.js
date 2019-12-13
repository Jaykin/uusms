import axios from 'axios'
import qs from 'qs'
import router from '@/router'

function checkLogin (res) {
  if (res.data.ret === -6) { // 未登录
    // TODO 转跳登录页
    localStorage.removeItem('token')
    // localStorage.removeItem('usrName')
    router.replace('/login')
  }
  return res
}

// catch 异步请求的网络错误
function onRequestRejected (err) {
  console.log(err)
  return Promise.reject(new Error('网络超时，请稍后再试'))
}

export default {
  post (url, data) {
    return axios(url, {
      method: 'post',
      data: qs.stringify(data),
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(checkLogin, onRequestRejected)
  },
  get (url, params) {
    return axios(url, {
      method: 'get',
      params,
      timeout: 10000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkLogin, onRequestRejected)
  },

  // 公参
  getDefaultParams () {
    return {
      token: localStorage.getItem('token')
    }
  },

  // 接口基本地址
  BASE_API_PATH: process.env.NODE_ENV === 'development' ? '/uu2' : 'https://m.uusport.net/uu2',
  // 加密 Key
  PUBLIC_KEY: 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC6J+Kvm+EkVaBLP5aLP/oUYKJNOGqfqYSrQoktckFlX7Ttr6qSkTl8rFuGVJAAtbgUh1yXQKP7h9uSE1YGEtnhvi7eAQQU6ectlb0pWXRjG8xLftGCrj7ePHnIhHf4PXYjS4KyN+JMAVx04JjkxcrPUpaqIxgtyuDH1g4JKdJMgwIDAQAB'
}
