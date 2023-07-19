import { validaHttps } from '@/view/module/siteSettings/libs/setttingLibs.js';

export const moduleList = () => [
  {
    type: 'input',
    title: '友情链接名称：',
    field: 'name',
    value: '',
    col: {
      span: 20,
    },
    props: {
      type: 'text',
      placeholder: '请输入友情链接名称（最多16个字符）',
      maxlength: 16,
    },
    validate: [{ required: true, message: '请输入友情链接名称', trigger: 'blur' }],
  },
  {
    type: 'input',
    title: '友情链接：',
    field: 'link',
    value: '',
    col: {
      span: 20,
    },
    props: {
      type: 'text',
      placeholder: '请输入http或者https开头的完整链接。',
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
    title: '排序',
    value: 0,
    props: {
      precision: 0,
    },
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
