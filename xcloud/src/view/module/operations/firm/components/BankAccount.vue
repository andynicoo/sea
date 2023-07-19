<template>
  <div class="form">
    <div class="tittle">
      <el-divider direction="vertical"></el-divider>
      <span class="text-info">基础信息</span>
    </div>
    <el-table :data="bankList" highlight-current-row class="table" border >
      <el-table-column align="center" label="编号" width="70">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="账户名称" prop="accountName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="银行名称" prop="bankName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="银行账号" prop="bankAccount" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.type == 1 ? "公户" : "私户" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="帐号类型" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ getAccountType(scope.row.accountType) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0">
            <span class="dot-success"><span class="dot"></span></span>
            启用
          </span>
          <span v-else>
            <span class="dot-danger"><span class="dot"></span></span>
            禁用
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="是否默认">
        <template slot-scope="scope">
          {{ scope.row.isDefault == 0 ? "是" : "否" }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建人" prop="createName" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="创建时间" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="修改人" prop="modifyId" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="修改时间" prop="modifyName" show-overflow-tooltip></el-table-column>
    </el-table>
  </div>
</template>
<script>
import { detailFirmBankList } from "@/api/newApi/operations/firm.js";
export default {
  data() {
    return {
      bankList: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10
      }
    };
  },
  created() {
    this.getBanList();
  },
  methods: {
    getAccountType(v) {
      switch (parseInt(v)) {
        case 1:
          return "网银转账";
        case 2:
          return "微信";
        case 3:
          return "支付宝";
        case 4:
          return "paypal";
        case 5:
          return "ebay";
        default:
          break;
      }
    },
    getBanList() {
      detailFirmBankList().then(res => {
        // 延迟loading关闭
        setTimeout(() => {
          this.listLoading = false;
        }, 300);
        if (res.code == 0) {
          // 设置列表和总条数
          this.bankList = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getBanList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getBanList();
    }
  }
};
</script>
<style scoped lang="scss">
.form {
  border: 1px solid #eeeeee;
  margin: 30px 0;
  padding: 10px 25px;
}
.tittle {
  font-size: 14px;
  padding: 10px 0;
}
.table{
  height: calc(100vh - 550px);
  overflow: auto;
}
</style>
