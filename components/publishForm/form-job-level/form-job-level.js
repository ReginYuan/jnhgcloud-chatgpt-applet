// components/publishForm/form-job-level/form-job-level.js
const rulesBehavior = require('../rulesBehavior/rulesBehavior')
Component({
  behaviors: [rulesBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    value: Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    jobType: [
      {
        label: '高级工',
        value: 3,
      },
      {
        label: '中级工',
        value: 2,
      },
      {
        label: '初级工',
        value: 1,
      },
    ],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handlerSelect(e) {
      this.setData({
        value: e.currentTarget.dataset.item.value,
      })
      this.setData({
        warn: '',
      })
    },
  },
})
