<template>
  <div class="app-container">
    <!-- 表单 -->
    <div class="form-container">
      <el-form label-width="140px" ref="formRef" :model="form" :rules="formRules">
        <el-form-item label="奖品名称：" prop="prizeName">
          <el-input v-model="form.prizeName" placeholder="请输入奖品名称" clearable style="width: 360px" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="描述：">
          <el-input v-model="form.prizeInfo" placeholder="请输入描述" clearable style="width: 360px" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="奖品图片：" prop="prizeImg">
          <UploadImage ref="uploadImageRef" :imageUrl="form.prizeImg" :imgType="1" :on-success="(v) => (form.prizeImg = v.file.fileUrl)" upload-tips="添加图片" :imgMaxSize="3" :accept="'.png, .jpg'" :ruleType="['image/jpeg', 'image/jpg', 'image/png']"></UploadImage>
          <div class="subTips">建议尺寸：800*800</div>
        </el-form-item>
        <el-form-item label="奖品类型：">
          <el-radio-group v-model="form.prizeType" prop="prizeType" @change="changeRadio" :disabled="isEdit || editPrizeIndex == 7">
            <el-radio label="nothing">未中奖</el-radio>
            <el-radio label="coupon">优惠券</el-radio>
            <el-radio label="entity">实物商品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="优惠券：" prop="businessId" v-if="form.prizeType === 'coupon'">
          <div class="subTips">活动期间若剩余券数为0，则不赠送</div>
          <div v-if="couponSelection.length">
            <el-table :data="couponSelection" stripe style="width: 480px">
              <el-table-column prop="couponName" label="优惠券名称" width="180"> </el-table-column>
              <el-table-column prop="couponContent" label="优惠内容" width="180"> </el-table-column>
              <el-table-column label="操作" width="120">
                <template>
                  <el-button type="text" size="small" @click="dialogVisible = true" :disabled="isEdit"> 修改 </el-button>
                  <el-button type="text" size="small" @click="deleteCouponSelection" :disabled="isEdit"> 删除 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-button @click="dialogVisible = true" v-else :disabled="isEdit">选择优惠券</el-button>
        </el-form-item>
        <el-form-item label="奖品数量：" prop="num" v-if="form.prizeType != 'nothing'">
          <el-input-number v-model="form.num" controls-position="right" placeholder="请输入" style="width: 100px" clearable :min="0" :max="9999" :disabled="isEdit" />
        </el-form-item>
        <el-form-item label="抽中概率：" prop="probability" v-if="form.prizeType != 'nothing'">
          <el-input-number v-model="form.probability" :min="0.0" :max="1" :active-change="false" :precision="2" controls-position="right" clearable size="small" :disabled="isEdit" style="width: 100px" @blur="probabilityChange"></el-input-number>
        </el-form-item>
        <el-form-item label="中奖规则：" v-if="form.prizeType != 'nothing'">
          <el-select v-model="form.winningRule" placeholder="请选择活动类型" clearable style="width: 360px" :disabled="isEdit">
            <el-option v-for="item in activityType" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="抽中提示语：" prop="clew">
          <el-input v-model="form.clew" placeholder="请输入抽中提示语" clearable style="width: 360px" :disabled="isEdit" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit" :disabled="isEdit"> 保存 </el-button>
          <el-button @click="goback()">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="1200" center destroy-on-close :append-to-body="true">
      <Coupon ref="coupon" @getCouponSelection="getCouponSelection" :couponSelectionProp="couponSelection" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="couponSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import BackHerader from '@/components/backHerader';
import FormTitle from '@/components/WorkOrderComponents/FormTitle';
import Editor from '@/components/quillEditor/index';
import UploadImage from '@/components/UploadImage/index.vue';
import Coupon from '../../integral/couponPage/index.vue';
import { couponInfo } from '@/api/newApi/extension/coupon.js';
export default {
  components: {
    BackHerader,
    FormTitle,
    Editor,
    UploadImage,
    Coupon,
  },
  props: {
    form: Object,
    couponId: String | Number,
    probability: String | Number,
    originProbability: String | Number,
    isEdit: Boolean,
    editPrizeIndex: String | Number,
  },
  data() {
    return {
      activity: '1',
      activityType: [
        {
          value: '0',
          label: '按中奖概率开奖',
        },
      ],
      formRules: {
        prizeName: [{ required: true, message: '请输入奖品名称', trigger: 'blur' }],
        num: [{ required: true, message: '请输入奖品数量', trigger: 'blur' }],
        probability: [{ required: true, message: '请输入抽中概率', trigger: 'blur' }],
        clew: [{ required: true, message: '请输入抽中提示语', trigger: 'blur' }],
        prizeImg: [{ required: true, message: '请添加商品封面', trigger: 'change' }],
        prizeType: [{ required: true, message: '请选择奖品类型', trigger: 'change' }],
      },
      submitting: false,
      dialogVisible: false,
      couponSelection: [], // 弹窗选择的优惠券
      couponSelectionTemp: [], // 弹窗选择的优惠券临时
      originValue: this.form.probability,
    };
  },
  watch: {
    // 被侦听的变量count
    couponId() {
      if (Number(this.couponId) > 0) {
        this.getCouponInfo(this.form.prizeEntityId);
      } else {
        this.couponSelection = [];
      }
    },
  },
  mounted() {
    if (Number(this.couponId) > 0) {
      this.getCouponInfo(this.form.prizeEntityId);
    } else {
      this.couponSelection = [];
    }
    this.form.winningRule = this.form.winningRule.toString();
  },
  methods: {
    // 保存
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let data = this.form;
          if (this.form.prizeType == '') {
            this.$message.warning('请选择奖品类型');
            return false;
          }
          if (data.prizeType == 'coupon') {
            if (this.couponSelection.length == 0) {
              this.$message.warning('请选择优惠券');
              return false;
            }
            data.prizeEntityId = this.couponSelection[0].marketingCouponActivityId;
          }
          this.$emit('getPrizeData', data);
        } else {
          return false;
        }
      });
    },
    goback() {
      this.$emit('cancleDialog');
    },
    getCouponSelection(data) {
      this.couponSelectionTemp = data;
    },
    couponSure() {
      this.$refs.coupon.getCouponSelection();
      let couponLength = this.couponSelectionTemp.length;
      if (couponLength && couponLength > 1) {
        this.$message({
          type: 'error',
          message: '只能选择一个优惠券',
        });
      }
      if (!couponLength || couponLength === 1) {
        this.couponSelection = this.couponSelectionTemp;
        this.dialogVisible = false;
      }
    },
    deleteCouponSelection() {
      this.couponSelection = [];
    },
    getCouponInfo(id) {
      couponInfo({ couponId: id , enterpriseId: window.localStorage.getItem('enterpriseId')})
        .then((res) => {
          if (res.code == 0) {
            this.$set(this.couponSelection, 0, { couponName: res.data.couponName, couponContent: res.data.couponContent, marketingCouponActivityId: res.data.marketingCouponActivityId });
          } else {
            this.$message.error(res.message);
          }
        })
        .finally(() => {
          this.submitting = false;
        });
    },
    probabilityChange(e) {
      let value = e.target.value;
      let probability = 1 - Number(this.probability);
      if (probability < Number(value)) {
        this.$message.warning('总概率不能超过1');
        this.form.probability = this.originProbability;
      }
    },
    changeRadio(val) {
      if (val == 'nothing') {
        this.form.num = 0;
        this.form.probability = 0;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.app-container {
  position: relative;
  background: #fff;
  padding: 0px 30px 30px;
  .el-page-header {
    padding: 20px 0px 30px 0px;
    .el-page-header__left {
      display: flex;
      align-items: baseline;
    }
  }
  .form-container {
    background: #fff;
    border-radius: 4px;
    .titleStyle {
      margin-bottom: 20px;
    }
  }
  .setting {
    color: #cccccc;
    font-size: 12px;
    line-height: 20px;
    padding-left: 22px;
  }
}
.tooltip-box {
  width: 150px;
  .grid-content {
    height: 50px;
    background: #cccccc;
    text-align: center;
    line-height: 48px;
    margin: 2px;
  }
  .tooltip-text {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
