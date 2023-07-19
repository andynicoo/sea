<template>
  <div class="cell-wrap">
    <form-create class="form-create" v-model="formModal" v-model:api="data.fApi" :rule="rule" :option="data.option" />

    <div class="btn-wrap">
      <a-space>
        <a-button type="primary" @click="preserve()">仅保存不提交</a-button>
        <a-button type="primary" @click="submit()" v-if="!editFlag">确认并提交</a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, shallowRef, watch } from 'vue';
import { toRuleData } from '@/utils/formCreateHandle';
import { getCountrySelectList } from '@/api/base/basicsData';
import { updateNodeAPI } from '@/api/workOrder/intellectualProperty/trademark';
import { message } from 'ant-design-vue';
import TrademarkClass from './form/TrademarkClass.vue';
import SalesLink from './form/SalesLink.vue';
import ImgList from './form/ImgList.vue';
import { jumpPage } from '@/utils/utils';

const props = defineProps({
  serviceInfo: {
    type: Object,
    default: null,
  },
  workflowColumns: {
    type: Array<any>,
    default: () => [],
  },
  editFlag: {
    type: Boolean,
    defalt: false,
  },
});

const data: any = reactive({
  fApi: null,
  option: {
    form: {
      labelWidth: '150px',
    },
    resetBtn: false,
    submitBtn: false,
    innerText: '取消',
    formData: {},
  },
});
const rule: any = ref([]);
const formModal = ref({});

watch(formModal, (newVal: any, oldVal: any) => {
  if (newVal.trademarkCategory !== oldVal.trademarkCategory) {
    for (const li of rule.value) {
      if (['marketHref', 'useProductImg', 'useEvidence'].includes(li.field) && newVal.trademarkCategory) {
        const list = JSON.parse(newVal.trademarkCategory);
        li.props.categoryList = list[0].listTrademarkCategory2;
      }
    }
  }
});

onMounted(() => {
  rule.value = toRuleData(props.workflowColumns, [
    {
      field: 'trademarkCategory',
      type: 'component',
      component: shallowRef(TrademarkClass),
      props: {
        count: props.serviceInfo.trademarkCategoryCount || 1,
        countryCode: props.serviceInfo.countryCode,
      },
    },
    {
      field: 'marketHref',
      type: 'component',
      component: shallowRef(SalesLink),
    },
    {
      field: 'useProductImg',
      type: 'component',
      component: shallowRef(ImgList),
    },
    {
      field: 'useEvidence',
      type: 'component',
      component: shallowRef(ImgList),
    },
    {
      field: 'companyAddressCountryEn',
      options: async () => {
        return ((await getCountrySelectList()) as any).map((v: { countryCode: string; countryNameZh: string }) => {
          return {
            value: v.countryCode,
            label: v.countryNameZh,
          };
        });
      },
      emitPrefix: 'prefix1',
    },
    {
      field: 'companyLegalPersonSign',
      hidden: true,
    },
  ]);
});

//保存
const preserve = () => {
  updateNodeAPI({
    isManager: true,
    serviceId: props.serviceInfo.serviceId,
    nodeCode: props.serviceInfo.nodeCode,
    json: formModal.value,
  }).then(() => {
    message.success('操作成功');
  });
};

//提交
const submit = () => {
  setTimeout(() => {
    data.fApi.submit((formData: any, fApi: any) => {
      updateNodeAPI({
        path: true,
        isManager: true,
        serviceId: props.serviceInfo.serviceId,
        nodeCode: props.serviceInfo.nodeCode,
        json: formModal.value,
      }).then(() => {
        message.success('操作成功');
        jumpPage('/workOrder/intellectualProperty/trademark');
      });
    });
  }, 60);
};
</script>

<style scoped lang="less">
.cell-wrap {
  margin-bottom: 20px;
  .cell-table {
    padding: 5px 10px;
  }
}
</style>
