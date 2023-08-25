// components/common/custom-nav/custom-nav.js
const app = getApp()
const { navbarTop, statusBarHeight } = app.globalData

Component({
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    /* 顶部占位 */
    topMass: {
      type: Boolean,
      value: false,
    },
    /* 背景色 */
    backgroundColor: {
      type: String,
      value: '#fff',
    },
    /* 左侧按钮 */
    left: {
      type: Boolean,
      value: true,
    },
    /* 返回按钮颜色类型 */
    backImgType: {
      type: String,
      value: 'black',
    },
    /* 自定义标题 */
    title: {
      type: String,
      value: '',
    },
    /* 自定义标题颜色 */
    color: {
      type: String,
      value: '#333',
    },
    /* 搜索框文本 */
    searchText: {
      type: String,
      value: '',
    },
    /* 自定义导航定位方式 */
    position: {
      type: String,
      value: 'fixed',
    },
    iconColor: {
      type: String,
      value: '#101010',
    },
    zIndex: {
      type: Number,
      value: 999,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 0,
    navbarTop: 0,
    inputIsFocus: false,
    inputValue: '',
    backImgs: {
      black:
        'https://image.zhushuhebao.com/jnhgcloud-worker-applet/icon/common-icon-back.jpg',
      white:
        'https://image.zhushuhebao.com/jnhgcloud-worker-applet/icon/arrow-left.png',
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 返回 */
    onTapBack() {
      console.log('onTapBack')
      // wx.navigateBack()
      this.triggerEvent('back')
    },

    /* 输入 */
    // onInput: throttle(function (event) {
    //   const value = event.detail.value
    //   this.triggerEvent('input', value)
    // }),
    onInput(event) {
      const value = event.detail.value
      this.triggerEvent('input', value)
    },

    onFocusInput() {
      this.setData({ inputIsFocus: true }) // Input聚焦
      this.triggerEvent('inputfocus')
    },
    /* 取消 */
    onCancel() {
      this.setData({ inputIsFocus: false, inputValue: '' }) // Input聚焦
      this.triggerEvent('cancel')
    },
    /* 清除Input */
    handleClearInput() {
      this.setData({ inputValue: '' })
    },
  },
  lifetimes: {
    attached() {
      this.setData({
        statusBarHeight,
        navbarTop,
      })
    },
  },
})
