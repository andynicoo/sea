import directive from './directives';
import store from '../store';
const importDirective = (Vue) => {
  /**
   * 拖拽指令 v-draggable="options"
   * options = {
   *  trigger: /这里传入作为拖拽触发器的CSS选择器/,
   *  body:    /这里传入需要移动容器的CSS选择器/,
   *  recover: /拖动结束之后是否恢复到原来的位置/
   * }
   */
  Vue.directive('draggable', directive.draggable);
  Vue.directive('highlight', directive.highlight);
  Vue.directive('hidden', directive.hidden); //隐藏手机号中间4位
  Vue.directive('positiveNumber', directive.positiveNumber); // 限制input输入框只能输入数字
};

export default importDirective;
