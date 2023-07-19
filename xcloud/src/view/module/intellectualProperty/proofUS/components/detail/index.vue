<template>
  <div>
    <div class="ope-header-wrapper">
      <el-link :underline="false" @click="goBack">
        <i class="el-icon-arrow-left" style="margin-right: 6px; cursor: pointer"></i>
        返回列表
      </el-link>
      <div>
        <el-button type="primary" :disabled="isCancel" v-if="showAuditPass" @click="handleAuditSure" style="margin-right: 10px" v-show="hasAuthority('W1_5')"> 审核通过 </el-button>
        <el-button type="primary" :disabled="isCancel" v-if="showAuditRefund" @click="handleAuditRefund" style="margin-right: 10px" v-show="hasAuthority('W1_6')"> 驳回 </el-button>
        <el-button type="primary" :disabled="isCancel" v-if="showEdit" @click="handleCanEdit" style="margin-right: 10px" v-show="hasAuthority('W1_7')"> 修改 </el-button>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="app-container" :class="{ 'app-container-fold': fold }">
        <div class="header-container">
          <div class="fold" @click="fold = !fold">{{ fold ? '展开' : '收缩' }}</div>
          <Detail
            v-if="showDetail"
            ref="detailRef"
            :isCancel="isCancel"
            :serviceId="serviceId"
            :evidenceType="evidenceType"
            :nodeCode="nodeCode"
            :useVoucherRejectReason="workOrderInfo.useVoucherRejectReason"
            :serviceProgress="serviceProgress"
            :detailInfo="detailInfo"
            :workflowColumns="workflowColumns"
            @backPage="goBack()"
          />
        </div>
      </div>
      <div class="right-container" :class="{ 'info-block-wrapper-fold': fold }">
        <RightInfo v-if="showDetail" :workOrderInfo="workOrderInfo" :userInfo="userInfo" :operationLog="operationLog" />
      </div>

      <el-dialog :visible.sync="auditModal" title="驳回原因">
        <el-input v-model="remark" type="textarea" style="margin-top: 10px" placeholder="请输入驳回原因" />
        <p style="margin-top: 10px">
          <span style="margin-right: 12px">短信通知</span>
          <el-radio-group v-model="sendSms">
            <el-radio :label="true">通知用户</el-radio>
            <el-radio :label="false">不通知用户</el-radio>
          </el-radio-group>
        </p>

        <p slot="footer">
          <el-button type="primary" ghost style="margin-right: 20px" @click="auditModal = false">取消</el-button>
          <el-button type="primary" @click="rejectAudit">确认</el-button>
        </p>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import Detail from './detail';
import { evidenceDetailApi, submitEvidencelistApi, evidenceUpdate } from '@/api/newApi/proffus/proffus.js';
import { getBusinessLogListByNo } from '@/api/newApi/common';
import RightInfo from '../../../components/rightInfo';
import isServiceCancel from '@/view/module/workOrder/mixin/isServiceCancel';
export default {
  components: {
    Detail,
    RightInfo,
  },
  // props: {
  //   serviceId: String,
  //   selectRow: Object
  // },
  mixins: [isServiceCancel],
  data() {
    return {
      // 节点标识和状态
      remark: '', //驳回原因
      sendSms: false, //是否通知用户
      serviceProgress: '',
      auditModal: false,
      // 详情数据
      detailInfo: {},
      // 工单详情的字段列表
      workflowColumns: [],
      // 右侧信息-服务信息
      workOrderInfo: {},
      // 右侧信息-用户信息
      userInfo: {},
      // 右侧信息-操作日志
      operationLog: [],
      // 是否展示详情组件
      showDetail: false,
      serviceId: this.$route.query.serviceId,
      nodeCode: this.$route.query.nodeCode,
      evidenceType: this.$route.query.evidenceType,
      fold: false,
    };
  },
  computed: {
    // 审核通过按钮，
    showAuditPass() {
      if (this.nodeCode == 'NODE0040' && this.detailInfo.nextNodeCode) {
        return true;
      } else {
        return false;
      }
    },
    // 审核驳回按钮，
    showAuditRefund() {
      return (this.nodeCode == 'NODE0039' && this.workOrderInfo.status == 1 && this.evidenceType != 2) || (this.detailInfo.rejectNodeCode != '' && this.nodeCode == 'NODE0040');
      // return this.nodeCode === 'NODE0040';
    },
    // 展示编辑按钮，
    showEdit() {
      if (this.nodeCode == 'NODE0039' && (this.serviceProgress == 2 || this.serviceProgress == 3)) {
        return true;
      } else {
        return false;
      }
    },
  },
  created() {
    this.queryDetail();
  },
  methods: {
    goBack() {
      // this.$emit("back");
      this.$router.push({ path: '/intellectualProperty/proofUS/index' });
    },

    /**
     * 查询详情
     */
    queryDetail() {
      evidenceDetailApi({
        serviceId: this.serviceId,
        nodeCode: this.nodeCode,
      }).then((res) => {
        if (res.code == 0) {
          this.detailInfo = res.data;
          this.workflowColumns = res.data.workflowColumns;
          this.workOrderInfo = res.data.trademarkOrderServiceInfoVO;
          this.ifCancel(res.data.trademarkOrderServiceInfoVO.status);
          this.userInfo = res.data.trademarkOrderUserInfoVO;
          this.nodeCode = this.workOrderInfo.subNodeCode;
          this.serviceProgress = this.workOrderInfo.subServiceProgress;
          // console.log(this.workOrderInfo);
          // 显示详情
          this.showDetail = true;
          this.getOperationLog(this.workOrderInfo.serviceNo, 2);
        }
      });
    },
    getOperationLog(businessNo, businessType) {
      console.log(333);
      getBusinessLogListByNo({
        businessNo,
        businessType,
      }).then((res) => {
        if (res.code === 0) {
          this.operationLog = res.data;
        }
      });
    },

    /**
     * 审核通过
     */
    handleAuditSure() {
      this.$confirm('确定审核通过吗？', '提示', {
        customClass: 'custom-confirm',
        type: 'warning',
        center: true,
      })
        .then(() => {
          submitEvidencelistApi({
            nodeCode: this.nodeCode,
            path: true,
            serviceId: this.serviceId,
          }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功',
              });
              this.goBack();
            }
          });
        })
        .catch(() => {});
    },

    /**
     * 审核驳回
     */
    handleAuditRefund() {
      if (this.nodeCode == 'NODE0039' && this.workOrderInfo.status == 1) {
        this.auditModal = true;
      } else {
        this.$confirm('确定驳回该条数据吗？', '提示', {
          customClass: 'custom-confirm',
          type: 'warning',
          center: true,
        })
          .then(() => {
            submitEvidencelistApi({
              nodeCode: this.nodeCode,
              path: false,
              serviceId: this.serviceId,
            }).then((res) => {
              if (res.code == 0) {
                this.$message({
                  type: 'success',
                  message: '驳回成功',
                });
                this.goBack();
              }
            });
          })
          .catch(() => {});
      }
    },
    /**
     * 待录入驳回 39节点状态
     */
    async rejectAudit() {
      //   @ApiModelProperty(value = "服务id")
      // private Long servicesId;

      // @ApiModelProperty(value = "使用证据节点唯一编码")
      // private String nodeCode;

      // @ApiModelProperty(value = "驳回到资料被驳回原因")
      // private String remark;

      // @ApiModelProperty(value = "是否发送短信")
      // private Boolean sendSms;
      let parms = {
        nodeCode: String(this.nodeCode),
        serviceId: this.serviceId,
        remark: this.remark,
        sendSms: this.sendSms,
      };
      let { message, code } = await evidenceUpdate(parms);
      if (code == 0) {
        this.$message({
          type: 'success',
          message: '操作成功',
        });
        this.goBack();
      } else {
        this.$message({
          type: 'error',
          message: message,
        });
      }
    },
    /**
     * 允许编辑
     */
    handleCanEdit() {
      this.$refs.detailRef.isEdit = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.main-wrapper {
  display: flex;
  .app-container {
    width: calc(100% - 410px);
    flex: 0 0 calc(100% - 410px);
    margin-right: 5px;
    margin-top: 10px;
    transition: all 0.3s ease-in-out;
    &.app-container-fold {
      width: 100%;
      flex: 100%;
      margin-right: -5px;
    }
    .header-container {
      padding-left: 30px;
      position: relative;
      .el-form-wrapper {
        height: calc(100vh - 312px);
        overflow-y: auto;
      }
      .fold {
        position: absolute;
        z-index: 1;
        right: 30px;
        top: 35px;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
  .right-container {
    width: 390px;
    margin-left: 10px;
    background: #fff;
    transition: all 0.3s ease-in-out;
    &.info-block-wrapper-fold {
      width: 0;
      margin-left: 0;
      overflow: hidden;
    }
  }
}

::v-deep .info-block {
  height: calc(100vh - 243px) !important;
}
</style>
