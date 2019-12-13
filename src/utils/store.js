// 应用级别的数据缓存
let store = Object.create(null)

export const DATA_KEYS = {}

export function setData (key, value) {
  store[key] = value
}

export function getData (key) {
  return store[key] || null
}

export function removeData (key) {
  store[key] = null
}

export function clear () {
  store = Object.create(null)
}

export default {
  DATA_KEYS,
  setData,
  getData,
  removeData,
  clear
}
