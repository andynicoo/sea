import Vue from 'vue'
import router from './router/'
import store from './store/'

import vueFilter from './plugins/filter'

import App from './App.vue'

import i18n from './lang'

import 'ant-design-vue/dist/antd.less'
import {
  Timeline,
  Affix,
  Button,
  ConfigProvider,
  message,
  notification,
  Card,
  Input,
  Space,
  Row,
  Col,
  Table,
  Modal,
  Form,
  FormModel,
  Checkbox,
  Radio,
  Upload,
  Icon,
  Select,
  Cascader,
  InputNumber,
  Spin,
  TimePicker,
  DatePicker,
  Tag,
  Tabs,
  TreeSelect,
  Dropdown,
  Menu,
  // LocaleProvider,
  Popover,
  Tooltip,
  Pagination,
  Avatar,
  Breadcrumb,
  Carousel,
  Slider,
  Divider,
  Anchor,
  Steps,
  Switch,
  Alert,
  Badge,
  Descriptions,
  Empty,
  PageHeader,
  Layout,
  Popconfirm,
  BackTop,
  Progress
} from 'ant-design-vue'
Vue.component(Button.name, Button)
Vue.component(Button.Group.name, Button.Group)
Vue.component(ConfigProvider.name, ConfigProvider)
Vue.component(Card.name, Card)
Vue.component(Input.name, Input)
Vue.component(Input.Search.name, Input.Search)
Vue.component(Input.TextArea.name, Input.TextArea)
Vue.component(Input.Group.name, Input.Group)
Vue.component(InputNumber.name, InputNumber)
Vue.component(Space.name, Space)
Vue.component(Row.name, Row)
Vue.component(Col.name, Col)
Vue.component(Table.name, Table)
Vue.component(Spin.name, Spin)
Vue.component(Upload.name, Upload)
Vue.component(Icon.name, Icon)
Vue.component(TreeSelect.name, TreeSelect)
Vue.component(Popover.name, Popover)
Vue.component(Tooltip.name, Tooltip)
Vue.component(Pagination.name, Pagination)
Vue.component(Avatar.name, Avatar)
Vue.component(Divider.name, Divider)
Vue.component(Anchor.name, Anchor)
Vue.component(Anchor.Link.name, Anchor.Link)
Vue.component(Steps.name, Steps)
Vue.component(Steps.Step.name, Steps.Step)
Vue.component(Switch.name, Switch)
Vue.component(Alert.name, Alert)
Vue.component(Badge.name, Badge)
Vue.component(Empty.name, Empty)
Vue.component(PageHeader.name, PageHeader)
Vue.component(Layout.name, Layout)
Vue.component(Popconfirm.name, Popconfirm)
Vue.component(Affix.name, Affix)
Vue.component(Progress.name, Progress)
Vue.component(Timeline.name, Timeline)

Vue.use(Checkbox)
Vue.use(Radio)
Vue.use(Form)
Vue.use(FormModel)
Vue.use(Modal)
Vue.use(Select)
Vue.use(Cascader)
Vue.use(TimePicker)
Vue.use(DatePicker)
Vue.use(Tag)
Vue.use(Tabs)
Vue.use(Dropdown)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(Carousel)
Vue.use(Slider)
Vue.use(Descriptions)
Vue.use(BackTop)
Vue.use(Timeline)

Vue.prototype.$message = message
Vue.prototype.$notification = notification
Vue.prototype.$error = Modal.error
Vue.prototype.$confirm = Modal.confirm
Vue.prototype.$success = Modal.success
Vue.prototype.$warning = Modal.warning
Vue.prototype.$info = Modal.info

import './styles/rewrite.scss' //框架重写样式
import './theme/var.scss' //浏览器默认
import './theme/default.scss' //系统主题相关
import './theme/form.scss' //表单

import WUI from './packages/index'
import './wui-theme/src/index.scss'
Vue.use(WUI, {
  i18n: (key, value) => i18n.t(key, value)
})

import Confirm from '@/packages/input-confirm'
Vue.use(Confirm)

import Loading from '@/packages/loading'
Vue.use(Loading)

/**图片预览 */
import ImagePreview from '@/packages/image-preview'
Vue.use(ImagePreview)

//全局指令
import globalDirective from '@/directive/global'
Vue.use(globalDirective)

//全局混入
import globalMixins from '@/mixins/global'
Vue.mixin(globalMixins)

//dom操作
import element from '@/directive/element'
Vue.use(element)

for (let key in vueFilter) {
  Vue.filter(key, vueFilter[key])
}

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: '/default-img.png',
  loading: '/loading-img.png'
})

import VueIntro from 'vue-introjs'
import 'intro.js/introjs.css'
Vue.use(VueIntro)

import ImageChoose from '@/packages/image-choose'
import CategoryChoose from '@/packages/category-choose'
import PriceTemplate from '@/packages/price-template'

Vue.config.productionTip = false

const app = new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
  mounted() {
    Vue.use(ImageChoose, { $vv: window._VV })
    Vue.use(CategoryChoose, { $vv: window._VV }),
      Vue.use(PriceTemplate, { $vv: window._VV })
  }
})

app.$mount('#app')
