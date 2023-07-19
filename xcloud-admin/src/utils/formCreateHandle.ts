import CellTitle from '@/components/assembly/CellTitle.vue';
import FormCreateUploadImg from '@/components/assembly/FormCreateUploadImg.vue';
import { shallowRef } from 'vue';
export const toRuleData = (columnsArr: any[], replaceRuleArr: any[]) => {
  const ruleArr: any[] = [];
  const list = JSON.parse(JSON.stringify(columnsArr || [])).sort((a: { sort: number }, b: { sort: number }) => {
    return a.sort - b.sort;
  });
  for (const cell of list) {
    if (cell.columns && cell.columns.length > 0) {
      ruleArr.push({
        type: 'component',
        component: shallowRef(CellTitle),
        props: {
          title: cell.moduleName,
        },
      });
      cell.columns.sort((a: { sort: number }, b: { sort: number }) => {
        return a.sort - b.sort;
      });
      for (const item of cell.columns) {
        item.infoJson = item.info ? JSON.parse(item.info.replace(/'/g, '"')) : {};
        ruleArr.push(setRuleoption(item));
      }
    }
  }
  for (const item of replaceRuleArr) {
    const index = ruleArr.findIndex((v: { field: string }) => v.field === item.field);
    if (index !== -1) {
      ruleArr.splice(index, 1, Object.assign({}, ruleArr[index], item));
    }
  }
  return setParentNode(ruleArr);
};

//设置rule配置
const setRuleoption = (item: any) => {
  if (JSON.stringify(item.keyNameValue) == '{}') {
    item.keyNameValue = '';
  }
  const ruleConfig = {
    title: item.keyLabel,
    field: item.keyName,
    value: item.keyNameValue,
    validate: [
      {
        required: item.isNeed == 1 ? true : false,
        trigger: item.inputType == 1 || item.inputType == 6 ? 'blur' : 'change',
        message: item.remindMessage || item.keyLabel + '必填',
      },
      {
        message: `最大长度为${item.infoJson.maxlength}`,
        max: item.infoJson.maxlength ? item.infoJson.maxlength - 0 : Infinity,
      },
    ],
    style: {
      maxWidth: '660px',
    },
    columnId: item.columnId,
    columnOption: item.columnOption,
    columnPid: item.columnPid,
  };
  switch (item.inputType) {
    case 1: {
      //1=文本框
      return Object.assign({}, ruleConfig, {
        type: 'input',
        props: {
          placeholder: item.placeHolder ? item.placeHolder : '请输入' + item.keyLabel,
        },
        value: typeof item.keyNameValue === 'string' ? item.keyNameValue : '',
      });
    }
    case 2: {
      // 2=单选框
      return Object.assign({}, ruleConfig, {
        type: 'radio',
        options: item.infoJson.groups || [],
        props: {
          placeholder: item.placeHolder ? item.placeHolder : '请选择' + item.keyLabel,
        },
        value: String(item.keyNameValue) || item.infoJson.groups[0]?.value,
      });
    }
    case 3: {
      // 3=复选框
      return Object.assign({}, ruleConfig, {
        type: 'checkbox',
        props: {
          placeholder: item.placeHolder ? item.placeHolder : '请选择' + item.keyLabel,
        },
      });
    }
    case 4: {
      //4=上传框
      return Object.assign({}, ruleConfig, {
        type: 'component',
        component: shallowRef(FormCreateUploadImg),
        props: {
          accepts: item.infoJson.accepts,
          limit: Number(item.infoJson.limit),
        },
      });
    }
    case 5: {
      // 5=下拉框
      return Object.assign({}, ruleConfig, {
        type: 'select',
        options: item.infoJson.groups,
        props: {
          placeholder: item.placeHolder ? item.placeHolder : '请选择' + item.keyLabel,
        },
      });
    }
    case 6: {
      //6=文本域
      return Object.assign({}, ruleConfig, {
        type: 'input',
        props: {
          type: 'textarea',
          placeholder: item.placeHolder ? item.placeHolder : '请输入' + item.keyLabel,
        },
      });
    }
    case 7: {
      return Object.assign({}, ruleConfig, {
        type: '',
      });
    }
    case 8: {
      //8=日期选择
      return Object.assign({}, ruleConfig, {
        type: 'DatePicker',
        style: {
          width: '260px',
        },
        props: {
          placeholder: item.placeHolder ? item.placeHolder : '请输入' + item.keyLabel,
        },
      });
    }
    case 9: {
      //9=日期范围选择
      return Object.assign({}, ruleConfig, {
        type: 'RangePicker',
      });
    }
    case 10: {
      //10=无类型
      return Object.assign({}, ruleConfig, {
        type: 'text',
      });
    }
  }
};

//设置组件联动
const setParentNode = (datalist: any[]) => {
  const map = new Map();
  const data: any[] = [];
  datalist.forEach(item => {
    if (item.columnId) {
      map.set(item.columnId, item);
    }
  });
  datalist.forEach(item => {
    const parent = map.get(item.columnPid);
    if (parent) {
      (parent.control || (parent.control = [])).push({
        handle: (val: string) => {
          return item.columnOption.split(',').includes(val);
        },
        rule: [item],
      });
    } else {
      data.push(item);
    }
  });
  return data;
};
