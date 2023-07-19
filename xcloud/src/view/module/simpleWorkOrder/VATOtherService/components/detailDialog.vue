<template>
  <!-- 订单详情弹窗 -->
  <el-dialog title="订单详情" :visible.sync="dialogvisible" width="460px" v-if="info" center>
    <div class="info-block-wrapper">
      <div class="info-block">
        <div class="info-block-item">
          <span class="info-block-title">订单号：</span>
          <span>{{ info.orderNo }}</span>
        </div>
        <div class="info-block-item">
          <span class="info-block-title">合同公司名称：</span>
          <span>{{ info.companyNameZh }}</span>
        </div>
        <div class="info-block-item">
          <span class="info-block-title">客户：</span>
          <span>{{ info.nickname }}</span>
        </div>
        <div class="info-block-item">
          <span class="info-block-title">手机号：</span>
          <span>{{ info.userMobile }}</span>
        </div>
        <div class="info-block-item">
          <span class="info-block-title">商品名称：</span>
          <span>{{ info.productNames }}</span>
        </div>
        <div class="info-block-item">
          <span class="info-block-title">订单金额：</span>
          <span>{{ info.orderMoney }}</span>
        </div>
         <div class="info-block-item">
          <span class="info-block-title">应付金额：</span>
          <span>{{ info.orderPaymentMoney }}</span>
        </div>
         <div class="info-block-item">
          <span class="info-block-title">实付金额：</span>
          <span>{{ info.orderPaidMoney }}</span>
        </div>
        <div class="info-block-item">
          <span class="info-block-title">订单来源：</span>
          <span>{{ info.orderSource }}</span>
        </div>
        <div class="info-block-item">
          <span class="info-block-title">订单归属人：</span>
          <span>{{ info.attributionName }}</span>
        </div>
        <div class="info-block-item">
          <span class="info-block-title">订单备注：</span>
          <span>{{ remark }}</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogvisible = false" size="small">
        关闭
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import UploadFile from "@/components/UploadFile/index";
import { simpleWorkProgressOrderInfo } from "@/api/newApi/simpleWorkOrder/otherService.js";
export default {
  props: {
    detailDialog: Boolean,
    id: String
  },
  data() {
    return {
      info: null,
      remark: ""
    };
  },
  components: {
    UploadFile
  },
  computed: {
    dialogvisible: {
      get() {
        return this.detailDialog;
      },
      set(val) {
        this.$emit("update:detailDialog", val);
      }
    }
  },
  watch: {
    id() {
      if (this.dialogvisible) {
        this.getInfo();
      }
    }
  },
  methods: {
    getInfo() {
      if (this.id == 0) return;
      simpleWorkProgressOrderInfo(this.id).then(res => {
        this.info = res.data;
        try {
          let remarkInfo = JSON.parse(this.info.remark);
          this.remark = remarkInfo.creator.remark;
        } catch (error) {}
      });
    },
    submit() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.dialogvisible = false;
          this.confirm();
        } else {
          return false;
        }
      });
    },
    confirm() {
      // refundAudit({
      //   ...this.form,
      //   id: this.id,
      // }).then((res) => {
      //   if (res.code === 0) {
      //     this.$message({
      //       type: "success",
      //       message: "审核成功",
      //       duration: 2000,
      //     });
      //     this.$emit("refresh");
      //   } else {
      //     this.$message({
      //       type: "fail",
      //       message: "审核失败",
      //       duration: 2000,
      //     });
      //   }
      // });
    }
  }
};
</script>

<style></style>
