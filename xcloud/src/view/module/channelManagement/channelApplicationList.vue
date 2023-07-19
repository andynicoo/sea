<template>
  <div class="invoiceList">
    <div class="mainPage"
         v-if="!isDetailShow">
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem label="申请时间"
                  :label-width="80">
          <DatePicker type="date"
                      @on-change="startDate"
                      placeholder="开始日期"
                      style="width: 200px"></DatePicker>
          <span style="padding:0px 10px;">
            至
          </span>
          <DatePicker type="date"
                      @on-change="endDate"
                      placeholder="结束日期"
                      style="width: 200px"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary"
                  @click="searchList"
                  style="margin-right:5px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tableArea">
        <form-components @getList="getList"
                         :tableLoading="tableLoading"
                         :tableData="tableData"
                         :columns="columns"
                         :listTotal="listTotal">
        </form-components>
      </div>
      <!-- <Modal v-model="fdfd"
             title="Title"
             :loading="loading"
             @on-ok="isAdoptOK">
        <p>确定审核通过该评论吗？</p>
      </Modal> -->
    </div>
  </div>
</template>
<script>
import * as API from '@/api/taxService/adv.js';
import formComponents from "./components/formComponents";
export default {
  name: 'orderList',
  data() {
    return {
      isDetailShow: false,
      advModal: false,
      modalName: '',
      searchForm: {
        startDate: '',
        endDate: '',
        advertiseName: '',
        channelType: ''
      },
      date: '',
      pageInfo: {
        limit: 5,
        page: 1,
      },
      listTotal: 0,
      tableLoading: false,
      columns: [
        {
          title: '序号',
          type: 'index',
          width: 80
        },
        {
          title: '姓名',
          key: 'advertiseName',
          minWidth: 50,
        },
        {
          title: '联系电话',
          key: 'advertiseUrl'
        },
        {
          title: '公司名称',
          key: 'channelType'
        },
        {
          title: '申请时间',
          key: 'advertiseStatus'
        },
        // {
        //   title: '操作',
        //   key: 'operate',
        //   render: (h, params) => {
        //     return h('div', [
        //       h('span', {
        //         style: {
        //           cursor: 'pointer'
        //         },
        //         on: { click: this.detailShow }
        //       }, '【详情】')
        //     ])
        //   }
        // }
      ],
      tableData: [],
      id: '',
    }
  },
  mounted() {
    this.getAdvList();
  },
  components: {
    formComponents
  },
  methods: {
    startDate(val) {
      this.searchForm.startDate = val
    },
    endDate(val) {
      this.searchForm.endDate = val
    },
    getList(pageInfo) {
      this.pageInfo = pageInfo
      this.getAdvList()
    },
    detailShow() {

    },
    //获取列表
    getAdvList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo };
      API.getAdvList(params).then((res) => {
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
    //搜索列表
    searchList() {
      this.pageInfo.page = 1;
      this.getAdvList()
    },
    //重置列表
    resetList() {
      this.searchForm = {
        advertiseName: '',
        channelType: ''
      };
      this.date = "";
      this.pageInfo.page = 1;
      this.getAdvList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page
      this.getAdvList()
    },
  }
}
</script>
<style lang="less" scoped>
.invoiceList {
  background: #ffffff;
  height: 100vh;
  padding: 20px;
  .tableArea {
    .operateBtn {
      cursor: pointer;
    }
  }
}
</style>