import Vue from 'vue';
import formCreate from '@form-create/iview';
import formTitle from '@/components/WorkOrderComponents/FormTitle'; //模块title 例如：公司信息、法人信息、店铺信息文字
import LegalSigned from '@/components/WorkOrderComponents/LegalSigned'; //法人签名
import monthrange from '@/components/WorkOrderComponents/monthrange'; //月份范围
import ProductItems from '@/views/complianceBusiness/components/ProductItemsTable'; //产品信息
import EPRProductItems from '@/views/complianceBusiness/components/EPRProductItems'; //EPR预申报产品信息
import EPRBackProductItems from '@/views/complianceBusiness/components/EPRBackProductItem'; //EPR回溯产品信息
import BatteryProductDtos from '@/views/complianceBusiness/components/batteryProductDtos'; //电池法产品信息
import PackingProductDtos from '@/views/complianceBusiness/components/packingProductDtos'; //包装法申报信息
// import WeeeInfosFR from '@/views/complianceBusiness/components/weeeInfosFR'; //法国WEEE

// import BatteryInfosES from '@/views/complianceBusiness/components/batteryInfosES'; //电池法
// import WeeeInfosES from '@/views/complianceBusiness/components/weeeInfosES'; //法国WEEE

import WeeeProductDtos from '@/views/complianceBusiness/components/weeeProductDtos'; //WEEE产品信息

import BatteryInfosES from '../xcloud-client-components-web/module/components/product/batteryInfosES';
import WeeeInfosES from '../xcloud-client-components-web/module/components/product/weeeInfosES';
import WeeeInfosFR from '../xcloud-client-components-web/module/components/product/weeeInfosFR';

import UploadFile from '@/components/WorkOrderComponents/UploadFile'; //上传文件
import SampleFile from '@/components/WorkOrderComponents/SampleFile';
import TaxOtherEuTaxNumInfos from '@/components/WorkOrderComponents/numInfosCompnents'; //其他欧盟国家税号信息表

import RadioComponents from '@comp/module/components/formCreate/RadioComponents'; //单选组件
import UploadFiles from '@comp/module/components/formCreate/UploadFiles'; //上传文件OCR
import CompanyPhone from '@comp/module/components/formCreate/CompanyPhone'; //公司电话
import CompanyEmail from '@comp/module/components/formCreate/CompanyEmail'; //公司电话
import RejectReason from '@comp/module/components/formCreate/RejectReason'; //驳回原因
import Remark from '@comp/module/components/formCreate/Remark'; //注释信息
import TaxIdEffectiveDate from '@comp/module/components/formCreate/TaxIdEffectiveDate'; //税号生效日期
import ShopHref from '@comp/module/components/formCreate/ShopHref'; //店铺链接
import TitleOperation from '@comp/module/components/formCreate/TitleOperation'; //标题操作按钮
import TaxReportingPeriod from '@comp/module/components/formCreate/TaxReportingPeriod'; //报税周期
import DeclarationInterval from '@comp/module/components/formCreate/DeclarationInterval'; //申报区间
import StoreLinkDetailedAddress from '@comp/module/components/formCreate/StoreLinkDetailedAddress'; //店铺信息链接的英文详细地址
import CompanyBusinessModeDescribe from '@comp/module/components/formCreate/CompanyBusinessModeDescribe'; //店铺业务范围

formCreate.component('formTitle', formTitle);
formCreate.component('LegalSigned', LegalSigned);
formCreate.component('monthrange', monthrange);
formCreate.component('EPRProductItems', EPRProductItems);
formCreate.component('EPRBackProductItems', EPRBackProductItems);
formCreate.component('ProductItems', ProductItems);
formCreate.component('BatteryProductDtos', BatteryProductDtos);
formCreate.component('PackingProductDtos', PackingProductDtos);
formCreate.component('WeeeInfosFR', WeeeInfosFR);
formCreate.component('BatteryInfosES', BatteryInfosES);
formCreate.component('WeeeInfosES', WeeeInfosES);
formCreate.component('WeeeProductDtos', WeeeProductDtos);
formCreate.component('UploadFile', UploadFile); //上传文件
formCreate.component('SampleFile', SampleFile); //上传文件
formCreate.component('TaxOtherEuTaxNumInfos', TaxOtherEuTaxNumInfos); //其他欧盟国家税号信息表

formCreate.component('RadioComponents', RadioComponents); //单选组件
formCreate.component('UploadFiles', UploadFiles); //上传文件OCR
formCreate.component('CompanyPhone', CompanyPhone); //公司电话
formCreate.component('CompanyEmail', CompanyEmail); //公司邮箱
formCreate.component('RejectReason', RejectReason); //驳回原因
formCreate.component('Remark', Remark); //注释信息
formCreate.component('TaxIdEffectiveDate', TaxIdEffectiveDate); //税号生效日期
formCreate.component('ShopHref', ShopHref); //店铺链接
formCreate.component('TitleOperation', TitleOperation); //标题操作按钮
formCreate.component('TaxReportingPeriod', TaxReportingPeriod); //报税周期
formCreate.component('DeclarationInterval', DeclarationInterval); //申报区间
formCreate.component('StoreLinkDetailedAddress', StoreLinkDetailedAddress); //店铺信息链接的英文详细地址
formCreate.component('CompanyBusinessModeDescribe', CompanyBusinessModeDescribe); //店铺业务范围

Vue.use(formCreate);
