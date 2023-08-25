// components/common/select-area/select-area.js
import { debounceAhead, getUserLocation, getWxScope } from '../../../utils/util'
import { getAreasList } from '../../../api/area/area'

const app = getApp()
const { statusBarHeight } = app.globalData

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Object,
      value: false,
    },
    /* 最多可选 */
    max: {
      type: Number,
      value: 1,
    },
    /* 已选择的城市 */
    selectAdress: {
      type: Array,
      value: [],
    },
    /* 是否包含默认”全国“ */
    isDefault: {
      type: Boolean,
      value: false,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    height: 0, // 动态高度
    statusBarHeight,
    locationCityName: '未知', // 定位所在城市
    proviceList: [], // 省份列表
    cityList: [], // 城市列表
    currentProvince: 0, // 当前展开的省份 索引
    isHintLocation: false,
    popupData: {
      title: '是否授权当前位置',
      content: '需要获取您的地理位置，请确认授权，否则将不能为您自动推荐位置',
      cancel: '不同意并退出',
      confirm: '同意并继续',
    }, // 授权弹窗文案
    // offsetHeight: '',
    // selectedCounts: 0,
    selectAreas: [], // 多选时选择的区划
    selectCityCode: '', // 单选时选择的城市
    userLocation: null, // 当前位置信息
    defaultArea: {
      cityList: [
        {
          cityList: null,
          code: '',
          lat: '',
          lng: '',
          name: '全国',
          parentCode: '',
          simpleName: '全国',
        },
      ],
      code: '',
      lat: '',
      lng: '',
      name: '全国',
      parentCode: '',
      simpleName: '全国',
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /* 获取区划列表数据 */
    async handleGetAreaList() {
      let areasList = []

      /* 首次加载 */
      if (!app.globalData.areasList) {
        const { data } = await getAreasList() // 取接口数据
        app.globalData.areasList = data || []
      }

      areasList = JSON.parse(JSON.stringify(app.globalData.areasList))

      if (this.data.isDefault) {
        /* 单选区划 */
        /* 增加默认选择 */
        areasList.unshift({ ...this.data.defaultArea })
      } else {
        /* 多选区划 */
        areasList = this.resolveAreaData(areasList) // 处理区划数据
      }

      this.setData({
        proviceList: areasList,
        cityList: areasList[0].cityList,
        height: 240,
      })
    },

    /* 选择省份 */
    handleSelectProvince(event) {
      const index = event.currentTarget.dataset.index
      this.setData({
        currentProvince: index, // 切换省
        cityList: this.data.proviceList[index].cityList, // 切换市
      })
    },

    /* 选择城市 */
    handleSelectCity(event) {
      const index = event.currentTarget.dataset.index

      const location =
        this.data.proviceList[this.data.currentProvince].cityList[index]
      const selectLocation = {
        simpleName: location.simpleName,
        city: location.name,
        cityCode: location.code,
        cityIndex: location.cityIndex,
        province: location.provinceName,
        provinceCode: location.parentCode,
        provinceIndex: location.provinceIndex,
        lat: +location.lat,
        lng: +location.lng,
      }
      if (this.data.max <= 1) {
        /* 单选城市 */
        this.setData({
          selectCityCode: selectLocation.cityCode,
        })
        this.triggerEvent('select', selectLocation) // 选择区划，关闭组件
      } else {
        /* 多选城市 */
        if (!location.selected) {
          /* 处理高亮交互 */
          if (location.cityCode === location.parentCode) {
            this.data.cityList.map(city => (city.selected = false))
          } else {
            this.data.cityList.map(city => {
              if (city.cityCode === city.parentCode) {
                city.selected = false
              }
            })
          }
          location.selected = true
          this.handleSelectMulti(selectLocation)
        } else {
          /* 反选 */
          this.handleRemoveCity(location)
        }
      }
    },

    /* 重新定位 */
    handleReLocation: debounceAhead(async function (isTrigger = true) {
      const userLocation = await getUserLocation()

      /* 已拒绝授权 或 被限频 */
      if (userLocation === 'deny') {
        if (this.data.userLocation) {
          /* 本地有定位数据，先使用 */
          if (!isTrigger) return
          if (this.data.max <= 1) {
            /* 单选城市 */
            return this.triggerEvent('select', this.data.userLocation)
          }
        } else {
          if (await getWxScope('scope.userLocation')) {
            /* 已授权过，但是获取失败（一般为限频） */
            return wx.showToast({
              icon: 'loading',
              title: '请勿频繁操作',
            })
          } else {
            /* 未授权过 或 拒绝过 */
            return this.setData({
              isHintLocation: true,
            })
          }
        }
      }

      /* 无位置数据 */
      if (!userLocation) {
        return wx.showToast({
          icon: 'loading',
          title: '获取位置失败',
        })
      }

      app.globalData.userLocation = userLocation // 保存位置数据
      if (!isTrigger) return

      if (this.data.max <= 1) {
        /* 单选城市 */
        this.triggerEvent('select', app.globalData.userLocation)
      }
      /* 多选城市 */
      /* TODO: 暂时啥也不做 */
    }),

    /* 选择多个 */
    handleSelectMulti(selectLocation) {
      /* 限制重复选择 */
      const city = this.data.selectAreas.find(
        city => city.cityCode === selectLocation.cityCode
      )
      if (city) return // 已存在当前选择
      let selectAreas = []

      /* 同一省下 省市互选交互 */
      if (selectLocation.cityCode === selectLocation.provinceCode) {
        /* 选择了 全省一级 */
        selectAreas = this.data.selectAreas.filter(
          city => city.provinceCode !== selectLocation.cityCode
        )
      } else {
        /* 选择了城市一级 */
        selectAreas = this.data.selectAreas.filter(
          city => city.cityCode !== selectLocation.provinceCode
        )
      }
      if (selectAreas.length >= this.data.max) {
        return wx.showToast({
          title: `最多选择${this.data.max}个`,
        })
      }
      selectAreas.push(selectLocation)
      this.setData({
        selectAreas,
        cityList: this.data.cityList,
      })
      // this.onWatchSelectedLabelHeight() // 监听已选工种高度
    },

    /* 关闭弹窗 */
    onCloseLocation() {
      this.setData({
        isHintLocation: false,
      })
      this.triggerEvent('noSetting')
    },

    /* 引导重新授权 */
    onConfirmLocaion() {
      this.setData({
        isHintLocation: false,
      })
      this.triggerEvent('openSetting')
      wx.openSetting()
    },

    /* 关闭区划选择 */
    onBack() {
      this.setData({
        'isShow.show': false,
      })
    },

    /* 监听已选框高度变化 */
    // onWatchSelectedLabelHeight() {
    //   const query = wx.createSelectorQuery().in(this)
    //   query.select('.area__selected').boundingClientRect()
    //   query.exec(res => {
    //     {
    //       this.data.offsetHeight = `height: calc(100vh - ${
    //         res[0].height * 2
    //       }rpx - env(safe-area-inset-bottom)); height: calc(100vh - ${
    //         res[0].height * 2
    //       }rpx - constant(safe-area-inset-bottom));`
    //       this.setData({
    //         height: res[0].height * 2,
    //       })
    //     }
    //   })
    // },

    /* 选择定位的当前城市 */
    selectCurrentCity() {
      if (!this.data.userLocation) return
      if (this.data.max > 1) {
        this.handleSelectMulti(this.data.userLocation)
      }
    },

    /* 删除已选城市 */
    onRemoveCity(e) {
      this.handleRemoveCity(e.currentTarget.dataset.city)
    },

    /* 删除城市 */
    handleRemoveCity(city) {
      const list = this.data.selectAreas.filter(
        item => city.cityCode !== item.cityCode
      )
      /* 非 所在城市 */
      if (this.data.proviceList[city.provinceIndex]) {
        this.data.proviceList[city.provinceIndex].cityList[
          city.cityIndex
        ].selected = false
      }

      this.setData({
        cityList: this.data.cityList,
        selectAreas: [...list],
      })
    },

    /* 清空 */
    handleClear() {
      const areasList = this.resolveAreaData(
        JSON.parse(JSON.stringify(app.globalData.areasList))
      )
      if (this.data.isDefault) {
        areasList.unshift({ ...this.data.defaultArea })
      }
      this.setData({
        selectAreas: [],
        selectAdress: [],
        selectCityCode: '',
        proviceList: areasList, // 整体数据
        cityList: areasList[0].cityList, // 二级数据
        currentProvince: 0,
      })
    },

    /* 保存 */
    handleSave() {
      this.triggerEvent('select', this.data.selectAreas) // 选择区划，关闭组件
    },

    /* 处理区划数据 */
    resolveAreaData(areasList) {
      areasList.map((province, idx) => {
        province.index = idx
        province.cityList.map((city, index) => {
          city.cityIndex = index
          city.provinceIndex = idx
          city.selected = false // 增加交互字段
          city.cityCode = city.code
          city.provinceName = province.name
        })
      })

      return areasList
    },
  },

  lifetimes: {
    async attached() {
      /* 加载区划数据 */
      await this.handleGetAreaList()
      /* 获取定位位置数据 */
      if (!app.globalData.userLocation) {
        /* 本地暂无位置数据时 监听&&同步 定位数据 */
        app.watch('userLocation', userLocation => {
          if (userLocation !== 'deny') {
            this.setData({
              userLocation,
              locationCityName: userLocation.simpleName,
              selectCityCode: userLocation.cityCode,
            })
          }
        })
      } else {
        this.setData({
          userLocation: app.globalData.userLocation,
          locationCityName: app.globalData.userLocation.simpleName,
        })
      }
    },
  },
  observers: {
    // eslint-disable-next-line no-unused-vars
    'selectAdress': function (newValue, oldValue) {
      if (newValue) {
        let selectList = []
        newValue.forEach(item => {
          this.data.proviceList.forEach((ele, index) => {
            if (item.provinceCode == ele.code) {
              this.setData({
                currentProvince: index,
              })
              let cityList = ele.cityList
              cityList.forEach((element, index) => {
                if (item.cityCode === element.code) {
                  selectList.push(element)
                  this.setData({
                    selectAreas: selectList,
                  })
                  cityList[index].selected = true
                  return false
                }
              })
              this.setData({
                cityList,
              })
              return false
            }
          })
        })
      }
    },
  },
})
