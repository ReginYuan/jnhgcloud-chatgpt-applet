// components/publishForm/form-input-textarea/form-input-textarea.js
const rulesBehavior = require('../rulesBehavior/rulesBehavior')
Component({
  behaviors: [rulesBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    maxlength: Number,
    autoHeight: Boolean,
    placeholder: {
      type: String,
      value: '请输入',
    },
    disabled: {
      type: Boolean,
      value: false,
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
    onChange: function (e) {
      this.setData({
        value: e.detail.value,
        warn: '',
      })
    },
    onBlur: function (e) {
      this.setData({
        value: e.detail.value,
        warn: this.rulesTest(this.data.value, this.data.rules),
      })
    },
  },
})
