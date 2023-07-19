<template>
  <a-modal title="详情" width="1200px" v-model:visible="visible" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <div class="cell-wrap">
        <div class="cell-title">
          <span class="text">基础信息</span>
        </div>
        <a-row>
          <a-col :span="12">
            <div class="hd">数据源：</div>
            <div class="bd">{{ record.platformName || '-' }}</div>
          </a-col>
          <a-col :span="12">
            <div class="hd">数据源标识ID：</div>
            <div class="bd">{{ record.platform || '-' }}</div>
          </a-col>
          <a-col :span="12">
            <div class="hd">说明：</div>
            <div class="bd">
              {{ record.explainRemarks || '-' }}
            </div>
          </a-col>
          <a-col :span="12">
            <div class="hd">备注：</div>
            <div class="bd">
              {{ record.remarks || '-' }}
            </div>
          </a-col>
          <a-col :span="12">
            <div class="hd">客户来源：</div>
            <div class="bd">
              <span v-if="record.sourceLargeDes || record.sourceSmallDes">
                {{ record.sourceLargeDes }} / {{ record.sourceSmallDes }}
              </span>
              <span v-else>-</span>
            </div>
          </a-col>
        </a-row>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span class="text">线索基础属性</span>
        </div>
        <a-row>
          <a-col :span="8">
            <div class="hd">所属企业：</div>
            <div class="bd">{{ enterpriseName || '-' }}</div>
          </a-col>
          <a-col :span="16"> </a-col>
          <a-col :span="8">
            <div class="hd">X云BG跟进人：</div>
            <div class="bd">{{ record.leadFollowXDes || '-' }}</div>
          </a-col>
          <a-col :span="8">
            <div class="hd">SG卖家成长跟进人：</div>
            <div class="bd">{{ record.leadFollowMDes || '-' }}</div>
          </a-col>
          <a-col :span="8">
            <div class="hd">创新BG跟进人：</div>
            <div class="bd">{{ record.leadFollowCDes || '-' }}</div>
          </a-col>
        </a-row>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span class="text">客户基础属性</span>
        </div>
        <a-row>
          <a-col :span="8">
            <div class="hd">X云BG跟进人：</div>
            <div class="bd">{{ record.customerFollowXDes || '-' }}</div>
          </a-col>
          <a-col :span="8">
            <div class="hd">SG卖家成长跟进人：</div>
            <div class="bd">{{ record.customerFollowMDes || '-' }}</div>
          </a-col>
          <a-col :span="8">
            <div class="hd">创新BG跟进人：</div>
            <div class="bd">{{ record.customerFollowCDes || '-' }}</div>
          </a-col>
        </a-row>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span class="text">授权API</span>
        </div>
        <a-row>
          <a-col :span="24">
            <div class="hd">授权API：</div>
            <div class="bd">{{ record.secret || '-' }}</div>
          </a-col>
          <a-col :span="24">
            <div class="hd">API状态：</div>
            <div class="bd">{{ record.status === 1 ? '启用' : '禁用' }}</div>
          </a-col>
        </a-row>
      </div>

      <div class="cell-wrap">
        <div class="cell-title">
          <span class="text">数据推送CRM</span>
        </div>
        <a-row>
          <a-col :span="24">
            <div class="hd">推送CRM开关：</div>
            <div class="bd">{{ record.pushCrm === 1 ? '已开启' : '已关闭' }}</div>
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
import { ref, watch } from 'vue';
import { getEnterpriseSelect } from '@/api/base/basicsData';

const visible = ref<boolean>(false);
const enterpriseName = ref('');
//传入参数
const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

watch(visible, newVal => {
  if (newVal) {
    getEnterpriseSelectFun();
  } else {
    enterpriseName.value = '';
  }
});

//获取所属企业
const getEnterpriseSelectFun = () => {
  getEnterpriseSelect().then((res: any) => {
    const obj = res.find((v: any) => {
      return v.id == props.record.enterpriseId;
    });
    enterpriseName.value = obj.name;
  });
};

//暴露方法
defineExpose({ visible });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0 40px;
  .cell-wrap {
    border: 1px solid #eee;
    padding: 18px;
    margin-top: 15px;
    .cell-title {
      margin-bottom: 15px;
      .text {
        position: relative;
        line-height: 20px;
        font-size: 14px;
        color: #666;
        padding-left: 15px;
      }
      .text::before {
        position: absolute;
        left: 0;
        top: 3px;
        width: 2.5px;
        height: 14px;
        content: ' ';
        background-color: #1890ff;
      }
      .tips {
        color: red;
        margin-left: 10px;
        font-size: 12px;
      }
    }
    .ant-col {
      display: flex;
      font-size: 14px;
      line-height: 32px;
      margin: 10px 0;
      .hd {
        width: 150px;
        text-align: right;
        color: #999;
      }
      .bd {
        flex: 1;
        color: #666;
      }
    }
  }
}
</style>
