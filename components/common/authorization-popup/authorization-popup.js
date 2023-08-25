// components/common/authorization-popup/authorization-popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    installShow: false, //安装弹窗
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlerDisagree() {
      wx.setStorageSync('authorization', true)
      wx.exitMiniProgram()
    },
    handlerAgree() {
      this.triggerEvent('handlerAutnoeization', false)
      wx.setStorageSync('authorization', false)
      this.setData({
        installShow: true, //安装弹窗
      })
    },
    handlerOpen() {
      wx.navigateTo({
        url: '/pages/webview/webview?index=0',
      })
    },
    handlerOpen1() {
      wx.navigateTo({
        url: '/pages/webview/webview?index=1',
      })
    },
  },
})
