<template>
  <div class="content">
    <div class="commontitle">其他服务</div>
    <div class="headContent">
      <div class="tabTitle">
        <span
          :class="{ 'active-tab': formData.progressBar == '1,5' }"
          @click="(formData.progressBar = '1,5'), getList(1)"
        >
          待办理
        </span>
        <span
          :class="{ 'active-tab': formData.progressBar == '2,6' }"
          @click="(formData.progressBar = '2,6'), getList(1)"
        >
          办理中
        </span>
        <span :class="{ 'active-tab': formData.progressBar == '3' }" @click="(formData.progressBar = '3'), getList(1)">
          已办结
        </span>
      </div>
    </div>
    <div class="my-card">
      <div class="myVATFilter">
        <Form :model="formData" :label-width="80" label-position="right" inline ref="formData">
          <FormItem label="公司名称" prop="companyNameZh">
            <Input v-model="formData.companyNameZh" style="width: 200px" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="国家" :label-width="60" prop="countryCode">
            <Select v-model="formData.countryCode" placeholder="请选择国家" style="width: 180px" clearable filterable>
              <Option :value="v.countryCode" v-for="(v, i) in countryInfo" :key="i">{{ v.countryNameZh }}</Option>
            </Select>
          </FormItem>
          <FormItem label="服务名称" :label-width="90" prop="productId">
            <Select v-model="formData.productId" placeholder="请选择" style="width: 180px" clearable filterable>
              <Option :value="v.id" v-for="(v, i) in productList" :key="i">{{ v.productName }}</Option>
            </Select>
          </FormItem>
          <Button type="primary" @click="searchBtn()" icon="md-search" class="searchBtn">搜索</Button>
          <Button @click="handleReset('formData')" icon="md-refresh" class="resetBtn">重置</Button>
        </Form>
      </div>
      <div class="itemList">
        <Table :no-data-text="'暂无处理事项'" :data="dataList" :columns="columns" :loading="loading">
          <template slot="operation" slot-scope="{ row }">
            <div class="operation">
              <p class="banli" v-if="row.progressBar == 5" @click="toDetail(row)">
                <img src="@/assets/images/common/banli.svg" alt="" />在线办理
              </p>
              <p class="detail" v-else @click="toDetail(row)">详情</p>
            </div>
          </template>
        </Table>
      </div>
      <div class="page-box">
        <Page
          show-total
          v-if="dataList.length > 0"
          show-sizer
          show-elevator
          :total="total"
          :current="formData.page"
          :page-size="formData.limit"
          @on-change="handlePage"
          @on-page-size-change="handlePageSize"
        ></Page>
      </div>
    </div>
  </div>
</template>
<script>
import { getPageList } from '@/api/otherService/otherService';
import { baseInfo, newProductInfo } from '@/api/shoppingCar/shoppingCar';
export default {
  data() {
    return {
      contentStyleObj: {
        'min-height': '',
      },
      loading: false,
      paymentBox: false,
      dataList: [],
      columns: [
        {
          align: 'center',
          key: 'serviceNo',
          title: '服务号',
          minWidth: 270,
        },
        {
          align: 'center',
          title: '公司名称',
          key: 'companyNameZh',
        },
        {
          align: 'center',
          title: '国家',
          key: 'countryNameZh',
        },
        {
          align: 'center',
          title: '服务名称',
          key: 'serviceName',
        },
        {
          align: 'center',
          width: 170,
          title: '操作',
          slot: 'operation',
        },
      ],
      formData: {
        page: 1,
        limit: 10,
        companyNameZh: '',
        progressBar: '1,5',
        productId: '',
        countryCode: '',
      },
      total: 0,
      listQuery: {
        client: 'OFFLINE',
        productStatus: 'PENDED_PUBLISH',
        functionCodes: [20],
      },
      countryInfo: [],
      productList: [],
    };
  },
  methods: {
    getBaseInfo() {
      baseInfo().then((res) => {
        for (let i = 0; i < res.data.length; i++) {
          this.countryInfo = res.data;
        }
      });
    },
    getProductInfo() {
      newProductInfo(this.listQuery).then((res) => {
        this.productList = JSON.parse(JSON.stringify(res.data.records));
      });
    },
    getList(page) {
      if (this.formData.status === '-1') {
        this.formData.status = '';
      }
      if (page) {
        this.formData.page = page;
      }
      getPageList(this.formData).then((res) => {
        if (res.code === 0) {
          this.dataList = res.data.pageData.records;
          this.total = res.data.pageData.total - 0;
        }
      });
    },
    handlePage(page) {
      this.getList(page);
    },
    handlePageSize(pageSize) {
      this.formData.limit = pageSize;
      this.getList(1);
    },
    searchBtn() {
      this.getList(1);
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    toDetail(row) {
      this.$router.push({
        path: '/otherServicesDetail',
        query: { id: row.id, progressBar: row.progressBar },
      });
    },
  },
  computed: {},
  mounted() {
    this.getBaseInfo();
    this.getProductInfo();
    this.getList(1);
  },
};
</script>
<style lang="less" scoped>
/deep/ .ivu-table-cell {
  text-overflow: clip !important;
}
/deep/ .ivu-table td,
.ivu-table th {
  text-align: center !important;
}
.my-card {
  border-radius: 10px;
  margin: 24px;
  margin-bottom: 0px;
  .myVATFilter {
    background: #ffffff;
    padding: 24px;
    /deep/ .ivu-form-item {
      margin-bottom: 0px;
    }
    .searchBtn {
      margin-right: 10px;
      margin-left: 20px;
    }
  }
  .itemList {
    padding: 0 24px;
    background: #ffffff;
    .title {
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      span {
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        line-height: 22px;
        margin-right: 24px;
      }
      .red {
        color: #ed3e3e;
      }
      .blue {
        color: #16ade9;
      }
      .right {
        font-size: 14px;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #333333;
        line-height: 22px;
        display: flex;
        align-items: center;
        img {
          margin-right: 10px;
        }
      }
    }
  }
}
.title {
  font-size: 24px;
  font-weight: 500;
  margin-left: 8px;
  color: #333;
  margin-bottom: 24px;
}
.content {
  min-height: calc(100vh - 60px);
  /deep/ .ivu-table-wrapper-with-border {
    border: none;
  }
  /deep/ .ivu-table:before,
  /deep/ .ivu-table-border:after {
    width: 0px;
  }
  /deep/ .ivu-table-header thead tr th {
    font-size: 14px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
    // line-height: 14px;
    height: 48px;
  }
  /deep/ .ivu-table td {
    height: 48px;
    font-size: 12px;
    font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #333333;
  }
  .headContent {
    background: #ffffff;
    box-shadow: 0px 1px 4px 0px rgba(0, 21, 41, 0.12);
    padding: 10px 32px 0px;
    .top {
      margin-bottom: 14px;
      .flink,
      .clink {
        font-size: 14px;

        font-weight: 400;
        color: rgba(0, 0, 0, 0.45);
        line-height: 22px;
      }
      .clink {
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .bottom {
      font-size: 20px;
      font-family: 'Microsoft Yahei', PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
      line-height: 28px;
    }
    .tabTitle {
      border-bottom: 1px solid #e9e9e9ff;
      margin-top: 0px;
      span {
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        font-family: 'Microsoft Yahei', PingFangSC;
        color: #333333;
        line-height: 40px;
        margin-right: 46px;
        cursor: pointer;
      }
      .active-tab {
        color: #1890ffff;
        border-bottom: 2px solid #1890ffff;
        font-weight: 500;
      }
    }
  }
}
.page-box {
  text-align: center;
  background-color: #ffffff;
  padding: 24px 24px;
  text-align: right;
}
.operation {
  cursor: pointer;
  .banli {
    color: #f6b417;
    font-size: 12px;
    img {
      vertical-align: middle;
      margin-right: 4px;
    }
  }
  .detail {
    color: #1890ffff;
  }
}
</style>
<style scoped>
.ivu-table-header thead tr th {
  background: rgba(22, 173, 233, 0.2);
  padding: 17px 0;
  font-size: 12px;
  color: #666;
}

.no_border .ivu-table td,
.ivu-table th {
  border: none;
  text-align: center !important;
}
.no_border.ivu-table td,
.no_border.ivu-table th {
  border: none;
  text-align: center !important;
}
.no_border .ivu-table.ivu-table-default::after,
.no_border .ivu-table.ivu-table-default::before {
  display: none !important;
}
.ivu-btn-primary {
  border-color: #16ade9 !important;
  background-color: #16ade9 !important;
}
.ivu-btn-primary:hover {
  border-color: #16ade9 !important;
  background-color: #16ade9 !important;
}
</style>
