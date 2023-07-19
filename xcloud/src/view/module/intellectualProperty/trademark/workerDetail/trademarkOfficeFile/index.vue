<!-- 商标工单详情-商标局信息 -->
<template>
  <div class="content">
    <el-table
      ref="table"
      border 
      :data="trademarkOfficeFileList"
      >
        <el-table-column align="center" label="创建日期" prop="Create_Mail_Date" width="160"></el-table-column>
        <el-table-column align="center" label="文件" prop="Document_Description">
          <template slot-scope="{ row }">
            <a class="file-link" :href="row.Document_Description_href" target="_blank">{{ row.Document_Description }}</a>            
          </template>
        </el-table-column>
      <Empty slot="empty" />
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TrademarkOfficeInfo',
  props: {
    trademarkOfficeFileList:{
      type: Array
    }
  },
  data() {
    return { }
  },
  methods: {

  }
}
</script>
<style lang="less" scoped>
  .content{
    padding:20px 0 0;
    .file-link{
      color: #00a3ff;
    }
  }
</style>
