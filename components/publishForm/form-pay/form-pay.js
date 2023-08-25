// components/publishForm/form-pay/form-pay.js
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
    payMethod: [
      {
        label: '日结',
        value: 1,
      },
      {
        label: '量结',
        value: 2,
      },
    ],
    disabled: false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange: function (e) {
      this.setData({
        'value.expectedWages': e.detail.value,
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
          this.data.value.expectedWages,
          this.data.rules.expectedWages
        ),
      })
    },
    onBlur1: function () {
      this.setData({
        warn: this.rulesTest(this.data.value.unit, this.data.rules.unit),
      })
      this.triggerEvent('getPayData', this.data.value)
    },
    handlerPayMethod(e) {
      // console.log(e)
      if (e) {
        this.setData({
          'value.payMethod': e.currentTarget.dataset.item.value,
        })
      }
      if (this.properties.value.payMethod === 1) {
        this.setData({
          'value.unit': '日',
          disabled: true,
          warn: '',
        })
      } else {
        this.setData({
          'value.unit': '',
          disabled: false,
        })
      }
      this.triggerEvent('getPayData', this.data.value)
    },
  },
  attached() {
    this.handlerPayMethod()
  },
})
