<template>
  <div>
    <BatchUploadTemplate :show.sync="dialogvisible" title="批量完成注册" templateUrl="/workorder/management/epr/batch/serviceTemplate" submitUrl="/workorder/management/epr/batch/complete" />
  </div>
</template>

<script>
import BatchUploadTemplate from '../../components/batchUploadTemplate';
import { eprBatchComplete } from '@/api/newApi/workOrder/EPRManage';

export default {
  props: ['show', 'refresh'],
  computed: {
    dialogvisible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      },
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
