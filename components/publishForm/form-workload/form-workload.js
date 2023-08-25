// components/publishForm/form-workload/form-workload.js
const rulesBehavior = require('../rulesBehavior/rulesBehavior')
Component({
  behaviors: [rulesBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    value: Object,
    rules: Object,
    placeholder: String,
    placeholder1: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    disabled: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function (e) {
      this.setData({
        'value.workload': e.detail.value,
        warn: '',
      })
    },
    onChange1: function (e) {
      this.setData({
        'value.unit': e.detail.value,
        warn: '',
      })
    },
    onBlur: function () {
      this.setData({
        warn: this.rulesTest(
          this.data.value.workload,
          this.data.rules.workload
        ),
      })
    },
    onBlur1: function () {
      this.setData({
        warn: this.rulesTest(this.data.value.unit, this.data.rules.unit),
      })
    },
  },
  attached() {},
})
