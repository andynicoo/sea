<template>
  <a-modal
    title="批量修改ID标识"
    width="500px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submitConfirm"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="当前ID标识"> {{ data.unionIdShowList.join('、') }} </a-form-item>
        <a-form-item
          label="需修改的ID标识"
          name="unionId"
          :rules="[{ required: true, message: '请选择需修改的ID标识' }]"
        >
          <a-select
            v-model:value="formModal.unionId"
            placeholder="请选择"
            allowClear
            showSearch
            optionFilterProp="label"
            style="width: 230px"
          >
            <a-select-option v-for="(li, index) of data.selectList" :key="index" :value="li" :label="li">
              {{ li }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { nextTick, reactive, ref, watch } from 'vue';
import { message, type FormInstance } from 'ant-design-vue';
import { selectAllUnionId, manualBind } from '@/api/customerManage/customerCenter';

const props = defineProps({
  selectedRowKeys: {
    default: [],
  },
});
const emit = defineEmits(['submit']);

const data: any = reactive({
  unionIdShowList: [],
  selectList: [], //下拉列表
});
const showModal = ref(false);
const formModal: any = ref({});
watch(showModal, newVal => {
  if (newVal) {
    selectAllUnionIdFun();
    nextTick(() => {
      data.unionIdShowList = [];
      props.selectedRowKeys.filter((v: { unionId: string }) => {
        if (v.unionId) {
          data.unionIdShowList.push(v.unionId);
        }
      });
      formModal.value = {
        userIdList: props.selectedRowKeys.map((v: { userId: string }) => v.userId),
        unionId: null,
      };
    });
  } else {
    // ruleFormRef.value?.resetFields();
    // data.unionIdShowList = [];
  }
});

//提交
const ruleFormRef = ref<FormInstance>();
const submitConfirm = () => {
  ruleFormRef.value?.validate().then(() => {
    manualBind(formModal.value).then((res: any) => {
      message.success('操作成功');
      showModal.value = false;
      emit('submit');
    });
  });
};

//获取 列表
const selectAllUnionIdFun = () => {
  selectAllUnionId().then((res: any) => {
    data.selectList = res || [];
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  padding: 20px 0;
}
</style>
