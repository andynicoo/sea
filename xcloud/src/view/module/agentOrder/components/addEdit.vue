<template>
  <!-- 线下付款提示 -->
  <el-dialog :title="isEdit ? '编辑' : '新建'" :visible.sync="dialogvisible" width="650px" class="man-confirm-dialog" @close="reset">
    <el-form label-width="130px" ref="agentForm" :rules="rulesAgentForm" :model="form">
      <el-form-item prop="productName" label="代理商品：">
        <el-select style="width: 300px" v-model="form.productName" placeholder="代理商品" clearable>
          <el-option value="亚马逊保险" label="亚马逊保险"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="客户名称：" prop="companyName">
        <el-input v-model="form.companyName" style="width: 300px" clearable></el-input>
      </el-form-item>

      <el-form-item label="售价金额(元)：" prop="salePrice">
        <el-input-number v-model="form.salePrice" :min="0.0" :precision="2" :max="999999999.99" style="width: 180px"></el-input-number>
      </el-form-item>
      <el-form-item prop="attributionId" label="跟进人：">
        <el-select style="width: 168px" clearable placeholder="选择跟进人" filterable v-model="form.attributionId">
          <el-option-group>
            <li class="option_title" style="background: #f6f8fa">
              <span>姓名</span>
              <span>手机号</span>
              <span>部门</span>
            </li>

            <el-option v-for="item in followList" :key="item.userId" :label="item.nickName" :value="item.userId" class="option_title">
              <span>{{ item.nickName }}</span>
              &nbsp;
              <span>{{ item.mobile }}</span>
              &nbsp;
              <span>{{ item.departmentName }}</span>
            </el-option>
          </el-option-group>
        </el-select>
      </el-form-item>

      <el-form-item label="付款时间：" prop="paymentTime" style="width: 300px">
        <el-date-picker v-model="form.paymentTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期时间"> </el-date-picker>
      </el-form-item>

      <el-form-item label="付款凭证：" prop="paymentFile">
        <UploadImages ref="uploadImageRef" accept=".png, .jpg, .jpeg" :imageUrl="form.paymentFile" :num="3" :on-success="uploadSuccess" :on-error="onUploadError" :on-remove="onUploadRemove"></UploadImages>
      </el-form-item>

      <el-form-item label="备注：" prop="remark">
        <el-input type="textarea" :rows="4" v-model="form.remark" placeholder="请输入" style="width: 300px" :maxlength="150" show-word-limit></el-input>
      </el-form-item>
    </el-form>

    <div style="text-align: right">
      <span class="dialog-footer">
        <el-button size="mini" type="primary" @click="submitConfirm">保存</el-button>

        <el-button size="mini" @click="dialogvisible = false">取消</el-button>
      </span>
    </div>
  </el-dialog>
</template>

<script>
import UploadImages from '@/components/UploadImages';
import { addOrEditAgentOrder } from '@/api/newApi/agentOrder/agentOrder.js';

export default {
  components: { UploadImages },
  data() {
    return {
      form: {
        attributionId: '',
        attributionName: '',
        companyName: '',
        paymentFile: '',
        paymentTime: '',
        productName: '',
        remark: '',
        salePrice: '',
      },
      rulesAgentForm: {
        productName: [{ required: true, trigger: 'change', message: '请选择代理商品' }],
        companyName: [{ required: true, trigger: 'blur', message: '请填写客户名称' }],
        salePrice: [{ required: true, trigger: 'blur', message: '请填写售价金额' }],
        attributionId: [{ required: true, trigger: 'change', message: '请选择跟进人' }],
      },
    };
  },
  props: {
    addEditDialog: Boolean,
    isEdit: Boolean,
    rowData: Object,
    followList: Array,
  },
  computed: {
    dialogvisible: {
      get() {
        if (this.addEditDialog) {
          if (this.isEdit) {
            this.form = { ...this.rowData };
          }
        }
        return this.addEditDialog;
      },
      set(val) {
        this.$emit('update:addEditDialog', val);
      },
    },
  },
  created() {},
  methods: {
    /**
     * 上传图片的操作
     */
    uploadSuccess(file) {
      this.form.paymentFile = file;
    },
    // 上传失败
    onUploadError(file) {},
    // 上传移除
    onUploadRemove(file, uploadFiles) {
      this.form.paymentFile = file;
    },
    reset() {
      this.form = {
        attributionId: '',
        attributionName: '',
        companyName: '',
        paymentFile: '',
        paymentTime: '',
        productName: '',
        remark: '',
        salePrice: '',
      };
      this.$refs.agentForm.resetFields();
    },
    /**获取跟进人名称 */
    selectName() {
      let obj = {};
      obj = this.followList.find((item) => {
        //这里的Data就是上面遍历的数据源
        return item.userId === this.form.attributionId; //筛选出匹配数据
      });
      return (obj || {}).nickName;
    },
    submitConfirm() {
      console.log(this.form);
      this.$refs.agentForm.validate((valid) => {
        if (valid) {
          console.log(111);
          addOrEditAgentOrder({
            ...this.form,
            attributionName: this.selectName(),
            agencyOrderId: this.isEdit ? this.rowData.agencyOrderId : null,
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: this.isEdit ? '编辑成功' : '新增成功',
              });
              this.dialogvisible = false;
              this.$emit('refresh');
            } else {
              this.$message({ type: 'error', message: res.message });
            }
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.option_title {
  padding: 10px 0;
  display: flex;
  text-align: center;
  span {
    flex: 1;
  }
}
</style>
