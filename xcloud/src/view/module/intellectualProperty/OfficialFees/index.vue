<template>
  <div class="app-container">
    <div class="header-container">
      <el-tabs ref="elTabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="0"></el-tab-pane>
        <el-tab-pane label="待付款" name="1"></el-tab-pane>
        <el-tab-pane label="已付款" name="2"></el-tab-pane>
      </el-tabs>
      <!-- 查询条件 -->
      <div class="search-box" ref="searchBox">
        <el-form ref="searchForm" inline>
          <el-form-item label="订单编号">
            <el-input v-model="listQuery.orderNo" placeholder="请输入订单编号" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="服务号">
            <el-input v-model="listQuery.serviceNo" placeholder="请输入服务号" clearable style="width: 168px" />
          </el-form-item>
          <el-form-item label="国家">
            <el-select style="width: 168px" v-model="listQuery.countryCode" placeholder="国家" clearable filterable>
              <el-option v-for="(item, index) in countrySelect" :key="index" :label="item.countryNameZh" :value="item.countryCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源">
            <el-select style="width: 168px" size="small" v-model="listQuery.orderSource" clearable filterable>
              <el-option v-for="item in orderSourceList" :value="item.id" :key="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="queryData">搜索</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="submit"> 批量付款 </el-button>
            <el-button type="warning" icon="el-icon-download" :loading="btnLoading" @click="exportBtn"> 导出exl </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" :data="list" style="width: 100%" border max-height="700" v-loading="listLoading" highlight-current-row @selection-change="handleSelectionChange" element-loading-spinner="icon loading" element-loading-text="拼命加载中" :height="tableHeight">
        <Empty slot="empty" />
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column align="center" label="订单编号" prop="orderNo" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="服务编号" prop="officialServiceNo" width="200" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="国家" prop="countryName"></el-table-column>
        <el-table-column align="center" label="商品名称" prop="trademarkNameEn"></el-table-column>
        <el-table-column align="center" label="注册进度" prop="serviceProgressStr" width="150"></el-table-column>
        <el-table-column align="center" label="服务状态" prop="statusStr" width="150">
          <!-- <template slot-scope="scope">
            {{ scope.row.serviceStatus | filterServiceStatus }}
          </template> -->
        </el-table-column>
        <el-table-column align="center" label="受理号/受理日期" width="300">
          <template slot-scope="scope">
            <p>受理号:{{ scope.row.acceptNum }}</p>
            <p>受理日期{{ scope.row.acceptTime }}</p>
          </template>
        </el-table-column>
        <el-table-column align="center" label="律师编号" prop="supplierCode" width="150"></el-table-column>
        <el-table-column align="center" label="律师名称" prop="attorneyName" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" label="创建日期" prop="createTime" width="150"></el-table-column>
        <el-table-column align="center" label="商标注册服务号" prop="serviceNo" width="200"></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <!-- 确认付款 -->
    <el-dialog title="是否确认付款" :visible.sync="confirmFlag" width="400px">
      <el-form ref="paymentsFrom" :rules="paymentsFrom" :model="payments">
        <el-form-item label="是否确认付款：" prop="status">
          <el-radio-group v-model="payments.status">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <div slot="footer" style="text-align: center">
        <el-button style="width: 65px" type="default" @click="dialog.confirmFlag = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submit">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getList, rejectVerificationCode, exportExcel } from '@/api/newApi/intellectualProperty/officialFees.js';
import { getCountrySelectList } from '@/api/newApi/common.js';
export default {
  data() {
    return {
      listLoading: false,
      btnLoading: false,
      orderSourceList: [
        { name: 'PC端', id: 'PC' },
        { name: 'H5端', id: 'H5' },
        { name: '手工录单', id: 'IN' },
        { name: '小程序', id: 'MP' },
        { name: '渠道系统', id: 'CS' },
      ],
      // 分页
      listTotal: 0,
      list: [],
      listQuery: {
        page: 1,
        limit: 7,
      },
      selectList: [],
      countrySelect: [],
      activeName: '0',
      payments: {
        status: 1,
      },
      confirmFlag: false,
      paymentsFrom: {
        status: [{ required: true, message: '请选择', trigger: 'change' }],
      },
    };
  },
  filters: {
    filterServiceStatus(val) {
      switch (val) {
        case '0':
          return '未购买';
        case '1':
          return '正常（服务中）';
        case '2':
          return '待续费';
        case '3':
          return '税号注销';
        case '4':
          return '已转出';
        case '9':
          return '已取消';
        case '10':
          return '封存';
        case '11':
          return '取消中';
      }
    },
  },
  created() {
    this.queryData();
    this.getCountry();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      getList(this.listQuery)
        .then((res) => {
          // 延迟loading关闭
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
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
     * 获取国家下拉框数据
     */
    getCountry() {
      getCountrySelectList()
        .then((res) => {
          this.countrySelect = res.data;
        })
        .catch((err) => {
          this.$message.error(err.message);
        });
    },
    //多选勾选
    handleSelectionChange(val) {
      console.log(val);
      this.selectList = val;
    },
    handleClick() {
      if (this.activeName == '0') {
        this.listQuery.status = '';
      } else {
        this.listQuery.status = this.activeName;
      }

      this.queryData();
    },

    //付款保存
    submit() {
      if (this.selectList.length == 0) {
        this.$message.warning('请选择要操作的工单');
        return;
      }
      let ids = this.selectList.map((item) => item.id).join(',');
      this.$confirm('是否确认付款?', '付款提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      }).then(() => {
        rejectVerificationCode({ ids: ids })
          .then((res) => {
            if (res.code == 0) {
              this.$message.success('操作成功');
              this.queryData();
            }
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      });
    },
    /**
     * 导出报表
     */
    exportBtn() {
      this.btnLoading = true;
      exportExcel(this.listQuery).then((res) => {
        this.btnLoading = false;
        this.$util.exportExcel(res);
      });
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/fixedSearch.scss';
</style>
