<!-- 首页 弹窗 -->
<template>
  <!-- 订单变更手机号 -->
  <el-dialog title="订单转移" :visible.sync="dialogShowObj.orderTransfer" width="500px">
    <el-form ref="rejectUserUpdateMoblie" :model="orderMoblie">
      <el-form-item label="被转移手机号：" prop="currentPhone">
        <el-input v-model="orderMoblie.currentPhone" placeholder="请填写旧手机号" style="width:300px" clearable></el-input>
      </el-form-item>
      <el-form-item label="即将使用的手机号：" prop="soonPhone">
        <el-input v-model="orderMoblie.soonPhone" placeholder="请填写新手机号" style="width:300px" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogShowObj.orderTransfer = false" size="small">取 消</el-button>
      <el-button type="primary" @click="updateMoblie" size="small">提 交</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateOrderUserMobileChange } from "@/api/newApi/orderManage/salesorder.js";
import { newThrottle } from '@/libs/throttle'
export default {
  props: {
    dialogShowObj: { type: Object },
    detailInfo: { type: Object },
    paymen: { type: Object },
    balancePrice: { type: Number },
  },
  data() {
    return {
      // 手机号验证
      userMoblierelesForm: {
        currentPhone: [
          { required: true, message: "请填写手机号码", trigger: "blur" },
          { required: true, pattern: /^(1\d{10})|(852-([6|9])\d{7})$/, message: "手机号码格式错误", trigger: "blur" },
        ],
        soonPhone: [
          { required: true, message: "请填写手机号码", trigger: "blur" },
          { required: true, pattern: /^(1\d{10})|(852-([6|9])\d{7})$/, message: "手机号码格式错误", trigger: "blur" },
        ],
      },
      orderMoblie: {
        currentPhone: "", //旧手机号
        soonPhone: "", //新手机号
      },
    };
  },

  components: {},

  computed: {},

  methods: {
    updateMoblie: newThrottle('updateMoblieFun'),
    async updateMoblieFun() {
      let { soonPhone, currentPhone } = this.orderMoblie;
      let parm = {
        newMobile: soonPhone,
        oldMobile: currentPhone,
      };
      try {
        let { code, message } = await updateOrderUserMobileChange(parm);
        if (code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.dialogShowObj.orderTransfer = false;
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
</script>
<style lang='scss' scoped>
</style>