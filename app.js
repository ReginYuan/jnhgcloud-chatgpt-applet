// app.js
import { getDictTypeData } from './api/common/common'
import {
  checkLogin,
  getUserLocation,
  getLogin,
  loginHuanXin,
  checkHuanXin,
} from './utils/util'

App({
  async onLaunch() {
    /* 检查版本，提示更新 */
    this.checkVersions()

    /* 获取用户设备信息 */
    this.getSystemInfo()

    /* 获取用户位置信息 */
    this.getUserLocation()

    /* 登录 */
    if (!checkLogin()) {
      await getLogin()
    }

    if (checkLogin() && !checkHuanXin()) {
      await loginHuanXin()
    }

    /* 调用 API 从本地缓存中获取数据 */
    wx.setInnerAudioOption({ obeyMuteSwitch: false })

    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  async onShow() {
    console.log('index onShow...')
  },
  /* 全局监听globalData */
  watch(key, cb) {
    const obj = this.globalData
    let _val = obj[key]
    const descriptor = Object.getOwnPropertyDescriptor(obj, key) // 已有的属性描述
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (newVal) {
        _val = newVal
        if (descriptor && descriptor.set) {
          descriptor.set(newVal) // 执行上一个set
        }
        cb(newVal)
      },
      get: function () {
        return _val
      },
    })
  },
  /* 获取设备信息 */
  getSystemInfo() {
    const me = this
    /* 获取设备信息 */
    wx.getSystemInfo({
      success: systemInfo => {
        const bubbleMenuInfo = wx.getMenuButtonBoundingClientRect() // 胶囊位置
        const offsetTop = bubbleMenuInfo.top // 胶囊top坐标
        this.globalData.bubbleMenuInfo = bubbleMenuInfo // 胶囊位置信息
        this.globalData.navbarTop = offsetTop + 3
        this.globalData.systemInfo = {
          ...systemInfo,
        }
        this.globalData.statusBarHeight = systemInfo.statusBarHeight
        // 根据 model 进行判断
        if (systemInfo.model.search('iPhone X') != -1) {
          me.globalData.isIPX = true
        }
      },
    })
  },

  /* 获取用户位置信息 */
  async getUserLocation() {
    /* 获取授权信息 */
    // const authSetting = await getScope()
    // this.globalData.authSetting = authSetting

    /* 首次进入 获取位置信息 */
    const userLocation = await getUserLocation()
    /* 位置数据非空 且 未拒绝 */
    if (userLocation && userLocation !== 'deny') {
      this.globalData.userLocation = userLocation
    }
  },


  /* 检查版本，提示更新 */
  checkVersions() {
    if (!wx.canIUse('getUpdateManager')) return
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        },
      })
    })
  },

  conn: {
    closed: false,
    curOpenOpt: {},
  },
  
  globalData: {
    userInfo: null,
    loginCode: null,
    systemInfo: null,
    statusBarHeight: 0,
    bubbleMenuInfo: null,
    navbarTop: 0,
    previewImage: false, // 是否处于预览状态
    areasList: null, // 区划数据
    userLocation: null, // 定位数据
    tabbarHeight: 0, // tabbar高度
    dictMaps: {
      CREATE_TIME_DESC: 'updateTime desc',
      DISTANCE_ASC: 'distance asc',
    },
    TXMapKey: 'NU2BZ-SHZKQ-VKP5T-2K4TY-QANCO-KMB3J', // 腾讯地图插件key
    isIPX: false, //是否为iphone X
    defaultLocation: {
      lng: 116.39747, // 经度
      lat: 39.908822, // 纬度
    }, // 默认位置点，北京天安门
    writePhotosAlbum: true, //相册授权状态
  },
})
