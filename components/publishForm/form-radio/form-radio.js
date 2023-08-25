// components/publishForm/form-radio/form-radio.js
const rulesBehavior = require('../rulesBehavior/rulesBehavior')
Component({
  behaviors: [rulesBehavior],
  /**
   * 组件样式
   */
  options: {
    styleIsolation: 'isolated',
  },
  /**
   * 组件的属性列表
   */
  properties: {
    value: Number,
    defineNoChecked: {
      type: Number,
      value: 0,
    },
    defineChecked: {
      type: Number,
      value: 1,
    },
    color: {
      type: String,
      value: 'rgb(9, 187, 7)',
    },
    size: {
      type: String,
      value: '32rpx',
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
    onChange() {
      this.setData({
        value:
          this.properties.value === this.properties.defineChecked
            ? this.properties.defineNoChecked
            : this.properties.defineChecked,
      })
    },
  },
})
