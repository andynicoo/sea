import Vue from 'vue';
import vueThis from '@/main';
/** 数据处理 */
export const dynamicForm = (moduleList, { ...props }) => {
  var vue = new Vue({});
  let datalist = [];
  let companyBusinessLicenseFlg = false;
  let identityCardFrontFlg = false;
  let identityCardReverseFlg = false;
  let companyBusinessLicenseVal = false;
  let identityCardFrontVal = false;
  let identityCardReverseVal = false;
  moduleList.sort((a, b) => {
    // 字段排序
    return a.sort - b.sort;
  });
  moduleList.forEach((module) => {
    module.columns.forEach((item) => {
      if (item.keyName == 'companyBusinessLicense') {
        item.infoJson = item.info ? JSON.parse(item.info.replace(/\'/g, '"')) : {};
        companyBusinessLicenseFlg = item.infoJson.automaticRecognition;
        companyBusinessLicenseVal = ['""', '{}'].includes(JSON.stringify(item[props.formValueLabel]))
          ? ''
          : item[props.formValueLabel];
      }
      if (item.keyName == 'identityCardFront') {
        item.infoJson = item.info ? JSON.parse(item.info.replace(/\'/g, '"')) : {};
        identityCardFrontFlg = item.infoJson.automaticRecognition;
        identityCardFrontVal = ['""', '{}'].includes(JSON.stringify(item[props.formValueLabel]))
          ? ''
          : item[props.formValueLabel];
      }
      if (item.keyName == 'identityCardReverse') {
        item.infoJson = item.info ? JSON.parse(item.info.replace(/\'/g, '"')) : {};
        identityCardReverseFlg = item.infoJson.automaticRecognition;
        identityCardReverseVal = ['""', '{}'].includes(JSON.stringify(item[props.formValueLabel]))
          ? ''
          : item[props.formValueLabel];
      }
    });
  });

  moduleList.map((item) => {
    // 模块名称处理列如：公司信息、法人信息
    if (item.columns.length && item.columns.some((c) => c.inputType !== 'hidden')) {
      if (item.moduleName) {
        datalist.push({
          type: 'formTitle',
          className: datalist.length ? '' : 'form-title-one',
          value: item.moduleName,
          field: 'testField',
          col: {
            span: 24,
          },
        });
      }
      item.columns.sort((a, b) => {
        // 字段排序
        return a.sort - b.sort;
      });
      if (props.taxInspection && item.moduleCode === 'companyInfo') {
        datalist.push({
          type: 'input',
          props: {
            disabled: true,
          },
          title: '稽查国家',
          field: 'testField',
          value: props.taxInspectionCountry,
          col: {
            span: props.colspan,
          },
        });
      }
      if (props.logoutTaxNum && item.moduleCode === 'companyInfo') {
        datalist.push({
          type: 'input',
          props: {
            disabled: true,
          },
          title: '注销税号国家',
          field: 'testField',
          value: props.logoutTaxNumCountry,
          col: {
            span: props.colspan,
          },
        });
      }

      item.columns.map((pro) => {
        pro.infoJson = pro.info ? JSON.parse(pro.info.replace(/\'/g, '"')) : {};
        pro.infoJson.limit = pro.infoJson.limit || 1;
        let formValue = '';
        // 数据兼容
        if (pro.inputType === 4 && pro.keyNameValue == '') {
          pro.keyNameValue = {};
        }
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
          try {
            formValue = JSON.parse(formValue);
          } catch (error) {
            try {
              if (typeof formValue === 'string') {
                formValue = formValue.split(',').filter((i) => i);
              }
            } catch (e) {}
          }
        }
        // 当单选项只配置了一个选项时，默认选中该选项
        if (pro.inputType === 2 && pro.infoJson.groups.length == 1) {
          formValue = pro.infoJson.groups[0].value;
        }
        //自动识别默认是否显示
        let displayFlag = true;
        if (companyBusinessLicenseFlg && !companyBusinessLicenseVal) {
          if (
            [
              'BusinessLicenseNumber',
              'companyNameZh',
              'AddressOfBusiness',
              'companyLegalPersonCh',
              'DateOfRegistration',
            ].includes(pro.keyName)
          ) {
            displayFlag = false;
          }
        }
        if (identityCardFrontFlg && !identityCardFrontVal) {
          if (['NameOfCertificateHolder', 'DocumentNumber', 'AddressOfDocumentHolder'].includes(pro.keyName)) {
            displayFlag = false;
          }
        }
        if (identityCardReverseFlg && !identityCardReverseVal) {
          if (['ValidityPeriodOfCertificate'].includes(pro.keyName)) {
            displayFlag = false;
          }
        }
        // 基础数据
        let form = {
          type: formatType(pro.inputType, pro).type,
          display: displayFlag,
          title: pro.keyLabel,
          field: pro.keyName,
          nativeEmit: ['click'],
          // suffix: {
          //   type: 'div',
          //   children: [pro.remindMessage],
          //   class: 'text-tips',
          // },
          col: pro.col || {
            span: props.colspan,
          },
          value: formValue,
          props: {
            maxlength: Number(pro.infoJson.maxlength) || Infinity,
            disabled: pro.disabled || false,
            type: pro.infoJson.drag ? 'drag' : formatType(pro.inputType, pro).propType,
            placeholder: pro.placeHolder,
            // format: "yyyy-MM-dd",
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            action: vue.uploadUrl,
            multiple: pro.infoJson.multiple || false,
            filterable: pro.infoJson.filterable || false,
            rows: +pro.infoJson.rows || 2,
            accept: [...new Set(pro.infoJson.accepts.map((a) => '.' + a))].join(','),
            // uploadType: "image",
            // showFileList: true,
            showUploadList: true,
            fileModelUrl: pro.fileModelUrl,
            allowRemove: true,
            onSuccess: function(res, file) {
              file.url = res.data.fileUrl;
              pro.renameText = file.url;
              if (props.isAuthorizationLetter) {
                pro.keyNameValue = file.url;
              }
              if (pro.infoJson && pro.infoJson.automaticRecognition) {
                //营业执照识别
                if (pro.keyName == 'companyBusinessLicense') {
                  vueThis.$store.dispatch('app/setBusinessLicense', `COMPANY_LICENSE|${file.url}`);
                }
                //身份证人像面
                if (pro.keyName == 'identityCardFront') {
                  vueThis.$store.dispatch('app/setBusinessLicense', `ID_CARD|${file.url}`);
                }
                //身份证国徽面
                if (pro.keyName == 'identityCardReverse') {
                  vueThis.$store.dispatch('app/setBusinessLicense', `ID_CARD_REVERSE|${file.url}`);
                }
              }
            },
            onRemove: function(res, file) {
              if (props.isAuthorizationLetter) {
                pro.renameText = '';
                pro.keyNameValue = '';
              }
            },
            onPreview(file) {
              if (file.response) {
                window.open(file.response.data.fileUrl.replace('http://', 'https://'));
              } else {
                window.open(file.url.replace('http://', 'https://'));
              }
            },
            beforeUpload(file) {
              let params = pro.infoJson.accepts.join('|');
              let reg = new RegExp('.(' + params + ')$');
              if (!reg.test(file.name.toLowerCase())) {
                vue.$Message.warning('上传文件格式错误！');
                return false;
              }
              if (this.fileList.length >= pro.infoJson.limit) {
                vue.$Message.warning(`上传失败，最多可上传${pro.infoJson.limit}个文件`);
                return false;
              }
              return true;
            },
          },
          children: pro.children || [],
          validate: [
            // 校验
            {
              type: formatType(pro.inputType, pro).defaultType,
              required: pro.isNeed,
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
              max: Number(pro.infoJson.maxlength) || Infinity,
            },
          ],
          columnId: pro.columnId,
          columnOption: pro.columnOption,
          columnPid: pro.columnPid,
        };
        // 对日期格式校验单独处理
        if (pro.inputType === 8) {
          form.validate = pro.isNeed ? [{ type: 'date', required: pro.isNeed, message: pro.keyLabel + '必填' }] : [];
        }
        //授权书需求显示SampleFile
        if (props.isAuthorizationLetter) {
          form.suffix = {
            type: 'SampleFile',
            props: {
              fileObj: pro,
              showAuthorizeFile: props.showAuthorizeFile,
              remindMessage: pro.remindMessage,
            },
          };
        }

        // 产品信息
        if (pro.keyName === 'productItems') {
          form.col.span = 23;
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
          form.validate.forEach((i) => (i.type = 'array'));
        }
        // EPR预申报产品信息、回溯产品信息
        if (
          pro.keyName === 'eprBacktrackingProductDtos' ||
          pro.keyName === 'eprProductDtos' ||
          pro.keyName === 'weeeInfos' ||
          pro.keyName === 'packageInfos' ||
          pro.keyName === 'batteryInfos'
        ) {
          // form.col.span = 23;
          form.col.className = 'productListTable-wrap';
          form.suffix = {
            type: 'SampleFile',
            props: {
              fileObj: pro,
              showAuthorizeFile: props.showAuthorizeFile,
              showSourceFile: props.showSourceFile,
              remindMessage: pro.remindMessage,
              workInfo: props.workInfo,
            },
          };
          try {
            form.value = JSON.parse(form.value);
          } catch (error) {}
          let product = form.value;

          if (
            !(form.value && form.value.length) &&
            (pro.keyName === 'eprBacktrackingProductDtos' || pro.keyName === 'eprProductDtos')
          ) {
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
          if (!form.value && pro.keyName === 'packageInfos') {
            product = {
              papier: '',
              glas: '',
              kunststoffe: '',
              liquidCardboard: '',
              eisenmetalle: '',
              sonstigeVerbunde: '',
              aluminium: '',
              sonstigeMaterialie: '',
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
          } else {
            form.type = 'EPRBackProductItems';
          }
        }
        if (pro.keyName === 'isBacktracking') form.col.span = 23;

        // 法人签名
        if (pro.keyName == 'companyLegalPersonSign') {
          form.type = 'LegalSigned';
          form.props = {
            disabled: form.props.disabled,
            serviceNo: props.serviceNo,
            fileModelUrl: pro.fileModelUrl,
          };
        }
        //数据兼容
        if (
          typeof pro.keyNameValue == 'string' &&
          (pro.keyName == 'companyBusinessLicense' ||
            pro.keyName == 'trademarkLogo' ||
            pro.keyName == 'identityCardFront' ||
            pro.keyName == 'identityCardReverse')
        ) {
          form.value = [pro.keyNameValue.replace(/\"/g, '')];
        }
        // 商标分类
        if (pro.keyName == 'trademarkCategory') {
          form.type = 'TrademarkClassification';
          form.props = {
            serviceInfo: props.serviceInfo,
          };
          form.validate.forEach((i) => (i.type = 'array'));
        }
        // 销售链接
        if (pro.keyName == 'marketHref') {
          form.type = 'SalesLinks';
          form.props = {
            serviceInfo: props.serviceInfo,
            moduleListData: props.moduleList,
          };
          form.validate.forEach((i) => (i.type = 'array'));
        }
        // 上传产品图
        if (pro.keyName == 'useProductImg') {
          form.type = 'ProductPictures';
          form.props = {
            serviceInfo: props.serviceInfo,
          };
        }
        // 上传订单详情截图
        if (pro.keyName == 'useEvidence') {
          form.type = 'OrderScreenshot';
          form.props = {
            serviceInfo: props.serviceInfo,
          };
        }
        // 上传文件组件+示例文件
        if (pro.inputType == 4) {
          form.props.type = 'select';
          // form.suffix={type:'SampleFile', props:{fileObj:pro, showAuthorizeFile: props.showAuthorizeFile}};
          form.children = [
            {
              type: 'i',
              class: 'ivu-icon ivu-icon-ios-cloud-upload-outline',
            },
            '点击上传',
          ];
        }
        if (pro.keyName == 'taxEffectiveDate') {
          form.info = {
            info: `温馨提示：捷克税号下达的日期为税号生效日期。请填写预期发货日期。如果填写日期早于税号下达日期，
            则需回溯申报，回溯申报将导致产生罚金/滞纳金/利息；建议在开始销售前注册捷克VAT税号；`,
            align: 'left',
          };
        }

        // 海牙授权书
        let authorizeFileList = ['authorizeFileOne', 'authorizeFileTwo', 'authorizeFileThree', 'authorizeFileFour'];
        if (authorizeFileList.includes(pro.keyName) && props.hyAuthorized) {
          form.type = 'SampleFile';
          form.props.type = null;
          // form.suffix={type:'SampleFile', props:{fileObj:pro, showAuthorizeFile: props.showAuthorizeFile}};
          form.children = [];
        }

        // link数据联动
        pro.link && (form.link = pro.link);
        pro.update && (form.update = pro.update);

        if (pro.infoJson) {
          if (pro.inputType === 8 || pro.inputType === 9) {
            if (pro.infoJson.datetype === 'monthrange') {
              form.type = 'monthrange';
            }
            form.props.type = pro.infoJson.datetype;
          }
          form.info = pro.infoJson;
          form.options = pro.infoJson.groups;
          // 禁用单选框
          if (pro.inputType === 2 && pro.disabled) {
            form.options.forEach((item) => {
              item.disabled = true;
            });
          }
          // 固有选项为客户公司时不请求
          if (
            form.info.selecttype == 2 &&
            pro.infoJson.selectfixed.url &&
            pro.infoJson.selectfixed.selectKey !== 'custCompanyInfo'
          ) {
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
        // 需要过滤的字段
        if (pro.keyName !== 'certificat') datalist.push(form);
      });
    }
  });
  return getControlData(datalist, '');
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
        propType: 'text',
        default: '',
        defaultType: 'string',
      };
    case 2:
      return {
        type: 'radio',
        propType: null,
        default: '',
        defaultType: 'string',
      };
    case 3:
      return {
        type: 'checkbox',
        propType: null,
        default: [],
        defaultType: 'array',
      };
    case 4:
      return {
        type: 'upload',
        propType: 'select',
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
        defaultType: 'date',
      };
    case 9:
      return {
        type: 'DatePicker',
        propType: 'daterange',
        default: [],
        defaultType: 'array',
      };
    case 'autoComplete':
      return {
        type: 'autoComplete',
        propType: 'text',
        default: '',
        defaultType: 'string',
      };
    default:
      return {
        type,
        propType: 'text',
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
    // case "4":
    //   return {
    //     message: "手机号格式错误",
    //     pattern: /^1[3456789]\d{9}$/,
    //   };
    default: {
      return {
        message: '',
        pattern: '',
      };
    }
  }
};
const dealFile = (url, name) => {
  return url ? [{ name, url }] : [];
};

const isEmpty = (data) => {
  return data === void 0 || data === '' || data === '{}' || JSON.stringify(data) === '{}';
};
