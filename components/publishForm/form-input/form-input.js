// components/publishForm/form-input/form-input.js
const rulesBehavior = require('../rulesBehavior/rulesBehavior')
Component({
  behaviors: [rulesBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String,
      value: 'text',
    },
    placeholder: {
      type: String,
      value: '请输入',
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    multiline: {
      type: Boolean,
      value: false,
    },
    adjust_position: {
      type: Boolean,
      value: true,
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
    onBlur: function () {
      this.setData({
        warn: this.rulesTest(this.data.value, this.data.rules),
      })
    },
    onTap: function () {
      this.triggerEvent('clicktigger', {}) // 只会触发 pageEventListener2
    },
  },
})
