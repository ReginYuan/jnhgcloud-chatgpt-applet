// components/publishForm/form-uploader/form-uploader.js
import { upload } from '../../../api/common/common'
const rulesBehavior = require('../rulesBehavior/rulesBehavior')
import { getLogin } from '../../../utils/util'
const app = getApp()
Component({
  externalClasses: ['list-class', 'img-class'], // 图片列表 单个图片
  behaviors: [rulesBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Array,
      value: [],
    },
    size: {
      type: Number,
      value: 3 * 1024 * 1024,
    },
    count: {
      type: Number,
      value: 1,
    },
    multiple: {
      type: Boolean,
      value: false,
    },
    tip: String,
    /* 图片宽 */
    width: {
      type: String,
      value: '56px',
    },
    /* 图片高 */
    height: {
      type: String,
      value: '56px',
    },
    /* 上传icon */
    uploadIcon: {
      type: Object,
      value: {
        width: '56px',
        height: '56px',
        icon: 'https://image.zhushuhebao.com/jnhgcloud-worker-applet/icon/ico-add-pic@2x.png',
        bgc: '#edf0f5',
        iconWidth: '100%',
        iconHeight: '100%',
      },
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: false, // 加载
  },

  /**
   * 组件的方法列表
   */
  methods: {
    async afterRead(event) {
      console.log(event)
      const { file } = event.detail
      // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
      if (Array.isArray(file)) {
        file.forEach(item => {
          this.handlerUpload(item)
        })
      } else {
        this.handlerUpload(file)
      }
    },
    delete(e) {
      let index = e.currentTarget.dataset.index
      this.data.value.splice(index, 1)
      this.setData({
        value: this.data.value,
      })
      this.triggerEvent('del', this.data.value)
    },
    handlerUpload(file) {
      this.setData({
        loading: true,
      })
      upload(file).then(async res => {
        this.setData({
          loading: false,
        })
        console.log(res)
        if (res.code == 200 && res.data) {
          this.data.value.push({
            ossType: 1,
            ...res.data,
          })
          this.setData({
            value: this.data.value,
          })
          this.triggerEvent('upload', this.data.value)
        } else if (res.code == 401) {
          wx.showToast({
            title: '请重新操作',
            icon: 'error',
            duration: 2000,
          })
          // await getXcxPhoneLogin()
          await getLogin()
        }
      })
    },
    handlerPreview(e) {
      let currentUrl = e.currentTarget.dataset.url
      let urls = this.data.value.map(item => {
        return item.url
      })
      wx.previewImage({
        current: currentUrl, // 当前显示图片的http链接
        urls: urls, // 需要预览的图片http链接列表
        success: () => {
          app.globalData.previewImage = true
        },
      })
    },
  },
})
