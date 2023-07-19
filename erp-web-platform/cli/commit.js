const msgPath = process.env.HUSKY_GIT_PARAMS
const msg = require('fs')
  .readFileSync(msgPath, 'utf-8')
  .trim()
const LIMIT = require('./commit-message')

console.log('你输入的提交信息：', msg)

const commitRE = /^(feat|fix|docs|style|refactor|perf|test|workflow|build|ci|chore|release|workflow)(\(.+\))?:.{1,50}/
// 这条正则表达式要求符合示例：
// fix(common): 修复字体过小的BUG，将通用管理下所有页面的默认字体大小修改为 14px    //半角冒号后面有空格
if (!commitRE.test(msg) && msg.indexOf('Merge') < 0) {
  console.log('提交信息不是很规范哦！')
  console.table(LIMIT)
  process.exit(1)
}
