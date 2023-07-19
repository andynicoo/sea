<template>
  <div>
    <BatchUploadTemplate :show.sync="dialogvisible" title="批量上传回执" templateUrl="/workorder/management/epr/batch/serviceTemplate" :submitUrl="submitUrl" accept=".zip,.rar">
      <template #step2>
        <h3 class="step-title">步骤2：准备批量上传的回执文件</h3>
        <p>
          <span>每个回执文件按要求命名</span>
        </p>
        <p>
          <span>回执文件命名格式：</span>
          <span class="text-primary">公司中文名称</span>
        </p>
      </template>
      <template #step3>
        <h3 class="step-title">步骤3：压缩以上步骤准备的文件，上传</h3>
        <p>
          <span>将编辑好的信息表和文件全选，生成1个压缩文件包上传</span>
        </p>
        <p class="text-danger">注意：</p>
        <p>压缩包仅限zip格式；</p>
        <p>压缩包内不能有文件夹；</p>
        <p>压缩包小于100M；</p>
      </template>
    </BatchUploadTemplate>
  </div>
</template>

<script>
import BatchUploadTemplate from '@/view/module/workOrder/components/batchUploadTemplate';
import { eprBatchComplete } from '@/api/newApi/workOrder/EPRManage';

export default {
  props: ['show', 'refresh', 'isPreDeclare'],
  computed: {
    dialogvisible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      },
    },
    submitUrl() {
      // EPR预申报
      return this.isPreDeclare ? '/workorder/management/epr/batch/preDeclare/receipt/upload' : '/workorder/management/epr/batch/declare/receipt/upload';
    },
  },
  data() {
    return {
      eprBatchComplete,
    };
  },
  components: { BatchUploadTemplate },
  methods: {},
};
</script>

<style></style>
