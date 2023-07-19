### Export 组件选项说明

导出功能组件, 二次封装 element Button,
<font color="#dd0000">部分导出(ids)优先于全部导出(total)</font>

| 参数       | 说明                 | 类型     | 可选值 | 默认值  |
| ---------- | -------------------- | -------- | ------ | ------- |
| auth       | 权限值               | String   | -      | -       |
| exportApi  | 导出请求             | Promise  | -      | -       |
| excelTitle | 表格标题             | String   | -      | 'excel' |
| params     | 请求参数             | Object   | -      | -       |
| total      | 全部导出总条数       | Number   | -      | -       |
| ids        | 部分导出时传递的参数 | Array    | -      | -       |
| onOk       | 导出成功回调         | Function | -      | -       |
| onError    | 导出失败回调         | Function | -      | -       |
| onCance    | 取消导出回调         | Function | -      | -       |

#### demo

```javascript
    <Export
      auth="C1_18"
      excelTitle="客户线索"
      :exportApi="excelList"
      :params="{ ...copyForm }"
      :ids="checkIds"
      :total="total"
    />

```
