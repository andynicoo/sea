<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <el-form ref="searchForm" inline label-width="70px">
        <el-form-item>
          <h3><span @click="goGuess">疯狂猜猜猜</span> <span class="active">题目管理</span></h3>
        </el-form-item>
        <el-form-item style="float: right">
          <div style="float: right; margin-left: 10px">
            <ManualUploadFile :showDrag="false" :showFileList="false" :drag="false" v-model="templateFile" accept=".xls,.xlsx">
              <div slot="uploadBtn">
                <el-button size="small" type="primary">Excel批量导入题目</el-button>
              </div>
            </ManualUploadFile>
          </div>
          <el-button
            type="success"
            @click="
              addEditDialogVisible = true;
              isEdit = false;
            "
            icon="el-icon-plus"
          >
            添加题目
          </el-button>
        </el-form-item>
        <br />

        <el-form-item>
          <el-input v-model="listQuery.topicName" placeholder="请输入题目关键词" clearable style="width: 300px" size="small" />
        </el-form-item>

        <el-form-item style="margin-left: 20px">
          <el-button type="primary" size="small" icon="el-icon-search" @click="search"> 搜索 </el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <el-table :data="dataSource" border :height="tableHeight" ref="table" v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-radio-group size="small" value="YES">
              <el-radio :label="item.isAnswer" v-for="item in props.row.topicOptionList" :key="item.optionName">{{ item.optionName }}</el-radio>
            </el-radio-group>
          </template>
        </el-table-column>
        <el-table-column label="题目">
          <template slot-scope="scope">{{ scope.row.topicName }}</template>
        </el-table-column>
        <el-table-column align="center" label="题型" prop="supplierId" width="300px">
          <template slot-scope="scope">{{ scope.row.questionTypes | questionTypeFilter }}</template>
        </el-table-column>

        <el-table-column align="center" label="操作人">
          <template slot-scope="scope">{{ scope.row.createBy }}</template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" width="200px">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="250" fixed="right">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="editTopic(scope.row)"></el-link>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-del" @click="toDelete(scope.row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>

    <AddEditDialog :addEditDialogVisible.sync="addEditDialogVisible" @refresh="queryList" :isEdit="isEdit" :rowData="rowData" />
  </div>
</template>
<script>
import { deleteTopic, topicPageApi } from '@/api/newApi/extension/activity.js';
import AddEditDialog from './components/addEditDialog.vue';
import ManualUploadFile from '@/components/manualUploadFile/index.vue';
export default {
  data() {
    return {
      // 分页查询
      dataSource: [],
      listLoading: false,
      rowData: {},
      isEdit: false,
      addEditDialogVisible: false,
      listTotal: 0,
      templateFile: [],
      listQuery: {
        page: 1,
        limit: 10,
        topicName: '',
      },
    };
  },
  created() {
    this.queryList();
  },
  components: {
    AddEditDialog,
    ManualUploadFile,
  },
  filters: {
    questionTypeFilter(val) {
      if (val == 'MULTIPLE_CHOICE') {
        return '单选';
      }
      return '';
    },
  },
  watch: {
    templateFile(val) {
      if (val && val.length) {
        let formData = new FormData();
        formData.append('file', val[0].raw);
        this.$util
          .formDataRequest({
            url: '/marketingcenter/topic/batchImportAnswerTopic',
            data: formData,
          })
          .then((res) => {
            if (res.code === 0) {
              this.$message.success('导入成功');
              this.queryList();
            } else {
              this.$message.error(res.message || '导入失败');
            }
          })
          .catch((e) => {
            this.$message.error('导入失败');
          })
          .finally((e) => {
            this.templateFile = [];
          });
      }
    },
  },
  methods: {
    /**
     * 查询分页列表
     */
    queryList() {
      this.listLoading = true;
      topicPageApi(this.listQuery)
        .then((res) => {
          if (res.code === 0) {
            this.$data.dataSource = res.data.records;
            this.listTotal = Number(res.data.total);
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryList();
    },
    editTopic(row) {
      this.isEdit = true;
      this.addEditDialogVisible = true;
      this.rowData = row;
    },
    /**
     * 删除
     */
    toDelete(row) {
      this.$confirm('是否确定删除题目？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deleteTopic({
            answerTopicId: row.answerTopicId,
          })
            .then((res) => {
              if (res.code === 0) {
                this.$message.success('删除成功');
                this.queryList();
              }
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    goGuess() {
      this.$router.push({
        name: 'guess',
        path: '/extension/activityManagement/guess/index',
      });
    },
    changePageNo(val) {
      this.listQuery.page = val;
      this.queryList();
    },
    changePageSize(val) {
      this.listQuery.limit = val;
      this.queryList();
    },
  },
};
</script>
<style scoped lang="scss">
h3 {
  color: #8c8c8c;
  .active {
    color: #333;
  }
  span {
    margin-right: 20px;
    cursor: pointer;
  }
}

.el-radio {
  display: block;
  margin: 0 0 10px 60px;
}
</style>
