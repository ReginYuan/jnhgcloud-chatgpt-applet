// components/publishForm/tip-popup/tip-popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
    },
    content: {
      type: String,
      value: '工资发放承诺有助于获得更优质的工人接活。',
    },
    cancle: {
      type: String,
      value: '取消',
    },
    agree: {
      type: String,
      value: '同意并继续',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handlerCancle() {
      this.triggerEvent('handlerCancle')
      this.setData({
        show: false,
      })
    },
    handlerAgree() {
      this.triggerEvent('handlerTip')
      this.setData({
        show: false,
      })
    },
  },
})
