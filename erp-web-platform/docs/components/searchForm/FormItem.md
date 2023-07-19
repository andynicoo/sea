# FormItem

## Props

| Prop name | Description | Type   | Values | Default |
| --------- | ----------- | ------ | ------ | ------- |
| itemProp  |             | object | -      |         |
| item      |             | object | -      |         |
| formModel |             | object | -      |         |
| itemData  |             | array  | -      | []      |

## Slots

| Name    | Description | Bindings |
| ------- | ----------- | -------- |
| default |             | <br><br> |

---

## API

请使用 markdown 预览此文档

Form props

| 属性      | 说明               | 类型      | 默认值 |
| :-------- | ------------------ | --------- | ------ |
| formModel | 表单数据对象       | Object    | { }    |
| formClass | formModel 类名     | String    | -      |
| formItem  | 配置每一项目的数据 | object[ ] | [ ]    |

formItem props

| 属性属性    | 说明                                                        | 类型                            | 默认值     |     |
| ----------- | ----------------------------------------------------------- | ------------------------------- | ---------- | --- |
| itemType    | 要渲染的数据类型                                            | String                          | -          |     |
| span        | 同 a-col 的 span 属性，栅格布局占比                         | Number                          | 8          |     |
| itemProp    | 渲染 form-item 表单域组件所需要的传值，映射所有 antd 的属性 | Object                          | { }        |     |
| required    | 是否必填                                                    | Boolean                         | false      |     |
| itemData    | 用于 select 组件的 options 数据                             | Array                           | [ ]        |     |
| placeholder | 占位符                                                      | String                          | label 文字 |     |
| label       | label 标签的文本（同 antd 的 Form.item 的 label）           | String                          | -          |     |
| key         | 表单域 model 字段,必填（同 antd 的 Form.item 的 prop 属性） | String                          | -          |     |
| render      | 自定义渲染 Form.item 里面的内容，使用 Vue 的 Render 函数    | Function(h,{text,record,index}) | -          |     |
| slotName    | 具名插槽                                                    | slot                            | -          |     |
| title       | 头部文字                                                    | String                          | -          |     |
|             |                                                             |                                 |            |     |

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
