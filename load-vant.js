let fs = require('fs')
let path = require('path')

/* vant组件列表 */
const vantComponentList = [
  'button',
  'cell',
  'col',
  'cell-group',
  'config-provider',
  'icon',
  'image',
  'layout',
  'popup',
  'style',
  'toast',
  'transition',
  'calendar',
  'checkbox',
  'checkbox-group',
  'datetime-picker',
  'field',
  'picker',
  'picker-column',
  'radio',
  'radio-group',
  'rate',
  'search',
  'slider',
  'stepper',
  'switch',
  'uploader',
  'action-sheet',
  'dialog',
  'dropdown-menu',
  'dropdown-item',
  'loading',
  'notify',
  'overlay',
  'share-sheet',
  'swipe-cell',
  'circle',
  'collapse',
  'collapse-item',
  'count-down',
  'divider',
  'empty',
  'notice-bar',
  'progress',
  'skeleton',
  'steps',
  'sticky',
  'tag',
  'grid',
  'index-bar',
  'index-anchor',
  'nav-bar',
  'sidebar',
  'sidebar-item',
  'tab',
  'tabbar',
  'tabbar-item',
  'tree-select',
  'area',
  'card',
  'submit-bar',
  'goods-action',
  'goods-action-button',
  'goods-action-icon',
  'panel',
]

function walkSync(currentDirPath, callback) {
  fs.readdirSync(currentDirPath, { withFileTypes: true }).forEach(function (
    dirent
  ) {
    const filePath = path.join(currentDirPath, dirent.name)
    if (dirent.isFile()) {
      callback(filePath, dirent)
    } else if (dirent.isDirectory()) {
      walkSync(filePath, callback)
    }
  })
}

/* 项目用到的vant组件 */
const useVantList = new Set()

function addUseList(filePath, stat, type = 0) {
  if (/.json$/g.test(stat.name)) {
    if (type === 0) {
      const data = fs.readFileSync(filePath, 'utf-8')
      // eslint-disable-next-line
      data.match(/\@vant\/weapp\/([^\/]*)\/index/g)?.forEach(item => {
        const res = item.match(/(?<=weapp\/)[^\/]*(?=\/index)/g)[0]
        res && useVantList.add(res)
        return
      })
    }
    if (type === 1) {
      const data = fs.readFileSync(filePath, 'utf-8')
      data.match(/\.\.\/([^\/]*)\/index/g)?.forEach(item => {
        const res = item.match(/(?<=\.\.\/)[^\/]*(?=\/index)/g)[0]
        res && useVantList.add(res)
        return
      })
    }
  }
}
const deletePath = `./miniprogram_npm/@vant/weapp/` // vant路径
walkSync(path.join(__dirname, './pages'), addUseList)
walkSync(path.join(__dirname, './components'), addUseList)
walkSync(path.join(__dirname, './custom-tab-bar'), addUseList)
const appData = require(path.join(__dirname, './app.json'))
// eslint-disable-next-line
appData.subpackages?.forEach(function (item) {
  walkSync(path.join(__dirname, `./${item.root}`), addUseList)
})

for (const useVantItem of useVantList) {
  if (!fs.existsSync(path.join(__dirname, deletePath + useVantItem))) {
    console.error(`缺少${useVantItem} 🚀 ～ 请重新构建`)
    process.exit(0)
  }

  // 遍历Set
  walkSync(path.join(__dirname, deletePath + useVantItem), (path, dirent) => {
    addUseList(path, dirent, 1)
  })
}
console.log('使用的vant组件', useVantList)

function deleteall(path) {
  let files = []
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path)
    files.forEach(function (file, index) {
      let curPath = `${path}/${file}`
      if (fs.statSync(curPath).isDirectory()) {
        // recurse
        deleteall(curPath)
      } else {
        // delete file
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

const deleteList = vantComponentList.filter(function (item) {
  return !useVantList.has(item)
})

deleteList.forEach(item => {
  deleteall(path.join(__dirname, deletePath + item))
})
