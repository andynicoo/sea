<template>
  <el-drawer title="续费详情" :visible.sync="dialogvisible" :size="1100">
    <div class="renewal-detail-wrapper">
      <div class="renewal-detail-title-wrapper">
        <div>
          <span class="renewal-detail-title">{{ row.productName }}</span>
          <span class="renewal-detail-subtitle">（{{ row.productSpecName }}）</span>
        </div>
        <el-divider direction="vertical"></el-divider>
        <div class="renewal-detail-company">{{ info.companyNameZh }}</div>
      </div>

      <div class="tag-wrapper">
        <span class="tag">手机号：{{ info.mobile }}</span>
        <span class="tag">服务号：{{ info.serviceNo }}</span>
        <span class="tag">服务状态：{{ info.status | serviceStatus }}</span>
        <span class="tag"
          >剩余时间：
          <span style="color: #ff5f61">{{ info.expirationTime | filterRestTime }}</span>
        </span>
      </div>
      <el-descriptions :column="2" labelClassName="desc-label" contentClassName="desc-content">
        <el-descriptions-item label="国家">{{ info.countryNameZh }}</el-descriptions-item>
        <el-descriptions-item label="税号/注册号">{{ info.businessNo }}</el-descriptions-item>
        <el-descriptions-item label="首次服务开始时间">{{ $util.formatDateTime(info.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="最后服务截止时间">{{ $util.formatDateTime(info.expirationTime) }}</el-descriptions-item>
        <el-descriptions-item label="客户等级">{{ info.userLevel | filterCustomLevel }}</el-descriptions-item>
        <el-descriptions-item label="续费跟进人">{{ info.renewFollowUserName }}</el-descriptions-item>
      </el-descriptions>

      <el-tabs class="tabs" v-model="activeName" type="card">
        <el-tab-pane label="跟进记录" name="followRecord"></el-tab-pane>
        <el-tab-pane label="提醒记录" name="remindRecord"></el-tab-pane>
        <el-tab-pane label="续费记录" name="renewalRecord"></el-tab-pane>
      </el-tabs>

      <div class="tab-content-wrapper">
        <div v-show="activeName === 'followRecord'">
          <FollowRecord ref="followRecord" :serviceId="serviceId" @refresh="refresh" />
        </div>
        <div v-show="activeName === 'remindRecord'">
          <RemindRecord ref="remindRecord" :serviceId="serviceId" />
        </div>
        <div v-show="activeName === 'renewalRecord'">
          <RenewalRecord ref="renewalRecord" :oldServiceNo="row.serviceNo" />
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script>
import { renewalDetail } from '@/api/newApi/renewalCenter/myRenewal.js';
import FollowRecord from './followRecord.vue';
import RemindRecord from './remindRecord.vue';
import RenewalRecord from './renewalRecord.vue';
export default {
  props: {
    renewalDetailDialog: Boolean,
    serviceId: String,
    row: Object,
  },

  data() {
    return {
      activeName: 'followRecord',
      info: {},
    };
  },
  components: {
    FollowRecord,
    RemindRecord,
    RenewalRecord,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.renewalDetailDialog;
      },
      set(val) {
        this.$emit('update:renewalDetailDialog', val);
      },
    },
  },
  watch: {
    serviceId(val) {
      if (val) {
        setTimeout(() => {
          this.init();
        });
      }
    },
  },
  methods: {
    init() {
      this.getInfo();
      this.$refs.followRecord.getList();
      this.$refs.remindRecord.getList();
      this.$refs.renewalRecord.getList();
    },
    // 获取续费详情
    getInfo() {
      renewalDetail(this.serviceId).then((res) => {
        this.info = res.data;
      });
    },
    refresh() {
      this.$emit('refresh');
    },
  },
};
</script>

<style lang="scss" scoped>
.renewal-detail-wrapper {
  padding: 0 35px 0 24px;
  font-size: 16px;
  .renewal-detail-title-wrapper {
    display: flex;
    align-items: center;
    .renewal-detail-title {
      color: #303132;
      font-weight: bold;
    }
    .renewal-detail-subtitle {
      color: #919498;
    }
  }
  .renewal-detail-company {
    color: #303132;
  }
  .tag-wrapper {
    display: flex;
    align-items: center;
    margin: 16px 0;
    .tag {
      font-size: 14px;
      padding: 2px 4px;
      background-color: #f5f5f5;
      margin-right: 16px;
      color: #606266;
    }
  }
  .tabs {
    margin-top: 24px;
  }
  .tab-content-wrapper {
    // height: calc(100vh - 480px);
    overflow-y: auto;
  }
}
::v-deep {
  .desc-label {
    font-size: 16px;
    color: #606266;
  }
  .desc-content {
    font-size: 16px;
    color: #303132;
  }
}
::v-deep .el-drawer__header {
  font-size: 16px;
  color: #919498;
}
::v-deep .el-divider--vertical {
  background-color: #d9d9d9 !important;
  margin: 0 24px !important;
}
</style>
