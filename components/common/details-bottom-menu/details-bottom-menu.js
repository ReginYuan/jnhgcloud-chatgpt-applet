// components/common/details-bottom-menu/details-bottom-menu.js

import {
  checkLogin,
  debounceAhead,
  makePhone,
  checkHuanXin,
  loginHuanXin,
} from '../../../utils/util'
import { collectWorker, collectJob } from '../../../api/common/common'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    workerInfo: {
      type: Object,
      value: () => {
        return {}
      },
    },
    type: {
      type: String,
      value: 'job',
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
    /* 登录授权提示 */
    isLogin() {
      if (!checkLogin()) {
        this.selectComponent('#popup').show()
        return
      }
      return true
    },
    /* 收藏 */
    handleTapCollect: debounceAhead(async function () {
      if (!this.isLogin()) return
      try {
        if ('job' === this.data.type) {
          const res = await collectJob(this.data.workerInfo.recruitId) // 收藏工作
          if (res.code === 200) {
            this.setData({
              'workerInfo.isCollect': res.data,
            })
          } else {
            throw res.msg
          }
        } else if ('worker' === this.data.type) {
          const res = await collectWorker(this.data.workerInfo.workerCardId) // 收藏工人
          if (res.code === 200) {
            this.setData({
              'workerInfo.isCollect': res.data,
            })
          } else {
            throw res.msg
          }
        }
      } catch (error) {
        wx.showToast({
          title: error,
        })
      }
    }),
    /*在线沟通*/
    async handleTapCommunicate() {
      if (!checkLogin()) {
        try {
          this.isLogin()
        } catch (error) {
          console.log('error', error)
        }
        return
      }
      if (!checkHuanXin()) {
        try {
          await loginHuanXin()
        } catch (error) {
          console.log('error', error)
        }
      }
      let { createBy, createName } = this.data.workerInfo
      let my = wx.getStorageSync('myUsername')
      let yourname = 'labor' + createBy
      var nameList = {
        myName: my,
        your: yourname,
        yourName: createName,
      }
      wx.navigateTo({
        url: '../chatroom/chatroom?username=' + JSON.stringify(nameList),
      })
    },
    /* 免费联系 */
    handleTapPhone: debounceAhead(async function () {
      if (!this.isLogin()) return
      await makePhone(this.data.workerInfo.createBy)
    }),
  },
})
