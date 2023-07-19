## API
请使用markdown预览此文档

Form props

| 属性      | 说明               | 类型   | 默认值 |
| :-------- | ------------------ | ------ | ------ |
| formModel | 表单数据对象       | Object | { }     |
| formClass | formModel类名      | String | -      |
| formItem  | 配置每一项目的数据 | object[ ]  | [ ]     |

formItem props

| 属性属性    | 说明                                                | 类型                    | 默认值    |  |
| ----------- | --------------------------------------------------- | ----------------------- | --------- | ----------- |
| itemType    | 要渲染的数据类型                                    | String                  | -         |  |
| span        | 同a-col的span属性，栅格布局占比                     | Number                  | 8         |  |
| itemProp    | 渲染form-item表单域组件所需要的传值，映射所有antd的属性 | Object                  | { }        |  |
| required    | 是否必填                                            | Boolean                 | false     |  |
| itemData    | 用于select组件的options数据                         | Array                   | [ ]        |  |
| placeholder | 占位符                                              | String                  | label文字 |  |
| label       | label 标签的文本（同antd的Form.item的label）        | String                  | -         |  |
| key         | 表单域model字段,必填（同antd的Form.item的prop属性） | String                  | -         |  |
| render      | 自定义渲染Form.item里面的内容，使用Vue的Render函数  | Function(h,{text,record,index}) | -         |  |
| slotName | 具名插槽 | slot | - |  |
| title | 头部文字 | String | - |  |
| isHide | 是否隐藏该项 | Boolean | false |  |

事件

| 事件名称 | 说明             | 回调参数               |
| -------- | ---------------- | ---------------------- |
| submit   | 提交成功后的事件 | Function(props:object) |
|          |                  |                        |

实例方法

| 事件名称  | 说明                 | 回调参数 |
| --------- | -------------------- | -------- |
| validate  | 对表单开始验证的方法 | -        |
| resetForm | 对表单进行重置       | -        |

