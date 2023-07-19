<template>
  <a-modal
    title="查看OA翻译"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    :footer="false"
  >
    <div class="wrap">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }">
        <a-form-item label="翻译OA"> {{ record.interpretFileContent }} </a-form-item>
        <a-form-item label="客户答复截止日期"> {{ record.lastDealDate }} </a-form-item>
        <a-form-item label="审查意见翻译文件">
          <div v-if="schemeList.length > 0">
            <div v-for="(item, index) in schemeList" :key="index">
              <FileLink :fileUrl="item.fileUrl" :fileName="item.oldFileName" />
            </div>
          </div>
        </a-form-item>
        <a-form-item label="OA处理方案">
          <div class="scheme-cell" v-for="(li, index) of planList" :key="index">
            <div class="scheme-title">
              <span class="text">方案{{ index + 1 }}</span>
            </div>
            <div class="scheme-wrap">
              <div class="scheme-tips">答复建议</div>
              <div class="scheme-text">
                {{ li.planInfo.replyStr }}
              </div>
              <div class="scheme-tips">答复审查意见服务商品</div>
              <a-table
                size="small"
                :data-source="li.planInfo.oaServiceList"
                :pagination="false"
                bordered
                :locale="{ emptyText: '无需OA付费' }"
              >
                <a-table-column :width="80" title="国家" data-index="oaCountry" />
                <a-table-column :width="80" title="售价" data-index="oaPrice" />
                <a-table-column title="服务商品" data-index="evidenceComboName" />
              </a-table>
            </div>
          </div>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import FileLink from '@/components/assembly/FileLink.vue';
import { getFileDetails } from '@/api/workOrder/intellectualProperty/oaExamination';

const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const showModal = ref(false);
const schemeList: any = ref([]);
const planList: any = ref([]);
watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      getPlanList();
      if (props.record.hlepDocument) {
        schemeList.value = JSON.parse(props.record.hlepDocument);
      }
    });
  }
});

//获取方案
const getPlanList = () => {
  getFileDetails({
    id: props.record.id,
  }).then((res: any) => {
    planList.value = res.planList
      .map((item: { planInfo: string }) => {
        if (item.planInfo != '') {
          item.planInfo = JSON.parse(item.planInfo);
        }
        return item;
      })
      .filter((item: { planInfo: string }) => item.planInfo != '');
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 10px;
  max-height: 60vh;
  overflow-y: auto;
  .scheme-cell {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-bottom: 10px;
    .scheme-title {
      border-bottom: 1px solid #ccc;
      padding: 4px;
      .text {
        font-weight: bold;
      }
    }
    .scheme-wrap {
      .scheme-tips {
        color: #999;
        margin: 4px 0;
      }
      .scheme-text {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
