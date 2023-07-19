import { log, re } from 'mathjs';
import Vue from 'vue';
import { emit } from '../../public/Neditor/third-party/zeroclipboard/ZeroClipboard';
export const trademarkDataHandle = (moduleList, servicesStatus) => {
  var vue = new Vue({});
  let datalist = [],
    disabled = servicesStatus == 9 ? true : false;
  // console.log("serviceStatus", servicesStatus, disabled);
  moduleList.map((item, i) => {
    if (item.moduleName != '商标分类') {
      datalist.push({
        type: 'formTitle',
        value: item.moduleName,
        field: 'testField',
        columnPid: '',
      });
    }

    item.columns.sort((a, b) => {
      return a.sort - b.sort;
    });
    item.columns.map((pro) => {
      pro.infoJson = pro.info ? JSON.parse(pro.info.replace(/\'/g, '"')) : {};
      if (pro.inputType == 6) pro.type = 'textarea';
      if (pro.inputType == 8) pro.type = 'date';
      if (pro.inputType == 9) pro.type = 'daterange';
      let formTep = {
        type: inputType(pro.inputType),
        title: pro.keyLabel,
        field: pro.keyName,
        value: JSON.stringify(pro.keyNameValue) == '{}' ? '' : pro.keyNameValue,
        props: {
          required: pro.isNeed == 1 ? true : false,
          type: pro.type ? pro.type : inputType(pro.inputType),
          disabled: disabled,
          filterable: pro.filterable ? true : pro.infoJson.filterable || false,
          placeholder: pro.placeHolder,
          format: 'yyyy-MM-dd',
          rangeseparator: '至',
          startPlaceholder: '开始日期',
          endPlaceholder: '结束日期',
          limit: pro.info.limit,
        },
        validate: [
          {
            required: pro.isNeed == 1 ? true : false,
            message: pro.remindMessage || pro.keyLabel + '必填',
            trigger: pro.inputType == 1 ? 'blur' : pro.inputType == 6 ? 'blur' : 'change',
          },
          {
            message: `最大长度为${pro.infoJson.maxlength}`,
            max: pro.infoJson.maxlength ? pro.infoJson.maxlength - 0 : Infinity,
          },
        ],
        columnId: pro.columnId,
        columnOption: pro.columnOption,
        columnPid: pro.columnPid,
      };
      if (pro.inputType == 4) {
        formTep.props = {
          type: formatType(pro.inputType).propType,
          placeholder: pro.placeHolder,
          action: vue.baseUrl + '/file/oss/upload',
          multiple: pro.infoJson.multiple || false,
          uploadType: 'image',
          // name: "file",
          // maxLength: pro.info.limit,
          format: pro.info.accepts,
          allowRemove: true,
          limit: pro.infoJson.limit - 0 || '',
          onSuccess: function (res, file) {
            file.url = res.data.fileUrl.replace('http://', 'https://');
            pro.renameText = file.url;
            if (pro.infoJson.limit - 0 === 1) {
              formTep.validate.forEach((i) => (i.type = 'string'));
            }
          }, //文件上传成功时的钩子，返回字段为
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
            return true;
          },
        };
        // 美标使用证据-上传订单详情截图
        if (pro.keyName == 'useEvidence' && pro.keyNameValue != '' && JSON.stringify(pro.keyNameValue) != '{}' && !isJson(pro.keyNameValue)) {
          formTep.value = JSON.parse(pro.keyNameValue);
        }
        // 美标使用证据-上传产品图
        if (pro.keyName == 'useProductImg' && pro.keyNameValue != '' && JSON.stringify(pro.keyNameValue) != '{}' && !isJson(pro.keyNameValue)) {
          formTep.value = JSON.parse(pro.keyNameValue);
        }
        // 公司营业执照
        if (pro.keyName == 'companyBusinessLicense' && pro.keyNameValue != '' && JSON.stringify(pro.keyNameValue) != '{}' && !isJson(pro.keyNameValue)) {
          formTep.value = JSON.parse(pro.keyNameValue);
        }
        // 商标LOGO
        if (pro.keyName == 'trademarkLogo' && pro.keyNameValue != '' && JSON.stringify(pro.keyNameValue) != '{}' && !isJson(pro.keyNameValue)) {
          formTep.value = JSON.parse(pro.keyNameValue);
        }
        // 身份证正面
        if (pro.keyName == 'identityCardFront' && pro.keyNameValue != '' && JSON.stringify(pro.keyNameValue) != '{}' && !isJson(pro.keyNameValue)) {
          formTep.value = JSON.parse(pro.keyNameValue);
        }
        // 身份证反面
        if (pro.keyName == 'identityCardReverse' && pro.keyNameValue != '' && JSON.stringify(pro.keyNameValue) != '{}' && !isJson(pro.keyNameValue)) {
          formTep.value = JSON.parse(pro.keyNameValue);
        }
        //小语种
        if (pro.keyName == 'otherSmallLanguagesFiles' && pro.keyNameValue != '' && JSON.stringify(pro.keyNameValue) != '{}' && !isJson(pro.keyNameValue)) {
          formTep.value = JSON.parse(pro.keyNameValue);
        }
      }
      if (pro.inputType == 5 || pro.inputType == 2) {
        formTep.options = pro.info.groups;
        // formTep.filterable = pro.filterable ? true : pro.infoJson.filterable || false;
        if (JSON.stringify(pro.keyNameValue) != '{}') formTep.value = String(pro.keyNameValue);
      }
      // 当单选项只配置了一个选项时，默认选中该选项
      if (pro.inputType === 2 && pro.infoJson.groups.length == 1) {
        formTep.value = pro.infoJson.groups[0].value;
      }
      if (pro.infoJson) {
        if (pro.inputType === 8 || pro.inputType === 9) {
          if (pro.infoJson.datetype === 'monthrange') {
            formTep.props.format = 'yyyy-MM';
          }
          formTep.props.type = pro.infoJson.datetype;
        }
        formTep.info = pro.infoJson;
        formTep.options = pro.infoJson.groups;
        // 固有选项为客户公司时不请求
        if (formTep.info.selecttype == 2 && pro.infoJson.selectfixed.url && pro.infoJson.selectfixed.selectKey !== 'custCompanyInfo') {
          formTep.options = [];
          formTep.effect = {
            fetch: {
              action: vue.baseUrl + '/' + pro.infoJson.selectfixed.url,
              to: 'options',
              method: 'post',
              parse(res) {
                return res.data.map((row) => {
                  return {
                    label: row.countryNameZh,
                    value: row.countryCode,
                  };
                });
              },
            },
          };
        }
      }
      if (pro.keyLabel != '商标分类' && pro.keyName != 'companyLegalPersonSign' && pro.keyName != 'marketHref' && pro.keyName != 'useEvidence' && pro.keyName != 'useProductImg') datalist.push(formTep);
    });
  });
  // let data = getControlData(datalist, "");
  // console.log(data);
  return c(datalist);
};

function c(datalist) {
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

export const inputType = (type) => {
  switch (type) {
    case 1:
      return 'input';
    case 2:
      return 'radio';
    case 3:
      return 'checkbox';
    case 4:
      return 'upload';
    case 5:
      return 'select';
    case 6:
      return 'input';
    case 7:
      return '';
    case 8:
      return 'DatePicker';
    case 9:
      return 'DatePicker';
  }
};
const formatType = (type, formValue) => {
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
        defaultType: 'string',
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
    default:
      return {
        type: 'AuthorizeFile',
        propType: null,
        default: '',
        defaultType: 'string',
      };
  }
};
export const isJson = (obj) => {
  var isJson = typeof obj == 'object' && Object.prototype.toString.call(obj).toLowerCase() == '[object object]' && !obj.length;
  return isJson;
};
