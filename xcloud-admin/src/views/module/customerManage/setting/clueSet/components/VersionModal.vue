<template>
  <a-modal title="版本对比" width="1200px" v-model:visible="showModal" :maskClosable="false" :keyboard="false">
    <div class="wrap">
      <div class="cont">
        <div class="flex1">
          <div class="title">
            <a-select v-model:value="formModal.new" placeholder="请选择" style="width: 350px" @change="changeNew">
              <a-select-option v-for="(li, index) of list" :key="index" :value="li.configRuleId">
                {{ li.version }}
              </a-select-option>
            </a-select>
            <div class="date-tips">{{ formModal.newInfo.updateTime }}</div>
          </div>
          <div class="config-list">
            <div class="config-li" v-for="(li, index) of formModal.newInfo.details" :key="index">
              <div class="t1">
                <span class="fw">符合</span>
                <span>“ {{ li.brandName || '-' }} ”</span>
                <span>“ {{ li.filterConditionFieldDes || '-' }} ”</span>
                <span> 属于 </span>
                <span>“ {{ li.filterConditionValueDes || '-' }} ”</span>
              </div>
              <div class="t2 line2">
                <span>负责的{{ li.fpConditionType === 1 ? '员工' : '部门' }}：</span>
                <span>
                  <a-tooltip placement="top">
                    <template #title>
                      <div style="font-size: 12px">{{ li.fpConditionValueDes || '-' }}</div>
                    </template>
                    {{ li.fpConditionValueDes || '-' }}
                  </a-tooltip>
                </span>
              </div>
              <div class="t2">
                <span>分配规则：</span>
                <span>{{ li.fpRule === 1 ? '按照员工顺序轮流分配' : '按照员工线索补齐分配' }}</span>
              </div>
            </div>
          </div>
          <div class="checked-cell">
            <a-checkbox v-model:checked="formModal.newInfo.flagDistribution" disabled />
            <span>开启后，若存在均不符合上述规则的线索统一分配给</span>
            <span>{{ formModal.newInfo.distributionUserName || '-' }}</span>
          </div>
          <div class="checked-cell">
            <a-checkbox v-model:checked="formModal.newInfo.flagPushDd" disabled />
            <span>开启后，新增分配消息以钉钉卡片方式通知对应跟进人</span>
          </div>
        </div>
        <div class="flex1">
          <div class="title">
            <a-select v-model:value="formModal.old" placeholder="请选择" style="width: 350px" @change="changeOld">
              <a-select-option v-for="(li, index) of list" :key="index" :value="li.configRuleId">
                {{ li.version }}
              </a-select-option>
            </a-select>
            <div class="date-tips">{{ formModal.oldInfo.updateTime }}</div>
          </div>
          <div class="config-list">
            <div class="config-li" v-for="(li, index) of formModal.oldInfo.details" :key="index">
              <div class="t1">
                <span class="fw">符合</span>
                <span>“ {{ li.brandName || '-' }} ”</span>
                <span>“ {{ li.filterConditionFieldDes || '-' }} ”</span>
                <span> 属于 </span>
                <span>“ {{ li.filterConditionValueDes || '-' }} ”</span>
              </div>
              <div class="t2 line2">
                <span>负责的{{ li.fpConditionType === 1 ? '员工' : '部门' }}：</span>
                <span>
                  <a-tooltip placement="top">
                    <template #title>
                      <div style="font-size: 12px">{{ li.fpConditionValueDes || '-' }}</div>
                    </template>
                    {{ li.fpConditionValueDes || '-' }}
                  </a-tooltip>
                </span>
              </div>
              <div class="t2">
                <span>分配规则：</span>
                <span>{{ li.fpRule === 1 ? '按照员工顺序轮流分配' : '按照员工线索补齐分配' }}</span>
              </div>
            </div>
          </div>
          <div class="checked-cell">
            <a-checkbox v-model:checked="formModal.oldInfo.flagDistribution" disabled />
            <span>开启后，若存在均不符合上述规则的线索统一分配给</span>
            <span>{{ formModal.oldInfo.distributionUserName || '-' }}</span>
          </div>
          <div class="checked-cell">
            <a-checkbox v-model:checked="formModal.oldInfo.flagPushDd" disabled />
            <span>开启后，新增分配消息以钉钉卡片方式通知对应跟进人</span>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <a-button @click="showModal = false">确定</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { findHistoryList, getConfigRule } from '@/api/customerManage/clueSet';
import { nextTick, ref, watch } from 'vue';

const showModal = ref(false);
const list: any = ref([]);
const formModal: any = ref({
  new: null,
  old: null,
  newInfo: {},
  oldInfo: {},
});

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      findHistoryListFun();
    });
  }
});

// 获取历史版本
const findHistoryListFun = () => {
  findHistoryList({}).then((res: any) => {
    list.value = res || [];
    formModal.value.new = list.value[0].configRuleId;
    formModal.value.old = list.value[1].configRuleId;
    changeNew(formModal.value.new);
    changeOld(formModal.value.old);
  });
};

// 更改版本
const changeNew = (id: string) => {
  getConfigRule({
    id: id,
  }).then((res: any) => {
    formModal.value.newInfo = res || {};
  });
};

// 更改版本
const changeOld = (id: string) => {
  getConfigRule({
    id: id,
  }).then((res: any) => {
    formModal.value.oldInfo = res || {};
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 60vh;
  overflow-y: auto;
  .cont {
    display: flex;
    .flex1 {
      flex: 1;
      margin: 0 20px;
      .title {
        text-align: center;
        .date-tips {
          margin: 6px 0;
        }
      }
      .config-list {
        .config-li {
          background-color: rgb(245, 247, 249);
          padding: 10px 20px;
          margin-bottom: 10px;
          border-radius: 6px;
          .t1 {
            margin-bottom: 4px;
            .fw {
              font-weight: bold;
            }
          }
          .t2 {
          }
          .line2 {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
          }
        }
      }
      .checked-cell {
        margin: 10px 0;
        span {
          margin: 0 6px;
        }
      }
    }
  }
}
</style>
