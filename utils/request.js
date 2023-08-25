import { config } from '../config/index'
import wxLogs from '../utils/logs'
import { getLogin } from './toolClass'
/**
 * 代理映射列表
 */
const proxy = {
  '/api': {
    target: config.HG_BASE_URL,
    rewrite: path => path.replace(/^\/api\//, ''),
  },
}

/**
 * 获取真实URL
 * @param {*} service
 */
const getFullURL = service => {
  const keys = Object.keys(proxy)
  const item = keys.find(item => {
    const reg = new RegExp('^' + item)
    return reg.test(service)
  })
  return {
    target: proxy[item].target, // 请求基础地址
    service: proxy[item].rewrite(service), // 服务地址
    fullURL: `${proxy[item].target}/${proxy[item].rewrite(service)}`, // 完整请求地址
  }
}

/**
 * 项目内的统一请求
 * @param {*} service 对应的服务api，不需要带baseURL
 * @param {*} method 请求方式
 * @params {*} params 参数列表
 * @param {*} header header
 */
const request = (service, method, data, header, type) => {
  const { fullURL } = getFullURL(service)
  const accessToken = wx.getStorageSync('accessToken')
  if (accessToken) {
    header.Authorization = `Bearer ${accessToken}`
  }
  method = method || 'get'
  data = data || {}
  if (type == 'file') {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: fullURL,
        filePath: data.url,
        name: 'file',
        header,
        success: async res => {
          if (res.statusCode === 200) {
            /* 小程序 业务非200时上报异常 */
            if (res.data.code !== 200) {
              wxLogs.error(
                JSON.stringify({
                  status: res.data.code,
                  message: res.data.msg,
                  url: fullURL,
                  data,
                })
              )
            }
            if (res.data.code == 401) {
              // const app = getApp()
              // app.resetting()
              getLogin()
            } else if (
              res.data.code == 402 &&
              res.data.msg == 'unionid.is.not.bind'
            ) {
              // wx.showToast({
              //   title: '手机号未绑定',
              //   icon: 'error',
              //   duration: 2000,
              // })
            } else if (res.data.code == 500) {
              wx.showToast({
                title: res.data.msg,
                icon: 'error',
                duration: 2000,
              })
            }
            resolve(JSON.parse(res.data))
          }
          if (res.statusCode === 401) {
            resolve(res.data)
          }
          if (res.statusCode === 500) {
            reject(JSON.parse(res.data))
          }
        },
        fail: err => {
          console.log('err', err)
          reject(err)
        },
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      wx.request({
        url: fullURL,
        data,
        method,
        header,
        success: async res => {
          if (res.statusCode === 200) {
            /* 小程序 业务非200时上报异常 */
            if (res.data.code !== 200) {
              wxLogs.error(
                JSON.stringify({
                  status: res.data.code,
                  message: res.data.msg,
                  url: fullURL,
                  data,
                })
              )
            }
            if (res.data.code == 401) {
              // const app = getApp()
              // app.resetting()
              getLogin()
            } else if (
              res.data.code == 402 &&
              res.data.msg == 'unionid.is.not.bind'
            ) {
              // wx.showToast({
              //   title: '手机号未绑定',
              //   icon: 'error',
              //   duration: 2000,
              // })
            } else if (res.data.code == 500) {
              wx.showToast({
                title: '服务器未知错误,请重新操作',
                icon: 'error',
                duration: 2000,
              })

              /* 小程序 500日志 */
              wxLogs.error(
                JSON.stringify({
                  status: res.data.code,
                  message: res.data.msg,
                  url: fullURL,
                  data,
                })
              )
            } else if (
              res.data.code == 402 &&
              res.data.msg === '用户秘钥错误'
            ) {
              getLogin()
            }
            resolve(res.data)
          }
          if (res.statusCode === 401) {
            resolve(res.data)
          }
          if (res.statusCode === 500) {
            reject(res.data)
          }
        },
        fail: err => {
          console.log('err', err)
          reject(err)

          /* 小程序 error日志 */
          wxLogs.error(
            JSON.stringify({
              status: 'fail',
              message: err,
              url: fullURL,
              data,
            })
          )
        },
      })
    })
  }
}

/**
 * 请求方法
 */
const wxRequest = {
  get: (service, data) => {
    return request(service, 'get', data, {
      'content-type': 'application/json',
      'clientType': 'app', // TODO 临时调整为app
    })
  },
  post: (service, data) => {
    return request(service, 'post', data, {
      'content-type': 'application/json',
      'clientType': 'xcx',
    })
  },
  put: (service, data) => {
    return request(service, 'put', data, {
      'content-type': 'application/json',
      'clientType': 'xcx',
    })
  },
  delete: (service, data) => {
    return request(service, 'delete', data, {
      'content-type': 'application/json',
      'clientType': 'xcx',
    })
  },
  uploadFile: (service, data) => {
    return request(
      service,
      'post',
      data,
      {
        'Content-Type': 'multipart/form-data',
        'Authorization': 'Bearer ' + wx.getStorageSync('token'),
      },
      'file'
    )
  },
}

export default wxRequest
