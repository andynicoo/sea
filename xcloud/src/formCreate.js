import Vue from 'vue';
import formCreate from '@form-create/element-ui';
import formTitle from '@/components/WorkOrderComponents/FormTitle'; //模块title 例如：公司信息、法人信息、店铺信息文字
import LegalSigned from '@/components/WorkOrderComponents/LegalSigned'; //法人签名
import Suffix from '@/components/WorkOrderComponents/Suffix'; //后缀信息
import ProductItems from '@/components/WorkOrderComponents/ProductItems'; //产品信息
import EPRProductItems from '@/components/WorkOrderComponents/EPRProductItems/index'; //EPR预申报产品信息
import EPRBackProductItems from '@/components/WorkOrderComponents/EPRProductItems/backProductItems'; //EPR回溯产品信息
import BatteryProductDtos from '@/components/WorkOrderComponents/EPRProductItems/batteryProductDtos'; //电池法产品信息
import PackingProductDtos from '@/components/WorkOrderComponents/EPRProductItems/packingProductDtos'; //包装法申报信息
import WeeeProductDtos from '@/components/WorkOrderComponents/EPRProductItems/weeeProductDtos'; //WEEE产品信息
import WeeeInfosFR from '@/components/WorkOrderComponents/EPRProductItems/weeeInfosFR'; //法国WEEE产品信息
import BatteryInfosES from '@/components/WorkOrderComponents/EPRProductItems/batteryInfosES'; //法国WEEE产品信息
import WeeeInfosES from '@/components/WorkOrderComponents/EPRProductItems/weeeInfosES'; //法国WEEE产品信息
import AuthorizeFile from '@/components/WorkOrderComponents/AuthorizeFile'; //授权文件
import SampleFile from '@/components/WorkOrderComponents/SampleFile';
import Calssification from '@/view/module/intellectualProperty/components/calssification'; // 商标分类
import TaxOtherEuTaxNumInfos from '@/view/module/newTaxServices/taxRegister/taxRegisterFormCreate/taxOtherEuTaxNumInfos'; //其他欧盟国家税号信息表

formCreate.component('formTitle', formTitle);
formCreate.component('LegalSigned', LegalSigned);
formCreate.component('Suffix', Suffix);
formCreate.component('ProductItems', ProductItems);
formCreate.component('EPRProductItems', EPRProductItems);
formCreate.component('EPRBackProductItems', EPRBackProductItems);
formCreate.component('BatteryProductDtos', BatteryProductDtos);
formCreate.component('PackingProductDtos', PackingProductDtos);
formCreate.component('WeeeProductDtos', WeeeProductDtos);
formCreate.component('WeeeInfosFR', WeeeInfosFR);
formCreate.component('BatteryInfosES', BatteryInfosES);
formCreate.component('WeeeInfosES', WeeeInfosES);
formCreate.component('AuthorizeFile', AuthorizeFile);
formCreate.component('SampleFile', SampleFile);
formCreate.component('Calssification', Calssification);
formCreate.component('TaxOtherEuTaxNumInfos', TaxOtherEuTaxNumInfos);
Vue.use(formCreate);
