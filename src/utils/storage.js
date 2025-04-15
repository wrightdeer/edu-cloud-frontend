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
