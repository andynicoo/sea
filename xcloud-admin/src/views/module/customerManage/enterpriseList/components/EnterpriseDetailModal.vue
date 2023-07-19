<template>
  <a-modal title="企业客户详情" width="1200px" v-model:visible="visible" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <div class="enterprise-title">
        <div class="img">
          <img src="@/assets/img/icon/Group427318305.png" />
        </div>
        <div class="text">
          <div class="name">{{ record.companyName || '-' }}</div>
          <div class="name-en">{{ record.companyNameEn || '-' }}</div>
          <div class="update-time">更新时间:{{ record.updateTime || '-' }}</div>
        </div>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span>标识信息</span>
        </div>
        <a-row>
          <a-col :span="8">
            <div class="hd">统一社会信用代码：</div>
            <div class="bd">{{ record.companyCreditCode || '-' }}</div>
          </a-col>
          <a-col :span="8">
            <div class="hd">OneID标识：</div>
            <div class="bd">{{ record.oneId || '-' }}</div>
          </a-col>
          <a-col :span="8">
            <div class="hd">所属主体：</div>
            <div class="bd">{{ record.enterpriseName || '-' }}</div>
          </a-col>
        </a-row>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span>关键信息</span>
        </div>
        <a-row>
          <a-col :span="6">
            <div class="hd">人员规模：</div>
            <div class="bd">{{ record.companyPersonnelSizeTest || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">年销售额：</div>
            <div class="bd">{{ record.companyYearAmountTest || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">企业在售平台：</div>
            <div class="bd">{{ record.shopSalePlatformNameTest || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">主要出口国家：</div>
            <div class="bd">{{ record.mainSaleCountry || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">对接人：</div>
            <div class="bd">{{ record.followUserName || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">对接人身份：</div>
            <div class="bd">{{ record.followUserTypeTest || '-' }}</div>
          </a-col>
        </a-row>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span>基础信息</span>
        </div>
        <a-row>
          <a-col :span="6">
            <div class="hd">成立日期：</div>
            <div class="bd">{{ record.companyRegisterData || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">企业网址：</div>
            <div class="bd">{{ record.companySite || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">企业邮箱：</div>
            <div class="bd">{{ record.companyEmail || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">企业联系方式：</div>
            <div class="bd">{{ record.companyTel || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">企业法人：</div>
            <div class="bd">{{ record.companyLegalPersonZh || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">法人身份证号码：</div>
            <div class="bd">{{ record.companyLegalPersonCard || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">法人联系方式：</div>
            <div class="bd">{{ record.companyLegalPersonMobile || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">法人邮箱：</div>
            <div class="bd">{{ record.companyLegalPersonEmail || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">企业所在省份：</div>
            <div class="bd">{{ record.companyAddressEnProvice || '-' }}</div>
          </a-col>
          <a-col :span="6">
            <div class="hd">企业所在城市：</div>
            <div class="bd">{{ record.companyAddressEnCity || '-' }}</div>
          </a-col>
        </a-row>
      </div>
    </div>
    <template #footer>
      <a-button type="primary" @click="visible = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const visible = ref<boolean>(false);
//传入参数
defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

//暴露方法
defineExpose({ visible });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
}
.enterprise-title {
  display: flex;
  .img {
    width: 123px;
    height: 123px;
  }
  .text {
    flex: 1;
    margin-left: 15px;
    .name {
      font-size: 16px;
      font-weight: bold;
      color: #333;
      line-height: 32px;
      margin-bottom: 10px;
    }
    .name-en {
      font-size: 14px;
      color: #666;
      line-height: 28px;
      margin-bottom: 10px;
    }
    .update-time {
      font-size: 12px;
      color: #999;
      line-height: 22px;
    }
  }
}
.cell-wrap {
  border: 1px solid #eee;
  padding: 18px;
  margin-top: 15px;
  .cell-title {
    margin-bottom: 15px;
    span {
      position: relative;
      line-height: 20px;
      font-size: 14px;
      color: #666;
      padding-left: 15px;
    }
    span::before {
      position: absolute;
      left: 0;
      top: 3px;
      width: 2.5px;
      height: 14px;
      content: ' ';
      background-color: #1890ff;
    }
  }
  .ant-col {
    display: flex;
    font-size: 12px;
    margin: 10px 0;
    .hd {
      flex: 2;
      text-align: right;
      color: #999;
    }
    .bd {
      flex: 3;
      color: #666;
      overflow: hidden;
    }
  }
}
</style>
