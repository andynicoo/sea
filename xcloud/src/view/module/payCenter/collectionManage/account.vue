<template>
  <div class="payAdmin">
    <Card>
      <Form ref="searchForm" :model="searchForm" :label-width="60" inline>
        <FormItem label="收款账号" prop="actNo">
          <Input clearable v-model="searchForm.actNo" placeholder="请输入收款账号" />
        </FormItem>
        <FormItem label="手机号" prop="mobile">
          <Input clearable v-model="searchForm.mobile" placeholder="请输入手机号" />
        </FormItem>
        <FormItem label="主体名称" prop="subjectName">
          <!-- <Input clearable v-model="searchForm.subjectName" placeholder="请输入主体名称" /> -->
          <el-select style="width: 168px" v-model="searchForm.paySubjectIds" placeholder="请选择公司主体" clearable multiple filterable>
            <el-option :value="-1" label="全部"></el-option>
            <el-option v-for="item in firmList" :value="item.paySubjectId" :key="item.paySubjectId" :label="item.subjectName" :disabled="searchForm.paySubjectIds.includes(-1)"></el-option>
          </el-select>
        </FormItem>
        <!-- <FormItem label="创建时间">
          <DatePicker type="datetimerange" :options="dateOptions" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择创建时间" style="width: 280px" clearable :value="createTime" @on-change="changeCreateTime"></DatePicker>
        </FormItem> -->
        <Button type="primary" @click="searchList">查询</Button>
        <Button @click="clearHandler" type="primary" ghost>重置</Button>
        <Button type="primary" :loading="asyncAllLoading" @click="synchronizeAll" v-show="hasAuthority('payment_addpro')">同步</Button>
      </Form>
      <Table border :columns="columns" :data="data" :loading="loadTable">
        <template slot="mobile" slot-scope="{ row }">
          <span v-hidden>{{ row.mobile }}</span>
        </template>
        <template slot="entryModel" slot-scope="{ row }">
          {{ entryModelMap[row.entryModel] }}
        </template>
        <template slot="status" slot-scope="{ row }">
          {{ statusMap[row.status] }}
          <template v-if="row.status === 'FAIL' && !!row.reason">
            <Tooltip placement="top" :content="`失败原因：${row.reason}`">
              <i class="el-icon-warning"></i>
            </Tooltip>
          </template>
        </template>
        <template slot="action" slot-scope="{ row }" v-if="!!row.actNo">
          <Button type="primary" ghost @click="synchronize(row)" v-show="hasAuthority('sync_receive_payment')">同步</Button>
        </template>
      </Table>
      <Page :total="pageInfo.total" show-elevator show-sizer transfer :current="pageInfo.page" :page-size="pageInfo.size" show-total @on-change="handlePage" @on-page-size-change="handlePageSize" />
    </Card>
  </div>
</template>
<script>
import { getReceivePaymentList, synchronizeReceivePayment, synchronizeReceivePaymentAll, getPayMainList } from '@/api/payCenter';
export default {
  data() {
    return {
      dateOptions: {
        shortcuts: [
          {
            text: '近一周',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              return [start, end];
            },
          },
          {
            text: '近一个月',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              return [start, end];
            },
          },
          {
            text: '近三个月',
            value() {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              return [start, end];
            },
          },
        ],
      },
      loadTable: false,
      createTime: '',
      entryModelMap: {
        HANG: '挂账',
        DIRECT: '直接入账',
      },
      statusMap: {
        NORMAL: '正常',
        CANCEL: '注销',
        INIT: '申请中',
        FAIL: '开户失败',
      },
      columns: [
        {
          title: 'ID',
          key: 'actId',
          width: 140,
        },
        {
          title: '手机号',
          key: 'mobile',
          slot: 'mobile',
          width: 110,
        },
        {
          title: '客户名称',
          key: 'customerName',
          width: 200,
        },
        {
          title: '主体名称',
          key: 'subjectName',
          width: 200,
        },
        {
          title: '收款账号',
          key: 'actNo',
          width: 150,
        },
        {
          title: '余额',
          key: 'balance',
          width: 150,
        },
        {
          title: '入账模式',
          key: 'entryModel',
          slot: 'entryModel',
          width: 150,
        },
        {
          title: '支付渠道',
          key: 'payChannelName',
          width: 150,
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status',
          width: 150,
        },
        {
          title: '创建开通时间',
          key: 'createdTime',
          sortable: true,
          minWidth: 150,
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 100,
          fixed: 'right',
        },
      ],
      data: [],
      searchForm: {
        paySubjectIds: [-1],
      },
      pageInfo: {
        total: 0,
        current: 1,
        size: 10,
      },
      firmList: [],
      asyncAllLoading: false, // 顶部同步loading
    };
  },
  watch: {
    'searchForm.paySubjectIds': function(newV, oldV ) {
      let entLength= this.firmList.length;
      // 选中全部，取消其他显示
      if (newV.includes(-1) && newV.length !== 1) {
        this.modifyEnterpriseIdList([-1]);
      }
      // 选中全部其他，转为全部
      if(newV.length===entLength&&!newV.includes(-1)){
        this.modifyEnterpriseIdList([-1]);
      }
    }
  },
  methods: {
    modifyEnterpriseIdList(val) {
      this.searchForm.paySubjectIds = val;
    },
    getList() {
      this.loadTable = true;
      let obj = this.searchForm;
      let data = { ...this.pageInfo, ...obj };
      getReceivePaymentList(data)
        .then(
          (res) => {
            if (res.code == 0) {
              this.pageInfo.total = parseInt(res.data.total);
              this.data = res.data.records;
              this.loadTable = false;
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    // 创建时间
    changeCreateTime(time) {
      // 结束时时分秒是 00:00:00 则改为23:59:59
      let endTime = time[1];
      if (endTime.includes('00:00:00')) {
        endTime = endTime.replace('00:00:00', '23:59:59');
      }
      const dateTime = [time[0], endTime];
      this.searchForm.startTime = dateTime[0];
      this.searchForm.endTime = dateTime[1];
      this.createTime = dateTime;
    },
    searchList() {
      this.pageInfo.current = 1;
      this.getList();
    },
    clearHandler() {
      this.pageInfo.current = 1;
      this.searchForm = {
        paySubjectIds: [-1],
      };
      this.createTime = '';
      this.getList();
    },
    // 分页
    handlePage(current) {
      this.pageInfo.current = current;
      this.handleSearch();
    },
    handlePageSize(size) {
      this.pageInfo.size = size;
      this.handleSearch();
    },
    handleSearch(page) {
      if (page) {
        this.pageInfo.current = page;
      }
      this.loading = true;
      this.getList();
    },
    // 同步
    synchronize(data) {
      synchronizeReceivePayment({
        payReceivePaymentId: data.payReceivePaymentId,
      })
        .then(
          (res) => {
            if (res.code == 0) {
              this.$Message.success('同步成功');
              this.getList();
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    // 同步全部
    async synchronizeAll() {
      this.asyncAllLoading= true;
      await synchronizeReceivePaymentAll()
        .then(
          (res) => {
            if (res.code == 0) {
              this.$Message.success('同步成功');
              this.getList();
              this.asyncAllLoading= false;
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    /**
     * 获取企业列表
     */
    getFirmList() {
      let data={
        total: 200,
        current: 1,
        size: 200,
        paySubjectIds: [-1]
      }
      getPayMainList(data)
        .then(
          (res) => {
            if (res.code == 0) {
              this.firmList = res.data.records;
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
  },
  mounted() {
    this.getList();
    this.getFirmList();
  },
};
</script>
<style lang="less">
.payAdmin {
  .ivu-form,
  .ivu-row-flex {
    button {
      margin-right: 10px;
    }
  }
  .ivu-row {
    margin: 10px;
  }
  .ivu-table-wrapper {
    margin-top: 10px;
    button {
      margin-right: 10px;
    }
    .spanHd {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        margin-right: 5px;
      }
    }
  }
}
.ivu-modal-footer {
  text-align: center;
  .footerBt {
    width: 150px;
    height: 40px;
    font-size: 15px;
  }
}
</style>
