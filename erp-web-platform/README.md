## 目录结构

```bash
├── build
├── config (Webpack)
├── src
│   ├── api
│   ├── components
│   ├── mixins
│   ├── views (or views)
│   ├── router
│   ├── store
│   ├── util
│   ├── theme
│   │   ├── default.sass
│   └── App.vue
│   └── event.js
│   └── main.js
├── dist
├── release
├── static (or asset)
├── mock (or script to build mock data)
├── node_modules
├── test
├── README.md
├── package.json
├── index.html
└── .gitignore
```

### 依赖安装

```
yarn install || npm i
```

### 本地开发

```
yarn start || npm start
```

### 编译文件

需要区分编译环境，目前主要环境包括 dev,test,uat,prod,除 prod 之外，构建命令均需在 build 脚本指定环境标识，所有环境标识均需与 erp.conf.js 下的 API_CONFIG 对应

```
yarn run build || npm run build
```

### Eslint

```
yarn run lint
```

### 引用

- [antdv](https://www.antdv.com/)

### 开发规范

- 需要严格遵守项目 es-lint 配置规范
- 需要启用 prettier 进行代码格式化
- 视图层目录约定与接口菜单接口保持一直，下钻及二级页面根据页面功能命名，views 下每个一级目录约定与可见菜单一级含义一致，一级路由下所有组件均会被自动生成为可访问页面
  例如:

```bash
├── product
    |--Manage.vue
    |--Detail.vue
    |——shopee
        |-- Page.vue
        |-- Detail.vue
    |——lazada
        |-- Page.vue
        |-- Detail.vue
    components //模块组件
```

最终解析的路由格式(components 下的组件不会被解析为页面视图)

```bash
/product/manage
/produtc/detail
/product/shopee/page
/product/shopee/detail
```

- 组件开发严格遵守 vue 官方推荐风格  
  [优先级-B-的规则：强烈推荐-增强可读性](https://cn.vuejs.org/v2/style-guide/#%E4%BC%98%E5%85%88%E7%BA%A7-B-%E7%9A%84%E8%A7%84%E5%88%99%EF%BC%9A%E5%BC%BA%E7%83%88%E6%8E%A8%E8%8D%90-%E5%A2%9E%E5%BC%BA%E5%8F%AF%E8%AF%BB%E6%80%A7)
- 重写框架 UI 框架样式需放在 styles/rewrite.scss 中，并附加对应注释

- 定期使用 `npm run lint`脚本检查代码基本格式规范和语法错误，可使用`npm run eslint-fix`脚本解决掉一些简单掉错误，error 级别的警告必须手动排查解决后方可推送或发布，warning 级别的视情况而定可忽略，但仍建议解决掉。

- 轻易不要修改项目规范类的配置文件

### 开发文档

公共组件文档采用 vue-docgen-cli 生成，文档页面采用 vuepress 生成
基础文档存放在 docs/base 目录下，组件文档存放在 docs/components 目录下

### 分支说明

- test 测试版本，所有成员均可操作
- uat 预发布版本，架构操作
- hotfix-日期 热修复版本，由最近一次生产环境发布后拉取的分支，所有成员均可操作
- dev-日期，由产品指定的迭代版本分支，所有成员均可操作
- prod 架构操作
- demo erp 演示版本，用于给第三方培训机构进行演示的版本，核心环节进行了数据静态话处理
