/* 
  自定义tabbar组件
*/

Component({
  /**
   * 组件的属性列表
   */
  data: {
    show: true,
    active: 0,
    list: [
      {
        pagePath: "/pages/index/index",
        text: "首页",
        iconPath: "/assets/tabbar/tab-job.png",
        selectedIconPath: "/assets/tabbar/tab-job-checked.png",
      },
      {
        pagePath: "/pages/mine/mine",
        text: "我的",
        iconPath: "/assets/tabbar/tab-mine.png",
        selectedIconPath: "/assets/tabbar/tab-mine-checked.png",
      },
    ],
  },
  methods: {
    /* tab切换 */
    async onChange(e) {
      const currentIndex = e.detail;
      this.setData({
        active: currentIndex,
      });
      wx.switchTab({
        url: this.data.list[currentIndex].pagePath,
      });
    },

    /* 页面中tab实例切换 */
    init() {
      const page = getCurrentPages().pop();
      if (page) {
        this.setData({
          active: this.data.list.findIndex(
            (item) => item.pagePath === `/${page.route}`
          ),
        });
      }
    },

    /* 登录授权 */
    async toLogin() {
      this.selectComponent("#popup").show();
      this.data.show = false;
    },

    /* 获取tabbar高度 */
    async getTabBarHeight() {
      const query = wx.createSelectorQuery().in(this);
      query.select(`.tab-bar >>> .van-tabbar`).boundingClientRect();
      return new Promise((resolve) => {
        query.exec((res) => {
          resolve(res[0].height);
        });
      });
    },
  },

  lifetimes: {
    ready() {
      this.init();
    },
  },
});
