<template>
  <div>
    <el-card class="tabBox">
      <div slot="header" class="clearfix">
        <span>企业信息</span>
      </div>
      <el-table border :data="data" height="250">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope"> {{ scope.row.runk }} </template>
        </el-table-column>
        <el-table-column align="center" label="企业名称">
          <template slot-scope="scope"> {{ scope.row.name }} </template>
        </el-table-column>
        <el-table-column align="center" label="授权状态">
          <template slot-scope="scope"> {{ scope.row.name }} </template>
        </el-table-column>
        <el-table-column align="center" label="开通时间">
          <template slot-scope="scope"> {{ scope.row.time }} </template>
        </el-table-column>
        <el-table-column align="center" label="操作人">
          <template slot-scope="scope"> {{ scope.row.name }} </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card class="tabBox">
      <div slot="header" class="clearfix">
        <span>角色信息</span>
      </div>
      <el-table border :data="data" height="250">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope"> {{ scope.row.runk }} </template>
        </el-table-column>
        <el-table-column align="center" label="角色名称">
          <template slot-scope="scope"> {{ scope.row.name }} </template>
        </el-table-column>
        <el-table-column align="center" label="开通时间">
          <template slot-scope="scope"> {{ scope.row.time }} </template>
        </el-table-column>
        <el-table-column align="center" label="操作人">
          <template slot-scope="scope"> {{ scope.row.name }} </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //数据
      data: [
        {
          runk: 1,
          id: 1,
          name: "王小明",
          time: "2019-5-11 09:30",
          status: "启用",
          creatperson: "admin",
        },
        {
          runk: 2,
          id: 2,
          name: "张小刚",
          time: "2019-5-11 09:30",
          status: "禁用",
          creatperson: "admin",
        },
        {
          runk: 3,
          id: 3,
          name: "李小红",
          status: "启用",
          time: "2019-5-11 09:30",
          creatperson: "admin",
        },
        {
          runk: 4,
          id: 4,
          name: "周小伟",
          status: "禁用",
          time: "2019-5-11 09:30",
          creatperson: "admin",
        },
        {
          runk: 5,
          id: 5,
          name: "周小伟",
          status: "启用",
          time: "2019-5-11 09:30",
          creatperson: "admin",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.tabBox {
  margin-bottom: 15px;
}
</style>>
