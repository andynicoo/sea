## 目录结构

```bash
├── config (Webpack)
├── dist
├── src
│   ├── api
│   ├── components
│   ├── router
│   ├── store
│   ├── styles
│   ├── util
│   ├── views
│   ├── vo
│   └── index.html
│   └── index.scss
│   └── index.tsx
│   └── public-path.js
├── zips
```

### 依赖安装

```
yarn install || npm i
```

### 本地开发

```
yarn start:dev || npm start:dev
```

### 编译文件

需要区分编译环境，目前主要环境包括 dev,test,prod,除 prod 之外，构建命令均需在 build 脚本指定环境标识

```
yarn run build:prod || npm run build:prod
```


### 引用

- [antd](https://ant.design/index-cn)

