/* 
  自定义tabbar组件
*/
let disp = require('../utils/broadcast')
import { loginHuanXin, checkLogin } from '../utils/util'
let WebIM = (wx.WebIM = require('../utils/webIM')['default'])
// const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  data: {
    show: true,
    active: 0,
    list: [
      {
        'pagePath': '/pages/jobs/jobs',
        'text': '招工信息',
        'iconPath': '/assets/tabbar/tab-job.png',
        'selectedIconPath': '/assets/tabbar/tab-job-checked.png',
      },
      {
        'pagePath': '/pages/workers/workers',
        'text': '工友圈',
        'iconPath': '/assets/tabbar/tab-worker.png',
        'selectedIconPath': '/assets/tabbar/tab-worker-checked.png',
      },
      {
        'pagePath': '/pages/message/message',
        'text': '消息',
        'iconPath': '/assets/tabbar/tab-message.png',
        'selectedIconPath': '/assets/tabbar/tab-message-checked.png',
      },
      {
        'pagePath': '/pages/mine/mine',
        'text': '我的',
        'iconPath': '/assets/tabbar/tab-mine.png',
        'selectedIconPath': '/assets/tabbar/tab-mine-checked.png',
      },
    ],
    unReadMessageNum:
      getApp().globalData.unReadMessageNum ||
      wx.getStorageSync('unReadMessageNum') ||
      '',
  },
  methods: {
    /* tab切换 */
    async onChange(e) {
      const currentIndex = e.detail
      this.setData({
        active: currentIndex,
      })
      wx.switchTab({
        url: this.data.list[currentIndex].pagePath,
      })
    },

    /* 页面中tab实例切换 */
    init() {
      const page = getCurrentPages().pop()
      if (page) {
        this.setData({
          active: this.data.list.findIndex(
            item => item.pagePath === `/${page.route}`
          ),
        })
      }
    },

    /* 登录授权 */
    async toLogin() {
      this.selectComponent('#popup').show()
      this.data.show = false
    },

    /* 获取tabbar高度 */
    async getTabBarHeight() {
      const query = wx.createSelectorQuery().in(this)
      query.select(`.tab-bar >>> .van-tabbar`).boundingClientRect()
      return new Promise(resolve => {
        query.exec(res => {
          resolve(res[0].height)
        })
      })
    },

    /**监听未读消息数*/
    readMessage() {
      let me = this
      //监听未读消息数
      disp.on('em.xmpp.unreadspot', function () {
        let unReadMessageNum =
          getApp().globalData.unReadMessageNum > 99
            ? '99+'
            : getApp().globalData.unReadMessageNum
        me.setData({
          unReadMessageNum,
        })
        wx.setStorageSync('unReadMessageNum', unReadMessageNum)
      })
    },

    /*获取所有聊天用户信息 包含陌生人版本*/
    getChatList() {
      wx.showLoading()
      var myName = wx.getStorageSync('myUsername')
      // eslint-disable-next-line no-unused-vars
      var array = []
      const me = this
      wx.getStorageInfo({
        success: function (res) {
          console.log('res', res)
          let storageKeys = res.keys
          console.log('res.keys +++ ', res.keys)
          let newChatMsgKeys = []
          let historyChatMsgKeys = []
          let len = myName.length
          storageKeys.forEach(item => {
            if (item.slice(-len) == myName && item.indexOf('rendered_') == -1) {
              newChatMsgKeys.push(item)
            } else if (
              item.slice(-len) == myName &&
              item.indexOf('rendered_') > -1
            ) {
              historyChatMsgKeys.push(item)
            }
          })
          cul.call(me, newChatMsgKeys, historyChatMsgKeys)
        },
      })

      async function cul(newChatMsgKeys, historyChatMsgKeys) {
        let array = []
        let lastChatMsg
        for (let i = 0; i < historyChatMsgKeys.length; i++) {
          let index = newChatMsgKeys.indexOf(historyChatMsgKeys[i].slice(9))
          if (index > -1) {
            let newChatMsgs = wx.getStorageSync(newChatMsgKeys[index]) || []
            // eslint-disable-next-line no-empty
            if (newChatMsgKeys.includes()) {
            }
            if (newChatMsgs.length) {
              lastChatMsg = newChatMsgs[newChatMsgs.length - 1]
              lastChatMsg.unReadCount = newChatMsgs.length
              if (lastChatMsg.unReadCount > 99) {
                lastChatMsg.unReadCount = '99+'
              }
              let dateArr = lastChatMsg.time.split(' ')[0].split('-')
              let timeArr = lastChatMsg.time.split(' ')[1].split(':')
              let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
              lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
              lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
              newChatMsgKeys.splice(index, 1)
            } else {
              let historyChatMsgs = wx.getStorageSync(historyChatMsgKeys[i])

              if (historyChatMsgs.length) {
                lastChatMsg = historyChatMsgs[historyChatMsgs.length - 1]
                let dateArr = lastChatMsg.time.split(' ')[0].split('-')
                let timeArr = lastChatMsg.time.split(' ')[1].split(':')
                let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
                lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
                lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
              }
            }
          } else {
            let historyChatMsgs = wx.getStorageSync(historyChatMsgKeys[i])
            if (historyChatMsgs.length) {
              lastChatMsg = historyChatMsgs[historyChatMsgs.length - 1]
              let dateArr = lastChatMsg.time.split(' ')[0].split('-')
              let timeArr = lastChatMsg.time.split(' ')[1].split(':')
              let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
              lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
              lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
            }
          }
          if (
            lastChatMsg.chatType == 'groupchat' ||
            lastChatMsg.chatType == 'chatRoom'
          ) {
            lastChatMsg.groupName = me.data.groupName[lastChatMsg.info.to]
          }
          // && lastChatMsg.username != myName
          lastChatMsg && array.push(lastChatMsg)
        }

        for (let i = 0; i < newChatMsgKeys.length; i++) {
          let newChatMsgs = wx.getStorageSync(newChatMsgKeys[i]) || []
          if (newChatMsgs.length) {
            lastChatMsg = newChatMsgs[newChatMsgs.length - 1]
            lastChatMsg.unReadCount = newChatMsgs.length
            if (lastChatMsg.unReadCount > 99) {
              lastChatMsg.unReadCount = '99+'
            }
            let dateArr = lastChatMsg.time.split(' ')[0].split('-')
            let timeArr = lastChatMsg.time.split(' ')[1].split(':')
            let month = dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2]
            lastChatMsg.dateTimeNum = `${dateArr[1]}${month}${timeArr[0]}${timeArr[1]}${timeArr[2]}`
            lastChatMsg.time = `${dateArr[1]}月${dateArr[2]}日 ${timeArr[0]}时${timeArr[1]}分`
            if (
              lastChatMsg.chatType == 'groupchat' ||
              lastChatMsg.chatType == 'chatRoom'
            ) {
              lastChatMsg.groupName = me.data.groupName[lastChatMsg.info.to]
            }
            // lastChatMsg.username != myName &&
            array.push(lastChatMsg)
          }
        }

        array.sort((a, b) => {
          return b.dateTimeNum - a.dateTimeNum
        })
        this.getRoster()
        wx.hideLoading()
      }
    },
    /**发送回执请求 */
    async getRoster() {
      let rosters = {
        success(roster) {
          var member = []
          for (let i = 0; i < roster.length; i++) {
            if (roster[i].subscription == 'both') {
              member.push(roster[i])
            }
          }
          wx.setStorage({
            key: 'member',
            data: member,
          })
          //if(!systemReady){
          disp.fire('em.main.ready')
          //systemReady = true;
          //}
        },
        error(err) {
          console.log(err)
        },
      }
      if (checkLogin()) {
        await loginHuanXin()
      } else {
        return
      }
      WebIM.conn.getRoster(rosters)
    },
  },

  lifetimes: {
    ready() {
      this.getChatList()
      this.readMessage()
      this.init()
    },
  },
})
