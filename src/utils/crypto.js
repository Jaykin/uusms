// 加密/解密

import JSEncrypt from 'jsencrypt'
import api from '../model/api'

let crypto = null

function _createCrypto () {
  crypto = new JSEncrypt()
  crypto.setPublicKey(api.PUBLIC_KEY)
  return crypto
}

export function encrypt (str) {
  return crypto ? crypto.encrypt(str) : _createCrypto()['encrypt'](str)
}

export function decrypt (str) {
  // TODO 貌似有问题，解不出密码
  return crypto ? crypto.decrypt(str) : _createCrypto()['decrypt'](str)
}

export default {
  encrypt,
  decrypt
}
