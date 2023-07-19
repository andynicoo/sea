<template>
  <div>
    <div class="info-block-wrapper" v-if="JSON.stringify(workOrderInfo) != '{}'">
      <el-tabs class="el-tabs" v-model="tabNav">
        <el-tab-pane name="all" label="全部"></el-tab-pane>
        <el-tab-pane name="serviceInfo" label="服务信息"></el-tab-pane>
        <el-tab-pane name="userInfo" label="用户信息"></el-tab-pane>
        <el-tab-pane name="operationInfo" label="操作记录"></el-tab-pane>
      </el-tabs>
      <div class="info-block">
        <template v-if="tabNav === 'all' || tabNav === 'serviceInfo'">
          <div class="block-title">服务信息</div>
          <div class="info-block-item">
            <span class="info-block-title">订单编号：</span>
            <span>{{ workOrderInfo.orderNo }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务编号：</span>
            <span>{{ workOrderInfo.serviceNo }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务名称：</span>
            <span>{{ workOrderInfo.serviceName }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">服务项目：</span>
            <span>{{
              workOrderInfo.trademarkCategoryCount == 1
                ? '一标一类'
                : workOrderInfo.trademarkCategoryCount == 2
                ? '一标二类'
                : workOrderInfo.trademarkCategoryCount == 3
                ? '一标三类'
                : workOrderInfo.trademarkCategoryCount == 4
                ? '一标四类'
                : workOrderInfo.trademarkCategoryCount == 5
                ? '一标五类'
                : workOrderInfo.trademarkCategoryCount == 6
                ? '一标六类'
                : workOrderInfo.trademarkCategoryCount == 7
                ? '一标七类'
                : '一标多类'
            }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">国家：</span>
            <span>{{ workOrderInfo.countryName }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">状态：</span>
            <span>
              {{ workOrderInfo.serviceProgressStr }}
              <!-- {{workOrderInfo.subServicesId != 0 ?  "-"+ workOrderInfo.subServiceProgressStr : ""}} -->
            </span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">创建时间：</span>
            <span>{{ workOrderInfo.createTime }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">受理号：</span>
            <span>{{ workOrderInfo.acceptNum }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">受理号日期：</span>
            <span v-if="workOrderInfo.acceptTime != ''">{{ (workOrderInfo.acceptTime || '').slice(0, 10) }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">公告日期：</span>
            <span v-if="workOrderInfo.noticeDate != ''">{{ (workOrderInfo.noticeDate || '').slice(0, 10) }}</span>
            <!-- 国际商标注册详情的公告期和已注册显示 -->
            <el-link icon="el-icon-edit" type="primary" v-show="hasAuthority('T1_24')" v-if="isTrademark && ['NODE0037', 'NODE0038'].includes(workOrderInfo.nodeCode)" @click="changeNoticeDateDialog = true"></el-link>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">律师：</span>
            <span v-if="workOrderInfo.attorneyName != ''">{{ workOrderInfo.attorneyName }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">发送注册资料：</span>
            <span>
              <template v-if="workOrderInfo.flagCustomerData === true"> 是 </template>
              <template v-else-if="workOrderInfo.flagCustomerData === false"> 否 </template>
              <template v-else> - </template>
            </span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">客户发送邮件状态：</span>
            <span>
              <template v-if="workOrderInfo.emailSend === true"> 是 </template>
              <template v-else-if="workOrderInfo.emailSend === false"> 否 </template>
              <template v-else> - </template>
            </span>
          </div>
        </template>

        <template v-if="tabNav === 'all' || tabNav === 'userInfo'">
          <div class="block-title">用户信息</div>
          <div class="info-block-item">
            <span class="info-block-title">用户昵称：</span>
            <span>{{ userInfo.nickname }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">手机号：</span>
            <span>{{ userInfo.userMobile }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">企业名称：</span>
            <span>{{ userInfo.enterpriseName }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">所在地：</span>
            <span>{{ userInfo.userAddress }}</span>
          </div>
          <div class="info-block-item">
            <span class="info-block-title">注册时间：</span>
            <span>{{ userInfo.registerTime }}</span>
          </div>
        </template>
        <template v-if="tabNav === 'all' || tabNav === 'operationInfo'">
          <div class="block-title">操作记录</div>
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in operationLog" :key="index" placement="top" hide-timestamp>
              <div class="timeline-header">
                <b>{{ activity.businessOperateName }}</b>
                <div>时间：{{ activity.businessOperateTime }}</div>
                <div>操作人：{{ activity.username || activity.userMobile }}</div>
              </div>
              <div>操作节点：{{ activity.businessNodeName }}</div>
              <!-- 国际商标注册 -->
              <template v-if="isTrademark">
                <div v-if="activity.businessRemark">备注：{{ activity.businessRemark }}</div>
                <div v-if="activity.businessOperateReason">驳回原因：{{ activity.businessOperateReason }} &nbsp; {{ activity.businessRemark }}</div>
              </template>
              <!-- OA审查意见 -->
              <template v-else>
                <!-- <div v-if="activity.businessRemark">备注：{{ activity.businessRemark }}</div> -->
                <div v-if="activity.businessOperateReason">备注：{{ activity.businessOperateReason }}</div>
              </template>
            </el-timeline-item>
          </el-timeline>
        </template>
      </div>
    </div>
    <el-dialog title="修改公告日期" :visible.sync="changeNoticeDateDialog" width="460px" center @close="reset">
      <el-form :model="noticeDateForm" :rules="noticeDateRules" ref="noticeDateForm">
        <el-form-item label="公告日期：" prop="noticeDate">
          <el-date-picker v-model="noticeDateForm.noticeDate" type="date" align="right" size="small" clearable unlink-panels placeholder="请选择公告日期" value-format="yyyy-MM-dd" style="width: 200px"> </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeNoticeDateDialog = false" size="small">取消</el-button>
        <el-button type="primary" @click="noticeDateSubmit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { updateNoticeDate } from '@/api/newApi/intellectualProperty/trademark';
export default {
  props: ['workOrderInfo', 'userInfo', 'operationLog', 'isTrademark', 'serviceId'],
  data() {
    return {
      tabNav: 'all',
      changeNoticeDateDialog: false,
      noticeDateForm: {
        noticeDate: '',
      },
      noticeDateRules: {
        noticeDate: [{ required: true, message: '请选择公告日期', trigger: 'blur' }],
      },
    };
  },
  watch: {
    'workOrderInfo.noticeDate'(val) {
      if (val) {
        this.$nextTick(() => {
          this.noticeDateForm.noticeDate = val;
        });
      }
    },
  },
  methods: {
    reset() {
      if (this.$refs.noticeDateForm) {
        this.$refs.noticeDateForm.resetFields();
      }
    },
    noticeDateSubmit() {
      this.$refs.noticeDateForm.validate((valid) => {
        if (valid) {
          updateNoticeDate({
            ...this.noticeDateForm,
            serviceId: this.serviceId,
          }).then((res) => {
            if (res.code === 0) {
              this.$message.success('修改成功');
              this.changeNoticeDateDialog = false;
              this.workOrderInfo.noticeDate = this.noticeDateForm.noticeDate;
            }
          });
        }
      });
    },
  },
};
</script>
<style scoped lang="less">
/deep/ .el-form .el-form-item.el-form-item--small {
  margin-bottom: 0px;
}
.info-block-wrapper {
  margin: 0;
  .info-block {
    max-height: calc(100vh - 272px) !important;
  }
}
</style>
