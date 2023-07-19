<!--  -->
<template>
  <el-dialog title="题目管理" :visible.sync="dialogvisible" width="800px" center destroy-on-close>
    <div>
      <div class="table-container">
        <el-button class="mb-20" @click="goTopic">新增题目</el-button><el-button @click="search">刷新</el-button>
        <div class="f-r mb-20"><el-input class="mr-10" placeholder="请输入关键字" style="width: 300px" v-model="listQuery.topicName" /><el-button @click="search">查询</el-button></div>
        <!--表格  -->
        <el-table ref="multipleTable" element-loading-spinner="icon loading" max-height="450" element-loading-text="拼命加载中" row-key="answerTopicId" v-loading="listLoading" :data="list" @selection-change="handleSelectionChange">
          <Empty slot="empty" />
          <el-table-column type="selection" width="50" reserve-selection> </el-table-column>
          <el-table-column show-overflow-tooltip label="题目内容" min-width="500">
            <template slot-scope="scope">{{ scope.row.topicName }} 【{{ scope.row.questionTypes | questionTypeFilter }}】</template>
          </el-table-column>

          <el-table-column type="expand" label="操作">
            <template slot-scope="props">
              <el-radio-group size="small" value="YES">
                <el-radio :label="item.isAnswer" v-for="item in props.row.topicOptionList" :key="item.optionName">{{ item.optionName }}</el-radio>
              </el-radio-group>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
      </div>
      <div class="pagination-container">
        <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">添加题目</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { topicPageApi } from '@/api/newApi/extension/activity.js';
export default {
  data() {
    return {
      list: [],
      // 分页
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        topicName: '',
      },
      listTotal: 0,
      couponSelection: [],
    };
  },

  props: {
    couponSelectionProp: {
      type: Array,
      default: () => {},
    },
    topicDialogVisible: Boolean,
  },

  async created() {
    // this.handleSelectionChange(this.couponSelectionProp);
  },
  computed: {
    dialogvisible: {
      get() {
        if (this.topicDialogVisible) {
          this.queryData();
        }
        return this.topicDialogVisible;
      },
      set(val) {
        this.$emit('update:topicDialogVisible', val);
      },
    },
  },
  filters: {
    questionTypeFilter(val) {
      if (val == 'MULTIPLE_CHOICE') {
        return '单选';
      }
      return '';
    },
  },

  methods: {
    submit() {
      if (this.couponSelection.length > 500) {
        return this.$message.error('添加的题目不能超过500!');
      } else if (this.couponSelection.length == 0) {
        return this.$message.error('请选择题目');
      }
      this.$emit('getSelectList', this.couponSelection);
      this.$emit('update:topicDialogVisible', false);
    },
    handleSelectionChange(val) {
      this.couponSelection = val;
    },
    changePageNo(val) {
      this.listQuery.page = val;
      this.queryData();
    },
    goTopic() {
      this.$router.push({
        name: 'topicManage',
        path: '/extension/activityManagement/topicManage/index',
      });
    },
    changePageSize(val) {
      this.listQuery.limit = val;
      this.queryData();
    },
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      topicPageApi(this.listQuery)
        .then((res) => {
          if (res.code === 0) {
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            this.toggleSelection();
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    search() {
      this.listQuery.page = 1;
      this.queryData();
    },
    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        couponName: '',
        couponType: '0', //优惠券码
        status: '0', //状态
      };
      this.search();
    },
    // 默认勾选
    toggleSelection(val) {
      this.$nextTick(() => {
        let allCoupon = this.list;
        let selectCoupon = this.couponSelectionProp;
        allCoupon.forEach((row) => {
          if (selectCoupon.includes(row.answerTopicId)) {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        });
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.queryData();
    },

    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.queryData();
    },

    /**
     * 搜索全部/清空时间分页为第一页
     */
    searchData() {
      this.listQuery.pageNo = 1;
      this.queryData();
    },
  },
};
</script>
<style lang="scss" scoped>
.f-r {
  float: right;
}
.el-radio {
  display: block;
  margin: 0 0 10px 60px;
}
</style>
