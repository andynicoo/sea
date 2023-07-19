<template>
  <el-dialog
    title="修改客服"
    :visible.sync="dialogvisible"
    center
    width="400px"
    @close="closeModel('customerForm')"
  >
    <el-form ref="customerForm" :rules="customerForm" :model="customer" label-width="140px">
        <el-form-item label="修改客服：" prop="customerServiceId">
          <el-select v-model="customer.customerServiceId" filterable>
            <el-option
              v-for="(item, key) in commissionerList"
              :key="key"
              :value="item.userId"
              :label="item.nickName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    <div slot="footer" style="text-align: center">
      <el-button style="width: 65px" type="default" @click="dialogvisible = false">取消</el-button>
      <el-button style="width: 65px" type="primary" @click="claimCustomer">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { disposeCustomerBatch, changeCustomerBatch } from "@/api/newApi/common.js";
export default {
  props: {
    changeCustomerModel: { type: Boolean },
    serviceIds: { type: Array },
    typeNum: { type: Number, default: 2 },
    commissionerList: { type: Array },
    queryData: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      customerForm: {
        customerServiceId: [{ required: true, message: "请选择客服", trigger: "change" }]
      },
      customer: {
        customerServiceId: ''
      }
    };
  },
  computed: {
    dialogvisible: {
      get() {
        return this.changeCustomerModel;
      },
      set(val) {
        this.$emit("update:changeCustomerModel", val);
      }
    }
  },
  created() {},
  methods: {
   claimCustomer() {
      this.$refs.customerForm.validate(valid => {
        if (valid) {
          const customerServiceName = (this.commissionerList.find((item) => item.userId === this.customer.customerServiceId) || {}).nickName
          if (this.typeNum != 3) {
            disposeCustomerBatch({ customerServiceName, customerServiceId: this.customer.customerServiceId, type: this.typeNum,serviceIds:this.serviceIds })
            .then(res => {
              if (res.code === 0) {
                this.$message.success("修改客服成功");
                this.dialogvisible = false;
                this.queryData();
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
          } else {
            changeCustomerBatch({ customerServiceName, customerServiceId: this.customer.customerServiceId, workIds:this.serviceIds })
            .then(res => {
              if (res.code === 0) {
                this.$message.success("修改客服成功");
                this.dialogvisible = false;
                this.queryData();
              }
            })
            .catch(err => {
              this.$message.error(err.message);
            });
          }
        }
      })
    },
    /** 关闭弹窗时清除数据 */
    closeModel(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style></style>
