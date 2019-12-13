// 比赛相关
import api from './api'

export default {
  // 创建比赛
  createSingleGame (data = {}) {
    return api.get(`${api.BASE_API_PATH}/game/searchGame`, {
      ...api.getDefaultParams(),
      gameStr: data.gameStr
    })
  },

  // 查询比赛
  searchGame (data = {}) {
    let params = {}
    if (data.gameId) {
      params.id = data.gameId
    } else {
      params = {
        seo: data.searchTxt || '',
        which_page: data.page || 1,
        pageSize: data.pageSize || 12
      }
    }

    return api.get(`${api.BASE_API_PATH}/game/searchGame`, {
      ...api.getDefaultParams(),
      orderDescCol: 'createTm', // 按时间反序
      ...params
    })
  },

  // 查询比赛人员
  searchGameUsr (data = {}) {
    return api.get(`${api.BASE_API_PATH}/game/searchJoin`, {
      ...api.getDefaultParams(),
      gameId: data.gameId,
      which_page: data.page || 1,
      pageSize: data.pageSize || 12
    })
  },

  // 参赛（人员/组合）
  joinGame (data = {}) {
    let params = {
      ...api.getDefaultParams(),
      gameId: data.gameId
    }

    if (data.groupId) {
      params.tid = data.groupId
    }

    if (data.groupName) {
      params.name = data.groupName
    }

    if (data.joinInfo) {
      params.joinInfo = JSON.stringify(data.joinInfo) // 用列表，报名信息
    }

    if (data.passCode) {
      params.passCode = data.passCode
    }

    if (data.uid) {
      params.uid = data.uid
    }

    return api.post(`${api.BASE_API_PATH}/game/joinGame`, params)
  },

  // 批量加入比赛
  batchJoinGame (data = {}) {
    let params = {
      ...api.getDefaultParams(),
      gameId: data.gameId,
      gmListStr: data.gmList && data.gmList.length ? JSON.stringify(data.gmList) : '' // 报名列表的 JSON
    }
    return api.post(`${api.BASE_API_PATH}/game/batchJoinGame`, params)
  },

  // 删除参赛的某个队员
  delGameUsr (data = {}) {
    return api.get(`${api.BASE_API_PATH}/game/delGmSingle`, {
      ...api.getDefaultParams(),
      gmId: data.gmId,
      uid: data.uid
    })
  },

  // 删除参赛的组合
  delGameMember (data = {}) {
    return api.get(`${api.BASE_API_PATH}/game/delGameMember`, {
      ...api.getDefaultParams(),
      id: data.id // 参赛 ID
    })
  },

  // 更新比赛人员信息
  updateGameUsr (data = {}) {
    if (!data.jsonInfo) {
      return Promise.reject(new Error('人员信息有误'))
    }
    return api.post(`${api.BASE_API_PATH}/game/updateJoinInfo`, {
      ...api.getDefaultParams(),
      gmId: data.gmId, // 参赛列表 ID
      jsonInfo: JSON.stringify(data.jsonInfo)
    })
  }
}
