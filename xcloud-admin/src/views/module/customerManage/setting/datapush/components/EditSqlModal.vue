<template>
  <a-modal
    title="请输入SQL语句"
    width="600px"
    v-model:visible="showModal"
    :maskClosable="false"
    :keyboard="false"
    @ok="submit"
  >
    <div class="wrap">
      <a-form ref="ruleFormRef" :model="formModal" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <div class="form-tips">
          <a-tooltip placement="bottom">
            <template #title>
              1.姓名：必填字段<br />
              2.手机号：必填字段，重复手机号无法导入<br />
              3.线索来源：此字段请联系对应申请人或外呼经理，在外呼平台先行创建<br />
              4.跟进状态：默认传"未处理"<br />
              5.不能出现"删除"、"更新"语句<br />
            </template>
            <QuestionCircleOutlined />
          </a-tooltip>
          必填字段说明
        </div>
        <a-form-item label="SQL语句" name="sqlStr" :rules="[{ required: true, message: '请输入SQL语句' }]">
          <a-textarea v-model:value="formModal.sqlStr" :rows="6" placeholder="请输入SQL语句" />
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { editConfig } from '@/api/customerManage/datapush';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';

//传入参数
const props = defineProps({
  record: {
    default: () => null,
    type: Object,
  },
});

const emit = defineEmits(['submit']);

const showModal = ref<boolean>(false);
const ruleFormRef = ref<FormInstance>();
const formModal: any = ref({});

watch(showModal, newVal => {
  if (newVal) {
    nextTick(() => {
      formModal.value = {
        sqlStr: props.record.sqlStr || null,
      };
    });
  } else {
    ruleFormRef.value?.resetFields();
    formModal.value = {};
  }
});

//提交
const submit = () => {
  ruleFormRef.value?.validate().then(() => {
    editConfig({
      dataSqlTask: {
        ...formModal.value,
        sqlTaskId: props.record.sqlTaskId,
      },
    }).then((res: any) => {
      showModal.value = false;
      message.success('操作成功');
      emit('submit');
    });
  });
};

//暴露方法
defineExpose({ showModal });
</script>

<style scoped lang="less">
.wrap {
  max-height: 56vh;
  overflow-y: auto;
  padding: 0 10px;
  .form-tips {
    text-align: right;
    margin-bottom: 30px;
  }
}
</style>
