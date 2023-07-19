<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="all" tab="全部"> </a-tab-pane>
    <a-tab-pane key="wordOrderInfo" tab="工单信息"> </a-tab-pane>
    <a-tab-pane key="taxInfo" tab="税号信息"> </a-tab-pane>
    <a-tab-pane key="operationLog" tab="操作记录"> </a-tab-pane>
  </a-tabs>

  <div class="tabinfo-wrap">
    <div class="tab-li" v-if="activeKey === 'all' || activeKey === 'wordOrderInfo'">
      <div class="tab-title">工单信息</div>
      <div class="tab-cell">
        <span class="hd">客户：</span>
        <span class="bd">{{ detailsInfo.customer }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">手机号：</span>
        <span class="bd">{{ detailsInfo.userMobile }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">订单号：</span>
        <span class="bd">{{ detailsInfo.orderNo }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">订单归属人：</span>
        <span class="bd">{{ detailsInfo.attributionName }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">订单备注：</span>
        <span class="bd">{{ detailsInfo.orderRemark }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">服务号：</span>
        <span class="bd">{{ detailsInfo.serviceNo }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">工单号：</span>
        <span class="bd">{{ detailsInfo.workNo }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">国家：</span>
        <span class="bd">{{ detailsInfo.countryNameZh }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">商品名称：</span>
        <span class="bd">{{ detailsInfo.serviceName }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">工单状态：</span>
        <span class="bd">
          <span v-if="detailsInfo.workStatus === 1">正常</span>
          <span v-else-if="detailsInfo.currentNodeCode === 2">取消</span>
          <span v-else>{{ detailsInfo.workStatus }}</span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">工单进度：</span>
        <span class="bd">
          <span v-if="detailsInfo.currentNodeCode === 'NODE2'">待上传资料</span>
          <span v-else-if="detailsInfo.currentNodeCode === 'NODE3'">待审核资料</span>
          <span v-else-if="detailsInfo.currentNodeCode === 'NODE4'">已审核</span>
          <!-- 其他枚举 ++++++++++ -->
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">驳回原因：</span>
        <span class="bd">
          <span style="color: #46a6ff; cursor: pointer" @click="rejectReason()">查看</span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">服务商：</span>
        <span class="bd">{{ detailsInfo.supplierName }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">服务商分配编码：</span>
        <span class="bd">
          <span> {{ detailsInfo.supplierAssignsCode }} </span>
          <span style="cursor: pointer; margin-left: 5px" @click="editSupplierAssignsCode()">
            <EditOutlined />
          </span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">服务截止时间：</span>
        <span class="bd">{{ detailsInfo.expirationTime }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">工单创建时间：</span>
        <span class="bd">{{ detailsInfo.createTime }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">上传资料时间：</span>
        <span class="bd">{{ detailsInfo.saveMaterialTime }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">资料审核通过时间：</span>
        <span class="bd">{{ detailsInfo.auditPassTime }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">获取授权时间：</span>
        <span class="bd">{{ detailsInfo.authTime }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">授权审核通过时间：</span>
        <span class="bd">{{ detailsInfo.authPassTime }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">工单完成时间：</span>
        <span class="bd">{{ detailsInfo.completeTime }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">提交次数：</span>
        <span class="bd">{{ detailsInfo.submitCount }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">申报周期：</span>
        <span class="bd">
          <span v-if="detailsInfo.declarePeriod === 0">月报</span>
          <span v-else-if="detailsInfo.declarePeriod === 1">季报</span>
          <span v-else-if="detailsInfo.declarePeriod === 2">年报</span>
          <span v-else>暂无</span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">下一次申报周期：</span>
        <span class="bd">
          <span v-if="detailsInfo.beginTime">{{ detailsInfo.beginTime.split(' ')[0] }}</span>
          <span v-if="detailsInfo.beginTime && detailsInfo.endTime">-</span>
          <span v-if="detailsInfo.endTime">{{ detailsInfo.endTime.split(' ')[0] }}</span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">发送注册资料：</span>
        <span class="bd">
          <template v-if="detailsInfo.flagCustomerData === true"> 是 </template>
          <template v-else-if="detailsInfo.flagCustomerData === false"> 否 </template>
          <template v-else> - </template>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">客户发送邮件状态：</span>
        <span class="bd">
          <template v-if="detailsInfo.emailSend === true"> 是 </template>
          <template v-else-if="detailsInfo.emailSend === false"> 否 </template>
          <template v-else> - </template>
        </span>
      </div>
    </div>
    <div class="tab-li" v-if="detailsInfo && (activeKey === 'all' || activeKey === 'taxInfo')">
      <div class="tab-title">税号信息</div>
      <div class="tab-cell">
        <span class="hd">税号：</span>
        <span class="bd">{{ detailsInfo.vatTaxNumber }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">税号文件：</span>
        <span class="bd">
          <span>
            <a
              v-if="detailsInfo.vatTaxNumberFile"
              :href="detailsInfo.vatTaxNumberFile"
              target="_blank"
              style="word-break: keep-all; color: #00a3ff"
            >
              下载
            </a>
            <span v-else>暂无</span>
          </span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">税号生效日期：</span>
        <span class="bd">{{ detailsInfo.taxEffectiveDate }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">税号下发日期：</span>
        <span class="bd">{{ detailsInfo.taxIssueDate }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">EORI号：</span>
        <span class="bd">{{ detailsInfo.eoriNumber }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">EORI文件：</span>
        <span class="bd">
          <span>
            <a
              v-if="detailsInfo.eoriNumberFile"
              :href="detailsInfo.eoriNumberFile"
              target="_blank"
              style="word-break: keep-all; color: #00a3ff"
            >
              下载
            </a>
            <span v-else>暂无</span>
          </span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">VAT证书：</span>
        <span class="bd">
          <span>
            <a
              v-if="detailsInfo.vatCertificate"
              :href="detailsInfo.vatCertificate"
              target="_blank"
              style="word-break: keep-all; color: #00a3ff"
            >
              下载
            </a>
            <span v-else>暂无</span>
          </span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">DE欧盟证书：</span>
        <span class="bd">
          <span>
            <a
              v-if="detailsInfo.deEuCertificate"
              :href="detailsInfo.deEuCertificate"
              target="_blank"
              style="word-break: keep-all; color: #00a3ff"
            >
              下载
            </a>
            <span v-else>-</span>
          </span>
          <span style="cursor: pointer; margin-left: 5px" @click="editDeEuCertificate()">
            <EditOutlined />
          </span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">税务副本：</span>
        <span class="bd">
          <span v-if="detailsInfo.vatTaxNumberCopyFile">
            <a
              v-for="item in JSON.parse(detailsInfo.vatTaxNumberCopyFile)"
              :key="item"
              :href="item"
              target="_blank"
              style="word-break: keep-all; color: #00a3ff"
            >
              下载
            </a>
          </span>
        </span>
      </div>
    </div>
    <div class="tab-li" v-if="operationLog.length && (activeKey === 'all' || activeKey === 'operationLog')">
      <div class="tab-title">操作记录</div>
      <a-timeline class="timeline-wrap">
        <a-timeline-item v-for="(li, index) of operationLog" :key="index">
          <div class="timeline-title">{{ li.businessOperateName }}</div>
          <div class="timeline-text">时间：{{ li.businessOperateTime }}</div>
          <div class="timeline-text">操作人：{{ li.username || li.userMobile }}</div>
          <div class="timeline-text">操作节点：{{ li.businessNodeName }}</div>
          <div class="timeline-text" v-if="li.businessRemark">备注：{{ li.businessRemark }}</div>
          <div class="timeline-text" v-if="li.businessOperateReason">驳回原因：{{ li.businessOperateReason }}</div>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
  <RejectReasonModal ref="rejectReasonModal" :workNo="detailsInfo.workNo" />
  <EditSupplierAssignsCodeModal
    ref="editSupplierAssignsCodeModal"
    :workId="detailsInfo.workId"
    :supplierAssignsCode="detailsInfo.supplierAssignsCode"
    @submit="emit('submit')"
  />
  <EditDeEuCertificateModal
    ref="editDeEuCertificateModal"
    :workId="detailsInfo.workId"
    :deEuCertificate="detailsInfo.deEuCertificate"
    @submit="emit('submit')"
  />
</template>

<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { EditOutlined } from '@ant-design/icons-vue';
import RejectReasonModal from './tabOpt/RejectReasonModal.vue';
import EditSupplierAssignsCodeModal from './tabOpt/EditSupplierAssignsCodeModal.vue';
import EditDeEuCertificateModal from './tabOpt/EditDeEuCertificateModal.vue';

const prods = defineProps({
  detailsInfo: {
    type: Object,
    default: () => null,
  },
  operationLog: {
    type: Array<any>,
    default: () => [],
  },
});
const activeKey = ref('all');
const emit = defineEmits(['submit']);

//驳回原因
const rejectReasonModal: Ref = ref(null);
const rejectReason = () => {
  rejectReasonModal.value.showModal = true;
};

//编辑服务商分配编码
const editSupplierAssignsCodeModal: Ref = ref(null);
const editSupplierAssignsCode = () => {
  editSupplierAssignsCodeModal.value.showModal = true;
};

//编辑DE欧盟证书
const editDeEuCertificateModal: Ref = ref(null);
const editDeEuCertificate = () => {
  editDeEuCertificateModal.value.showModal = true;
};
</script>

<style scoped lang="less">
.tabinfo-wrap {
  height: calc(100% - 70px);
  overflow-y: auto;
  .tab-li {
    margin-bottom: 10px;
    padding: 0 10px;
    .tab-title {
      position: relative;
      padding: 8px 18px;
      font-weight: bold;
    }
    .tab-title::after {
      position: absolute;
      content: '';
      left: 5px;
      top: 50%;
      -webkit-transform: translateY(-50%);
      transform: translateY(-50%);
      width: 2px;
      height: 14px;
      background-color: #1890ff;
      border-radius: 1px;
    }
    .tab-cell {
      line-height: 28px;
      padding: 0 18px;
      .hd {
        color: #999;
      }
      .bd {
        color: #333;
      }
    }
    .timeline-wrap {
      padding: 10px 13px;
      .timeline-title {
        font-weight: bold;
        color: #666;
      }
      .timeline-text {
        color: #999;
      }
    }
  }
}
</style>
