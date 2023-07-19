<template>
  <a-modal
    title="手动推送"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    :confirmLoading="confirmLoading"
    @ok="submit"
  >
    <div class="wrap">
      <div class="wrap-tips">注：未处理线索推送至励销云；商机推送至销售易</div>
      <div class="select-tips">
        <p>共选中 【 {{ selectedRowKeys.length }} 】 条数据</p>
        <p>【 {{ data.num1 }} 】 条推送至励销云</p>
        <!-- <p>【 {{ data.num2 }} 】 条推送至销售易</p> -->
        <p>【 {{ data.num3 }} 】 条无需处理</p>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { customerLeadPushLxy } from '@/api/customerManage/clueCenter';

const props = defineProps({
  selectedRowKeys: {
    default: [],
    type: Array<any>,
  },
});
const emit = defineEmits(['submit']);

const data: any = reactive({
  num1: 0,
  num2: 0,
  num3: 0,
});

const confirmLoading = ref(false);
const showModal = ref(false);
watch(showModal, newVal => {
  if (newVal) {
    data.num1 = 0;
    data.num2 = 0;
    data.num3 = 0;
    for (const li of props.selectedRowKeys) {
      if (li.mobile && li.leadFollowStatus === 1 && li.lxyStatus === 1) {
        data.num1++;
      } else if (li.mobile && li.leadFollowStatus === 5) {
        data.num2++;
      } else {
        data.num3++;
      }
    }
  }
});

//提交
const submit = () => {
  confirmLoading.value = true;
  customerLeadPushLxy({
    ids: props.selectedRowKeys.map((v: any) => v.customerLeadId),
  }).then((res: any) => {
    confirmLoading.value = false;
    message.success('操作成功');
    showModal.value = false;
    emit('submit');
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 10px 20px;
  .wrap-tips {
    color: #999;
    margin-bottom: 10px;
  }
  .select-tips {
    margin-bottom: 10px;
    p {
      font-size: 16px;
      line-height: 30px;
      margin: 0;
    }
  }
}
</style>
