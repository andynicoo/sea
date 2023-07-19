<!-- receive -->
<template>
  <div>
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline>
          <el-form-item label="兑换单号">
            <el-input placeholder="请输入兑换单号" clearable style="width: 168px" size="small" v-model="listQuery.goodsOrderNo" @clear="queryData" />
          </el-form-item>
          <el-form-item label="兑换类型">
            <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.goodsType">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="实物商品" :value="1"></el-option>
              <el-option label="优惠券" :value="2"></el-option>
              <el-option label="会员卡" :value="3"></el-option>
              <el-option label="虚拟商品" :value="4"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="兑换状态">
            <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.goodsOrderStatus">
              <el-option label="全部" :value="null"></el-option>
              <el-option label="待兑换" :value="1"></el-option>
              <el-option label="已兑换" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker v-model="listQuery.createTimeQuery" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 表格 -->
    <div class="table-container">
      <div class="table-box-header">
        <el-tabs v-model="goodsOrderStatus" @tab-click="handleClick">
          <el-tab-pane label="全部" name="null"></el-tab-pane>
          <el-tab-pane label="待兑换" name="1"></el-tab-pane>
          <el-tab-pane label="已兑换" name="2"></el-tab-pane>
        </el-tabs>
        <div class="btns">
          <el-button type="success" size="small" :disabled="!selectArrry.length" @click="dialogVisibleStatus = true">批量修改兑换状态</el-button>
        </div>
      </div>
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row @selection-change="handleSelectionChange">
        <Empty slot="empty" />
        <el-table-column type="selection" width="55" :selectable="selected"> </el-table-column>
        <el-table-column align="center" label="兑换单号" width="200">
          <template slot-scope="scope">{{ scope.row.goodsOrderNo }}</template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" width="200">
          <template slot-scope="scope">{{ scope.row.goodsName }}</template>
        </el-table-column>
        <el-table-column align="center" label="兑换类型" width="200">
          <template slot-scope="scope">
            <span>{{ goodsTypeStatus[scope.row.goodsType] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="兑换状态" width="120">
          <template slot-scope="scope">
            <span>{{ goodsOrderStatusType[scope.row.goodsOrderStatus] }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">{{ scope.row.username || '-' }}</template>
        </el-table-column>
        <el-table-column align="center" label="消费积分">
          <template slot-scope="scope">{{ scope.row.integralPrice }}</template>
        </el-table-column>
        <el-table-column align="center" label="收货人信息">
          <template slot-scope="scope">{{ scope.row.name }}{{ scope.row.mobile }} <span v-if="!scope.row.name && !scope.row.mobile">-</span> </template>
        </el-table-column>

        <el-table-column align="center" label="收货人地址" width="200">
          <template slot-scope="scope"> {{ scope.row.province }} {{ scope.row.city }} {{ scope.row.region }} {{ scope.row.detailAddress || '-' }} </template>
        </el-table-column>

        <el-table-column align="center" label="兑换时间" width="120">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="客户留言">
          <template slot-scope="scope">
            {{ scope.row.issueType == 1 ? '系统发放' : ' 客户领取' }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="120" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="editRecord(scope.row)" v-if="scope.row.goodsType == 1 || scope.row.goodsType == 4">编辑</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>

    <!-- 编辑 -->
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="editItem" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="商品信息" prop="name">
          <div class="edititem">
            <img :src="editItem.goodsImg" style="width: 50px; float: left" />
            <div class="content">
              <h2>
                {{ editItem.goodsName }}
              </h2>
              {{ editItem.integralPrice }} 积分
            </div>
          </div>
        </el-form-item>
        <el-form-item label="兑换状态">
          <el-select placeholder="请选择" size="small" v-model="editItem.goodsOrderStatus">
            <el-option label="待兑换" :value="1"></el-option>
            <el-option label="已兑换" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司" prop="logistics" v-if="editType == 1">
          <el-input v-model="editItem.logistics"></el-input>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNo" v-if="editType == 1">
          <el-input v-model="editItem.logisticsNo"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="批量修改状态" :visible.sync="dialogVisibleStatus" width="500px" :close-on-click-modal="false" destroy-on-close>
      <el-form :model="editStatus" :rules="rules" ref="ruleFormStatus" label-width="100px" class="demo-ruleForm">
        <el-form-item label="兑换状态">
          <el-select placeholder="请选择" size="small" v-model="editStatus.goodsOrderStatus">
            <el-option label="已兑换" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitStatus">确认</el-button>
          <el-button @click="dialogVisibleStatus = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getIntegralOrder, updateIntegralGoodsOrde, batchExchangeIntegral } from '@/api/newApi/extension/coupon.js';

export default {
  data() {
    return {
      moreSerch: false, //更多查询条件
      list: [],
      // 分页
      listTotal: 0,
      initHeight: 65,
      listLoading: false,
      listQuery: {
        page: 1,
        limit: 20,
        enterpriseId: '',
        goodsOrderNo: '',
        goodsOrderStatus: null,
        goodsType: null,
        createTimeQuery: [],
      },
      goodsOrderStatus: 'null',
      searchFlag: false,
      dialogVisible: false,
      editItem: {
        name: '',
        goodsOrderStatus: 1,
        logistics: '',
        logisticsNo: '',
      },
      editStatus: {
        goodsOrderStatus: 2,
      },
      goodsTypeStatus: {
        1: '实物商品',
        2: '优惠券',
        3: '会员卡',
        4: '虚拟商品',
      },
      goodsOrderStatusType: {
        1: '待兑换',
        2: '已兑换',
      },
      rules: {
        logistics: [{ required: true, message: '请输入物流公司', trigger: 'blur' }],
        logisticsNo: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
      },
      selectArrry: [],
      dialogVisibleStatus: false,
      editType: '',
    };
  },

  created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    this.queryData();
  },
  watch: {
    goodsOrderStatus: {
      handler(newVal, oldVal) {
        if (Number(newVal) === 1 || Number(newVal) === 2) {
          this.listQuery.goodsOrderStatus = Number(newVal);
        } else {
          this.listQuery.goodsOrderStatus = null;
        }
        this.search();
      },
    },
    'listQuery.goodsOrderStatus': {
      handler(newVal, oldVal) {
        if (newVal === 1 || newVal === 2) {
          this.goodsOrderStatus = newVal.toString();
        } else {
          this.goodsOrderStatus = 'null';
        }
        // this.search();
      },
      deep: true,
    },
  },

  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      // this.search();
    },
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
      let data = {
        // token: 'b4af58f5-ed5a-4536-90fd-c3cfd2bb43fe',
        ...this.listQuery,
      };
      getIntegralOrder(data)
        .then((res) => {
          this.listLoading = false;
          if (res.code == 0) {
            // 设置列表和总条数
            this.list = res.data.records;
            this.listTotal = Number(res.data.total);
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

    search() {
      this.searchFlag = true;
      this.listQuery.page = 1;
      this.queryData();
    },

    handleReset() {
      this.listQuery = {
        page: 1,
        limit: 20,
        enterpriseId: '',
        goodsOrderNo: '',
        goodsOrderStatus: null,
        goodsType: null,
        createTimeQuery: [],
      };
      this.search();
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

    /** 编辑 */
    editRecord(row) {
      this.editType = row.goodsType;
      this.editItem = row;
      this.dialogVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let { code } = await updateIntegralGoodsOrde(this.editItem);
          if (code == 0) {
            this.$message.success('编辑成功');
            this.dialogVisible = false;
            this.searchData();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    selected(row) {
      let status = false;
      if (row.goodsType == 2 || row.goodsType == 3) {
        status = false;
      } else {
        status = true;
      }
      if (row.goodsOrderStatus == 2) {
        status = false;
      }
      return status;
    },
    handleSelectionChange(val) {
      let selectArrry = [];
      if (val.length > 0) {
        val.forEach((item) => {
          selectArrry.push(item.goodsOrderId);
        });
      }
      this.selectArrry = selectArrry;
    },
    submitStatus() {
      batchExchangeIntegral({
        goodsOrderIds: this.selectArrry,
        goodsOrderStatus: this.editStatus.goodsOrderStatus,
      })
        .then((res) => {
          if (res.code == 0) {
            // 设置列表和总条数
            this.$message.success('编辑成功');
            this.dialogVisibleStatus = false;
            this.queryData();
          } else {
            this.$message({
              type: 'error',
              message: res.message,
            });
          }
        })
        .catch((err) => {});
    },
  },
};
</script>
<style scoped lang="scss">
.edititem {
  img {
    width: 50px;
    height: 50px;
    float: left;
  }
  .content {
    float: left;
    margin-left: 5px;
    h2 {
      font-size: 14px;
    }
    p {
      font-size: 12px;
    }
  }
}
.table-box-header {
  display: flex;
  justify-content: space-between;
}
</style>
