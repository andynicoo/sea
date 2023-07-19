module.exports = {
  printWidth: 120, // 换行长度，默认80
  singleQuote: true, // 字符串使用单引号代替双引号
  semi: true, // 每行末尾自动添加分号
  trailingComma: 'es5', //对象、数组最后一个元素后加逗号
  tabWidth: 2, // tab缩进大小,默认为2
  useTabs: false, // 缩进不使用tab，使用空格，默认false
  formatOnSave: true, // prettier用的是系统默认的保存格式化
  bracketSpacing: true, // 对象中打印空格 默认true true: { foo: bar } false: {foo: bar}
  arrowParens: 'avoid', // 箭头函数参数括号 默认avoid 可选 avoid| always  （always 总是有括号）
  endOfLine: 'auto', //结尾是 \n \r \n\r auto
};
