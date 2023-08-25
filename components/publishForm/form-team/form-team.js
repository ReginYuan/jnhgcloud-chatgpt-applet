// components/publishForm/form-team/form-team.js
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
      console.log(this.data.value)
      this.setData({
        value: this.properties.value === 1 ? 0 : 1,
      })
    },
  },
})
