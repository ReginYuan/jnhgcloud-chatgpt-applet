// components/common/alert-popup/alert-popup.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      value: false,
      type: Boolean,
    },
    popupData: {
      /* 组件默认文本 */
      value: {
        title: '标题',
        content: '内容',
        cancel: '取消',
        confirm: '确认',
      },
      type: Object,
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
    onCancel() {
      console.log('onCancel')
      this.triggerEvent('cancel')
    },
    onConfirm() {
      console.log('onConfirm')
      this.triggerEvent('confirm')
    },
  },
})
