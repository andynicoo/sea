<template>
  <div class="result-panel">
    <div class="result-panel-item">
      <h5>核名结果</h5>
      <a-row :gutter="40">
        <a-col style="width: 300px">
          <a-form-item label="通过率">
            <a-select
              :disabled="readonly"
              v-model:value="checkPassRate"
              :options="checkPassRateOptions"
              @change="handleChange(1)"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col style="width: 600px">
          <a-form-item label="检索结果">
            <a-input :disabled="readonly" v-model:value="checkPassRateRes" />
          </a-form-item>
        </a-col>
      </a-row>
    </div>
    <div v-show="!hideVal">
      <div class="result-panel-item" v-if="conclusionText">
        <h5>核名结论</h5>
        <div class="result-text">
          <div class="result-text-item">
            <h6>商标含义部分：</h6>
            <a-textarea :value="conclusionText.mean" disabled autoSize></a-textarea>
          </div>
          <div class="result-text-item">
            <h6>近似检索部分：</h6>
            <a-textarea :value="conclusionText.similar" disabled autoSize></a-textarea>
          </div>
        </div>
        <p class="tips">检索结论是由商标含义检索结论和近似商标检索结论组成，若需修改，请返回对应步骤进行修改。</p>
      </div>
      <div class="result-panel-item">
        <h5 style="margin-bottom: 6px">修改建议</h5>
        <a-row v-if="!readonly" justify="space-between" style="margin-bottom: 10px">
          <p style="color: #999">
            请在下方填写核名修改建议，可参考右侧<span
              @click="data.showTips = true"
              style="color: #40a9ff; padding: 0 6px; cursor: pointer"
              >操作指引</span
            >的模板
          </p>
          <!-- <a-select
          placeholder="选择建议模版"
          :showSearch="true"
          style="width: 40%"
          :options="suggestOptions"
          v-model:value="suggestVal"
          @change="handleChange(2)"
        >
          <template #suffixIcon><SearchOutlined /></template>
        </a-select> -->
          <a-button type="link" @click="() => submit()">保存</a-button>
        </a-row>
        <a-textarea
          :auto-size="{ minRows: 4 }"
          :showCount="true"
          :maxlength="300"
          :disabled="readonly"
          v-model:value="suggestRes"
          placeholder="请输入修改建议"
          @change="editSuggest"
        ></a-textarea>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import _ from 'lodash';
import { ref, reactive, inject, watch, computed, onMounted } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { getTrademarkPassRateList, saveTrademarkRecordReport } from '@/api/workOrder/intellectualProperty/trademark';
import { message } from 'ant-design-vue';
import router from '@/router';
import { nextTick } from 'vue';
import { jumpPage } from '@/utils/utils';

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  detail: {
    type: Object,
    default: () => null,
  },
  hideVal: {
    type: Boolean,
    default: false,
  },
});
const data = reactive({
  nowStep: inject('nowStep') as number,
  reportInfo: inject('reportInfo') as any,
  recordId: inject('recordId') as string,
  reportId: inject('reportId') as any,
  notifySubmit: inject('notifySubmit') as number,
  showTips: inject('showTips') as boolean,
  recordNo: inject('recordNo') as string,
  isAddThird: inject('isAddThird') as boolean,
  isViewReport: inject('isViewReport') as boolean,
  indexLoading: inject('indexLoading') as boolean,
  nextClick: inject('nextClick') as boolean,
});

const conclusionText = computed<any>(() => {
  if (props.detail) {
    return {
      mean: props.detail.meaningCheckResult || '',
      similar: props.detail.likeCheckResult || '',
    };
  } else {
    return '';
  }
});
const checkPassRate = ref(''); // 通过率
const checkPassRateRes = ref(''); // 检索结果
const checkPassRateOptions = ref<any>([]); // 通过率下拉选项
const suggestVal = ref(''); // 建议模板 下拉值
const suggestRes = ref(''); // 用户建议
const suggestOptions = ref<any>([]);
watch(
  () => props.detail,
  () => {
    if (props.detail) {
      checkPassRate.value = props.detail.checkPassRate;
      checkPassRateRes.value = props.detail.checkResult;
      suggestRes.value = props.detail.editSuggest;
    }
  },
  { deep: true, immediate: true }
);
watch(
  () => data.nowStep,
  () => {
    if (+data.nowStep === 2) {
      data.nextClick = false;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);
onMounted(async () => {
  await nextTick();
  getData();
});
const subType = ref('save');
/**
 *
 * @param type 1 通过率 2 修改建议
 */
const handleChange = (type: 1 | 2) => {
  if (type === 1) {
    checkPassRateRes.value = checkPassRateOptions.value.filter(
      (item: any) => item.value === checkPassRate.value
    )[0].checkResult;
  } else {
    suggestRes.value = suggestOptions.value.filter((item: any) => item.value === suggestVal.value)[0].editSuggest;
  }
  save();
};

const params = computed(() => {
  const checkConclusionStr = {
    mean: conclusionText.value.mean,
    similar: conclusionText.value.similar,
  };
  return {
    checkPassRate: checkPassRate.value, // 通过率
    checkConclusion: JSON.stringify(checkConclusionStr), // 检索结论
    checkResult: checkPassRateRes.value, // 检索结果
    editSuggest: suggestRes.value, // 修改建议
    recordId: data.recordId,
    type: subType.value,
    curStep: 3,
    id: data.reportId,
  };
});
const isAddThird = inject('isAddThird') as boolean;
const save = (type = 'save', showTips = true) => {
  subType.value = type;
  saveTrademarkRecordReport(params.value).then(() => {
    if (!data.isAddThird && showTips) {
      message.success(type === 'save' ? '保存成功' : '操作成功');
    }
    if (type === 'submit') {
      jumpPage(
        `/workOrder/intellectualProperty/TrademarkNameReviewRecord/details?id=${data.recordId}&recordNo=${data.recordNo}`
      );
    }
  });
};
const editSuggest = _.debounce(() => {
  if (!data.nextClick) {
    subType.value = 'save';
    console.log('触发输入保存', subType.value);
    save('save', false);
  }
}, 15000);
const submit = (type = 'submit') => {
  return new Promise((resolve, reject) => {
    if (!checkPassRate.value) {
      reject();
      return message.error('通过率不能为空');
    }
    if (!suggestRes.value) {
      reject();
      return message.error('建议内容不能为空');
    }
    resolve(save(type));
  });
};
const getData = async () => {
  const rateRes = await getTrademarkPassRateList(1);
  if (rateRes.length) {
    checkPassRateOptions.value = rateRes.map((item: any) => {
      return {
        value: item.checkPassRate || '暂无数据',
        label: item.checkPassRate || '暂无数据',
        checkResult: item.checkResult,
      };
    });
  }
  const suggesRes = await getTrademarkPassRateList(2);
  if (suggesRes.length) {
    suggestOptions.value = suggesRes.map((item: any) => {
      return {
        value: item.id,
        label: item.editSuggest || '暂无数据',
        editSuggest: item.editSuggest,
      };
    });
  }
};
defineExpose({
  save,
  submit,
  subType,
});
</script>
<style lang="less" scoped>
.result-panel {
  padding: 20px;
  h5 {
    font-size: 16px;
    margin-bottom: 10px;
  }
  &-item {
    margin-bottom: 20px;
    .result-text {
      min-height: 200px;
      background: #eee;
      padding: 20px;
      margin-bottom: 10px;
      &-item {
        margin-bottom: 20px;
        h6 {
          font-size: 15px;
        }
        p {
          color: #999;
        }
      }
    }
    .tips {
      color: #999;
    }
  }
}
</style>
