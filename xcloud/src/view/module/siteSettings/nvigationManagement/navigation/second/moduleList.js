import Vue from 'vue';
var vue = new Vue({});
import { validaHttps } from '@/view/module/siteSettings/libs/setttingLibs.js';

export const moduleList = (navLevel) => [
  {
    type: 'input',
    title: navLevel == 1 ? '导航名称' : '二级导航名称：',
    field: 'name',
    value: '',
    col: {
      span: 20,
    },
    props: {
      type: 'text',
      placeholder: '请输入导航名称（不超过8个字）',
      maxlength: 8,
    },
    validate: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
  },
  {
    type: 'input',
    field: 'info',
    title: '简介：',
    value: '',
    col: {
      span: 20,
      maxlength: 45,
    },
    props: {
      type: 'textarea',
      placeholder: '请输入',
    },
  },

  {
    type: 'input',
    title: '链接：',
    field: 'link',
    value: '',
    col: {
      span: 20,
    },
    props: {
      type: 'text',
      placeholder: '请http或https开头的跳转链接',
    },
    validate: [
      {
        validator: validaHttps,
      },
    ],
  },
  {
    type: 'InputNumber',
    field: 'sort',
    title: '排序：',
    value: 0,
    props: {
      precision: 0,
    },
  },
  {
    type: 'fieldComponent',
    field: 'subordinate',
    title: navLevel == 1 ? '是否开启导航' : '三级导航：',
    value: false,
    control: [
      {
        handle: (val, fApi) => {
          console.log(val, navLevel);
          if (navLevel !== 1 && val) {
            console.log('111111111');
            return true;
          }
        },
        rule: [
          {
            type: 'serviceRadio',
            field: 'tertiaryType',
            value: 0,
          },
        ],
      },
    ],
  },
  {
    type: 'radio',
    title: '打开方式：',
    field: 'openType',
    value: true,
    options: [
      { value: true, label: '当前窗口', disabled: false },
      { value: false, label: '新窗口', disabled: false },
    ],
  },
  {
    type: 'switch',
    title: '状态:',
    field: 'status',
    value: true,
    props: {
      activeValue: true,
      inactiveValue: false,
    },
  },
];
