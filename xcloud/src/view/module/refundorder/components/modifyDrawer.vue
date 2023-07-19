<template>
  <el-drawer size="80%" title="申请退款" :visible.sync="drawerVisible" @close="reset">
    <div slot="title" class="drawer-title-wrapper">
      <div class="drawer-title">修改</div>
      <div class="drawer-title-btn-group">
        <el-button @click="drawerVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="refundConfirm" size="small">确 定</el-button>
      </div>
    </div>

    <div class="refund-left float-left">
      <h2>退款商品</h2>
      <el-table border :data="refundList" :max-height="560" class="table">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品名称" prop="productName" width="200">
          <template slot-scope="scope">
            {{ scope.row.productName }}<br />
            服务项目： {{ scope.row.specsName }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="实付金额（元）" prop="countryName">
          <template slot-scope="scope">
            {{ scope.row.productPaidMoney | formatQianFenWei }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="平台手续费（元）" width="160">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.refundPoundage" :min="0" :precision="2" size="small" @blur="changereFundPoundage(scope.row, scope.$index)" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="退款金额（元）">
          <template slot-scope="scope"> ￥{{ scope.row.refundMoney | formatQianFenWei }} </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="refund-right float-left">
      <h2>退款信息</h2>

      <p class="refund-tip">提示：微信支付超过30天，支付宝超过90天 ，线下转账不支持原路退回</p>
      <el-row class="title bold" v-if="orderRefund.refundType == 'ORDER'">
        <span>退款商品：{{ productName }}</span>
      </el-row>

      <el-row class="title bold" v-if="orderRefund.refundType == 'ORDER'">
        <span>实付金额：{{ orders.orderPaidMoney }}</span>
        <span style="margin-left: 20px">付款方式：{{ orders.paymentChannel }}</span>
        <span style="margin-left: 20px">最后付款时间：{{ orders.paymentTime }}</span>
      </el-row>

      <el-row class="title bold" v-else>
        <span>订单号：{{ orderRefund.orderNo }}</span>
        <span style="margin-left: 20px">实付金额：￥{{ orderRefund.amountMoney | formatQianFenWei }}</span>
        <span style="margin-left: 20px">已付开票金额：￥{{ (productList[0] || {}).payedTaxMoney }}</span>
      </el-row>

      <el-form :model="refundForm" label-width="140px" :rules="rulefundform" ref="refundForm">
        <el-form-item label="选择退款类型" prop="refundApplyType" v-if="orderRefund.refundType == 'ORDER'">
          <el-radio-group v-model="refundForm.refundApplyType" @change="refundApplyTypeChange">
            <el-radio label="REFUND_CANCEL_SERVICE">退款并取消服务</el-radio>
            <el-radio label="ONLY_REFUND">仅退款</el-radio>
            <el-radio label="ONLY_CANCEL_SERVICE">仅取消服务</el-radio>
          </el-radio-group>
          <div class="item-tip" v-show="refundText">
            <i class="icon icon-tip"></i>
            {{ refundText }}
          </div>
        </el-form-item>

        <template v-if="refundForm.refundApplyType != 'ONLY_CANCEL_SERVICE'">
          <el-form-item label="退款路径" prop="refundMethod">
            <el-radio-group v-model="refundForm.refundMethod">
              <el-radio label="RETURN_TO_SOURCE" v-if="supportReturnSourceFlag">原路返回</el-radio>
              <el-radio label="RETURN_TO_BANK">退回到银行卡</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="退款手续费" prop="refundPoundage">
            <el-input v-model="refundForm.refundPoundage" placeholder="请输入" type="number" :min="0" clearable style="width: 300px" size="small" />
            <div class="item-tip">
              <i class="icon icon-tip"></i>
              退款手续费为平台需要扣除的服务费，全额退款时输入为0
            </div>
          </el-form-item>
          <el-form-item label="不扣除手续费原因" prop="noPoundageReason">
            <el-input v-model="refundForm.noPoundageReason" placeholder="请输入不扣除手续费原因" clearable style="width: 300px" size="small" />
            <div class="item-tip" v-if="orderRefund.refundType == 2"><i class="icon icon-tip"></i>退款金额不能超过已付开票金额</div>
          </el-form-item>
          <el-form-item label="退款金额" prop="refundMoney">
            <el-input v-model="refundForm.refundMoney" placeholder="请输入" type="number" :min="0" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="退款账户类型" prop="bankCountType" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
            <el-radio-group v-model="refundForm.bankCountType">
              <el-radio label="PERSONAL">个人</el-radio>
              <el-radio label="ENTERPRISE">企业</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="退款银行：" prop="refundBank" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
            <el-input v-model="refundForm.refundBank" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="退款账户：" prop="refundAccount" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
            <el-input v-model="refundForm.refundAccount" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="收款人姓名：" prop="refundPayee" v-if="refundForm.bankCountType == 'PERSONAL' && refundForm.refundMethod == 'RETURN_TO_BANK'">
            <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="收款公司名称：" prop="refundPayee" v-if="refundForm.bankCountType == 'ENTERPRISE' && refundForm.refundMethod == 'RETURN_TO_BANK'">
            <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="开户支行：" prop="bankBranch" v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
            <el-input v-model="refundForm.bankBranch" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="省市：" prop="provincesCities">
            <el-select style="width: 145px; margin-right: 10px" v-model="refundForm.province" placeholder="省" filterable @change="provinceChange">
              <el-option :value="province.name" :label="province.name" v-for="province in provinceList" :key="province.id"></el-option>
            </el-select>
            <el-select style="width: 145px" v-model="refundForm.city" placeholder="市" filterable>
              <el-option :value="city.name" :label="city.name" v-for="city in cityList" :key="city.id"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="退款原因分类：" prop="refundReasonType">
          <el-select clearable style="width: 300px" placeholder="请选择" size="small" filterable v-model="refundForm.refundReasonType">
            <el-option v-for="(item, index) in refundclass" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款原因：" prop="refundReason">
          <el-input
            type="textarea"
            :rows="6"
            style="width: 300px"
            v-model="refundForm.refundReason"
            placeholder="1、付款时间：
            2、退款具体原因：
            3、直属主管是否协助挽留：
            4、客户是否有其他业务办理：
            5、客户历史消费："
          />
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import { refundAudit } from '@/api/newApi/orderManage/refundOrder';
import { editOrderRefund } from '@/api/newApi/orderManage/salesorder.js';
import { getWorldCountryListByPid } from '@/api/newApi/customer/companyInfo';
export default {
  props: {
    modifyDrawerVisible: Boolean,
    supportReturnSourceFlag: Boolean,
    id: String,
    productList: Array,
    orderId: { type: String },
    orderRefund: Object,
    selRefundList: Array,
    orders: Object,
  },
  data() {
    var validateReason = (rule, value, callback) => {
      if (this.refundForm.refundPoundage === '0' && value === '') {
        callback(new Error('请输入不扣除手续费原因'));
      } else {
        callback();
      }
    };
    return {
      formLabelWidth: '100px',
      refund: {},
      provinceList: [],
      cityList: [],
      refundList: [],
      refundclass: [
        { label: '客户店铺原因（挂掉/没注册下来等）', value: 'RRT001' },
        { label: '买多了/不想要了/拍错了', value: 'RRT002' },
        { label: '目前活动更优惠', value: 'RRT003' },
        { label: '重新合作/店铺关闭', value: 'RRT004' },
        { label: '时效太慢', value: 'RRT005' },
        { label: '信息弄错', value: 'RRT006' },
        { label: '服务态度不好', value: 'RRT007' },
        { label: '专业问题未及时处理', value: 'RRT008' },
        { label: '其他', value: 'RRT009' },
      ],
      refundForm: {
        refundApplyType: '',
        refundPoundage: '',
        refundMoney: '',
        refundBank: '',
        refundAccount: '',
        refundPayee: '',
        refundReasonType: '',
        bankCountType: '',
        refundMethod: '',
        refundReason: '',
        // auditFile: "",
        noPoundageReason: '',
        province: '',
        city: '',
      },
      rulefundform: {
        refundApplyType: [
          {
            required: true,
            message: '请输入选择退款类型',
            trigger: 'change',
          },
        ],
        refundPoundage: [
          {
            required: true,
            message: '请输入退款手续费',
            trigger: 'blur',
          },
        ],
        refundMoney: [
          {
            required: true,
            message: '请输入退款金额',
            trigger: 'blur',
          },
        ],
        refundBank: [
          {
            required: true,
            message: '请输入银行名称',
            trigger: 'blur',
          },
        ],
        refundAccount: [
          {
            required: true,
            message: '请输入退款账户',
            trigger: 'blur',
          },
        ],
        refundPayee: [
          {
            required: true,
            message: '请输入收款人/公司名称',
            trigger: 'blur',
          },
        ],
        productName: '',
        bankBranch: [{ required: true, message: '请输入开户支行', trigger: 'blur' }],
        bankCountType: [{ required: true, message: '请选择退款账户类型', trigger: 'change' }],
        refundMethod: [{ required: true, message: '请选择退款路径', trigger: 'change' }],
        refundReasonType: [
          {
            required: true,
            message: '请选择退款原因分类',
            trigger: 'change',
          },
        ],
        refundReason: [
          {
            required: true,
            message: '请输入退款原因',
            trigger: 'blur',
          },
        ],
        // auditFile: [
        //   {
        //     required: true,
        //     message: '请上传凭证',
        //     trigger: 'change',
        //   },
        // ],
        noPoundageReason: [{ validator: validateReason, trigger: 'change' }],
      },
    };
  },
  computed: {
    drawerVisible: {
      get() {
        // if (this.modifyDrawerVisible) {
        //   this.refundForm = JSON.parse(JSON.stringify(this.orderRefund))
        //   console.log(this.refundForm)
        //   this.provinceChange(this.refundForm.province)
        // }
        return this.modifyDrawerVisible;
      },
      set(val) {
        this.$emit('update:modifyDrawerVisible', val);
      },
    },
    refundText() {
      switch (this.refundForm.refundApplyType) {
        case 'ONLY_REFUND':
          return '仅退款，服务商品对应的服务工单正常交付';
        case 'ONLY_CANCEL_SERVICE':
          return '仅取消服务，钉钉审批通过后会自动取消服务，不退款';
        case 'REFUND_CANCEL_SERVICE':
          return '退款并取消服务，会同步取消已经生成的服务工单';
      }
    },
  },
  watch: {
    modifyDrawerVisible(val) {
      if (val) {
        this.refundForm = JSON.parse(JSON.stringify(this.orderRefund));
        console.log(this.refundForm);
        if (this.refundForm.province) {
          this.provinceChange(this.refundForm.province, true);
        }
      }
    },
    selRefundList(val) {
      console.log(val);
      this.refundList = JSON.parse(JSON.stringify(val));
      this.productName = val.reduce((pre, cur) => {
        return pre == '' ? pre + cur.productName : pre + ',' + cur.productName;
      }, '');
    },
  },
  created() {
    this.getProvinceOrCityList(1, 'province');
  },
  methods: {
    submit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.drawerVisible = false;
          this.auditConfirm();
        } else {
          return false;
        }
      });
    },
    changereFundPoundage(item, index) {
      this.$set(this.refundList[index], 'refundMoney', this.$util.accSub(item.productPaidMoney, item.refundPoundage));
      this.refundForm.refundMoney = this.refundList.reduce((pre, cur) => {
        return this.$util.accAdd(pre, cur.refundMoney);
      }, 0);

      this.refundForm.refundPoundage = this.refundList.reduce((pre, cur) => {
        return this.$util.accAdd(pre, cur.refundPoundage);
      }, 0);
    },
    refundApplyTypeChange(val) {
      if (val == 'ONLY_CANCEL_SERVICE') {
        this.refundForm = {
          refundPoundage: 0,
          refundMoney: 0,
          refundBank: '',
          refundAccount: '',
          bankBranch: '',
          refundPayee: '',
          bankCountType: '',
          province: '',
          refundMethod: '',
          noPoundageReason: '',
          refundReasonType: '',
          refundApplyType: 'ONLY_CANCEL_SERVICE',
          refundReason: '',
          city: '',
        };
      }
    },
    // 更改省
    provinceChange(name, flag) {
      // 根据名称获取id
      let id = (this.provinceList.find((item) => item.name == name) || {}).id;
      this.getProvinceOrCityList(id, 'city');
      if (!flag) this.refundForm.city = '';
    },
    // 获取省市列表
    getProvinceOrCityList(pid, type) {
      getWorldCountryListByPid({
        pid,
      }).then((res) => {
        if (type === 'province') {
          this.provinceList = res.data;
        } else if (type === 'city') {
          this.cityList = res.data;
        }
      });
    },
    reset() {
      if (this.$refs.refundForm) {
        this.$refs.refundForm.resetFields();
      }
    },
    /**
     * 申请退款
     */
    refundConfirm() {
      this.$refs.refundForm.validate((valid) => {
        if (valid) {
          // "refundProductDTOs": [
          //   {
          //     "orderProductId": 0,
          //     "productPaidMoney": 0,
          //     "realRefundMoney": 0,
          //     "refundPoundage": 0,
          //     "virtualRefundMoney": 0
          //   }
          // ],
          const refundProductDTOs = this.refundList.map((item) => ({ orderProductId: item.orderProductId, productPaidMoney: item.productPaidMoney, refundPoundage: item.refundPoundage, realRefundMoney: item.refundMoney }));
          editOrderRefund({
            refundId: this.orderRefund.orderRefundId,
            orderId: this.orderId,
            refundType: this.orderRefund.refundType,
            ...this.refundForm,
            refundProductDTOs,
          })
            .then((res) => {
              if (res.code == 0) {
                this.$message.success('修改成功');
                this.drawerVisible = false;
                this.$emit('refresh');
              }
            })
            .catch((err) => {
              // this.$message(err.message);
            });
        }
      });
    },
    auditConfirm() {
      refundAudit({
        ...this.form,
        id: this.id,
      }).then((res) => {
        if (res.code === 0) {
          this.$message({
            type: 'success',
            message: '修改成功',
            duration: 2000,
          });
          this.$emit('refresh');
        } else {
          this.$message({
            type: 'fail',
            message: '修改失败',
            duration: 2000,
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  margin: 0 20px 10px 20px;
  font-size: 14px;
  color: black;
  &.bold {
    font-weight: bold;
    margin-bottom: 20px;
  }
}
::v-deep .el-drawer__header {
  padding: 0 30px;
  border-bottom: 1px solid #ddd;
}
::v-deep .el-drawer__body {
  padding: 0 60px;
}
.drawer-title-wrapper {
  height: 60px;
  padding-right: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .drawer-title {
    font-size: 14px;
    color: #333;
  }
}
.item-tip {
  line-height: 28px;
  box-shadow: 0px 2px 3px 0px rgba(57, 61, 70, 0.06), 0px -2px 3px 0px rgba(57, 61, 70, 0.06);
  color: #999;
  padding: 0 20px;
  margin-top: 10px;
}
.refund-left {
  width: 50%;
}

.refund-right {
  padding-left: 30px;
  width: 48%;
  .refund-tip {
    height: 32px;
    line-height: 32px;
    background: #f2f2f2;
    padding-left: 20px;
    margin-bottom: 10px;
  }
}

/deep/ .el-drawer__body {
  padding: 0 40px;
  h2 {
    font-size: 22px;
    color: #333;
    margin-bottom: 10px;
  }
}

.drawer-title-wrapper /deep/.drawer-title {
  font-size: 18px;
}

/deep/ .el-drawer__header {
  margin-bottom: 10px !important;
}
</style>
