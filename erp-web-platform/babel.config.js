const plugins = ['@vue/babel-plugin-transform-vue-jsx']
// 生产环境移除console
if (process.env.NODE_ENV === 'production') {
  plugins.push('transform-remove-console')
}

// 配置babel-plugin-import, 用于按需加载组件代码和样式
plugins.push([
  "import",
  { libraryName: "ant-design-vue", libraryDirectory: "es", style: 'css' }
])

module.exports = {
  plugins: plugins,
  presets: ['@vue/cli-plugin-babel/preset'],
  
}
