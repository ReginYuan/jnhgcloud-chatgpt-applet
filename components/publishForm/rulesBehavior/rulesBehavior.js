module.exports = Behavior({
  behaviors: ['wx://form-field'],
  properties: {
    label: {
      type: String,
      value: '',
    },
    name: String,
    value: String,
    require: {
      type: Boolean,
      value: false,
    },
    warn: {
      type: String,
      value: '',
    },
    rules: Array,
  },
  data: {},
  methods: {
    rulesTest: function (value, rules) {
      if (rules) {
        let res = ''
        for (let i = 0; i < rules.length; i++) {
          const item = rules[i]
          if (
            (item.min || item.max) &&
            value &&
            (value.length < item.min || value.length > item.max)
          ) {
            // console.log(2)
            res = item.msg
            break
          } else if (item.reg && value && !new RegExp(item.reg).test(value)) {
            // console.log(3, 'reg', item.reg, new RegExp(item.reg))
            res = item.msg
            break
          } else if (!value && item.require) {
            // console.log(1)
            res = item.msg
            break
          } else {
            res = ''
          }
        }
        return res
      }
    },
    isRequire: function () {
      let rules = this.properties.rules
      if (Array.isArray(rules)) {
        rules.forEach(item => {
          if (item.require) {
            this.setData({
              require: true,
            })
          }
        })
      } else {
        let arr = Object.keys(rules)
        for (let i = 0; i < arr.length; i++) {
          const element = rules[arr[i]]
          element.forEach(item => {
            if (item.require) {
              this.setData({
                require: true,
              })
            }
          })
        }
      }
    },
    initWarn() {
      const formKeys = Object.keys(this.data.formRules)
      const warnForm = {}
      for (let i = 0; i < formKeys.length; i++) {
        const element = formKeys[i]
        warnForm[element] = ''
      }
      this.setData({
        warnForm,
      })
    },
    formRulesTest(data, rules) {
      this.initWarn()
      const keys = Object.keys(this.data.warnForm)
      let warnForm = { ...this.data.warnForm }
      keys.forEach(item => {
        if (typeof data[item] === 'object' && !Array.isArray(data[item])) {
          const itemkeys = Object.keys(data[item])
          const warnArr = []
          itemkeys.forEach(item1 => {
            const val = this.rulesTest(data[item][item1], rules[item][item1])
            if (val) {
              warnArr.push(val)
            }
          })
          // console.log(warnArr)
          if (warnArr[0]) {
            warnForm[item] = warnArr[0]
          }
        } else {
          warnForm[item] = this.rulesTest(data[item], rules[item])
        }
      })
      // console.log(warnForm)
      this.setData({
        warnForm,
      })
      let arr = Object.values(this.data.warnForm)
      let res = true
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i]
        if (element) {
          res = false
          break
        }
      }
      return res
    },
  },
  /** 在组件实例进入页面节点树时执行 */
  attached: function () {
    this.setData({
      value: this.properties.value,
    })
    this.isRequire()
  },
})
