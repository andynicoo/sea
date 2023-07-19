import Vue from 'vue';
import vueThis from '@/main';
/** 数据处理 */
export const dynamicForm = (moduleList, { ...props }, fApi) => {
  var vue = new Vue({});
  let datalist = [];
  moduleList.sort((a, b) => {
    // 字段排序
    return a.sort - b.sort;
  });

  moduleList.map((item) => {
    //模块名称处理列如：公司信息、法人信息
    if (item.columns.length) {
      if (item.moduleName) {
        let displayFlag = !item.columns.every((i) => i.hasOwnProperty('displayFlag') && !i.displayFlag);
        datalist.push({
          type: 'formTitle',
          className: datalist.length ? '' : 'form-title-one',
          value: item.moduleName,
          field: 'testField',
          display: displayFlag,
          col: {
            span: 24,
          },
          props: {
            moduleCode: item.moduleCode,
          },
        });
      }
      item.columns.sort((a, b) => {
        //字段排序
        return a.sort - b.sort;
      });
      item.columns.map((pro) => {
        pro.infoJson = pro.info ? JSON.parse(pro.info) : {};
        pro.infoJson.limit = pro.infoJson.limit || 1;
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
        //税号生效日期改为输入框类型
        if (pro.keyName === 'taxEffectiveDate') {
          pro.inputType = 5;
        }

        //自动识别默认是否显示,选填不显示
        let displayFlag = true;
        if (pro.hasOwnProperty('displayFlag')) {
          displayFlag = pro.displayFlag;
        } else if (['vorwahlNational', 'isOtherEUDutyOrServices'].includes(pro.keyName) || !pro.isNeed) {
          //选填字段隐藏
          if (!['vatTaxNumberCopyFile', 'changeDeclarePeriodLetter'].includes(pro.keyName)) {
            //特殊选填字段不隐藏
            displayFlag = false;
          }
        }
        //驳回原因
        let rejectflag = pro.rejectDTO && (pro.rejectDTO.reject || pro.rejectDTO.annexList.length);
        let required = pro.isNeed;
        if (props.isReject && !rejectflag) {
          required = false;
        }
        //基础数据
        let form = {
          type: formatType(pro.inputType, pro).type,
          display: displayFlag,
          title: {
            title: (!pro.isNeed ? '（选填）' : '') + pro.keyLabel,
            children: [
              {
                type: 'TitleOperation',
                props: {
                  keyName: pro.keyName,
                  fApi,
                  moduleListBlock: props.moduleListBlock,
                },
              },
            ],
          },

          field: pro.keyName,
          nativeEmit: ['click'],
          emit: ['on-change'],
          prefix: {
            type: 'Remark',
            props: {
              keyName: pro.keyName,
              isReject: rejectflag ? true : false,
              moduleCode: pro.moduleCode,
              fApi,
              remindMessage: pro.remindMessage,
            },
          },
          col: pro.col || {
            span: 24,
          },
          value: formValue,
          moduleCode: pro.moduleCode,
          props: {
            disabled: pro.disabled || false,
            type: pro.infoJson.drag ? 'drag' : formatType(pro.inputType, pro).propType,
            placeholder: pro.placeHolder,
            // workInfo: props.workInfo,
            isReject: props.isReject,
            format: 'yyyy-MM-dd',
            rangeSeparator: '至',
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            action: vue.ImgUrl,
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
              if (['companyBusinessLicense', 'identityCardFront', 'identityCardReverse'].includes(pro.keyName)) {
                const MAX_SIZE = file.size / 1024 / 1024 < 10;
                // 验证文件大小
                if (!MAX_SIZE) {
                  this.$message.warning(`上传文件大小不能超过10M`);
                  return false;
                }
              }
              if (this.fileList.length >= pro.infoJson.limit) {
                vue.$Message.warning(`最多可上传${pro.infoJson.limit}个文件`);
                return false;
              }
              return true;
            },
          },
          children: pro.children || [],
          validate: [
            //校验
            {
              type: formatType(pro.inputType, pro).defaultType,
              required: required,
              message: pro.keyLabel + '不能为空',
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
              max: pro.infoJson.maxlength || Infinity,
            },
          ],
          columnId: pro.columnId,
          columnOption: pro.columnOption,
          columnPid: pro.columnPid,
        };
        if (rejectflag) {
          form.suffix = {
            type: 'RejectReason',
            props: {
              rejectDTO: pro.rejectDTO,
            },
          };
        }
        // 对日期格式校验单独处理
        if (pro.inputType === 8) {
          form.validate = pro.isNeed
            ? [
                {
                  type: 'date',
                  required: pro.isNeed,
                  message: pro.keyLabel + '不能为空',
                },
              ]
            : [];
        }
        if ((pro.sourceFileUrl && pro.sourceFileUrl != '[]') || props.showAuthorizeFile || props.showSourceFile) {
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
        }
        let validate = (rule, value, callback) => {
          if (value < 8000 || value > 500000) {
            return callback(new Error('请输入8000-50000之间的数'));
          } else {
            callback();
          }
        };

        //明年预计销售额,今年预计销售额校验
        if (['shopPredictNextSale', 'shopPredictSale'].includes(pro.keyName)) {
          form.class = 'shopPredictSaleAppend';
          form.children = [
            {
              type: 'span',
              slot: 'append',
              children: ['欧元'],
            },
          ];
          form.validate = [
            {
              type: 'string',
              required: pro.isNeed,
              message: pro.keyLabel + '不能为空',
              trigger: 'blur',
            },
            {
              message: '只能输入数字，请重新输入',
              pattern: /^\d+$/,
            },
            {
              type: 'string',
              validator: validate,
            },
          ];
        }
        let validateBetrag = (rule, value, callback) => {
          if (value < 2000) {
            return callback(new Error('请输入大于2000的数'));
          } else {
            callback();
          }
        };
        //第一年纳税金额
        if ('betrag' === pro.keyName) {
          form.class = 'shopPredictSaleAppend';
          form.children = [
            {
              type: 'span',
              slot: 'append',
              children: ['欧元'],
            },
          ];
          form.validate = [
            {
              type: 'string',
              required: pro.isNeed,
              message: pro.keyLabel + '不能为空',
              trigger: 'blur',
            },
            {
              message: '只能输入数字，请重新输入',
              pattern: /^\d+$/,
            },
            {
              type: 'string',
              validator: validateBetrag,
            },
          ];
        }
        let validateCompanyAddressEn = (rule, value, callback) => {
          if (/[\u4e00-\u9fa5]/.test(value)) {
            if ('companyAddressEn' === pro.keyName) {
              return callback(new Error('您的店铺信息链接英文详细地址中包含中文字符，请更改为全英文字符。'));
            } else {
              return callback(new Error('只能输入英文字符，请重新输入'));
            }
          } else {
            callback();
          }
        };
        if (['shopLogisticsCompany', 'companyNameEn'].includes(pro.keyName)) {
          form.class = 'formMaxWidth';
        }
        //店铺信息链接英文详细地址,城市
        if (['companyAddressEnCity', 'companyAddressEn', 'companyNameEn'].includes(pro.keyName)) {
          form.validate = [
            {
              type: 'string',
              required: pro.isNeed,
              message: pro.keyLabel + '不能为空',
              trigger: 'blur',
            },
            {
              type: 'string',
              validator: validateCompanyAddressEn,
            },
          ];
        }

        //法人签名
        if (pro.keyName == 'companyLegalPersonSign') {
          form.type = 'LegalSigned';
          form.props = {
            disabled: form.props.disabled,
            fApi,
          };
        }

        //单选'公司类型', '证件类型'，'店铺所在平台'
        if (['companyType', 'certificateType', 'shopSalePlatformName'].includes(pro.keyName)) {
          form.type = 'RadioComponents';
          form.props = {
            formItem: pro,
            fApi,
            isReject: props.isReject,
          };
        }
        //上传文件的字段
        if (form.type === 'upload') {
          form.type = 'UploadFiles';
          form.props = {
            formItem: pro,
            fApi,
            moduleListBlock: props.moduleListBlock,
            isReject: props.isReject,
          };
        }
        //公司电话
        if (['companyTel'].includes(pro.keyName)) {
          form.type = 'CompanyPhone';
          form.props = {
            formItem: pro,
            fApi,
          };
          form.validate = [
            {
              type: 'string',
              required: pro.isNeed,
              message: pro.keyLabel + '不能为空',
              trigger: 'blur',
            },
            {
              type: 'string',
              message: '只能输入数字，请重新输入',
              pattern: /^\d+$/,
              trigger: 'blur',
            },
            {
              type: 'string',
              message: '您填写的联系电话少于11位/超出11位，请重新填写',
              pattern: /^\d{11}$/,
              trigger: 'blur',
            },
          ];
        }
        //公司邮箱
        if (['companyEmail'].includes(pro.keyName)) {
          form.type = 'CompanyEmail';
          form.props = {
            formItem: pro,
            fApi,
          };
        }
        // //税号生效日期
        if (['taxEffectiveDate'].includes(pro.keyName)) {
          form.type = 'TaxIdEffectiveDate';
          form.props = {
            formItem: pro,
            fApi,
          };
        }
        //店铺链接
        let validateShopHref = (rule, value, callback) => {
          let shopOtherEuTaxNumber = fApi.getValue('shopOtherEuTaxNumber') || '';
          let shopSalePlatformName = fApi.getValue('shopSalePlatformName');
          if (!value.includes('https://www.amazon.de/sp') && shopSalePlatformName === 'Amazon') {
            return callback(new Error('您的店铺信息链接，非亚马逊德国站链接，请重新填写'));
          } else if (shopOtherEuTaxNumber.includes('DE') && props.workInfo.functionCode !== '2') {
            return callback(
              new Error(
                `您的店铺信息链接已绑定有德国VAT税号（${shopOtherEuTaxNumber}），不符合税局注册要求。请更换未绑定德国税号的店铺链接或解绑现有税号后，重新填写。`
              )
            );
          } else {
            callback();
          }
        };
        if (['shopHref'].includes(pro.keyName)) {
          form.type = 'ShopHref';
          form.props = {
            formItem: pro,
            fApi,
            moduleListBlock: props.moduleListBlock,
            workInfo: props.workInfo,
          };
          form.validate = [
            {
              type: 'string',
              required: pro.isNeed,
              message: pro.keyLabel + '不能为空',
              trigger: 'blur',
            },
            {
              type: 'string',
              validator: validateShopHref,
            },
          ];
        }
        //报税周期
        if (['declarePeriod', 'currentDeclarePeriod'].includes(pro.keyName)) {
          form.type = 'TaxReportingPeriod';
          form.props = {
            formItem: pro,
            fApi,
          };
        }
        //申报区间
        if (['lastDeclarePeriod', 'nextDeclarePeriod'].includes(pro.keyName)) {
          form.type = 'DeclarationInterval';
          form.props = {
            formItem: pro,
            fApi,
          };
        }
        //店铺信息链接的英文详细地址
        if ('companyAddressEn' === pro.keyName) {
          form.type = 'StoreLinkDetailedAddress';
          form.props = {
            formItem: pro,
            fApi,
          };
        }
        //店铺业务范围
        let validateModeDescribe = (rule, value, callback) => {
          if (value.length > 3) {
            return callback(new Error('店铺业务范围最多只能选3个！'));
          } else if (/[\u4e00-\u9fa5]/.test(value.join())) {
            return callback(new Error('只能输入英文字符，请重新输入!'));
          } else {
            callback();
          }
        };
        if ('companyBusinessModeDescribe' === pro.keyName) {
          form.type = 'CompanyBusinessModeDescribe';
          form.props = {
            formItem: pro,
            fApi,
          };
          form.validate = [
            {
              type: 'array',
              required: pro.isNeed,
              message: pro.keyLabel + '不能为空',
              trigger: 'blur',
            },
            {
              type: 'array',
              validator: validateModeDescribe,
            },
          ];
        }
        //欧盟税号校验
        let validateVatTaxEuNumber = (rule, value, callback) => {
          if (!/^DE\d{9}/.test(value)) {
            return callback(new Error('欧盟税号格式统一为DE+9位数字，请重新输入!'));
          } else if (/[\u4e00-\u9fa5]/.test(value)) {
            return callback(new Error('只能输入英文,数字，请重新输入!'));
          } else {
            callback();
          }
        };
        if ('vatTaxEuNumber' === pro.keyName) {
          form.validate = [
            {
              type: 'string',
              required: pro.isNeed,
              message: pro.keyLabel + '不能为空',
              trigger: 'blur',
            },
            {
              type: 'string',
              validator: validateVatTaxEuNumber,
            },
          ];
        }

        //上传文件组件+示例文件
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

        // link数据联动
        pro.link && (form.link = pro.link);
        pro.update && (form.update = pro.update);
        if (!form.update) {
          form.update = (val, rule, fApi) => {
            rule.props.confirmSuccess = false;
            setTimeout(() => {
              Vue.prototype.$util.removeClass(fApi.el(form.field).$parent.$el, 'confirm-success');
            });
            vueThis.$store.dispatch('changeSetTodoNum', fApi.rule);
          };
        }

        if (pro.infoJson) {
          // if (pro.inputType === 8 || pro.inputType === 9) {
          //   if (pro.infoJson.datetype === 'monthrange') {
          //     form.type = 'monthrange';
          //   }
          //   form.props.type = pro.infoJson.datetype;
          // }
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
  if (props.isReject) {
    return datalist;
  }
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
        type: 'SampleFile',
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
        message: '只能输入数字，请重新输入',
        pattern: /^\d+$/,
      };
    case '2':
      return {
        message: '只能输入数字和两位小数，请重新输入',
        pattern: /^\d+(.\d{2})?$/,
      };
    case '3':
      return {
        message: '邮箱格式错误，请重新输入',
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
  return url
    ? [
        {
          name,
          url,
        },
      ]
    : [];
};

const isEmpty = (data) => {
  return data === void 0 || data === '' || data === '{}' || JSON.stringify(data) === '{}';
};
