<!-- receive -->
<template>
  <div>
    <div class="header-container" ref="searchBox">
      <!-- 查询条件 -->
      <div class="search-box">
        <el-form ref="searchForm" inline>
          <el-form-item label="会员手机号">
            <el-input placeholder="请输入会员手机号" style="width: 168px" size="small" v-model="listQuery.membershipCardOrder.mobile" clearable />
          </el-form-item>
          <el-form-item label="开通会员方式">
            <el-select placeholder="请选择" size="small" style="width: 150px" v-model="listQuery.membershipCardOrder.payType">
              <el-option label="全部" value=""></el-option>
              <el-option label="微信小程序" value="微信小程序"></el-option>
              <el-option label="手动发放" value="手动发放"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="套餐类型">
            <el-select placeholder="请选择" size="small" style="width: 150px" v-model="listQuery.membershipCardOrder.membershipCardId">
              <el-option label="全部" value=""></el-option>
              <el-option :label="item.membershipCardName" :value="item.membershipCardId" v-for="(item, index) in cardArry" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="支付时间">
            <el-date-picker v-model="listQuery.payTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
          </el-form-item>
          <el-form-item label="到期时间">
            <el-date-picker v-model="listQuery.standardTime" type="datetimerange" align="right" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button icon="el-icon-refresh-left" type="default" @click="handleReset">重置</el-button>
          </el-form-item>
          <el-button type="success" size="small" @click="giveMember">赠送会员</el-button>
        </el-form>
      </div>
    </div>

    <!-- 表格 -->
    <div class="table-container">
      <el-table ref="table" element-loading-spinner="icon loading" element-loading-text="拼命加载中" v-loading="listLoading" :data="list" :height="tableHeight" border highlight-current-row>
        <Empty slot="empty" />
        <el-table-column align="center" label="订单编号" width="200">
          <template slot-scope="scope">{{ scope.row.payOrderNo }}</template>
        </el-table-column>
        <el-table-column align="center" label="会员手机号" width="200">
          <template slot-scope="scope">{{ scope.row.mobile }}</template>
        </el-table-column>
        <el-table-column align="center" label="套餐类型" prop="membershipCardName"> </el-table-column>
        <el-table-column align="center" label="应付金额" prop="crossedPrice"> </el-table-column>
        <el-table-column align="center" label="优惠金额" prop="discountAmount"> </el-table-column>
        <el-table-column align="center" label="实付金额" prop="price"> </el-table-column>
        <el-table-column align="center" label="开通会员方式" prop="payType"> </el-table-column>
        <el-table-column align="center" label="付款状态">
          <template slot-scope="scope">{{ payStatus[scope.row.payStatus] }}</template>
        </el-table-column>
        <el-table-column align="center" label="支付时间" width="200">
          <template slot-scope="scope">{{ scope.row.payTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="到期时间" width="200">
          <template slot-scope="scope">{{ scope.row.endTime }}</template>
        </el-table-column>
        <el-table-column align="center" label="备注" prop="remarks"> </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.current" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div>
    <el-dialog title="赠送会员" :visible.sync="dialogVisible" width="450px" center destroy-on-close>
      <el-form ref="editForms" inline style="margin-bottom: 10px" :rules="formRules" :model="editForm" label-width="120px">
        <el-form-item label="手机账号" prop="mobile">
          <el-input placeholder="请输入展示名称" clearable style="width: 260px" size="small" v-model="editForm.mobile" maxlength="30" />
        </el-form-item>
        <el-form-item label="开通会员类型" prop="membershipCardId">
          <el-select placeholder="请选择" size="small" style="width: 260px" v-model="editForm.membershipCardId">
            <el-option :label="item.membershipCardName" :value="item.membershipCardId" v-for="(item, index) in cardArryOpen" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="赠送说明" prop="remarks">
          <el-input placeholder="请输入权益简介" clearable style="width: 260px" size="small" v-model="editForm.remarks" maxlength="30" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" />
          <div>会员购买记录可以查看到赠送内容</div>
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
import { cardBuyList, cardList, cardGive } from '@/api/newApi/extension/activity.js';

export default {
  data() {
    return {
      moreSerch: false, //更多查询条件
      list: [],
      // 分页
      listTotal: 0,
      listLoading: false,
      initHeight: 65,
      listQuery: {
        current: 1,
        size: 20,
        enterpriseId: '',
        membershipCardOrder: {},
        standardTime: [],
        payTime: [],
      },
      payStatus: {
        YZF: '已支付',
        YTK: '已退款',
        ZFSB: '支付失败',
        WZF: '未支付',
      },
      cardArry: [],
      cardArryOpen: [],
      goodsOrderStatus: 'null',
      searchFlag: false,
      editForm: {},
      dialogVisible: false,
      formRules: {
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
        membershipCardId: [{ required: true, message: '请入开通会员类型', trigger: 'change' }],
        remarks: [{ required: true, message: '请输入赠送说明', trigger: 'blur' }],
      },
    };
  },

  created() {
    this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
    this.queryData();
    this.getCardList();
    this.getCardListOpen();
  },
  watch: {},

  methods: {
    /**
     *
     * 查询列表
     */
    queryData() {
      this.listLoading = true;
      this.listQuery.enterpriseId = window.localStorage.getItem('enterpriseId');
      let data = this.setGetListParm();
      delete data.standardTime;
      delete data.payTime;
      cardBuyList(data)
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
        if (item == 'standardTime' && params['standardTime'] && params['standardTime'].length > 0) {
          params.serviceStartTime = params[item][0];
          params.serviceEndTime = params[item][1];
        }
        if (item == 'payTime' && params['payTime'] && params['payTime'].length > 0) {
          params.payStartTime = params[item][0];
          params.payEndTime = params[item][1];
        }
        return item;
      });
      return params;
    },
    getCardList() {
      let data = {
        current: 1,
        size: 100,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
      };
      cardList(data)
        .then((res) => {
          if (res.code === 0) {
            this.cardArry = res.data;
          }
        })
        .finally(() => {});
    },
    getCardListOpen() {
      let data = {
        current: 1,
        size: 100,
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
        membershipCard: {
          status: true,
        },
      };
      cardList(data)
        .then((res) => {
          if (res.code === 0) {
            this.cardArryOpen = res.data;
          }
        })
        .finally(() => {});
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
        enterpriseId: Number(localStorage.getItem('enterpriseId')),
        membershipCardOrder: {},
        standardTime: [],
        payTime: [],
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
    toTogetherRecord(row) {
      this.$router.push({
        name: 'togetherRecord',
        path: '/extension/activityManagement/together/record',
        query: {
          id: row.shareActivityId,
          name: row.activityName,
          startTime: row.spellStartTime,
          finishTime: row.spellEndTime,
        },
      });
    },
    giveMember() {
      this.dialogVisible = true;
      this.editForm = {};
    },
    sure() {
      this.$refs.editForms.validate((valid) => {
        if (valid) {
          cardGive({
            mobile: this.editForm.mobile,
            membershipCardId: this.editForm.membershipCardId,
            remarks: this.editForm.remarks,
          })
            .then((res) => {
              if (res.code == 0) {
                if (res.data == '用户不存在') {
                  this.$message({
                    type: 'error',
                    message: res.data,
                  });
                } else {
                  this.dialogVisible = false;
                  this.queryData();
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
        } else {
          return false;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss"></style>
