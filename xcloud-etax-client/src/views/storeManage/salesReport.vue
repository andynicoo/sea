<template>
  <div style="min-height: calc(100vh - 60px)">
    <div class="clearfix title_wait">
      <div class="commontitle">
        销售报告管理 <span @click="openTips()" class="tips"><a>自动获取销售报告教程</a></span>
      </div>
      <div class="content">
        <div class="flex title">
          <Form :model="formModal" :label-width="0" inline ref="formModal" style="width: 100%">
            <Row>
              <Col span="5">
                <FormItem label="服务号：" :label-width="90" label-position="left">
                  <Input v-model="formModal.serverNo" placeholder="请输入公司名称" style="width: 200px"></Input>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem label="站点：" :label-width="90" label-position="left">
                  <Select v-model="formModal.countryCode" clearable style="width: 150px" placeholder="站点">
                    <Option v-for="(li, index) of countryList" :key="index" :value="li.key">
                      {{ li.value }}
                    </Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem label="申报类型：" :label-width="90" label-position="left">
                  <Select v-model="formModal.declarePeriod" clearable style="width: 150px" placeholder="申报类型">
                    <Option value="0">月报</Option>
                    <Option value="1">季报</Option>
                    <Option value="2">年报</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem label="报告生成状态：" :label-width="110" label-position="left">
                  <Select v-model="formModal.status" clearable style="width: 150px" placeholder="报告生成状态">
                    <Option value="1">已生成</Option>
                    <Option value="2">部分生成</Option>
                    <Option value="3">生成失败</Option>
                  </Select>
                </FormItem>
              </Col>

              <Col span="4">
                <Form-item>
                  <Button type="primary" style="margin-left: 10px" icon="ios-search" @click="search" class="searchBtn">
                    搜索
                  </Button>
                  <Button @click="resetList" icon="ios-refresh" class="resetBtn">重置</Button>
                </Form-item>
              </Col>
            </Row>
          </Form>
        </div>
        <Table border :columns="columns" :data="letterData">
          <template slot="reportStartTime" slot-scope="{ row }">
            {{ row.reportStartTime }} 至 {{ row.reportEndTime }}
          </template>
          <template slot="declarePeriod" slot-scope="{ row }">
            <span v-if="row.declarePeriod === 0">月报</span>
            <span v-else-if="row.declarePeriod === 1">季报</span>
            <span v-else-if="row.declarePeriod === 2">年报</span>
          </template>
          <template slot="status" slot-scope="{ row }">
            <span style="color: green" v-if="row.status === 1">已生成</span>
            <span style="color: #666" v-else-if="row.status === 2">部分生成</span>
            <span style="color:red" v-else-if="row.status === 3">生成失败</span>
          </template>
          <template slot="operate" slot-scope="{ row }">
            <span class="cursor" @click="salesReportDownLoad(row)">查看报告</span>
          </template>
        </Table>
        <Page
          @on-change="changePageHandler"
          :current="pageInfo.page"
          :total="listTotal"
          :page-size="pageInfo.limit"
          show-total
          show-elevator
        />
      </div>
    </div>
    <SalesReportDownLoad ref="SalesReportDownLoad" :record="record" />
    <TipsModal ref="TipsModal"></TipsModal>
  </div>
</template>

<script>
import { getCountryList, getAmazonSalesReportList } from '@/api/store';
import SalesReportDownLoad from './components/SalesReportDownLoad.vue';
import TipsModal from './components/TipsModal.vue';
export default {
  components: {
    SalesReportDownLoad,
    TipsModal,
  },
  data() {
    return {
      listTotal: 0,
      pageInfo: {
        limit: 10,
        page: 1,
      },
      record: {},
      formModal: {},
      letterData: [],
      countryList: [],
      columns: [
        {
          title: '服务号',
          key: 'serverNo',
        },
        {
          title: '国家',
          key: 'countryName',
        },
        {
          title: '获取数据申报周期',
          slot: 'reportStartTime',
          width: 300,
        },
        {
          title: '申报类型',
          slot: 'declarePeriod',
        },
        {
          title: '数据生成状态',
          slot: 'status',
        },
        {
          title: '报告最新生成时间',
          key: 'reportGetTime',
        },
        {
          title: '操作',
          slot: 'operate',
        },
      ],
    };
  },
  mounted() {
    this.getCountry();
    this.getList();
  },
  methods: {
    salesReportDownLoad(row) {
      this.record = row;
      this.$refs.SalesReportDownLoad.showModal = true;
    },
    getList() {
      getAmazonSalesReportList({
        ...this.formModal,
        ...this.pageInfo,
      }).then((res) => {
        this.letterData = res.data.records;
        this.listTotal = Number(res.data.total);
      });
    },
    search() {
      this.pageInfo.page = 1;
      this.getList();
    },
    resetList() {
      this.formModal = {
        serverNo: '',
        countryCode: '',
        declarePeriod: '',
        status: '',
      };
      this.pageInfo.page = 1;
      this.getList();
    },
    //教程
    openTips() {
      this.$refs.TipsModal.showModal = true;
    },
    //获取国家
    getCountry() {
      getCountryList().then((res) => {
        if (res.code === 0) {
          this.countryList = res.data;
        }
      });
    },
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.headContent {
  background: #ffffff;
  box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
  padding: 20px 32px;
  .bottom {
    font-size: 20px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 28px;
    span {
      font-size: 14px;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      line-height: 22px;
      margin-left: 10px;
    }
  }
}
.content {
  margin: 22px 24px;
  background: #ffffff;
  padding: 24px;
  min-height: calc(100vh - 205px);
}
.title_wait {
  border-bottom: 1px solid #f6f6f6;
  min-height: calc(100vh - 86px);
  // margin: 20px 10px -2px 24px;
  // padding: 20px;
}
/deep/ th .ivu-table-cell {
  font-size: 14px;
  font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333333;
}
&/deep/ .ivu-table {
  color: #333333;
  font-size: 12px;
  td,
  th {
    border-bottom: 1px solid #e6e6e6;
    padding: 16px 0;
    text-align: center;
    // border-right: none;
    border-right: 1px solid #ebebebff;
  }
  th {
    color: #666666;
    font-weight: inherit;
    background: rgba(22, 173, 233, 0.2);
  }
}
.cursor {
  cursor: pointer;
}
.processed {
  color: #02a7f0;
  display: flex;
  justify-content: center;
}
/deep/ .title_wait {
  .ivu-page {
    text-align: center;
    padding-top: 30px;
  }
}
</style>
