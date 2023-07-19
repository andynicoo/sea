import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';

Vue.use(VueClipboard);

// 定义全局方法
let testFn = (msg) => {
    return true
}
let copyText = (text) => {
  this.$copyText(text).then(
    res => {
      this.$message.success('复制成功')
    },
    err => {
      this.$message.error('复制失败')
    }
  )
}
// 获取国家名称
let getCountryNameByCode = (code, countryCode) => {
  const arr = countryCode.filter(v => v.code === code);
  if(arr) {
    return arr[0].name
  }else {
    return ''
  }
}

Vue.prototype.$copyText = copyText;

// 注意：服务端内部钩子不能使用
Vue.prototype.$testFn = testFn;
Vue.prototype.$getCountryNameByCode = getCountryNameByCode;
Vue.prototype.$PLA = process.env.NODE_PLA

// 注册全局指令
import * as directivesList from './directives'
Object.keys(directivesList).forEach(key => Vue.directive(key, directivesList[key]))
