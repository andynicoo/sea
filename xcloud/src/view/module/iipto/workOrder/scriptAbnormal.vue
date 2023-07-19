<template>
  <div>
    <Card>
      <p class="title">数据筛选</p>
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem style="margin-bottom:0">
          <Input v-model="searchForm.acceptNum"
                 clearable
                 placeholder="受理号"
                 style="width:200px;" />
        </FormItem>
        <FormItem style="margin-bottom:0">
          <Select clearable
                  v-model="searchForm.country"
                  placeholder="国家">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-bottom:0">
          <Input v-model="searchForm.operationType"
                 clearable
                 placeholder="操作类型"
                 style="width:200px;" />
        </FormItem>
        <FormItem style="margin-bottom:0">
          <DatePicker type="daterange"
                      placeholder="选择操作时间"
                      v-model="searchForm.updateTime"
                      @on-change="changeUpdateDate"
                      style="width:180px;"></DatePicker>
        </FormItem>
        <FormItem style="margin-bottom:0">
          <Button type="primary"
                  @click="searchList(1)"
                  style="margin: 0 12px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card style="margin-top:15px;">
      <p class="title">数据列表</p>
      <div class="tableArea">
        <Table border
               :loading="tableLoading"
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
      </div>
    </Card>
  </div>
</template>
<script>
import { scriptErrorListApi } from '@/api/iipto/workOrder'
export default {
  data() {
    return {
      countryList: [
        { countryNameZh: "美国", countryCode: "US" },
        { countryNameZh: "欧盟", countryCode: "EU" },
        { countryNameZh: "日本", countryCode: "JP" },
        { countryNameZh: "英国", countryCode: "GB" },
        { countryNameZh: "加拿大", countryCode: "CA" },
      ],
      searchForm: {},
      tableLoading: false,
      pageInfo: {
        page: 1,
        limit: 10,
        total: 0
      },
      tableData: [],
      columns: [
        {
          title: '序号',
          width: 70,
          align: 'center',
          render(h, params) {
            return h('span', params.row._index + 1)
          },
        },
        {
          title: '操作类型',
          key: 'operationType'
        },
        {
          title: '服务名称',
          key: 'serviceName'
        },
        {
          title: '受理号',
          key: 'acceptNum'
        },
        {
          title: '操作时间',
          key: 'updateTime'
        },
        {
          title: '异常描述',
          key: 'exceptionDesc'
        },
        {
          title: '结果',
          key: 'resultDesc'
        },
      ]
    }
  },
  mounted() {
    this.searchList(1)
  },
  methods: {
    changeUpdateDate(date) {
      this.searchForm.endDate = date[1]
      this.searchForm.startDate = date[0]
    },
    searchList(page) {
      if (page) {
        this.pageInfo.page = page
      }
      let data = { ...this.searchForm }
      delete data.updateTime
      data.page = this.pageInfo.page
      data.limit = this.pageInfo.limit
      scriptErrorListApi(data).then(res => {
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
    resetList() {
      this.searchForm = {};
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
<style lang="less" scoped>
.title {
  padding: 0 10px 10px 10px;
}
</style>
