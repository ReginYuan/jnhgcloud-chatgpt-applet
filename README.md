# jnhgcloud-worker-applet

数智工福小程序(劳务)

## 分支

- master：生产分支（新版本基于 master 新建）
- test：测试分支（本地开发分支不可拉取此分支）
- dev：开发分支（也可用版本号替代）
- feat：功能分支（根据议题号新建）

## 代码提交流程

- 创建功能议题并基于 master 创建分支
- 功能开发完成后创建合并请求至 test 分支发布至体验版
- 体验版测试完成后，将该分支合并至 master 发布至正式版

## 发布流程

- 正式版 将 master 推送至小程序后台
- 体验版 将 test 推送至小程序后台
- 将其切换为当前体验版
- 提交审核
- 审核通过，发布

## 页面划分

- 招工信息(主页): pages/jobs
- 招工信息-详情: pages/jobs-detail
- 工友圈: pages/workers/workers
- 工友圈-详情: pages/workers-detail
- 地图找活: pages/jobs-by-map
- 我的: pages/mine/mine
- 我的-招工管理：pages/mine-jobs
- 我的-好活收藏：pages/mine-jobs-collect
- 我的-找活名片：pages/mine-workers
- 我的-招工收藏：pages/mine-workers-collect
- 发布招工: pages/publish-find-job
- 发布找活: pages/publish-recruit
- webview 承接页: pages/webview

## 项目目录

- .husky: husky 钩子配置
- api: 请求封装（按页面）
- assets: 静态资源
- components: 组件（按页面 or 按模块）
- config: 环境变量配置
- pages: 页面
- utils: 公用方法
  - logs: 小程序日志方法
  - request: 统一请求
  - util: 纯工具方法
- .eslintignore: eslint 检测忽略
- .eslintrc.js: eslint 配置
- .gitattributes: git 配置
- .gitignore: git 提交忽略
- .prettierignore: prettier 忽略
- .prettierrc.js: prettier 配置
- .commitlint.config.js: commitlint 配置
- .lint-staged.config.js: lint-staged 配置
- app.js: 小程序 App 根文件
- app.json: 小程序 App 配置文件
- app.wxss: 小程序 App 样式文件
- project.config.json 小程序项目文件

## vant 的使用

- 为了减少主包体积，项目针对 vant 采用了按需打包构建的模式，`miniprogram_npm/@vant/weapp`目录中只会留存项目中会用到的组件文件
- 默认情况下，npm 加载到的 vant 是包含了全部组件的包目录，而其中有大量的组件是项目中用不到的，而在打包构建时却会跟随一起打包到最终的构建结果中，白白占用了包的空间，用户使用时也会白白下载这些无效的组件文件，造成了内存和网络带宽的浪费
- `load-vant.js`文件存在于项目根目录下，它的作用是根据项目中对 vant 组件的使用，剔除未使用的组件文件，仅在`miniprogram_npm/@vant/weapp`目录中保留用到的组件文件，从而减少包大小，具体使用为：npm 构建后，在终端执行`node ./load-vant.js`，每次新增 vant 组件的使用，执行这一步骤即可。
