<template>
  <el-dialog width="650px" title="修改退款账号" :visible.sync="drawerVisible" @close="reset">
    <div>
      <el-form :model="refundForm" label-width="140px" :rules="rulefundform" ref="refundForm">
        <el-form-item label="退款路径" prop="refundMethod">
          <el-radio-group v-model="refundForm.refundMethod">
            <el-radio label="RETURN_TO_SOURCE" v-if="supportReturnSourceFlag">原路返回</el-radio>
            <el-radio label="RETURN_TO_BANK">退回到银行卡</el-radio>
          </el-radio-group>
        </el-form-item>
        <template v-if="refundForm.refundMethod == 'RETURN_TO_BANK'">
          <el-form-item label="退款账户类型" prop="bankCountType">
            <el-radio-group v-model="refundForm.bankCountType">
              <el-radio label="PERSONAL">个人</el-radio>
              <el-radio label="ENTERPRISE">企业</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="退款银行：" prop="refundBank">
            <el-input v-model="refundForm.refundBank" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="退款账户：" prop="refundAccount">
            <el-input v-model="refundForm.refundAccount" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>

          <el-form-item label="收款人姓名：" prop="refundPayee" v-if="refundForm.bankCountType == 'PERSONAL'">
            <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="收款公司名称：" prop="refundPayee" v-if="refundForm.bankCountType == 'ENTERPRISE'">
            <el-input v-model="refundForm.refundPayee" placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
          <el-form-item label="开户支行：" prop="bankBranch">
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
          <el-form-item label="第三方平台手续费：">
            <el-input value="0元" disabled placeholder="请输入" clearable style="width: 300px" size="small" />
          </el-form-item>
        </template>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="drawerVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit()" :loading="submitIng">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { refundAudit, editAccount } from '@/api/newApi/orderManage/refundOrder';
import { editOrderRefund } from '@/api/newApi/orderManage/salesorder.js';
import { getWorldCountryListByPid } from '@/api/newApi/customer/companyInfo';
export default {
  props: {
    modifyAccountVisible: Boolean,
    supportReturnSourceFlag: Boolean,
    id: String,
    orderId: { type: String },
    orderRefund: Object,
  },
  data() {
    return {
      refund: {},
      provinceList: [],
      cityList: [],
      submitIng: false,
      refundForm: {
        refundApplyType: '',
        refundBank: '',
        refundAccount: '',
        refundPayee: '',
        bankCountType: '',
        refundMethod: '',
        noPoundageReason: '',
        bankBranch: '',
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
        bankBranch: [{ required: true, message: '请输入开户支行', trigger: 'blur' }],
        bankCountType: [{ required: true, message: '请选择退款账户类型', trigger: 'change' }],
        refundMethod: [{ required: true, message: '请选择退款路径', trigger: 'change' }],
      },
    };
  },
  computed: {
    drawerVisible: {
      get() {
        // if (this.modifyAccountVisible) {
        //   this.refundForm = JSON.parse(JSON.stringify(this.orderRefund))
        //   console.log(this.refundForm)
        //   this.provinceChange(this.refundForm.province)
        // }
        return this.modifyAccountVisible;
      },
      set(val) {
        this.$emit('update:modifyAccountVisible', val);
      },
    },
  },
  watch: {
    modifyAccountVisible(val) {
      if (val) {
        // this.refundForm = JSON.parse(JSON.stringify(this.orderRefund));
        Object.keys(this.refundForm).forEach((item) => {
          this.refundForm[item] = this.orderRefund[item];
        });
        console.log(this.refundForm);
        if (this.refundForm.province) {
          this.provinceChange(this.refundForm.province, true);
        }
      }
    },
  },
  created() {
    this.getProvinceOrCityList(1, 'province');
  },
  methods: {
    submit() {
      this.$refs.refundForm.validate((valid) => {
        if (valid) {
          this.submitIng = true;

          this.auditConfirm();
        } else {
          return false;
        }
      });
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
    auditConfirm() {
      editAccount({
        ...this.refundForm,
        refundId: this.id,
        orderId: this.orderId,
      })
        .then((res) => {
          this.drawerVisible = false;
          if (res.code === 0) {
            this.$message({
              type: 'success',
              message: '修改成功',
              duration: 2000,
            });
            this.submitIng = false;
            this.$emit('refresh');
          } else {
            this.$message({
              type: 'fail',
              message: '修改失败',
              duration: 2000,
            });
          }
        })
        .catch((e) => {
          this.submitIng = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
