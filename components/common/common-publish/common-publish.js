// components/common/common-publish/common-publish.js
import { checkLogin } from '../../../utils/util'
Component({
  /**
   * 组件的属性列表
   */
  properties: {},

  /**
   * 组件的初始数据
   */
  data: {
    tabBarHeight: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /* 招工 */
    onFindWork() {
      console.log('onFindWork')
      if (checkLogin()) {
        wx.navigateTo({
          url: '/pages/publish-recruit/publish-recruit?pageCome=jobs',
        })
      } else {
        this.getTabBar().toLogin()
      }
    },
    /* 找活 */
    onFindJob() {
      console.log('onFindJob')
      if (checkLogin()) {
        wx.navigateTo({
          url: '/pages/publish-find-job/publish-find-job',
        })
      } else {
        this.getTabBar().toLogin()
      }
    },
  },
  lifetimes: {
    async attached() {
      const tabBarHeight = await this.getTabBar().getTabBarHeight()
      this.setData({
        tabBarHeight,
      })
    },
  },
})
