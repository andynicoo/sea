<template>
  <div>
    <el-button type="primary" :disabled="disabled" v-show="hasAuthority('T1_18')" @click="onOpen"> 关闭工单 </el-button>
    <el-dialog :visible.sync="visible" title="关闭工单">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <div style="margin-bottom: 10px">关闭工单前，请务必确认该商标已经“死掉”</div>
        <el-form-item label="关闭原因" prop="desc">
          <el-input type="textarea" v-model.trim="form.desc" maxlength="200" placeholder="请输入关闭原因" />
        </el-form-item>
      </el-form>
      <p slot="footer">
        <el-button type="primary" ghost style="margin-right: 20px" @click="visible = false"> 取消 </el-button>
        <el-button type="primary" @click="onConfirm">确认</el-button>
      </p>
    </el-dialog>
  </div>
</template>

<script>
import * as API from '@/api/newApi/intellectualProperty/trademark';

export default {
  props: {
    id: String,
    disabled: Boolean,
  },
  data() {
    return {
      visible: false,
      form: {
        desc: '',
      },
      rules: {
        desc: { required: true, message: '请输入关闭原因', trigger: 'blur' },
      },
    };
  },
  methods: {
    onOpen() {
      this.visible = true;
    },
    onConfirm() {
      const req = {
        serviceNo: this.id,
        closeReason: this.form.desc,
      };
      API.closeWorkOrder(req).then((res) => {
        this.$Message.success('关闭工单成功');
        this.visible = false;
        this.$emit('onOk');
      });
    },
  },
};
</script>

<style></style>
