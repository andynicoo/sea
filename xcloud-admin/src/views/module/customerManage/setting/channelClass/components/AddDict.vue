<template>
  <a-modal
    :title="code === 'leadSourceLarge' ? '新增大类' : '新增小类'"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 3 }" :wrapper-col="{ span: 20 }">
        <a-form-item
          label="名称"
          name="dictValueStr"
          :rules="[{ required: true, message: '请输入名称，以空格或换行隔开' }]"
        >
          <a-textarea
            v-model:value="formModal.dictValueStr"
            :rows="6"
            placeholder="请输入名称，以空格或换行隔开"
            @change="changeVal"
          />
        </a-form-item>
      </a-form>

      <div class="label-list">
        <div class="label-li" v-for="(li, index) of paramsArr" :key="index">{{ li.dictValue }}</div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { insertDictList } from '@/api/customerManage/channelClass';

//传入参数
const props = defineProps({
  code: {
    default: 'leadSourceLarge',
    type: String,
  },
});

const emit = defineEmits(['submit']);
const showModal = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>();
const formModal: any = ref({});
const paramsArr: any = ref([]);

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      paramsArr.value = [];
      formModal.value = {
        dictValueStr: null,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
  }
});

//提交
const submit = () => {
  ruleFormRef.value?.validate().then(() => {
    if (paramsArr.value.length === 0) {
      message.error('请添加类别');
      return false;
    }
    insertDictList(paramsArr.value).then((res: any) => {
      showModal.value = false;
      message.success('操作成功');
      emit('submit');
    });
  });
};

//输入改变
const changeVal = () => {
  paramsArr.value = [];
  let str = formModal.value.dictValueStr;
  str = str.replace(/(\r\n)|\r|\n/g, ' ');
  for (const li of str.split(' ')) {
    if (li.replace(/^\s*|\s*$/g, '')) {
      paramsArr.value.push({
        code: props.code,
        dictValue: li,
      });
    }
  }
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 56vh;
  overflow-y: auto;
  padding: 0 10px;
  .label-list {
    .label-li {
      float: left;
      padding: 2px 8px;
      margin-right: 12px;
      margin-bottom: 8px;
      border-radius: 4px;
      border: 1px solid #ccc;
    }
  }
}
</style>
