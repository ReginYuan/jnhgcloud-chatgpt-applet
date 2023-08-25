import { xcxLogin, wxLogout } from '../api/index/index'
import { getHuanXin } from '../api/message/index'
import { getPhone } from '../api/common/common'
import { getCurrentUser } from '../api/mine/index'

import wxLogs from '../utils/logs'
let WebIM = require('./webIM')['default']
// eslint-disable-next-line no-unused-vars
let __test_account__
// eslint-disable-next-line no-unused-vars
let __test_psword__

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return `${[year, month, day].map(formatNumber).join('-')}`
}

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(':')}`
}
/* 工单详情时间格式化 */
const orderFormatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('-')} ${[
    hour,
    minute,
    second,
  ]
    .map(formatNumber)
    .join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/*数组去重*/
const unique = arr => {
  return Array.from(new Set(arr))
}

/*函数节流*/
const throttle = (fn, interval) => {
  var enterTime = 0 //触发的时间
  var gapTime = interval || 300 //间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this
    var backTime = new Date() //第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments[0])
      enterTime = backTime //赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  }
}

/*函数防抖*/
const debounce = (fn, interval) => {
  var timer
  var gapTime = interval || 200 //间隔时间，如果interval不传，则默认200ms
  return function () {
    clearTimeout(timer)
    var context = this
    var args = arguments //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args)
    }, gapTime)
  }
}

/* 获取openId，unionId */

const getWxInfo = async () => {
  return await new Promise((resolve, reject) => {
    /* 获取openId、unionId */
    wx.login({
      success: ({ code }) => {
        wx.getUserInfo({
          success: async ({ encryptedData, iv }) => {
            const params = {
              encryptedData,
              iv,
              code,
            }
            const decryptData = () => {}
            const wxInfo = decryptData(params) // TODO
            wx.setStorageSync('wxInfo', wxInfo)
            resolve(wxInfo)
          },
          fail: err => {
            reject(err)
          },
        })
      },
    })
  })
}

// 立即执行 防抖函数
let _timer = null
const debounceAhead = (fn, time = 500) => {
  if (typeof fn !== 'function') {
    throw new TypeError('必须传入一个函数作为参数')
  }
  return function () {
    _timer && clearTimeout(_timer)
    if (!_timer) {
      const _this = this
      const args = arguments[0]
      fn.call(_this, args)
    }
    _timer = setTimeout(() => {
      _timer = null
    }, time)
  }
}

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
        } else if (res.code == 402 && res.msg == 'unionid.is.not.bind') {
          // wx.showToast({
          //   title: '手机号未绑定',
          //   icon: 'error',
          //   duration: 2000,
          // })
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

/** 小程序手机号续期登录*/
// const getXcxPhoneLogin = async () => {
//   // eslint-disable-next-line no-async-promise-executor
//   return new Promise(async function (resolve) {
//     const phoneNumber = wx.getStorageSync('phoneNumber')
//     const secretKey = wx.getStorageSync('secretKey')
//     const res = await xcxPhoneLogin(phoneNumber, secretKey)
//     if (res.code == 200) {
//       wx.setStorageSync('accessToken', res.data.token)
//       wx.setStorageSync('secretKey', res.data.secretKey)
//     } else if (res.code == 500) {
//       await getLogin()
//     }
//     resolve(res)
//   })
// }

// 校验微信登录
const checkLogin = () => {
  return wx.getStorageSync('accessToken')
}

/**
 * 获取用户定位 getLocationByWx
 * 首次授权会提示授权
 * 已授权过 静默获取
 * 拒绝授权过 直接失败
 */
const getLocationByWx = () => {
  return new Promise((resolve, rejetct) => {
    wx.getLocation({
      type: 'gcj02',
      getWorkInfoList: true,
      success: res => {
        /* 允许授权 */
        console.log('getLocation success...')
        resolve(res)
      },
      fail: err => {
        /* 拒绝授权 */
        console.log('getLocation fail...', err)
        rejetct('deny')
      },
    })
  })
}

/**
 * 获取授权信息
 * getScope
 */
// const getScope = () => {
//   return new Promise((resolve, reject) => {
//     wx.getSetting({
//       success: scope => {
//         resolve(scope.authSetting)
//       },
//       fail: err => {
//         reject(err)
//         console.log('getScope err...', err)
//       },
//     })
//   })
// }

/**
 * 获取位置信息 getUserLocation
 */
import { locationToAddress } from '../api/common/common'
const getUserLocation = async () => {
  try {
    /* 授权过 或 首次允许授权 */
    const { latitude, longitude } = await getLocationByWx() // 通过微信获取定位坐标

    /* 位置坐标反查位置信息 */
    const { status, result, message } = await locationToAddress({
      'get_poi': 1,
      'location': `${latitude},${longitude}`,
    })

    /* 反查失败啥也不做 */
    if (status !== 0)
      return wxLogs.error(
        JSON.stringify({
          status,
          message,
        })
      )

    /* 反查成功 */
    const { province, city } = result.ad_info
    const { provinceCode, cityCode, simpleName } = getAdCode(city) // 通过城市反查 省市行政区码

    /* 组合位置数据 */
    const userLocation = {
      lat: latitude, // 经度
      lng: longitude, // 纬度
      province, // 省份名称
      city, // 城市或区名称
      provinceCode, // 省份区划编码
      cityCode, // 城市或区区划编码
      address: result.address, // 详细地址
      simpleName, // 区划简称（级别：城市或区）
    }

    /* 响应位置数据 */
    return userLocation
  } catch (error) {
    /* 拒绝授权 或 接口报错 */
    console.log('getUserLocation error...', error)
    return error
  }
}

/* 获取省、市行政码 */
const getAdCode = cityName => {
  const app = getApp()
  const areasList = app.globalData.areasList

  const data = {
    provinceCode: '',
    cityCode: '',
    simpleName: '',
  }
  areasList.map(province => {
    province.cityList.map(city => {
      if (city.name.indexOf(cityName) !== -1) {
        data.cityCode = city.code
        data.provinceCode = province.code
        data.simpleName = city.simpleName
      }
    })
  })
  return data
}

const logout = async () => {
  await wxLogout()
  // if (res.code == 200) {
  //   wx.clearStorageSync('accessToken')
  // }
}

/**
 * 获取授权信息
 */
const getWxScope = authName => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: scope => {
        const authSetting = scope.authSetting
        resolve(authSetting[authName])
      },
      fail: err => {
        reject('getWxScope...', err)
      },
    })
  })
}

/* 距离单位处理 */
const distanceUnit = data => {
  let res = null
  const dic = Number(data)
  if (dic > 0 && dic < 1000) {
    res = dic.toFixed(0) + 'm'
  } else if (dic > 1000) {
    res = (dic / 1000).toFixed(2) + 'km'
  } else {
    res = '0m'
  }
  return res
}

//校验环信登录
const checkHuanXin = () => {
  return wx.getStorageSync('huanXinToken')
}

/*环信登录*/
const loginHuanXin = async () => {
  const res = await getHuanXin()
  if (res && res.data) {
    const imUsername = res.data.imUsername || ''
    const imPassword = res.data.imPassword || ''
    const imUuid = res.data.imUuid || ''
    wx.setStorageSync('myUsername', imUsername)
    wx.setStorageSync('myPassword', imPassword)
    wx.setStorageSync('myUuid', imUuid)
    const reshuandata = await WebIM.conn.open({
      apiUrl: WebIM.config.apiURL,
      user: __test_account__ || wx.getStorageSync('myUsername').toLowerCase(),
      pwd: __test_psword__ || wx.getStorageSync('myPassword'),
      grant_type: 'password',
      appKey: WebIM.config.appkey,
    })

    if (reshuandata && reshuandata.accessToken) {
      wx.setStorageSync('huanXinToken', reshuandata.accessToken)
      const CurrentUserRes = await getCurrentUser()
      if (CurrentUserRes.code === 200 && CurrentUserRes.data) {
        let avatarurl =
          CurrentUserRes.data.avatar ||
          'https://image.zhushuhebao.com/jnhgcloud-worker-applet/image/icon-avatar.png'
        let phone = CurrentUserRes.data.phoneNumber
        let nickname = CurrentUserRes.data.userName
        let gender = CurrentUserRes.data.sex
        let birth = CurrentUserRes.data.idCard
        /**设置用户属性 */
        let option = {
          nickname,
          avatarurl,
          phone,
          gender,
          birth,
        }
        // 设置用户属性
        WebIM.conn.updateUserInfo(option).then(res => {
          console.log('个人信息设置成功', res)
        })
      }
      // WebIM.conn.context.accessToken = reshuandata.accessToken
    }
  }
}

/* 拨打电话 */
const makePhone = async userId => {
  const { code, data, msg } = await getPhone(userId)
  if (code !== 200) {
    return wx.showToast({
      icon: 'error',
      title: msg,
    })
  }
  wx.makePhoneCall({
    phoneNumber: data,
    success: () => {
      console.log('makePhoneCall success...')
    },
    fail: () => {
      console.log('makePhoneCall fail...')
    },
  })
}

/* ios日期转化兼容性处理 */
function date_ompatible_processing(platform, dateStr) {
  let date = null
  if (platform === 'ios') {
    const reg = new RegExp('\\-', 'g')
    date = new Date(dateStr.replace(reg, '/'))
    console.log(reg, date)
  } else {
    date = new Date(dateStr)
  }
  return date
}

module.exports = {
  formatDate,
  formatTime,
  orderFormatTime,
  unique,
  throttle,
  debounce,
  debounceAhead,
  getLogin,
  // getXcxPhoneLogin,
  checkLogin,
  getWxInfo,
  getLocationByWx,
  getAdCode,
  logout,
  getUserLocation,
  getWxScope,
  // getScope,
  distanceUnit,
  loginHuanXin,
  checkHuanXin,
  searchWorkTypes,
  makePhone,
  date_ompatible_processing,
}
