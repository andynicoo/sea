## 开始

```bash
# 克隆项目
git clone https://gitee.com/ksyvat/declare-tax-client.git

# 进入项目目录
cd declare-tax-client

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev

# 或者npm start命令启动
npm start

# 支持stage环境启动
npm run stage
```

服务启动成功后，浏览器访问 [http://localhost:9520](http://localhost:9000)


## 环境

```bash
# 修改接口连接地址
在 .env.[development/staging/production].js 中修改 VUE_APP_BASE_API='http://接口地址'

# 运行环境
在使用npm run dev 和 npm build dev/stag/prod 会根据对应的.env.XXX.js里的配置来连接不同环境的接口地址
```

具体环境配置可以参考vue-cli官网的 [环境变量和模式](https://cli.vuejs.org/zh/guide/mode-and-env.html)


## 发布

```bash
# 构建开发环境
npm run build:dev

# 构建测试环境
npm run build:stag

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```

本模板基于vue-cli4改造，更多使用信息参考 [使用文档](https://cli.vuejs.org/zh/)