# git 规范共识

## 分支说明

- dev 环境：用于开发调试使用。
- test 环境：测试环境，由最新的 dev 分支进行合并
- uat 环境：预发布环境，由 test 分支测试完毕后进行合并，不允许在该分支修改代码
- prod 环境：生产环境，由 uat 分支测试完毕后进行合并，不允许在该分支修改代码

## 开发场景

- 普通版本迭代

  例如当前产品规划版本为 `2.2.0`, 需要新建对应开发版本分支，`dev-2.2.0`,并在完成当前版本迭代前保留上一版本分支。

- 紧急 bug 修复

  生产环境 bug 需在上一迭代版本分支上进行修复，例如上一版本分支为`dev-2.1.0`,确定开发人员后，切回该分支进行 bug 修复，同时运用该分支依次完成`test->uat->prod`的代码合并，待 bug 解决并上线后，针对代码情况选择合并或者本地拷贝（标准为尽可能减少 merge 后处理冲突的操作繁杂程度）

- 合并代码

  通常情况开发任务认领或分配应以大功能模块进行划分，以尽可能减少开发环节代码冲突的频率，

  在冲突较少的情况下，以沟通后的结果决定代码的取舍，而不建议草率的接受别人的代码或者覆盖别人的代码
  在冲突较大的情况下，代码责任人必须当面进行详细的沟通后进行合并
