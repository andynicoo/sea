<template>
  <el-drawer size="80%" title="订单确认" :visible.sync="dialogvisible" center>
    <div slot="title" class="drawer-title-wrapper">
      <div class="drawer-title">订单确认</div>
      <div class="drawer-title-btn-group">
        <el-button @click="dialogvisible = false" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="refundConfirm">确 认</el-button>
      </div>
    </div>
    <div class="refund-left float-left">
      <p>
        <span class="refund-blod">退款商品</span>
        <el-link type="primary" class="float-right mt-10" :underline="false" @click="autoRefundRuleDialog = true">自动计算规则</el-link>
      </p>

      <el-table border :data="refundList" :max-height="560" class="table">
        <el-table-column align="center" label="序号" width="70">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="商品信息" prop="productName" width="200">
          <template slot-scope="scope">
            <el-tooltip popper-class="w-400" :content="scope.row.specsNameTip" placement="top">
              <span
                >{{ scope.row.productName }}<br />
                服务项目： {{ scope.row.specsName }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column align="center" label="实付金额（元）" prop="countryName">
          <template slot-scope="scope">
            {{ scope.row.productPaidMoney | formatQianFenWei }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="抵扣金额（元）">
          <template slot="header">
            <span>抵扣金额（元）</span>
            <el-tooltip class="icon fr" placement="top" popper-class="w-400">
              <div slot="content">根据换货金额按商品顺序进行依次抵扣，未抵扣完将进行实际退款</div>
              <i class="el-icon-question icon-hover"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope"> ￥{{ scope.row.virtualRefundMoney | formatQianFenWei }} </template>
        </el-table-column>

        <el-table-column align="center" label="退款金额（元）">
          <template slot="header">
            <span>退款金额（元）</span>
            <el-tooltip class="icon fr" placement="top" popper-class="w-400">
              <div slot="content">多余的差价将分摊到其他商品进行实际退款，提交后会合并生成一条退款订单</div>
              <i class="el-icon-question icon-hover"></i>
            </el-tooltip>
          </template>

          <template slot-scope="scope"> ￥{{ scope.row.realRefundMoney | formatQianFenWei }} </template>
        </el-table-column>

        <el-table-column align="center" label="手续费（元）" width="160">
          <template slot="header">
            <span>手续费（元）</span>
            <el-tooltip class="icon fr" placement="top" popper-class="w-400">
              <div slot="content">手续费为平台需要扣除的服务费，全额退款时输入为0</div>
              <i class="el-icon-question icon-hover"></i>
            </el-tooltip>
          </template>

          <template slot-scope="scope">
            <el-input-number v-if="scope.row.realRefundMoney > 0" v-model="scope.row.refundPoundage" :min="0" :precision="2" size="small" @blur="changereFundPoundage(scope.row, scope.$index)" />
            <span v-if="scope.row.realRefundMoney == 0">{{ scope.row.refundPoundage }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="refund-right float-left">
      <h2>退款信息</h2>

      <p class="refund-tip">提示：微信支付超过30天，支付宝超过90天 ，线下转账不支持原路退回</p>

      <el-row class="title bold">
        <span>退款商品：{{ productName }}</span>
      </el-row>

      <el-row class="title bold">
        <span class="zt-mr-2">实付金额：￥{{ paidMoney }}</span>
        <!-- 分期付款不展示外币信息 -->
        <template v-if="refundInfo.payMethod === 'INTL_PAY' && refundInfo.paymentTypeEn !== 'PART'"
          >{{ refundInfo.currencySymbol }}{{ floor(divide(paidMoney, refundInfo.exRate), 2) }}<span class="zt-ml-2">汇率：{{ refundInfo.exRate }}</span></template
        >
        <span style="margin-left: 20px">付款方式：{{ refundInfo.paymentChannelName }}</span>
        <span style="margin-left: 20px">最后付款时间：{{ moment(lastPaymentTime).format('YYYY-MM-DD') }}</span>
      </el-row>
      <el-form :model="refundForm" label-width="140px" :rules="refundFormRules" ref="refundForm">
        <el-form-item label="退款类型" prop="refundApplyType">退款并取消服务</el-form-item>
        <el-form-item label="退款方式" prop="refundMethod">
          <el-radio-group v-model="refundForm.refundMethod" @change="refundMethodChange">
            <el-radio label="RETURN_TO_SOURCE" v-if="$route.query.supportReturnSourceFlag != 'false'">原路返回</el-radio>
            <el-radio label="RETURN_TO_BANK">退回到银行卡</el-radio>
            <el-radio label="COUPON">发放优惠券</el-radio>
          </el-radio-group>
          <template v-if="refundForm.refundMethod === 'COUPON'">
            <div>
              <el-tag class="tag" type="info" v-for="(tag, index) in tagList" :key="index">{{ tag }}</el-tag>
            </div>
            <div class="item-tip"><i class="icon icon-tip"></i>退款订单审核通过后会自动向该用户发送优惠券</div>
          </template>
        </el-form-item>
        <template v-if="refundForm.refundMethod !== 'COUPON'">
          <el-form-item label="退款手续费" prop="refundPoundage">
            <el-input v-model="refundForm.refundPoundage" disabled placeholder="请输入" type="number" :min="0" clearable style="width: 300px" size="small" />

            <div class="item-tip"><i class="icon icon-tip"></i>退款手续费为平台需要扣除的服务费，全额退款时输入为0</div>
          </el-form-item>
          <el-form-item label="不扣除手续费原因" prop="noPoundageReason">
            <el-input v-model="refundForm.noPoundageReason" placeholder="请输入不扣除手续费原因" clearable style="width: 300px" size="small" />
          </el-form-item>
        </template>
        <el-form-item label="第三方平台手续费" v-if="refundForm.refundMethod !== 'COUPON'">
          <template v-if="refundForm.refundMethod === 'RETURN_TO_SOURCE'">
            {{ refundInfo.refundBacktrackCost }}
          </template>
          <template v-if="refundForm.refundMethod === 'RETURN_TO_BANK'">
            {{ refundInfo.refundCardCost }}
          </template>
        </el-form-item>
        <el-form-item label="退款金额" prop="refundMoney">
          <!-- <el-input v-model="refundForm.refundMoney" disabled placeholder="请输入" type="number" :min="0" clearable style="width: 300px" size="small" /> -->
          ￥{{ refundNum }}
          <template v-if="refundInfo.payMethod === 'INTL_PAY' && refundInfo.paymentTypeEn !== 'PART'"
            >{{ refundInfo.currencySymbol }}{{ floor(divide(refundNum, refundInfo.exRate), 2) }}<span class="zt-ml-2">汇率：{{ refundInfo.exRate }}</span></template
          >
        </el-form-item>

        <template v-if="refundForm.refundMethod === 'RETURN_TO_BANK'">
          <el-form-item label="退款账户类型" prop="bankCountType">
            <el-radio-group v-model="refundForm.bankCountType">
              <el-radio label="PERSONAL">个人</el-radio>
              <el-radio label="ENTERPRISE">企业</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="退款银行" prop="refundBank">
            <el-input v-model="refundForm.refundBank" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="退款账户" prop="refundAccount">
            <el-input v-model="refundForm.refundAccount" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="收款人/公司" prop="refundPayee">
            <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="开户支行：" prop="bankBranch">
            <el-input v-model="refundForm.bankBranch" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
        </template>
        <el-form-item label="省市：" prop="provincesCities">
          <el-select style="width: 145px; margin-right: 10px" v-model="refundForm.province" placeholder="省" filterable @change="provinceChange">
            <el-option :value="province.name" :label="province.name" v-for="province in provinceList" :key="province.id"></el-option>
          </el-select>
          <el-select style="width: 145px" v-model="refundForm.city" placeholder="市" filterable>
            <el-option :value="city.name" :label="city.name" v-for="city in cityList" :key="city.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="退款原因分类：" prop="refundReasonType">
          <el-select style="width: 300px; margin-right: 10px" v-model="refundForm.refundReasonType" placeholder="请选择">
            <el-option :value="item.dataCode" :label="item.dataValue" v-for="item in refundReasonTypeList" :key="item.baseDataId"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="退款原因" prop="refundReason">
          <el-input style="width: 300px" v-model="refundForm.refundReason" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取 消</el-button>
      <el-button type="primary" size="small" @click="refundConfirm">确 认</el-button>
    </div> -->
    </div>
    <AutoRefundRuleDialog :autoRefundRuleDialog.sync="autoRefundRuleDialog" />
  </el-drawer>
</template>

<script>
import { getWorldCountryListByPid } from '@/api/newApi/customer/companyInfo';
import { getBaseDataByDataType } from '@/api/newApi/common';
import { calcRefund } from '@/api/newApi/manuelorder/addOrder.js';
import AutoRefundRuleDialog from '@/view/module/salesorder/detail/components/autoRefundRuleDialog.vue';
import { divide, floor } from 'lodash';
import moment from 'moment';

export default {
  props: {
    chooseRefundWayDialog: Boolean,
    refundData: Array,
    refundPaidPrice: String | Number,
    restPrice: String | Number,
    exchangeList: Array,
    totalPrice: Number,
    lastPaymentTime: String,
    refundInfo: {
      type: Object,
      default: {
        payMethod: '',
        paymentTypeEn: '',
        currencySymbol: '',
        exRate: '',
      },
    }, // 选择退款方式信息,需要payMethod和退款信息
  },
  components: {
    AutoRefundRuleDialog,
  },
  filters: {
    filterPaymentChannel(val, list) {
      return (list.find((item) => item.dataCode == val) || {}).dataValue;
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.chooseRefundWayDialog;
      },
      set(val) {
        this.$emit('update:chooseRefundWayDialog', val);
      },
    },
    // 退款金额 减去第三方平台手续费， 退款路径不同时，手续费不同
    refundNum() {
      let num = 0;
      let thirdRefundPoundage = 0;
      switch (this.refundForm.refundMethod) {
        case 'RETURN_TO_SOURCE':
          thirdRefundPoundage = this.refundInfo?.refundBacktrackCost || 0;
          break;
        case 'RETURN_TO_BANK':
          thirdRefundPoundage = this.refundInfo?.refundCardCost || 0;
          break;

        default:
          thirdRefundPoundage = 0;
          break;
      }
      num = this.refundForm.refundMoney - thirdRefundPoundage;
      num > 0 ? '' : (num = 0);
      return num;
    },
  },
  watch: {
    exchangeList(val) {
      if (val && val.length) {
        this.refundList = JSON.parse(JSON.stringify(val));
        this.getInfos();
        this.handleChangeMoney();
      }
    },
  },
  data() {
    return {
      moment,
      divide,
      floor,
      detail: {},
      refundForm: {
        refundMethod: this.$route.query.supportReturnSourceFlag != 'false' ? 'RETURN_TO_SOURCE' : 'RETURN_TO_BANK',
        refundPoundage: '',
        refundMoney: '',
        refundBank: '',
        refundAccount: '',
        bankCountType: '',
        refundPayee: '',
        bankBranch: '',
        refundReason: '',
        refundReasonType: '',
      },
      refundFormTemp:{
        refundPoundage:0,
        refundMoney:0,
        valueChanged: false
      },
      refundFormRules: {
        refundMethod: [{ required: true, message: '请选择退款路径', trigger: 'change' }],
        refundPoundage: [{ required: true, message: '请输入退款手续费', trigger: 'blur' }],
        refundMoney: [{ required: true, message: '请输入退款金额', trigger: 'blur' }],
        refundBank: [{ required: true, message: '请输入退款银行', trigger: 'blur' }],
        refundAccount: [{ required: true, message: '请输入退款账户', trigger: 'blur' }],
        bankCountType: [{ required: true, message: '请选择退款账户类型', trigger: 'change' }],
        refundPayee: [{ required: true, message: '请输入收款人/公司', trigger: 'blur' }],
        bankBranch: [{ required: true, message: '请输入开户支行', trigger: 'blur' }],
        refundReason: [{ required: true, message: '请输入退款原因', trigger: 'blur' }],
        refundReasonType: [{ required: true, message: '请选择退款原因分类', trigger: 'change' }],
      },
      tagList: ['满减', '无限制有效期', '无使用门槛', '所有服务商品', '仅原价购买时使用'],
      refundReasonTypeList: [],
      provinceList: [],
      cityList: [],
      refundList: [],
      productName: '',
      paidMoney: '',
      refundOrderConfirmDialog: false,
      autoRefundRuleDialog: false,
    };
  },
  mounted() {
    this.getProvinceOrCityList(1, 'province');
    this.getRefundReasonTypeList();
  },
  methods: {
    refundMethodChange(val) {

      if (val === 'COUPON') {
        // 填写手续费 切到发放优惠券，更新退款
        this.changereFundPoundage(this.refundList[0], 0);
        // 切换 退款方式 恢复退款金额
        this.refundFormTemp.refundPoundage = this.refundForm.refundPoundage;
        this.refundFormTemp.refundMoney = this.refundForm.refundMoney;
        this.refundFormTemp.valueChanged = true;

        this.refundForm.refundPoundage = 0;
        this.refundForm.refundMoney = -this.restPrice;
      }else if(this.refundFormTemp.valueChanged){
        this.refundForm.refundPoundage = this.refundFormTemp.refundPoundage;
        this.refundForm.refundMoney = this.refundFormTemp.refundMoney;
      }
    },
    getInfos() {
      this.productName = this.refundList.reduce((pre, cur) => {
        return pre == '' ? pre + cur.productName : pre + ',' + cur.productName;
      }, '');

      this.paidMoney = this.refundList.reduce((pre, cur) => {
        return this.$util.accAdd(pre, cur.productPaidMoney);
      }, 0);
    },
    // 获取退款方式列表
    getRefundReasonTypeList() {
      getBaseDataByDataType({
        dataType: 'REFUND_REASON_TYPE',
      }).then((res) => {
        this.refundReasonTypeList = res.data;
      });
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
    changereFundPoundage(item, index) {
      const refundProductDTOs = this.refundList.map((item) => ({ orderProductId: item.orderProductId, refundPoundage: item.refundPoundage }));
      calcRefund({
        newOrderPaymentMoney: this.totalPrice,
        refundProductDTOs,
      })
        .then((res) => {
          if (res.code == 0) {
            const ele = res.data.refundProductDTOs.find((el) => el.orderProductId == item.orderProductId);
            if (ele) {
              this.$set(this.refundList[index], 'realRefundMoney', ele.realRefundMoney);
              this.$set(this.refundList[index], 'refundPoundage', ele.refundPoundage);
              this.$set(this.refundList[index], 'virtualRefundMoney', ele.virtualRefundMoney);
              this.handleChangeMoney();
            }
          }
        })

        .catch((err) => {});
    },

    handleChangeMoney() {
      this.refundForm.refundMoney = this.refundList.reduce((pre, cur) => {
        return this.$util.accAdd(pre, cur.realRefundMoney);
      }, 0);

      this.refundForm.refundPoundage = this.refundList.reduce((pre, cur) => {
        return this.$util.accAdd(pre, cur.refundPoundage);
      }, 0);
    },

    // 更改省
    provinceChange(name) {
      // 根据名称获取id
      let id = this.provinceList.find((item) => item.name == name).id;
      this.getProvinceOrCityList(id, 'city');
      this.refundForm.city = '';
    },
    refundConfirm() {
      this.$refs.refundForm.validate((valid) => {
        if (valid) {
          const refundProductDTOs = this.refundList.map((item) => ({ orderProductId: item.orderProductId, productPaidMoney: item.productPaidMoney, realRefundMoney: item.realRefundMoney, refundPoundage: item.refundPoundage, virtualRefundMoney: item.virtualRefundMoney }));
          this.$emit(
            'submit',
            {
              ...this.refundForm,
              refundApplyType: 'REFUND_CANCEL_SERVICE',
              thirdRefundPoundage: this.getThirdRefundPoundageh(),
            },
            refundProductDTOs
          );
        }
      });
    },
    // 退换货确认弹窗 确认提交 需要thirdRefundPoundage 第三方手续费参数
    getThirdRefundPoundageh() {
      let { refundMethod } = this.refundForm;
      var thirdRefundPoundage=0;
      switch (refundMethod) {
        case 'RETURN_TO_SOURCE':
          thirdRefundPoundage = this.refundInfo.refundBacktrackCost;
          break;
        case 'RETURN_TO_BANK':
          thirdRefundPoundage = this.refundInfo.refundCardCost;
          break;
        default:
          break;
      }
      return thirdRefundPoundage;
    }
  },
};
</script>

<style lang="less" scoped>
.title {
  margin: 20px 20px 20px 63px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
}
.tag {
  margin-right: 15px;
}
.item-tip {
  width: 400px;
  margin-top: 10px;
}

.refund-left {
  width: 50%;
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
::v-deep .el-drawer__header {
  padding: 0 30px;
  border-bottom: 1px solid #ddd;
}
/deep/ .el-drawer__body {
  padding: 0 40px;
  h2,
  .refund-blod {
    font-size: 22px;
    color: #333;
    margin-bottom: 10px;
    font-weight: 800;
    margin-right: 20px;
  }
}

.drawer-title-wrapper /deep/.drawer-title {
  font-size: 18px;
}

/deep/ .el-drawer__header {
  margin-bottom: 10px !important;
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
.title {
  margin: 0 20px 10px 20px;
  font-size: 14px;
  color: black;
  &.bold {
    font-weight: bold;
    margin-bottom: 20px;
  }
}
</style>
