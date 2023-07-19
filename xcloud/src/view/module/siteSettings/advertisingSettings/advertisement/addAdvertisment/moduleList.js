import Vue from 'vue';

import { validaHttps } from '@/view/module/siteSettings/libs/setttingLibs.js';
export const moduleList = () => [
  {
    type: 'input',
    title: '广告标题',
    field: 'name',
    value: '',
    col: {
      span: 20,
    },
    props: {
      type: 'text',
      placeholder: '请输入广告标题(最多16字符)',
      popperAppendToBody: false,
      maxlength: 16,
      popperClass: 'from-create-select',
    },
    validate: [{ required: true, message: '请输入广告标题', trigger: 'blur' }],
  },
  {
    type: 'select',
    field: 'adPositionId',
    title: '广告位置',
    value: ['104', '105'],
    col: {
      span: 20,
    },
    options: [
      { value: '104', label: '生态蔬菜', disabled: false },
      { value: '105', label: '新鲜水果', disabled: false },
    ],
    props: {
      multiple: false,
    },
    validate: [{ required: true, message: '请选择广告位置', trigger: 'blur' }],
  },
  {
    type: 'fieldComponent',
    field: 'picPath',
    title: '广告图片',
    value: [],
    validate: [{ required: true, message: '请上传广告图片', trigger: 'blur' }],
  },
  {
    type: 'radio',
    title: '展示时间',
    field: 'isPostage',
    value: 0,
    options: [
      { value: 0, label: '永久', disabled: false },
      { value: 1, label: '自定义时间', disabled: false },
    ],

    control: [
      {
        handle(val) {
          return val == 1;
        },
        rule: [
          {
            type: 'DatePicker',
            field: 'sectionDay',
            title: '自定义时间',
            value: ['', ''],
            size: 'mini',
            props: {
              type: 'datetimerange',
              format: 'yyyy-MM-dd HH:mm:ss',
              rangeSeparator: '至',
              startPlaceholder: '开始日期',
              endPlaceholder: '结束日期',
            },
          },
        ],
      },
    ],
  },

  {
    type: 'radio',
    title: '跳转链接',
    field: 'urlType',
    value: 1,
    options: [
      { value: 1, label: '内部链接', disabled: false },
      { value: 2, label: '外部链接', disabled: false },
    ],
    emit: ['change'],
  },
  {
    type: 'input',
    title: ' ',
    field: 'url',
    value: '',
    col: {
      span: 20,
    },
    props: {
      type: 'text',
      placeholder: '请输跳转链接',
    },
    validate: [
      {
        // validator: validaHttps,
      },
    ],
  },
  {
    type: 'input',
    field: 'releaseNum',
    title: '已发布数',
    value: '1/8',
    props: {
      precision: 0,
      disabled:true
    },
    col: {
      span: 12,
    },
  },
  {
    type: 'InputNumber',
    field: 'sort',
    title: '排序',
    link: ['sort'],
    value: 0,
    props: {
      precision: 0,
    },
    // update(val, rule) {
    //   rule.value = '';
    // },
  },

  {
    type: 'switch',
    title: '是否启用:',
    field: 'status',
    value: false,
    props: {
      activeValue: true,
      inactiveValue: false,
    },
  },
];
