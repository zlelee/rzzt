import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const timekey = 'hrsaas-timestamp-key'
export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getTimeStamp() {
  return Cookies.get(timekey)
}

export function setTimeStamp() {
  Cookies.set(timekey, Date.now())
}
export function removeToken() {
  return Cookies.remove(TokenKey)
}
