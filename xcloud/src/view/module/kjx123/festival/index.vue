<template>
  <div class="content">
    <Form ref="searchForm"
          :model="searchForm"
          inline>
      <FormItem>
        <Input v-model="searchForm.festivalName"
               clearable
               placeholder="请输入节日名称"
               style="width:200px;" />
      </FormItem>
      <FormItem>
        <DatePicker type="year"
                    placeholder="选择年份"
                    v-model="searchForm.festivalYear"
                    style="width: 200px"></DatePicker>
      </FormItem>
      <FormItem>
        <Button type="primary"
                @click="getList(1)"
                style="margin-right:5px;">查询</Button>
        <!-- <Button type="primary"
                ghost
                @click="resetList">重置</Button> -->
      </FormItem>
      <Button type="primary"
              style="float:right;margin-right:20px;"
              @click="festivalModal=true">新增节日</Button>
    </Form>
    <div class="tableArea">
      <Table border
             :loading="tableLoading"
             :columns="columns"
             :data="tableData">
        <template slot="operate"
                  slot-scope="{ row }">
          <div class="operation">
            <Button type="info"
                    ghost
                    @click="goEditor(row)"
                    style="margin-right:8px;">编辑</Button>
            <Button type="info"
                    ghost
                    @click="deleteFestival(row)">删除</Button>
          </div>
        </template>
      </Table>
      <Page @on-change="changePageHandler"
            :current="pageInfo.pageIndex"
            :total="listTotal"
            :pageIndex-size="pageInfo.pageSize"
            show-total
            show-elevator />
    </div>
    <Modal v-model="festivalModal"
           title="新增节日"
           footer-hide>
      <Form ref="searchForm"
            :model="addFrom"
            :label-width="100">
        <FormItem label="年份："
                  prop="festivalYear">
          <DatePicker type="year"
                      placeholder="选择年份"
                      v-model="addFrom.festivalYear"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem label="节日名称："
                  prop="festivalName">
          <Input v-model="addFrom.festivalName"
                 :maxlength="70"
                 style="width:200px"></Input>
        </FormItem>
        <FormItem label="节日时间："
                  prop="festivalTime">
          <DatePicker type="date"
                      v-model="addFrom.festivalTime"
                      placeholder="选择节日时间"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="submitFrom"
                  style="margin-right:5px;">确定</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import * as API from '@/api/kj123/festival.js';
export default {
  data() {
    return {
      tableLoading: false,
      festivalModal: false,
      searchForm: {
        festivalName: '',
        festivalYear: ''
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 10
      },
      listTotal: 10,
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 66
        },
        {
          title: '年份',
          key: 'festivalYear',
        },
        {
          title: '节日名称',
          key: 'festivalName',
        },
        {
          title: '节日时间',
          key: 'festivalTime',
        },
        {
          title: '操作',
          slot: 'operate',
          width: 170
        },
      ],
      tableData: [{}],
      addFrom: {
        festivalName: "",
        festivalTime: "",
        festivalYear: '',
        id: ''
      }
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取列表
    getList(page) {
      this.tableLoading = true;
      if (page) {
        this.pageInfo.pageIndex = page
      }
      let params = { ...this.searchForm, ...this.pageInfo };
      params.festivalYear = this.formatDate(this.searchForm.festivalYear, 'year')
      API.festivalListAPI(params).then((res) => {
        if (res.code == 0) {
          this.tableLoading = false;
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$Message.warning(res.message);
          this.tableLoading = false
        }
      })
        .catch((err) => console.log(err))
    },
    submitFrom() {
      let data = { ...this.addFrom }
      data.festivalTime = this.formatDate(this.addFrom.festivalTime, 'all')
      data.festivalYear = this.formatDate(this.addFrom.festivalYear, 'year')
      API.addOrUpdatefestivalAPI(data).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.getList()
          this.festivalModal = false
          this.addFrom = {
            festivalName: "",
            festivalTime: "",
            festivalYear: '',
            id: ''
          }
        }
      })
    },
    //时间格式转换
    formatDate(date, type) {
      if (typeof date === 'object') {
        const y = date.getFullYear()
        let m = date.getMonth() + 1
        m = m < 10 ? '0' + m : m
        let d = date.getDate()
        d = d < 10 ? '0' + d : d
        if (type == 'all') {
          return y + '-' + m + '-' + d + ' 00:00:00'
        } else if (type == 'year') {
          return y
        }

      } else {
        return date
      }
    },
    resetList() { },
    goEditor(row) {
      this.addFrom = { ...row }
      this.addFrom.festivalYear = String(row.festivalYear)
      this.festivalModal = true
    },
    changePageHandler(page) {
      this.pageInfo.pageIndex = page
      this.getList()
    },
    //删除节日
    deleteFestival(row) {
      let self = this
      this.$Modal.confirm({
        title: '确认删除？',
        onOk() {
          API.delectfestivalAPI({ id: row.id }).then(res => {
            if (res.code === 0) {
              self.getList()
              this.$Message.success('删除成功')
            }
          })
        }
      })
    }
  },
}
</script>
<style lang="less" scoped>
.content {
  padding: 20px;
}
</style>