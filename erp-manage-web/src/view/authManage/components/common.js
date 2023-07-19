// ERP菜单管理formItem映射
export const menuFormItem = {
  M: [
    {
      itemType: 'input',
      key: 'menuName',
      label: '菜单名称',
      required: true,
      span: 24
    },
    {
      itemType: 'input',
      key: 'href',
      label: '菜单链接',
      required: true,
      span: 24
    },
    {
      itemType: 'input',
      key: 'menuCode',
      label: '菜单code',
      required: true,
      span: 24
    },
    {
      itemType: 'input',
      key: 'icon',
      label: '菜单图标',
      span: 24
    },
    {
      itemType: 'textarea',
      key: 'menuI18n',
      label: '菜单国际化名称',
      required: true,
      placeholder: '请输入菜单国际化名称(JSON格式)',
      span: 24
    },
    {
      itemType: 'textarea',
      key: 'remark',
      label: '备注',
      span: 24,
      itemProp: {
        showCount: true,
        maxLength: 1024
      }
    },
    {
      itemType: 'number',
      key: 'sort',
      label: '排序',
      itemProp: {
        style: 'width:190px'
      },
      span: 24
    },
    {
      itemType: 'switch',
      key: 'status',
      label: '状态',
      itemProp: {
        'checked-children': '启用',
        'un-checked-children': '禁用'
      },
      span: 24
    },
    {
      itemType: 'switch',
      key: 'isShow',
      label: '是否显示',
      itemProp: {
        'checked-children': '显示',
        'un-checked-children': '隐藏'
      },
      span: 24
    }
  ],
  C: [
    {
      itemType: 'input',
      key: 'menuName',
      label: '菜单名称',
      required: true,
      span: 24
    },
    {
      itemType: 'input',
      key: 'href',
      label: '菜单链接',
      required: true,
      span: 24
    },
    {
      label: '上级菜单',
      key: 'parentId',
      required: true,
      span: 24,
      slotName: 'parentId'
    },
    {
      itemType: 'input',
      key: 'menuCode',
      label: '菜单code',
      required: true,
      span: 24
    },
    {
      itemType: 'input',
      key: 'icon',
      label: '菜单图标',
      span: 24
    },
    {
      itemType: 'textarea',
      key: 'menuI18n',
      label: '菜单国际化名称',
      required: true,
      placeholder: '请输入菜单国际化名称(JSON格式)',
      span: 24
    },
    {
      itemType: 'textarea',
      key: 'remark',
      label: '备注',
      span: 24,
      itemProp: {
        showCount: true,
        maxLength: 1024
      }
    },
    {
      itemType: 'number',
      key: 'sort',
      label: '排序',
      itemProp: {
        style: 'width:190px'
      },
      span: 24
    },
    {
      itemType: 'switch',
      key: 'status',
      label: '状态',
      itemProp: {
        'checked-children': '启用',
        'un-checked-children': '禁用'
      },
      span: 24
    },
    {
      itemType: 'switch',
      key: 'isShow',
      label: '是否显示',
      itemProp: {
        'checked-children': '显示',
        'un-checked-children': '隐藏'
      },
      span: 24
    }
  ],
  F: [
    {
      itemType: 'input',
      key: 'menuName',
      label: '按钮/权限名称',
      required: true,
      span: 24
    },
    {
      itemType: 'input',
      key: 'href',
      label: '按钮/权限链接',
      span: 24
    },
    {
      label: '上级菜单',
      key: 'parentId',
      required: true,
      span: 24,
      slotName: 'parentId'
    },
    {
      itemType: 'input',
      key: 'menuCode',
      label: '按钮/权限code',
      required: true,
      span: 24
    },
    {
      itemType: 'textarea',
      key: 'menuI18n',
      label: '按钮/权限国际化',
      placeholder: '请输入按钮/权限国妹化名称(JSON格式)',
      span: 24
    },
    {
      itemType: 'textarea',
      key: 'remark',
      label: '备注',
      span: 24,
      itemProp: {
        showCount: true,
        maxLength: 500
      }
    },
    {
      itemType: 'number',
      key: 'sort',
      label: '排序',
      itemProp: {
        style: 'width:190px'
      },
      span: 24
    },
    {
      itemType: 'switch',
      key: 'status',
      label: '状态',
      itemProp: {
        'checked-children': '启用',
        'un-checked-children': '禁用'
      },
      span: 24
    },
    {
      itemType: 'switch',
      key: 'isShow',
      label: '是否显示',
      itemProp: {
        'checked-children': '显示',
        'un-checked-children': '隐藏'
      },
      span: 24
    }
  ]
}
