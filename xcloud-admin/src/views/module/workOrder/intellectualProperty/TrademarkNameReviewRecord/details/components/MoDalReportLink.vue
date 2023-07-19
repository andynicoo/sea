<template>
  <a-modal v-model:visible="visible" title="生成报告链接" @cancel="close" width="600px">
    <template v-if="!hasReportLink">
      <p style="margin-bottom: 10px">
        生成报告链接后，核名记录状态将变为「待确认」，且不能提交复核， 您需复制报告链接并发送给客户确认。
      </p>
      <p>是否继续生成报告链接？</p>
    </template>
    <template v-else>
      <p style="margin-bottom: 10px">报告链接已生成，请告知用户注册手机{{ detail?.userMobile }}验证后查看。</p>
      <a-button type="primary" @click="textCopy(allReport.lastLinkUrl), close()">复制报告链接</a-button>
    </template>

    <template #footer>
      <a-button @click="close" v-if="hasReportLink">关闭</a-button>
      <template v-else>
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="getReportLink">生成报告链接</a-button>
      </template>
    </template>
  </a-modal>
</template>
<script lang="ts" setup>
import { ref, inject } from 'vue';
import { textCopy } from '@/utils/utils';
import { createTrademarkReportLink } from '@/api/workOrder/intellectualProperty/trademark';
import { message } from 'ant-design-vue';

interface Emits {
  (e: 'close'): void;
  (e: 'update'): void;
}
const emit = defineEmits<Emits>();
const visible = ref(true);
const close = () => {
  emit('close');
};
const hasReportLink = inject('hasReportLink');
const detail = inject('detail') as any;
const allReport = inject('allReport') as any;
const getReportLink = async () => {
  const res = await createTrademarkReportLink(allReport.value.id);
  message.success('操作成功');
  close();
  emit('update');
};
</script>
