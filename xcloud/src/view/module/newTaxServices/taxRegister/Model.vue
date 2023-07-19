<template>
  <div class="model">
    <!-- 添加备注 -->
    <el-dialog title="添加备注" :visible.sync="dialog.remarkModel" width="460px" @close="closeRemark">
      <el-form ref="remarkRefForm" :rules="remarkRuleForm" :model="remarkObj" label-width="80px">
        <el-form-item label="备注：" prop="remarkComment">
          <el-input type="textarea" style="width: 290px" :rows="3" placeholder="请输入备注" v-model="remarkObj.remarkComment"></el-input>
        </el-form-item>
        <el-form-item label="附件：">
          <!-- 自定义上传单张图片组件 -->
          <UploadFile :fileList.sync="remarkObj.annex"></UploadFile>
        </el-form-item>
      </el-form>

      <div slot="footer" style="text-align: right">
        <el-button style="width: 65px" type="default" @click="dialog.remarkModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="addServiceRemark">保存</el-button>
      </div>
    </el-dialog>
    <!-- 查看备注 -->
    <el-dialog title="备注信息" :visible.sync="dialog.seeRemarkModel" width="495px">
      <template v-if="dialog.listRemark.length > 0">
        <div class="remarlist">
          <div class="content" v-for="(item, index) in dialog.listRemark" :key="index">
            <p>
              <span class="text-desc"> 备注人：</span> {{ item.remarkBy }}
              <i class="el-icon-circle-close text-desc" @click="delet(item, index)"></i>
            </p>
            <p><span class="text-desc">备注内容：</span>{{ item.remarkComment }}</p>
            <p>
              <span class="text-desc"> 附件：</span>
              <a :href="item.annex" :underline="false" target="_blank" class="text-primary file">{{ item.annex }}</a>
            </p>
            <p><span class="text-desc">备注时间：</span>{{ item.createTime }}</p>
          </div>
        </div>
      </template>
      <div class="text-info" v-else style="text-align: center">暂无备注</div>
      <div slot="footer">
        <el-button style="width: 65px" type="primary" @click="dialog.seeRemarkModel = false">关闭</el-button>
      </div>
    </el-dialog>
    <!-- 修改服务商 -->
    <el-dialog title="修改服务商" :visible.sync="dialog.serviceModel" width="400px" @close="closeModel('supplierForm')">
      <el-form ref="supplierForm" label-width="160px" :rules="supplierForm" :model="supplier">
        <el-form-item label="国家：">{{ dialog.checkItem.countryNameZh }}</el-form-item>
        <el-form-item label="选择服务商：" prop="supplierId">
          <el-select v-model="supplier.supplierId" clearable filterable style="width: 168px">
            <el-option v-for="(item, key) in dialog.supplierList" :key="key" :value="item.supplierId" :label="item.shortName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <p v-if="dialog.checkItem.nodeCode == currentCodeEnum.NODE2" class="warn-color">变更服务商后，服务流程会刷新为新服务商流程</p>
      <p v-if="dialog.checkItem.nodeCode == currentCodeEnum.NODE3" class="warn-color">新服务商资料可能有变动，变更服务商后，请重新审核资料；</p>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 65px" type="default" @click="dialog.serviceModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="submitService">保存</el-button>
      </div>
    </el-dialog>
    <!-- 查看驳回详情 -->
    <el-dialog title="驳回详情" :visible.sync="dialog.checkRejectInfoDialog" width="460px" center>
      <el-timeline class="ope-wrapper" v-if="dialog.rejectList.length > 0">
        <el-timeline-item v-for="(activity, index) in dialog.rejectList" :key="index" placement="top" hide-timestamp>
          <div class="ope-block">
            <div>{{ activity.createTime }}</div>
            <div>{{ activity.createBy }}</div>
          </div>
          <div>{{ activity.comment }}</div>
        </el-timeline-item>
      </el-timeline>
      <p style="text-align: center" v-else>暂无驳回数据</p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialog.checkRejectInfoDialog = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 修改税务经理 -->
    <el-dialog title="修改交付专员" :visible.sync="dialog.taxManagerModel" center width="400px" @close="closeModel('taxManagerForm')">
      <el-form ref="taxManagerForm" :rules="taxManagerForm" :model="taxManager" label-width="140px">
        <el-form-item label="修改交付专员：" prop="disposeId">
          <el-select v-model="taxManager.disposeId" filterable>
            <el-option v-for="(item, key) in dialog.taxManagerList" :key="key" :value="item.userId" :label="item.nickName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 65px" type="default" @click="dialog.taxManagerModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="claimManager">保存</el-button>
      </div>
    </el-dialog>

    <!-- 修改客服 -->
    <el-dialog title="修改客服" :visible.sync="dialog.changeCustomerModel" center width="400px" @close="closeModel('customerForm')">
      <el-form ref="customerForm" :rules="customerForm" :model="customer" label-width="140px">
        <el-form-item label="修改客服：" prop="customerServiceId">
          <el-select v-model="customer.customerServiceId" filterable>
            <el-option v-for="(item, key) in dialog.commissionerList" :key="key" :value="item.userId" :label="item.nickName"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" style="text-align: center">
        <el-button style="width: 65px" type="default" @click="dialog.changeCustomerModel = false">取消</el-button>
        <el-button style="width: 65px" type="primary" @click="claimCustomer">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import UploadFile from '@/components/UploadFile/index'; //上传图片组件
import { orderServiceRemark, deleteRemark, updateSupplier } from '@/api/newApi/taxServices/serviceManage.js';
import { batchModifyRtSupplier } from '@/api/newApi/taxServices/taxRegister.js';
import { disposeModifyBatch, disposeCustomerBatch } from '@/api/newApi/common.js';
import { workOrderCommonOperator } from '@/components/DynamicForm/commonOperator';
import { currentCodeEnum } from '@/view/module/workOrder/map.js';
export default {
  components: { UploadFile },
  props: {
    dialog: { type: Object },
    queryData: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      remarkObj: {
        //备注
        remarkComment: '',
        annex: [],
      },
      progress: {
        progress: this.dialog.progress,
        serviceId: 1,
      }, //更改进度参数
      supplier: {
        supplierId: '',
      }, //修改服务商参数
      taxManager: {
        disposeId: '',
      }, //修改税务经理
      remarkRuleForm: {
        remarkComment: [{ required: true, message: '请输入备注内容', trigger: 'blur' }],
      },
      customer: {
        customerServiceId: '',
      },
      supplierForm: {
        supplierId: [{ required: true, message: '请选择服务商', trigger: 'change' }],
      },
      taxManagerForm: {
        disposeId: [{ required: true, message: '请选择服务商', trigger: 'change' }],
      },
      customerForm: {
        customerServiceId: [{ required: true, message: '请选择客服', trigger: 'change' }],
      },
      currentCodeEnum,
    };
  },
  watch: {
    'dialog.remarkModel': {
      handler(newVal, oldVal) {
        if (newVal) {
          this.remarkObj.annex = [];
          this.remarkObj.remarkComment = '';
        }
      },
    },
  },
  created() {},
  methods: {
    /** 关闭弹窗时清除数据 */
    closeModel(formName) {
      this.$refs[formName].resetFields();
    },
    /** 批量修改税务经理 */
    claimManager() {
      disposeModifyBatch({
        disposeId: this.taxManager.disposeId,
        serviceIdColl: this.dialog.serviceIdColl,
        serviceId: this.dialog.serviceId,
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success('修改税务经理成功');
          this.dialog.taxManagerModel = false;
          this.queryData();
        }
      });
    },
    claimCustomer() {
      this.$refs.customerForm.validate((valid) => {
        if (valid) {
          const customerServiceName = (this.dialog.commissionerList.find((item) => item.userId === this.customer.customerServiceId) || {}).nickName;
          disposeCustomerBatch({
            customerServiceName,
            customerServiceId: this.customer.customerServiceId,
            type: 1,
            serviceIds: this.dialog.serviceIds,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('修改客服成功');
              this.dialog.changeCustomerModel = false;
              this.queryData();
            }
          });
        }
      });
    },
    /** 添加备注 */
    addServiceRemark() {
      this.$refs.remarkRefForm.validate((valid) => {
        if (valid) {
          workOrderCommonOperator('saveRemark', {
            ...this.remarkObj,
            workNo: this.dialog.workNo,
            annex: this.remarkObj.annex.map((item) => item.url).join(','),
          }).then((res) => {
            if (res.code == 0) {
              this.$message.success('添加成功');
              this.dialog.remarkModel = false;
              this.queryData();
            }
          });
        }
      });
    },
    /** 删除备注 */
    delet(item, index) {
      deleteRemark(item.id).then((res) => {
        if (res.code == 0) {
          this.$message.success('删除成功');
          this.dialog.listRemark.splice(index, 1);
          this.queryData();
        }
      });
    },
    //关闭弹窗是清空数据
    closeRemark() {
      this.remarkObj = {
        remarkComment: '',
        annex: [],
        annexName: '',
      };
    },

    /** 提交修改服务商 */
    submitService() {
      this.$refs.supplierForm.validate((valid) => {
        if (valid) {
          batchModifyRtSupplier({
            serviceIds: [this.dialog.checkItem.serviceId],
            countryCode: this.dialog.checkItem.countryCode,
            functionCode: this.dialog.checkItem.productFunctionCode,
            curNodeCode: this.dialog.checkItem.nodeCode,
            countryNameZh: this.dialog.checkItem.countryNameZh,
            newSupplierId: this.supplier.supplierId,
            newNodeCode: this.dialog.checkItem.nodeCode,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('修改成功');
              this.dialog.serviceModel = false;
              this.queryData();
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.el-icon-circle-close {
  font-size: 24px;
  cursor: pointer;
  float: right;
}
.taxinfo {
  .el-form-item {
    margin-bottom: 10px;
  }
}
.ope-wrapper {
  max-height: 300px;
  overflow-y: auto;
  .ope-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
    color: #666;
  }
}

.remarlist {
  max-height: 440px;
  overflow: auto;
  .content {
    width: 375px;
    margin: 0 auto 15px;
    border: 1px solid #eeeeee;
    padding: 20px;
    p {
      line-height: 28px;
    }
    .file {
      width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.warn-color {
  color: #de7c09;
}
</style>
