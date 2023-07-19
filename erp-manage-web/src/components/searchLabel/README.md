## API

SearchLabel props

| 属性          | 说明                 | 类型     | 默认值 |
| ------------- | -------------------- | -------- | ------ |
| labelItem     | 传入的每一项数据配置 | object[] | []     |
| data          | 数据源               | object   | {}     |
| gutter        | 栅格间隔同a-row      | number   | 16     |
| labelAlign    | label对齐属性        | string   | right  |
| labelWidth    | label的宽度          | string   | -      |
| labelMinWidth | label最小宽度        | string   | -      |
|               |                      |          |        |

labelitem props

| 属性      | 说明                                                         | 类型                            | 默认值 |
| --------- | ------------------------------------------------------------ | ------------------------------- | ------ |
| label     | label标签的文本                                              | string                          | -      |
| dataIndex | 每一项在数据对应的key                                        | string                          | -      |
| slotName  | 具名插槽名自定义value的值参数为{text,record,index}           | string                          | -      |
| render    | 渲染函数自定义value的值参数为(h,{text,record,index}),插槽优先级大于render函数 | function(h,{text,record,index}) | -      |

```js
<search-label :labelItem="labelItem" :data="data"/>
    
data() {
    return {
        data:{
            invoiceUrl:'https://..',
            receiveBankCard:'6225xxxxx'
        }
    }
  },
  computed: {
    labelItem() {
      return [
         {
          label: '卡号',
          dataIndex: 'receiveBankCard'
        },
        {
          label: '发票',
          dataIndex: 'invoiceUrl',
          render: (h, { text }) => <img src={text} height='70'/>
        },
      ]
    }
  },
```

