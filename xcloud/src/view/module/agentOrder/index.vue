<template>
  <div class="app-container">
    <!-- 查询 -->
    <div class="header-container" ref="searchBox">
      <div
        :class="{
          'search-aera': true,
          'search-on': moreSerch,
          'search-off': !moreSerch,
        }"
      >
        <!-- 查询条件 -->
        <div class="search-box" :class="moreSerch ? 'styleclass' : ''">
          <el-form :model="listQuery" ref="searchForm" inline>
            <el-form-item label="公司主体">
              <el-select multiple v-model="listQuery.enterpriseIds" placeholder="请选择公司主体" @clear="queryData">
                <el-option v-for="item in enterpriseList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="订单号">
              <el-input v-model="listQuery.orderNo" placeholder="请输入订单号" clearable style="width: 168px" size="small" @clear="queryData" />
            </el-form-item>
            <el-form-item label="客户名称">
              <el-input v-model="listQuery.companyName" placeholder="请输入客户名称" clearable style="width: 168px" size="small" @clear="queryData" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
              <el-button size="small" icon="el-icon-refresh-left" @click="clickReset">重置</el-button>
              <el-button type="text" @click="handleMoreSearch">
                <i :class="moreSerch ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" class="more-search-icon" style=""></i>
                {{ moreSerch ? '收起' : '更多' }}筛选
              </el-button>
            </el-form-item>
            <el-button type="success" @click="addOrder" class="float-right" style="margin-left: 10px"> 新建 </el-button>
            <el-button type="success" class="float-right" @click="exportExcel" :loading="btnLoading"> 导出 </el-button>
            <div class="more-search" v-show="moreSerch">
              <el-form-item label="选择代理商品">
                <el-select style="width: 200px" size="small" v-model="listQuery.productName" clearable>
                  <el-option value="亚马逊保险" label="亚马逊保险">亚马逊保险</el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="付款时间">
                <el-date-picker v-model="listQuery.paymentTime" type="daterange" align="right" size="small" clearable unlink-panels range-separator="至" start-placeholder="付款开始日期" end-placeholder="付款结束日期" value-format="yyyy-MM-dd HH:mm:ss" style="width: 340px"></el-date-picker>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <el-table v-loading="listLoading" :data="list" style="width: 100%" border max-height="700" highlight-current-row :height="tableHeight" ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
        <Empty slot="empty" />
        <el-table-column align="center" label="序号" width="70" type="index">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="所属主体" width="200" prop="enterpriseName"> </el-table-column>
        <el-table-column align="center" label="订单号" width="200">
          <template slot-scope="scope">{{ scope.row.orderNo }}</template>
        </el-table-column>
        <el-table-column align="center" label="客户名称" width="200" prop="companyName"> </el-table-column>
        <el-table-column align="center" label="代理商品" width="130" prop="productName"> </el-table-column>
        <el-table-column align="center" label="销售金额（元）" width="130">
          <template slot-scope="scope">
            {{ scope.row.salePrice }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="销售跟进人" width="130" prop="attributionName"> </el-table-column>
        <el-table-column align="center" label="付款时间" width="200" prop="paymentTime"> </el-table-column>
        <el-table-column align="center" label="付款凭证" width="200">
          <!-- <template slot-scope="scope">{{ scope.row.createTime }}</template> -->
          <template slot-scope="scope">
            <el-image v-if="scope.row.paymentFile" style="width: 60px; height: 40px" :src="scope.row.paymentFile.split(',')[0]" :preview-src-list="scope.row.paymentFile.split(',')"></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" label="客户资料" width="200">
          <template slot-scope="scope">
            <el-link type="primary" v-if="scope.row.agencyOrderAttachmentVOList.length" :underline="false" @click="uploadInfo(scope.row)">已上传</el-link>
            <el-link type="primary" v-else :underline="false" @click="uploadInfo(scope.row)">未上传</el-link>
          </template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="remark" width="200" show-overflow-tooltip> </el-table-column>

        <el-table-column align="center" label="最后修改时间" prop="updateTime" width="200"> </el-table-column>
        <el-table-column align="center" label="修改人" prop="updateBy"> </el-table-column>
        <el-table-column align="center" label="创建时间" prop="createTime" width="200"> </el-table-column>
        <el-table-column align="center" label="创建人" prop="createBy"> </el-table-column>
        <el-table-column align="center" label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="删除" placement="top">
              <el-link type="primary" :underline="false" @click="handleRemove(scope.row)" class="icon icon-del"></el-link>
            </el-tooltip>

            <el-tooltip effect="dark" content="编辑" placement="top">
              <el-link type="primary" :underline="false" class="icon icon-edit" @click="editAgentOrder(scope.row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50, 100]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <AddEdit :followList="followList" :rowData="rowData" :addEditDialog.sync="addEditDialog" :isEdit="isEdit" @refresh="queryData" />
    <CustomerInfoDialog :rowData="rowData" :showCustomerInfo.sync="showCustomerInfo" @refresh="queryData" />
  </div>
</template>
<script>
import { userList } from '@/api/newApi/common.js';
import { getList, removeAgentOrder, exportExcel } from '@/api/newApi/agentOrder/agentOrder.js';
import AddEdit from './components/addEdit';
import CustomerInfoDialog from './components/customerInfoDialog';
import cacheQuery from '@/mixins/cacheQuery';
export default {
  components: { AddEdit, CustomerInfoDialog },
  filters: {},
  data() {
    return {
      totalPrice: {}, //合计列表

      // 分页
      listTotal: 0,
      listLoading: false,
      list: [],
      addEditDialog: false,
      isEdit: false,
      listQuery: {
        page: 1,
        limit: 20,
        orderNo: '',
        paymentEndTime: '',
        paymentStartTime: '',
        productName: '',
        enterpriseIds: [],
      },
      cacheKey: 'listQuery',
      copyListQuery: {},
      btnLoading: false,
      rowData: {},
      followList: [],
      showCustomerInfo: false,
      searchFlag: false,
      enterpriseList: [],
      moreSerch: false,
    };
  },
  computed: {},
  mixins: [cacheQuery],
  created() {
    this.copyListQuery = { ...this.listQuery };
    this.enterpriseList = JSON.parse(localStorage.enterpriseList);
    this.getUserList();
    this.getPageCache();
    this.queryData();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.setPageCache();

      getList(this.listQuery)
        .then((res) => {
          this.listLoading = false;
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
            // this.activeName = this.listQuery.status || "0";
            // this.listQuery.status = this.activeName
            if (this.searchFlag) {
              this.$message({
                message: `搜索完成，为您搜索${this.listTotal}条结果`,
                type: 'success',
                duration: 2000,
              });
              this.searchFlag = false;
            }
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    handleRemove(data) {
      this.$Modal.confirm({
        title: '确定删除吗？',
        onOk: () => {
          removeAgentOrder(data.agencyOrderId).then((res) => {
            if (res.code === 0) {
              this.listQuery.page = 1;
              this.$Message.success('删除成功');
              this.queryData();
            }
          });
        },
      });
    },
    addOrder() {
      this.isEdit = false;
      this.addEditDialog = true;
    },
    uploadInfo(row) {
      console.log(row);
      this.showCustomerInfo = true;
      this.rowData = row;
    },
    exportExcel() {
      this.btnLoading = true;
      exportExcel(this.listQuery)
        .then((res) => {
          this.btnLoading = false;
          this.$util.exportExcel(res);
        })
        .catch(() => {
          this.btnLoading = false;
        });
    },
    /**
     *归属人下拉列表
     */
    getUserList() {
      userList({
        page: 1,
        limit: 100,
      }).then((res) => {
        if (res.code == 0) {
          this.followList = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },
    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;

      this.listQuery.paymentEndTime = this.listQuery.paymentTime ? this.listQuery.paymentTime[1] : '';
      this.listQuery.paymentStartTime = this.listQuery.paymentTime ? this.listQuery.paymentTime[0] : '';
      this.queryData();
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

    /** 重置查询条件 */
    clickReset() {
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
      this.queryData();
    },
    editAgentOrder(row) {
      this.rowData = row;
      this.addEditDialog = true;
      this.isEdit = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.search-aera::before {
  height: 0px;
  top: 0px;
}
</style>
