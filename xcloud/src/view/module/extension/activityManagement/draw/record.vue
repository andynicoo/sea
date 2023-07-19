<!-- receive -->
<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <BackHerader @back="goback" title="抽奖记录"></BackHerader>
      <el-form inline label-width="70px">
        <el-form-item>
          <h4>{{ `活动名称：${name}（${startTime} 至 ${finishTime}）` }}</h4>
        </el-form-item>
      </el-form>
      <el-form ref="searchForm" inline>
        <el-form-item label="参与用户">
          <el-input placeholder="请输入客户手机号" clearable style="width: 168px" size="small" v-model="listQuery.userMobile" @clear="queryData" />
        </el-form-item>
        <el-form-item label="中奖状态">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.winStatus" clearable>
            <el-option label="全部" :value="0"></el-option>
            <el-option label="已中奖" :value="1"></el-option>
            <el-option label="未中奖" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参与时间">
          <el-date-picker v-model="listQuery.receivedTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
        </el-form-item>
        <el-form-item label="奖品类型">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.prizeType" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="未中奖" value="nothing"></el-option>
            <el-option label="优惠券" value="coupon"></el-option>
            <el-option label="实物图片" value="entity"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="兑换状态">
          <el-select placeholder="请选择" size="small" style="width: 120px" v-model="listQuery.status" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option label="待兑换" value="WAIT_EXCHANGE"></el-option>
            <el-option label="待收货" value="WAIT_RECEIVE"></el-option>
            <el-option label="已兑换" value="EXCHANGED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
          <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 列表 -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="手机号">
          <template slot-scope="scope">{{ scope.row.userMobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="奖品类型">
          <template slot-scope="scope">{{ prizeType[scope.row.luckyDrawPrize.prizeType] }}</template>
        </el-table-column>
        <el-table-column align="center" label="奖品内容">
          <template slot-scope="scope">
            {{ scope.row.prizeInfo }}
            <div v-if="scope.row.luckyDrawPrize.prizeType == 'nothing'">
              <div>{{ prizeType[scope.row.luckyDrawPrize.prizeType] }}</div>
              <div>概率未命中</div>
            </div>
            <div v-else-if="scope.row.luckyDrawPrize.prizeType == 'coupon'">
              <div>{{ JSON.parse(scope.row.extendField).couponName }}</div>
              <div>优惠券</div>
            </div>
            <div v-else>
              <div>{{ scope.row.luckyDrawPrize.prizeName }}</div>
              <div>实物商品</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">{{ statusType[scope.row.status] }}</template>
        </el-table-column>
        <el-table-column align="center" label="收货人信息">
          <template slot-scope="scope">
            <div>{{ scope.row.userAddressVO.name }}</div>
            <div>{{ scope.row.userAddressVO.mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="地址">
          <template slot-scope="scope">
            <div>
              <span>{{ scope.row.userAddressVO.province }}</span>
              <span>{{ scope.row.userAddressVO.city }}</span>
              <span>{{ scope.row.userAddressVO.region }}</span>
              <span>{{ scope.row.userAddressVO.street }}</span>
              <span>{{ scope.row.userAddressVO.detailAddress }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" label="抽奖时间">
          <template slot-scope="scope">{{ scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-tooltip content="编辑" placement="top" v-if="scope.row.luckyDrawPrize.prizeType == 'entity'">
              <el-link type="primary" class="icon icon-edit" :underline="false" @click="toActivities(scope.row)"></el-link>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <el-dialog title="编辑" :visible.sync="dialogVisible" width="400px" center destroy-on-close>
      <el-form ref="editForms" inline style="margin-bottom: 10px" :rules="formRules" :model="editForm">
        <el-form-item label="奖品信息">
          <el-image style="width: 48px; height: 33px" :src="editForm.prizeImg">
            <div slot="error" class="image-slot"><img src="@/assets/images/infoDetail/default.png" alt="" /></div>
          </el-image>
          <span style="margin-left: 10px">{{ editForm.prizeName }}</span>
        </el-form-item>
        <el-form-item label="兑换状态" prop="status">
          <el-select placeholder="请选择" size="small" style="width: 260px" v-model="editForm.status" clearable>
            <el-option label="待兑换" value="WAIT_EXCHANGE"></el-option>
            <el-option label="待收货" value="WAIT_RECEIVE"></el-option>
            <el-option label="已兑换" value="EXCHANGED"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流公司" prop="logisticsCompanyName">
          <el-input placeholder="请输入物流公司" clearable style="width: 260px" size="small" v-model="editForm.logisticsCompanyName" maxlength="30" />
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsNumber">
          <el-input placeholder="请输入物流单号" clearable style="width: 260px" size="small" v-model="editForm.logisticsNumber" maxlength="30" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import { getDrawRecordData, editPrize } from '@/api/newApi/extension/activity.js';
export default {
  components: {
    BackHerader,
  },
  filters: {
    //功能码
    filterCode(val) {
      switch (val) {
        case 0:
          return '适用所有';
        case 1:
          return '指定商品可用';
        case 2:
          return '指定商品不可用';
      }
    },
    //状态
    filterState(val) {
      switch (val) {
        case 0:
          return '未中奖';
        case 1:
          return '已中奖';
      }
    },
    //不同状态显示不同的文字颜色
    filterStyle(val) {
      switch (val) {
        case 0:
          return 'test';
        case 1:
          return 'text-blue';
      }
    },
  },

  data() {
    return {
      moreSerch: false, //更多查询条件
      list: [],
      // 分页
      listTotal: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 20,
        winStatus: 0, //状态
        userMobile: '',
        prizeType: '',
        receivedTime: [],
        status: '',
      },
      searchFlag: false,
      prizeType: {
        nothing: '未中奖',
        coupon: '优惠券',
        entity: '实物商品',
      },
      statusType: {
        WAIT_EXCHANGE: '待兑换',
        WAIT_RECEIVE: '待收货',
        EXCHANGED: '已兑换',
      },
      editForm: {},
      dialogVisible: false,
      name: this.$route.query.name,
      startTime: this.$route.query.startTime,
      finishTime: this.$route.query.finishTime,
      formRules: {
        status: [{ required: true, message: '请选择兑换状态', trigger: 'change' }],
        logisticsCompanyName: [{ required: true, message: '请输入物流公司', trigger: 'blur' }],
        logisticsNumber: [{ required: true, message: '请输入物流单号', trigger: 'blur' }],
      },
    };
  },

  created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    this.queryData();
  },
  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      getDrawRecordData(this.setGetListParm(), this.$route.query.id)
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

    setGetListParm() {
      let params = { ...this.listQuery };
      Object.keys(params).map((item) => {
        if (item == 'receivedTime' && params['receivedTime'] && params['receivedTime'].length > 0) {
          params.startTime = params[item][0];
          params.finishTime = params[item][1];
        }
        if (params[item] == '-1') {
          params[item] = null;
        }
        if (params[item] == '') {
          delete params[item];
        }
        return item;
      });
      return params;
    },

    search() {
      this.searchFlag = true;
      this.listQuery.current = 1;
      this.queryData();
    },

    handleReset() {
      this.listQuery = {
        current: 1,
        size: 20,
        winStatus: 0, //状态
        userMobile: '',
        prizeType: '',
        receivedTime: [],
      };
      this.search();
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.size = val;
      this.queryData();
    },

    handleCurrentChange(val) {
      this.listQuery.current = val;
      this.queryData();
    },
    /**
     * 搜索全部/清空时间分页为第一页
     */
    searchData() {
      this.listQuery.current = 1;
      this.queryData();
    },
    // 返回列表
    goback() {
      this.$router.push({
        path: '/extension/activityManagement/draw/index.vue',
        name: 'draw',
      });
    },
    toActivities(row) {
      this.editForm = row;
      this.dialogVisible = true;
    },
    sure() {
      this.$refs.editForms.validate((valid) => {
        if (valid) {
          editPrize({
            luckyDrawLogId: this.editForm.luckyDrawLogId,
            logisticsCompanyName: this.editForm.logisticsCompanyName,
            logisticsNumber: this.editForm.logisticsNumber,
            status: this.editForm.status,
          })
            .then((res) => {
              if (res.code == 0) {
                this.dialogVisible = false;
                this.queryData();
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
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.test {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #67c23a;
  background: #eaffe0;
  border: 1px solid #67c23a;
}

.text-blue {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffc100;
  background: #fff8e1;
  border: 1px solid #ffc100;
}
.text-warning {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #b8b8b8;
  background: #f4f4f4;
  border: 1px solid #b8b8b8;
}
</style>
