// 运营相关
import api from './api'

export default {
  // 获取轮播图
  searchCommFs (data = {}) {
    return api.get(`${api.BASE_API_PATH}/game/searchCommFs`, {
      ...api.getDefaultParams(),
      type: 2,
      which_page: data.page || 1,
      pageSize: data.pageSize || 20
    })
  },

  // 删除轮播图
  delCommFs (data = {}) {
    return api.get(`${api.BASE_API_PATH}/game/delCommFs`, {
      ...api.getDefaultParams(),
      id: data.imgId
    })
  },

  // 上传轮播图
  getUploadCommFsService (data = {}) {
    let commonQuery = ''
    const defParams = api.getDefaultParams() || {}
    Object.keys(defParams).forEach((key) => {
      commonQuery += `&${key}=${defParams[key]}`
    })
    return `${api.BASE_API_PATH}/game/upCommFs?type=2&seqno=${data.seqno || 0}${commonQuery}`
  }
}
