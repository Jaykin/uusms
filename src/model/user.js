// 用户相关
import api from './api'
import { encrypt } from '../utils/crypto'
import { DEF_USR_PWD } from '../utils/constant'
import { getRandomUUid } from '../utils/index'

// 登录相关
const loginApi = {
  // 登录
  login (data = {}) {
    return api.get(`${api.BASE_API_PATH}/usr/login`, {
      ucode: data.account,
      pass: encrypt(data.pwd),
      type: 1
    })
  },

  // 登出
  logout () {
    return api.get(`${api.BASE_API_PATH}/usr/logout`, {
      ...api.getDefaultParams()
    })
  },

  // 判断是否登录
  isLogin () {
    return !!localStorage.getItem('token')
  }
}

// 用户相关
const usrApi = {
  register (data = {}) {
    let params = {
      nickname: data.nickname,
      ucode: data.account || 'uu' + getRandomUUid(),
      pass: encrypt(data.pwd || DEF_USR_PWD)
    }
    return api.get(`${api.BASE_API_PATH}/usr/register`, params)
  },

  // 查询用户
  searchUser (data = {}) {
    return api.get(`${api.BASE_API_PATH}/usr/searchUsr`, {
      ...api.getDefaultParams(),
      seo: data.searchTxt || '',
      which_page: data.page || 1,
      pageSize: data.pageSize || 12
    })
  },

  // 删除用户
  delUsr (data = {}) {
    return api.get(`${api.BASE_API_PATH}/usr/delUserData`, {
      ...api.getDefaultParams(),
      id: data.uid
    })
  },

  // 更新用户信息
  updateUsr (data = {}) {
    let params = {
      ...api.getDefaultParams(),
      uid: data.uid,
      type: 5,
      strval: data.extData ? JSON.stringify(data.extData) : ''
    }

    if (data.extId) {
      params.id = data.extId
    }

    return api.post(`${api.BASE_API_PATH}/usr/nuUserData`, params)
  },

  // 更新用户姓名
  updateUsrName (data = {}) {
    return api.post(`${api.BASE_API_PATH}/usr/updateUsr`, {
      ...api.getDefaultParams(),
      uid: data.uid || '',
      name: data.usrName || ''
      // isValid: 1
    })
  },

  // 批量导出球队用户
  exportTeamUsr (data = {}) {
    return api.post(`${api.BASE_API_PATH}/usr/exportUsr`, {
      ...api.getDefaultParams(),
      teamId: data.teamId || ''
    })
  },

  // 批量导出比赛用户
  exportGameUsr (data = {}) {
    return api.post(`${api.BASE_API_PATH}/usr/exportUsr`, {
      ...api.getDefaultParams(),
      gameId: data.gameId || ''
    })
  }
}

export default {
  ...loginApi,
  ...usrApi
}
