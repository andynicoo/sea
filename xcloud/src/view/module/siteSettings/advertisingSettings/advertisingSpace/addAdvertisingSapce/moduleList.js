export const moduleList = [
  {
    type: 'input',
    title: '广告位标题',
    field: 'name',
    value: '',
    col: {
      span: 20,
    },
    props: {
      type: 'text',
      placeholder: '请输入广告位名称（最多16个字符）',
      maxlength: 16,
    },
    validate: [{ required: true, message: '请输入广告位名称', trigger: 'blur' }],
  },
  {
    type: 'input',
    title: '广告位key',
    field: 'adKey',
    value: '',
    col: {
      span: 20,
    },
    props: {
      type: 'text',
      placeholder: '请输入广告位key',
    },
    validate: [{ required: true, message: '请输入广告位key', trigger: 'blur' }],
  },
  {
    type: 'fieldComponent',
    field: 'adSize',
    title: '广告位尺寸',
    value: '',
  },
  {
    type: 'switch',
    field: 'flagCarousel',
    title: '是否轮播',
    value: true,
    props: {
      activeValue: true,
      inactiveValue: false,
    },
  },
  {
    type: 'switch',
    title: '是否启用:',
    field: 'status',
    value: true,
    props: {
      activeValue: true,
      inactiveValue: false,
    },
  },
];
