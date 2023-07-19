<template>
  <a-tabs v-model:activeKey="activeKey">
    <a-tab-pane key="all" tab="全部"> </a-tab-pane>
    <a-tab-pane key="serviceInfo" tab="服务信息"> </a-tab-pane>
    <a-tab-pane key="userInfo" tab="用户信息"> </a-tab-pane>
    <a-tab-pane key="operationLog" tab="操作记录"> </a-tab-pane>
  </a-tabs>

  <div class="tabinfo-wrap">
    <div class="tab-li" v-if="serviceInfo && (activeKey === 'all' || activeKey === 'serviceInfo')">
      <div class="tab-title">服务信息</div>
      <div class="tab-cell">
        <span class="hd">订单编号：</span>
        <span class="bd">{{ serviceInfo.orderNo }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">订单编号：</span>
        <span class="bd">{{ serviceInfo.serviceNo }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">服务名称：</span>
        <span class="bd">{{ serviceInfo.serviceName }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">服务项目：</span>
        <span class="bd">
          <span v-if="serviceInfo.trademarkCategoryCount === 1">一标一类</span>
          <span v-else-if="serviceInfo.trademarkCategoryCount === 2">一标二类</span>
          <span v-else-if="serviceInfo.trademarkCategoryCount === 3">一标三类</span>
          <span v-else-if="serviceInfo.trademarkCategoryCount === 4">一标四类</span>
          <span v-else-if="serviceInfo.trademarkCategoryCount === 5">一标五类</span>
          <span v-else-if="serviceInfo.trademarkCategoryCount === 6">一标六类</span>
          <span v-else-if="serviceInfo.trademarkCategoryCount === 7">一标七类</span>
          <span v-else>一标多类</span>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">国家：</span>
        <span class="bd">{{ serviceInfo.countryName }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">状态：</span>
        <span class="bd">{{ serviceInfo.serviceProgressStr }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">创建时间：</span>
        <span class="bd">{{ serviceInfo.createTime }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">受理号：</span>
        <span class="bd">{{ serviceInfo.acceptNum }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">受理号日期：</span>
        <span class="bd">{{ serviceInfo.acceptTime }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">公告日期：</span>
        <span class="bd">{{ serviceInfo.noticeDate }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">律师：</span>
        <span class="bd">{{ serviceInfo.attorneyName }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">发送注册资料：</span>
        <span class="bd">
          <template v-if="serviceInfo.flagCustomerData === true"> 是 </template>
          <template v-else-if="serviceInfo.flagCustomerData === false"> 否 </template>
          <template v-else> - </template>
        </span>
      </div>
      <div class="tab-cell">
        <span class="hd">客户发送邮件状态：</span>
        <span class="bd">
          <template v-if="serviceInfo.emailSend === true"> 是 </template>
          <template v-else-if="serviceInfo.emailSend === false"> 否 </template>
          <template v-else> - </template>
        </span>
      </div>
    </div>
    <div class="tab-li" v-if="userInfo && (activeKey === 'all' || activeKey === 'userInfo')">
      <div class="tab-title">用户信息</div>
      <div class="tab-cell">
        <span class="hd">用户昵称：</span>
        <span class="bd">{{ userInfo.nickname }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">手机号：</span>
        <span class="bd">{{ userInfo.userMobile }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">企业名称：</span>
        <span class="bd">{{ userInfo.enterpriseName }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">所在地：</span>
        <span class="bd">{{ userInfo.userAddress }}</span>
      </div>
      <div class="tab-cell">
        <span class="hd">注册时间：</span>
        <span class="bd">{{ userInfo.registerTime }}</span>
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
          <div class="timeline-text" v-if="li.businessOperateReason">备注：{{ li.businessOperateReason }}</div>
        </a-timeline-item>
      </a-timeline>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps({
  serviceInfo: {
    type: Object,
    default: () => null,
  },
  userInfo: {
    type: Object,
    default: () => null,
  },
  operationLog: {
    type: Array<any>,
    default: () => [],
  },
});

const activeKey = ref('all');
</script>

<style scoped lang="less">
.tabinfo-wrap {
  height: calc(100% - 70px);
  overflow-y: auto;
  .tab-li {
    margin-bottom: 10px;
    padding: 0 10px;
    .tab-title {
      font-weight: bold;
      padding: 5px 0;
    }
    .tab-cell {
      line-height: 26px;
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
