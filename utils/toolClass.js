import { xcxLogin } from '../api/index/index'
//小程序登录获取code
const getLogin = () => {
  // 登录
  // 发送 res.code 到后台换取 openId, sessionKey, unionId
  return new Promise(function (resolve) {
    wx.login({
      success: async loginData => {
        const app = getApp()
        if (app && app.globalData) {
          app.globalData.loginCode = loginData.code || ''
        }
        const res = await xcxLogin(loginData.code)
        if (res.code == 200) {
          wx.setStorageSync('phoneNumber', res.data.phoneNumber)
          wx.setStorageSync('accessToken', res.data.token)
          wx.setStorageSync('secretKey', res.data.secretKey)
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 1000,
          })
        }
        resolve(res)
      },
    })
  })
}
module.exports = {
  getLogin,
}
