<template>
  <div class="cell-wrap">
    <div class="cell-table">
      <a-table
        :dataSource="fileList"
        bordered
        :pagination="false"
        :locale="{ emptyText: '暂无文件，请先上传后再查看' }"
      >
        <a-table-column width="60px" title="序号" #default="{ index }">
          {{ index + 1 }}
        </a-table-column>
        <a-table-column width="200px" title="文件" #default="{ record }">
          <FileLink :style="{ maxWidth: '300px' }" :fileUrl="record.answerFile" />
        </a-table-column>
        <a-table-column width="150px" title="备注" #default="{ record }">
          {{ record.remark || '答复审核意见' }}
        </a-table-column>
        <a-table-column width="150px" title="上传时间" #default="{ record }">
          <div>{{ (record.answerDate || '').slice(0, 10) || '无' }}</div>
        </a-table-column>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import FileLink from '@/components/assembly/FileLink.vue';

defineProps({
  fileList: {
    type: Array<any>,
    default: () => [],
  },
});
</script>

<style scoped lang="less">
.cell-wrap {
  margin-bottom: 20px;
  .cell-table {
    padding: 5px 10px;
  }
}
</style>
