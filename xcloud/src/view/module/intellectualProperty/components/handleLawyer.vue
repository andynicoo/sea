<template>
  <div>
    <!-- 修改处理人 -->
    <el-dialog :visible.sync="handlerTypeModal" :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false" width="440px" title="修改律师信息" @close="reset">
      <template v-if="!showSuccess">
        <el-form :model="formCodeItem" label-width="120px" ref="formCodeItem" :rules="rules">
          <el-form-item label="选择新律师：" prop="attorenyId">
            <el-select v-model="formCodeItem.attorenyId" placeholder="请选择律师">
              <el-option v-for="(item, index) in lawyerList" :value="item.id" :label="item.shortName" :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="原律师服务费：" prop="consumed" v-if="showConsumed">
            <el-radio-group v-model="formCodeItem.consumed">
              <el-radio :label="true">已产生服务费</el-radio>
              <el-radio :label="false">未产生服务费</el-radio>
            </el-radio-group>
            <div class="text-warning">选择已产生服务费时，会另外生成一条转代理工单</div>
          </el-form-item>
          <p class="dialogFooter">
            <el-button ghost @click="handleCancel(false)">取消</el-button>
            <el-button type="primary" @click="sureFunc('formCodeItem')">确认</el-button>
          </p>
        </el-form>
      </template>
      <template v-else>
        <el-result icon="success" title="律师修改成功">
          <template slot="extra">
            <p style="margin-bottom: 20px">
              新的转代理工单为：<span class="text-primary">{{ newServiceIds }}</span>
            </p>
            <p>
              <el-button type="primary" class="target" data-clipboard-action="copy" :data-clipboard-text="newServiceIds" @click="copy">复制服务号并关闭弹窗</el-button>
            </p>
          </template>
        </el-result>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import * as API from '@/api/newApi/intellectualProperty/trademark';
import { changeAttorney } from '@/api/newApi/intellectualProperty/appearancePatent';
import { getSupplierList } from '@/api/newApi/common';
export default {
  props: ['serviceIds', 'countryCode', 'functionCode', 'entry', 'showConsumed'],
  data() {
    return {
      handlerTypeModal: true,
      formCodeItem: {
        attorenyId: '',
        consumed: false,
      },
      rules: {
        attorenyId: [{ required: true, message: '请选择新律师', trigger: 'change' }],
        consumed: [{ required: true, message: '请选择原律师服务费', trigger: 'blur' }],
      },
      lawyerList: [],
      showSuccess: false,
      val: '',
      newServiceIds: '',
    };
  },
  created() {
    this.getLawyerListFunc();
  },
  methods: {
    reset() {
      this.showSuccess = false;
    },
    getLawyerListFunc() {
      let data = {
        supplierType: 2,
        functionCode: this.functionCode,
        countryCode: this.countryCode,
        countryCodeList: [this.countryCode],
        // flow: true,
      };
      getSupplierList(data).then((res) => {
        if (res.code === 0) {
          this.lawyerList = res.data;
        }
      });
    },
    sureFunc() {
      this.$refs['formCodeItem'].validate((valid) => {
        if (valid) {
          this.$confirm('确认进行更换律师信息吗？', '确认更换律师', {
            customClass: 'custom-confirm',
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true,
          }).then(() => {
            this.submitFunc(false);
          });
        }
      });
    },
    submitFunc(type) {
      let lawyerInfo = this.lawyerList.filter((item) => {
        return item.id == this.formCodeItem.attorenyId;
      });
      console.log('flowId', lawyerInfo);
      let data = {
        // flowId: this.formCodeItem.attorenyId,
        ...this.formCodeItem,
        serviceId: this.serviceIds,
        isInit: type,
      };
      let method = this.entry === 'appearancePatent' ? changeAttorney : API.batchUpdAttorneyApi;
      method(data).then((res) => {
        if (res.code == 0) {
          if (res.data.data) {
            this.$Message.success('操作成功');
            this.formCodeItem.lawyerId = '';
            if (res.data.data.length) {
              this.newServiceIds = res.data.data.join(',');
            }
            this.handleCancel(true);
          } else {
            this.tipsFunc();
          }
        }
      });
    },
    tipsFunc() {
      this.$confirm('现有数据与更换律师数据不相符，将初始化工单信息，确认进行操作吗？', '确认更换律师', {
        customClass: 'custom-confirm',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true,
      }).then(() => {
        this.submitFunc(true);
      });
    },
    handleCancel(val) {
      this.val = val;
      if (this.formCodeItem.consumed && this.newServiceIds) {
        this.showSuccess = true;
      } else {
        this.$emit('cancelFunc', this.val);
      }
    },
    copy() {
      this.$util.copyLink('.target');
      this.$emit('cancelFunc', this.val);
    },
  },
};
</script>
<style lang="less" scoped>
.dialogFooter {
  width: 315px;
  display: flex;
  justify-content: right;
  margin-top: 50px;
}
</style>
