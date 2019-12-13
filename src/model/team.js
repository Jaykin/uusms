// 球队相关
import api from './api'

export default {
  // 查询球队
  searchTeam (data = {}) {
    let params = {}
    if (data.teamId) {
      params.id = data.teamId
    } else {
      params = {
        seo: data.searchTxt || '',
        which_page: data.page || 1,
        pageSize: data.pageSize || 12
      }
    }

    return api.get(`${api.BASE_API_PATH}/team/searchTeam`, {
      ...api.getDefaultParams(),
      ...params
    })
  },

  // 创建球队
  createTeam (data = {}) {
    return api.get(`${api.BASE_API_PATH}/team/nuTeam`, {
      ...api.getDefaultParams(),
      name: data.name || '',
      mark: data.mark || '',
      joinCode: data.joinCode || ''
    })
  },

  // 查询球队人员
  searchTeamUsr (data = {}) {
    return api.get(`${api.BASE_API_PATH}/team/searchTeamUsr`, {
      ...api.getDefaultParams(),
      teamId: data.teamId || '',
      which_page: data.page || 1,
      pageSize: data.pageSize || 12
    })
  },

  // 加入球队，只提供加入，不能修改信息
  addTeamForUsr (data = {}) {
    return api.post(`${api.BASE_API_PATH}/team/addTeamUsr`, {
      ...api.getDefaultParams(),
      teamId: data.teamId,
      uid: data.uid,
      joinCode: data.joinCode
    })
  },

  // 删除队员
  delTeamUsr (data = {}) {
    return api.post(`${api.BASE_API_PATH}/team/delTeamUsr`, {
      ...api.getDefaultParams(),
      teamId: data.teamId,
      uid: data.uid
    })
  },

  // 批量删除球队队员
  batchDelTeamUsr (data = {}) {
    return api.post(`${api.BASE_API_PATH}/team/batchDelTeamUsrs`, {
      ...api.getDefaultParams(),
      teamId: data.teamId,
      uidListStr: data.uidList && data.uidList.length ? data.uidList.join(',') : ''
    })
  },

  // 批量导入球队 & 球员
  getBatchImportTeamService () {
    let commonQuery = ''
    const defParams = api.getDefaultParams() || {}
    Object.keys(defParams).forEach((key) => {
      commonQuery += `&${key}=${defParams[key]}`
    })
    return `${api.BASE_API_PATH}/usr/importTeamAndUsr?insertExist=1${commonQuery}`
  }
}
