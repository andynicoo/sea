<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline>
          <el-form-item label="姓名">
            <el-input
              v-model="listQuery.service"
              placeholder="请输入姓名"
              clearable
              style="width: 168px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input
              v-model="listQuery.service"
              placeholder="请输入手机号"
              clearable
              style="width: 168px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              style="width: 120px"
              v-model="listQuery.status"
              size="small"
            >
              <el-option value="1" label="正常"></el-option>
              <el-option value="2" label="离职"></el-option>
              <el-option value="2" label="禁用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search"
              >搜索</el-button
            >
          </el-form-item>
          <el-form-item style="float: right">
            <el-button
              type="success"
              icon="el-icon-plus"
              @click="showEditModal"
              size="small"
              >新增</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table border :data="data" max-height="700" highlight-current-row>
        <el-table-column align="center" label="序号" width="80px">
          <template slot-scope="scope"> {{ scope.row.runk }} </template>
        </el-table-column>
        <el-table-column align="center" label="工号">
          <template slot-scope="scope"> {{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column align="center" label="姓名">
          <template slot-scope="scope"> {{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope"> {{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column align="center" label="邮箱">
          <template slot-scope="scope"> 131654654@qq.com</template>
        </el-table-column>
        <el-table-column align="center" label="部门">
          <template slot-scope="scope"> 技术部</template>
        </el-table-column>
        <el-table-column align="center" label="职位">
          <template slot-scope="scope">打工仔 </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope"> {{ scope.row.status }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250px">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="showDetailModal(scope.row)"
            >
              查看
            </el-link>
            <el-link
              :underline="false"
              type="primary"
              @click="showEditModal(scope.row, scope.$index)"
            >
              编辑
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              @click="handleClickSetting(scope.row)"
            >
              企业权限
            </el-link>
            <el-link
              type="primary"
              :underline="false"
              @click.native="handleResetPassword(scope.row)"
            >
              重置密码
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="listQuery.pageNo"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="listTotal"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 分页
      listTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        service: "",
        status: "",
        level: 1,
      },
      isAddEdit: false, //编辑/新增
      //表格
      //数据
      data: [
        {
          runk: 1,
          id: 1,
          name: "王小明",
          time: "2019-5-11 09:30",
          status: "启用",
          contacts: "88888888",
          corpId: "123",
          phone: "463313",
          status: "正常",
        },
        {
          runk: 2,
          id: 2,
          name: "张小刚",
          time: "2019-5-11 09:30",
          status: "禁用",
          phone: "463313",
        },
        {
          runk: 3,
          id: 3,
          name: "李小红",
          status: "启用",
          time: "2019-5-11 09:30",
          phone: "463313",
          status: "禁用",
        },
        {
          runk: 4,
          id: 4,
          name: "周小伟",
          status: "禁用",
          time: "2019-5-11 09:30",
          phone: "463313",
          status: "正常",
        },
        {
          runk: 5,
          id: 5,
          name: "周小伟",
          status: "启用",
          time: "2019-5-11 09:30",
          phone: "463313",
          status: "离职",
        },
      ],
    };
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      getList({
        pageIndex: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        name: this.listQuery.name,
        status: this.listQuery.status,
      })
        .then((res) => {
          // 延迟loading关闭
          setTimeout(() => {
            this.listLoading = false;
            this.$message({
              type: "success",
              message: "搜索完成",
            });
          }, 300);
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
          } else {
            this.$message({
              type: "error",
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      // this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      // this.queryData();
    },

    /**
     * 编辑弹框/新增
     */
    showEditModal(row, index) {
      this.$router.push({
        name: "agementAddEdit",
        params: row,
      });
    },

    /**
     * 详情
     */
    showDetailModal(row) {
      this.$router.push({
        name: "agementDetail",
        params: row,
      });
    },
    /**
     * 企业权限
     */
    handleClickSetting() {
      this.$router.push({
        name: "agementauthority",
      });
    },
    /**
     * 重置密码
     */
    handleResetPassword(row) {
      this.$confirm(
        "<div>确定重置该用户的密码吗？</div><div>重置后默认：<span class='font-14 text-danger text-bold'>888888</span></div>",
        "提示",
        {
          type: "warning",
          customClass: "custom-confirm",
          dangerouslyUseHTMLString: true,
          center: true
        }
      ).then(() => {});
    },
  },
};
</script>
<style scoped lang="less">
</style>
