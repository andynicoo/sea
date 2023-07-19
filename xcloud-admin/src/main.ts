import { createApp } from 'vue';
import store from '@/stores/store';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/assets/css/style.less';
import '@/assets/css/common.less'; // 公用样式
import formCreate from '@form-create/ant-design-vue';
import { renderWithQiankun, qiankunWindow, type QiankunProps } from 'vite-plugin-qiankun/dist/helper';
import { useStore } from '@/stores/store';
import { directiveHidden } from '@/directive/index';
import filters from '@/filters/index';
import 'viewerjs/dist/viewer.css';
import VueViewer from 'v-viewer';
import Components from '@/components';
let app: any = null;
function render(props: any = {}) {
  const { container }: any = props;
  app = createApp(App);
  app.use(store);
  app.use(router);
  app.use(Antd);
  app.use(formCreate);
  app.use(VueViewer, {
    defaultOptions: {
      inline: false, //默认值：false。启用内联模式。
      button: false, //在查看器的右上角显示按钮。
      navbar: false, //指定导航栏的可见性。
      title: false, //指定标题的可见性和内容。
      toolbar: true, //指定工具栏及其按钮的可见性和布局。
      tooltip: true, //放大或缩小时显示带有图像比率（百分比）的工具提示。
      movable: true, //启用以移动图像。
      zoomable: true, //启用以缩放图像
      rotatable: true, //启用以旋转图像
      scalable: true, //启用以缩放图像。
      transition: true, //为某些特殊元素启用CSS3转换。
      fullscreen: true, //启用以在播放时请求全屏。
      keyboard: true, //启用键盘支持。
      // url: 'src',  //默认值：'src'。定义获取原始图像URL以供查看的位置。
    },
  });
  app.use(Components);
  app.directive('hidden', directiveHidden);
  app.config.globalProperties.$filters = filters;
  app.mount(container ? container.querySelector('#app') : '#app');
  if (qiankunWindow.__POWERED_BY_QIANKUN__) {
    useStore().setLoginInfo({
      access_token: props.token || '',
    });
    useStore().setAuthoritiesList(props.authoritiesList || []);
    useStore().setEnterpriseRecord(props.enterpriseRecord);
    props.onGlobalStateChange((state: Record<string, any>) => {
      state.menuRecord && useStore().setMenuRecord(state.menuRecord);
      state.$router && useStore().setRouter(state.$router);
    }, true);
  }
}

renderWithQiankun({
  mount(props) {
    render(props);
  },
  bootstrap() {
    // console.log("bootstrap");
  },
  unmount(props: any) {
    app.unmount();
  },
  update: function (props: QiankunProps): void | Promise<void> {
    throw new Error('Function not implemented.');
  },
});

if (!qiankunWindow.__POWERED_BY_QIANKUN__) {
  render({});
}
