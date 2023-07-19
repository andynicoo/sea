<template>
  <Card>
    <Table border
           :columns="columns"
           :data="tableData">
    </Table>
    <Page @on-change="changePageHandler"
          @on-page-size-change="handlePageSize"
          :current="pageInfo.page"
          :total="pageInfo.total"
          :page-size="pageInfo.limit"
          show-total
          show-elevator
          show-sizer />
  </Card>
</template>
<script>
import { workOrderMessageListApi } from '@/api/iipto/workOrder'
export default {
  data() {
    return {
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0
      },
      columns: [
        {
          title: '消息内容',
          key: 'content'
        },
        {
          title: '创建时间',
          key: 'createTime'
        },
      ],
      tableData: [],

    }
  },
  mounted() {
    this.searchList()
  },
  methods: {
    searchList(page) {
      let data = { ...this.pageInfo }
      workOrderMessageListApi(data).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.records
          this.pageInfo = {
            page: Number(res.data.current),
            total: Number(res.data.total),
            limit: Number(res.data.size)
          }
        }
      })
    },
    changePageHandler(page) {
      this.pageInfo.page = page
      this.searchList()
    },
    handlePageSize(pageSize) {
      this.pageInfo.limit = pageSize
      this.searchList(1)
    },
  },
}
</script>
