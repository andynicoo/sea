import Vue from 'vue';
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
/** 数据处理 */
export const dynamicForm = (moduleList, { ...props }) => {
  console.log(moduleList, 88888);
  props.workInfo = props.workInfo || {};
  var vue = new Vue({});
  let datalist = [];
  moduleList.map((item, moduleIndex) => {
    // 不渲染产品信息
    if (props.hideProductItem && item.moduleCode === 'productInfo') {
      return;
    }
    //模块名称处理列如：公司信息、法人信息
    if (item.columns.length && item.columns.some((c) => c.inputType !== 'hidden')) {
      if (item.moduleName) {
        datalist.push({
          type: 'formTitle',
          value: item.moduleName,
          field: 'testField',
          sourceData: item,
        });
      }

      item.columns.sort((a, b) => {
        //字段排序
        return a.sort - b.sort;
      });
      if (props.taxInspection && moduleIndex === 0) {
        datalist.push({
          type: 'input',
          props: {
            disabled: true,
          },
          title: '稽查国家',
          field: 'testField',
          value: props.taxInspectionCountry,
        });
      }
      if (props.logoutTaxNum && moduleIndex === 0) {
        datalist.push({
          type: 'input',
          props: {
            disabled: true,
          },
          title: '注销税号国家',
          field: 'testField',
          value: props.logoutTaxNumCountry,
        });
      }

      item.columns.map((pro) => {
        pro.infoJson = pro.info ? JSON.parse(pro.info) : {};
        let formValue = '';
        // 数据兼容
        if (isEmpty(pro.reView)) {
          if (isEmpty(pro.keyNameValue)) {
            formValue = formatType(pro.inputType, pro).default;
          } else {
            formValue = pro.keyNameValue;
          }
        } else {
          formValue = pro.reView;
        }
        if (typeof formValue === 'number') {
          formValue += '';
        }

        // 上传数组值处理
        if (pro.inputType === 4) {
          formValue = formatImg(formValue);
        }
        // 当单选项只配置了一个选项时，默认选中该选项
        if (pro.inputType === 2 && pro.infoJson.groups.length == 1) {
          formValue = pro.infoJson.groups[0].value;
        }
        let sourceFileUrl = formatImg(pro.sourceFileUrl);
        pro.sourceFileUrl = sourceFileUrl && sourceFileUrl.length ? sourceFileUrl[0] : '';
        //基础数据
        let form = {
          moduleParentCode: item.moduleCode,
          sourceData: pro,
          type: formatType(pro.inputType, pro).type,
          title: pro.keyLabel,
          field: pro.keyName,
          value: formValue,
          col: {
            span: props.isTemplate ? 8 : 24 / props.rowKeyNum,
          },
          props: {
            disabled: pro.disabled || false,
            type: formatType(pro.inputType, pro).propType,
            placeholder: pro.placeHolder,
            format: 'yyyy-MM-dd',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            action: vue.baseUrl + '/file/oss/upload',
            multiple: pro.infoJson.multiple || false,
            filterable: pro.filterable ? true : pro.infoJson.filterable || false,
            allowCreate: pro.allowCreate || false,
            clearable: pro.clearable,
            // drag: pro.infoJson.drag || false,
            drag: true,
            limit: pro.infoJson.limit - 0 || '',
            rows: pro.infoJson.rows || 2,
            accept: [...new Set(pro.infoJson.accepts.map((a) => '.' + a))].join(','),
            // uploadType: "image",
            showFileList: true,
            fileModelUrl: pro.fileModelUrl,
            sourceFileUrl: pro.sourceFileUrl,
            onSuccess: function (res, file, fileList) {
              file.url = res.data.fileUrl.replace('http://', 'https://');
              pro.renameText = file.url;
              if (pro.infoJson.limit - 0 === 1) {
                form.validate.forEach((i) => (i.type = 'string'));
              }
            },
            onPreview(file) {
              window.open(file.url.replace('http://', 'https://'));
            },
            beforeUpload(file) {
              let params = pro.infoJson.accepts.join('|');
              let reg = new RegExp('.(' + params + ')$');
              if (!reg.test(file.name.toLowerCase())) {
                vue.$message.warning('上传文件格式错误！');
                return false;
              }
              if (['companyBusinessLicense', 'identityCardFront', 'identityCardReverse'].includes(pro.keyName)) {
                const MAX_SIZE = file.size / 1024 / 1024 < 10;
                // 验证文件大小
                if (!MAX_SIZE) {
                  this.$message.warning(`上传文件大小不能超过10M`);
                  return false;
                }
              }
              return true;
            },
            onRemove(file, fileList) {
              if (fileList.length === 0) {
                form.value = '';
              }
            },
          },
          children: pro.children || [],
          validate: [
            //校验
            {
              type: formatType(pro.inputType, pro).defaultType,
              required: pro.isNeed,
              // required: true,
              message: pro.keyLabel + '必填',
              trigger: 'blur',
            },
            {
              type: formatType(pro.inputType, pro).defaultType,
              message: regMatch(pro.infoJson.regxtype, pro.inputType).message,
              pattern: regMatch(pro.infoJson.regxtype, pro.inputType).pattern,
            },
            {
              type: formatType(pro.inputType, pro).defaultType,
              message: `最大长度为${pro.infoJson.maxlength}`,
              max: pro.infoJson.maxlength ? pro.infoJson.maxlength - 0 : Infinity,
            },
          ],
          columnId: pro.columnId,
          columnOption: pro.columnOption,
          columnPid: pro.columnPid,
        };
        if (pro.inputType == 'autoComplete') {
          form.props.fetchSuggestions = (queryString, cb) => {
            cb(pro.propData);
          };
        }
        //默认不显示，需要显示时传参showSampleFile
        if (props.showSampleFile) {
          form.suffix = {
            type: 'SampleFile',
            props: {
              fileObj: pro,
              currentNodeCode: props.workInfo.nodeCode,
              showAuthorizeFile: props.showAuthorizeFile,
              remindMessage: pro.remindMessage,
            },
          };
        }
        // 如果元素未隐藏
        if (!isHidden(pro.inputType)) {
          // 产品信息
          if (pro.keyName === 'productItems') {
            try {
              form.value = JSON.parse(form.value);
            } catch (error) {}
            let product = form.value;
            if (!(form.value && form.value.length)) {
              product = [
                {
                  productName: '',
                  brand: '',
                  models: '',
                  classification: '',
                  ceCertificat: '',
                  productTestReportCertificat: '',
                  ukcaCertificat: '',
                  productCertificat: '',
                },
              ];
            }
            form.value = JSON.parse(JSON.stringify(product));
            form.type = 'ProductItems';
            form.col.span = 23;
            form.validate.forEach((i) => (i.type = 'array'));
          }

          // EPR预申报产品信息、回溯产品信息
          if (['eprBacktrackingProductDtos', 'eprProductDtos', 'weeeInfos', 'packageInfos', 'otherEuTaxNumInfos', 'batteryInfos', 'weeeInfosFR', 'weeeInfosES', 'batteryInfosES'].includes(pro.keyName)) {
            form.col.span = 23;
            try {
              form.value = JSON.parse(form.value);
            } catch (error) {}

            let product = form.value;

            if (!(form.value && form.value.length) && (pro.keyName === 'eprBacktrackingProductDtos' || pro.keyName === 'eprProductDtos')) {
              product = [
                {
                  productName: '',
                  unitNumber: '',
                  netWeight: '',
                  priceCodeEcologic: '',
                  unitEcoFee: '',
                  totalFee: '',
                },
              ];
            }
            if (!(form.value && form.value.length) && pro.keyName === 'weeeInfos') {
              product = [
                {
                  productCategory: '',
                  productName: '',
                  productLogo: '',
                  sideMaxSize: '',
                  saleWeight: '',
                },
              ];
            }
            if (!(form.value && form.value.length) && pro.keyName === 'otherEuTaxNumInfos') {
              product = [
                {
                  taxNumCountry: '',
                  vatTaxNumber: '',
                  taxEffectiveDate: '',
                  logisticsCompanyNameEn: '',
                  logisticsCompanyAddressEn: '',
                  clearCompanyNameEn: '',
                  clearCompanyAddressEn: '',
                },
              ];
            }
            if (!form.value && pro.keyName === 'packageInfos') {
              product = {
                papier: 0,
                glas: 0,
                kunststoffe: 0,
                liquidCardboard: 0,
                eisenmetalle: 0,
                sonstigeVerbunde: 0,
                aluminium: 0,
                sonstigeMaterialie: 0,
              };
            }
            if (!(form.value && form.value.length) && pro.keyName === 'batteryInfos') {
              product = [
                {
                  productName: '',
                  batteryType: '',
                  materialType: '',
                  isCharge: '',
                  unitWeight: '',
                  yearDeliveryNum: '',
                  batteryBrand: '',
                },
              ];
            }
            if (!(form.value && form.value.length) && pro.keyName === 'weeeInfosFR') {
              product = [
                {
                  deviceUse: '',
                  firstClass: '',
                  secondaryClass: '',
                  weight: '',
                  prodName: '',
                  prodLink: '',
                },
              ];
            }

            if (!(form.value && form.value.length) && pro.keyName === 'weeeInfosES') {
              product = [
                {
                  prodType: '',
                  prodName: '',
                  prodBrand: '',
                  maxSize: 0,
                  prodLink: '',
                },
              ];
            }

            if (!(form.value && form.value.length) && pro.keyName === 'batteryInfosES') {
              product = [
                {
                  batteryType: '',
                  device: '',
                  unitWeight: 0,
                  yearDeliveryNum: 0,
                  batteryBrand: '',
                },
              ];
            }

            form.value = JSON.parse(JSON.stringify(product));
            form.validate.forEach((i) => (i.type = 'array'));
            if (pro.keyName === 'eprProductDtos') {
              form.type = 'EPRProductItems';
            } else if (pro.keyName === 'batteryInfos') {
              form.type = 'BatteryProductDtos';
            } else if (pro.keyName === 'packageInfos') {
              form.type = 'PackingProductDtos';
              form.validate.forEach((i) => (i.type = 'object'));
            } else if (pro.keyName === 'weeeInfos') {
              form.type = 'WeeeProductDtos';
            } else if (pro.keyName === 'otherEuTaxNumInfos') {
              //其他欧盟国税号信息表
              form.type = 'TaxOtherEuTaxNumInfos';
            } else if (pro.keyName === 'eprBacktrackingProductDtos') {
              form.type = 'EPRBackProductItems';
            } else if (pro.keyName === 'weeeInfosFR') {
              form.type = 'WeeeInfosFR';
            } else if (pro.keyName === 'batteryInfosES') {
              form.type = 'BatteryInfosES';
            } else if (pro.keyName === 'weeeInfosES') {
              form.type = 'WeeeInfosES';
            }
            form.props.isEPRTaxServices = props.isEPRTaxServices;
            form.props.countryCode = props.countryCode;
          }

          // 授权书
          let authorizeFileList = ['authorizeFileOne', 'authorizeFileTwo', 'authorizeFileThree', 'authorizeFileFour', 'registrationAuthorization', 'registrationAuthorization2', 'registrationAuthorization3', 'registrationForm'];
          // 上传授权书
          let custom = ['_customAuthorizationFileOne', '_customAuthorizationFileTwo', '_customAuthorizationFileThree', '_customAuthorizationFileFour'];
          if (authorizeFileList.concat(custom).includes(pro.keyName)) {
            if ([currentCodeEnum.NODE4, currentCodeEnum.NODE5].includes(props.workInfo.currentNodeCode)) {
              // 已审核
              form.suffix = {
                type: 'SampleFile',
                props: {
                  fileObj: pro,
                  remindMessage: pro.remindMessage,
                  currentNodeCode: props.workInfo.currentNodeCode,
                  workId: props.workInfo.workId,
                },
              };
            } else if (props.workInfo.currentNodeCode === currentCodeEnum.NODE6) {
              form.type = 'AuthorizeFile';
              form.props = {
                value: isEmpty(formValue) ? '' : formValue,
                keyLabel: pro.keyLabel,
                fileModelUrl: pro.fileModelUrl,
                sourceFileUrl: pro.sourceFileUrl,
                currentNodeCode: props.workInfo.currentNodeCode,
              };
            }
          }

          //法人签名
          if (pro.keyName == 'companyLegalPersonSign') {
            form.type = 'LegalSigned';
            form.props = {
              serviceNo: props.serviceNo,
            };
            if (pro.infoJson.limit - 0 === 1) {
              if (typeof form.value === 'object' && form.value.length === 1) {
                form.value = form.value[0];
              }
              form.validate.forEach((i) => (i.type = 'string'));
            }
          }
          // 商标分类
          if (item.moduleName == '商标分类') {
            form.type = 'Calssification';
            form.props = {
              calssifyList: item.columns[0].keyNameValue,
              categoryCount: 1,
            };
          }
        }
        // 是否显示描述
        if (props.isTemplate) {
          form.suffix = {
            type: 'SampleFile',
            props: {
              fileObj: pro,
              showAuthorizeFile: props.showAuthorizeFile,
              remindMessage: pro.remindMessage,
              currentNodeCode: props.workInfo.currentNodeCode,
              workId: props.workInfo.workId,
            },
          };
        }

        // link数据联动
        pro.link && (form.link = pro.link);
        pro.update && (form.update = pro.update);

        if (pro.infoJson) {
          if (pro.inputType === 8 || pro.inputType === 9) {
            if (pro.infoJson.datetype === 'monthrange') {
              form.props.format = 'yyyy-MM';
            }
            form.props.type = pro.infoJson.datetype;
          }
          form.info = pro.infoJson;
          form.options = pro.infoJson.groups;
          // 固有选项为客户公司时不请求
          if (form.info.selecttype == 2 && pro.infoJson.selectfixed.url && pro.infoJson.selectfixed.selectKey !== 'custCompanyInfo') {
            form.options = [];
            let selectKey = pro.infoJson.selectfixed.selectKey;
            let method = 'get',
              labelKey = 'label',
              valueKey = 'value';
            if (selectKey === 'country') {
              // 国家
              method = 'post';
              labelKey = 'countryNameZh';
              valueKey = 'countryCode';
            } else if (selectKey === 'regionCode') {
              // 公司所属地区
              labelKey = 'regionName';
              valueKey = 'regionCode';
            }
            form.effect = {
              fetch: {
                action: vue.baseUrl + '/' + pro.infoJson.selectfixed.url,
                to: 'options',
                method,
                parse(res) {
                  return res.data.map((row) => {
                    return {
                      label: row[labelKey],
                      value: row[valueKey],
                    };
                  });
                },
              },
            };
          }
        }
        pro.options && (form.options = pro.options);

        datalist.push(form);
      });
    }
  });
  return props.noControl ? datalist : getControlData(datalist);
};
// 联动数据
function getControlData(datalist) {
  let map = new Map();
  let data = [];
  datalist.forEach((item) => {
    if (item.columnId) {
      map.set(item.columnId, item);
    }
  });
  datalist.forEach((item) => {
    const parent = map.get(item.columnPid);
    if (parent) {
      (parent.control || (parent.control = [])).push({
        handle: (val) => {
          return item.columnOption.split(',').includes(val);
        },
        rule: [item],
      });
    } else {
      data.push(item);
    }
  });
  return data;
}

const formatType = (type, pro) => {
  switch (type) {
    case 1:
      return {
        type: 'input',
        propType: 'input',
        default: '',
        defaultType: 'string',
      };
    case 2:
      return {
        type: 'radio',
        propType: 'radio',
        default: '',
        defaultType: 'string',
      };
    case 3:
      return {
        type: 'checkbox',
        propType: 'checkbox',
        default: [],
        defaultType: 'array',
      };
    case 4:
      return {
        type: 'upload',
        propType: 'upload',
        default: [],
        defaultType: 'array',
      };
    case 5:
      return {
        type: 'select',
        propType: 'select',
        default: '',
        defaultType: pro.infoJson.multiple ? 'array' : 'string',
      };
    case 6:
      return {
        type: 'input',
        propType: 'textarea',
        default: '',
        defaultType: 'string',
      };
    case 7:
      return {};
    case 8:
      return {
        type: 'DatePicker',
        propType: 'datetime',
        default: '',
        defaultType: 'string',
      };
    case 9:
      return {
        type: 'DatePicker',
        propType: 'daterange',
        default: [],
        defaultType: 'array',
      };
    case 'autoComplete':
    case 'hidden':
      return {
        type,
        propType: 'text',
        default: '',
        defaultType: 'string',
      };
    default:
      return {
        type: 'AuthorizeFile',
        propType: null,
        default: '',
        defaultType: 'string',
      };
  }
};

const regMatch = (regxtype, inputType) => {
  if (inputType !== 1) {
    return {
      message: '',
      pattern: '',
    };
  }
  switch (regxtype) {
    case '1':
      return {
        message: '仅支持数字',
        pattern: /^\d+$/,
      };
    case '2':
      return {
        message: '仅支持数字和两位小数',
        pattern: /^\d+(.\d{2})?$/,
      };
    case '3':
      return {
        message: '邮箱格式错误',
        pattern: /^([a-zA-Z0-9_-]+\.)*[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      };
    // case '4':
    //   return {
    //     message: '手机号格式错误',
    //     pattern: /^1[3456789]\d{9}$/
    //   }
    default: {
      return {
        message: '',
        pattern: '',
      };
    }
  }
};
const isHidden = (type) => {
  return type === 'hidden';
};

const isEmpty = (data) => {
  return data === void 0 || data === '' || data === '{}' || JSON.stringify(data) === '{}' || JSON.stringify(data) === '[]';
};

const formatImg = (url) => {
  try {
    url = JSON.parse(url);
  } catch (error) {
    try {
      if (typeof url === 'string') {
        url = url.split(',').filter((i) => i);
      }
    } catch (e) {}
  }
  return url;
};
