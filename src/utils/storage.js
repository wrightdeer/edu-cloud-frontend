// 存储 JWT 令牌
export function setToken (token) {
  localStorage.setItem('token', token)
}

// 读取 JWT 令牌
export function getToken () {
  return localStorage.getItem('token')
}

// 删除 JWT 令牌
export function removeToken () {
  localStorage.removeItem('token')
}

export function setOriginRoute (originRoute) {
  localStorage.setItem('originRoute', JSON.stringify(originRoute))
}

export function getOriginRoute () {
  return JSON.parse(localStorage.getItem('originRoute'))
}

export function removeOriginRoute () {
  localStorage.removeItem('originRoute')
}
