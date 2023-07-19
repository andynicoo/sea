<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline>
          <el-form-item label="云服务名称">
            <el-input
              v-model="listQuery.service"
              placeholder="请输入云服务名称"
              clearable
              style="width: 168px"
              size="small"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="editForm.status"
              placeholder="请选择"
              size="small"
              style="width: 120px"
            >
              <el-option label="启用" value="1"></el-option>
              <el-option label="禁用" value="2"></el-option>
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
              @click="showAddModal"
              size="small"
            >
              新增
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table
        :data="data"
        style="width: 100%"
        border
        max-height="700"
        highlight-current-row
      >
        <el-table-column align="center" label="编号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="云服务名称" prop="name">
        </el-table-column>
        <el-table-column align="center" label="类型">
          <template slot-scope="scope">{{ scope.row.status }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建人" prop="creatperson">
        </el-table-column>
        <el-table-column align="center" label="创建时间" prop="time">
        </el-table-column>
        <el-table-column align="center" label="修改人" prop="creatperson">
        </el-table-column>
        <el-table-column align="center" label="修改时间" prop="time">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-link
              type="primary"
              :underline="false"
              @click="showEditModal(scope.row)"
            >
              编辑
            </el-link>
            <el-link
              type="info"
              :underline="false"
              @click="handleDelete(scope.row)"
            >
              删除
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
    <!-- 新增编辑 -->
    <el-dialog
      :visible.sync="detailModal"
      :title="editForm.id ? '编辑' : '新增'"
      width="460px"
    >
      <el-form
        :model="editForm"
        ref="editFormRef"
        :rules="ruleValidate"
        label-width="100px"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="editForm.name"
            placeholder="请输入名称"
            style="width: 200px"
            size="small"
          />
        </el-form-item>
        <el-form-item label="类型">
          <el-select
            style="width: 200px"
            size="small"
            v-model="editForm.status"
          >
            <el-option label="Web" value="Web"></el-option>
            <el-option label="App" value="App"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="editForm.desc"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
            style="width: 300px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: right">
        <el-button size="small" style="width: 65px" @click="detailModal = false"
          >取消</el-button
        >
        <el-button
          size="small"
          style="width: 65px"
          type="primary"
          @click="handleSubmit"
          >保存</el-button
        >
      </div>
    </el-dialog>
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
      },

      //数据
      data: [
        {
          runk: 1,
          id: 1,
          name: "王小明",
          time: "2019-5-11 09:30",
          status: "web",
          creatperson: "admin",
        },
        {
          runk: 2,
          id: 2,
          name: "张小刚",
          time: "2019-5-11 09:30",
          status: "web",
          creatperson: "admin",
        },
        {
          runk: 3,
          id: 3,
          name: "李小红",
          status: "web",
          time: "2019-5-11 09:30",
          creatperson: "admin",
        },
        {
          runk: 4,
          id: 4,
          name: "周小伟",
          status: "web",
          time: "2019-5-11 09:30",
          creatperson: "admin",
        },
        {
          runk: 5,
          id: 5,
          name: "周小伟",
          status: "web",
          time: "2019-5-11 09:30",
          creatperson: "admin",
        },
      ],
      editForm: {
        id: "",
        name: "",
        desc: "",
        status: "",
      },
      detailModal: false,
      ruleValidate: {
        name: [
          {
            required: true,
            message: "不允许为空",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
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
     * 新增
     */
    showAddModal() {
      this.detailModal = true;
      // 编辑和新增用一个对象时候，resetFields方法之前必须先重置一下对象才可以
      this.editForm = {
        id: "",
      };
      // 重置表单
      if (this.$refs.editFormRef) {
        this.$refs.editFormRef.resetFields();
      }
    },

    /**
     * 编辑弹框
     */
    showEditModal(row, index) {
      this.editForm = {
        id: row.id,
        desc: row.name,
        name: row.name,
      };
      this.detailModal = true;
    },
    handleSubmit() {},
    /**
     * 根据id删除活动
     */
    handleDelete(row) {
      this.$confirm("确定删除该数据？", "删除提示", {
        customClass: "custom-confirm",
        type: "warning",
        center: true
      }).then(() => {});
    },
  },
};
</script>
<style scoped lang="less">
</style>
