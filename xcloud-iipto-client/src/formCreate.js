import Vue from 'vue';
import formCreate from '@form-create/iview';
import formTitle from '@/components/DynamicForm/FormTitle'; // 模块title 例如：公司信息、法人信息、店铺信息文字
import SampleFile from '@/components/DynamicForm/SampleFile';
import LegalSigned from '@/components/DynamicForm/LegalSigned';
import TrademarkClassification from '@/components/DynamicForm/TrademarkClassification'; // 商标分类
import SalesLinks from '@/components/DynamicForm/SalesLinks'; // 销售链接
import ProductPictures from '@/components/DynamicForm/ProductPictures'; // 产品图片
import OrderScreenshot from '@/components/DynamicForm/OrderScreenshot'; // 订单截图
formCreate.component('formTitle', formTitle);
formCreate.component('SampleFile', SampleFile); // 上传文件
formCreate.component('LegalSigned', LegalSigned);
formCreate.component('TrademarkClassification', TrademarkClassification);
formCreate.component('SalesLinks', SalesLinks);
formCreate.component('ProductPictures', ProductPictures);
formCreate.component('OrderScreenshot', OrderScreenshot);
Vue.use(formCreate);
