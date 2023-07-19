<template>
  <div class="mainContent">
    <div class="my-card">
      <div class="title">
        <img src="@/assets/images/setting/settingIcon.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='kby'"/>
        <img src="@/assets/images/setting/settingIconwg.svg" alt="" v-if="PROCESS_ENV.NODE_PLA==='wg'" />
        <span class="title">商标核名</span>
      </div>

      <div class="content">
        <div class="flex">
          <Form :model="formModal" :label-width="0" inline ref="formModal" style="width: 100%">
            <Row>
              <Col span="24">
                <FormItem>
                  <Select v-model="formModal.queryCountryCodeList" clearable style="width: 130px" placeholder="所有国家">
                    <Option v-for="(li, index) of countryList" :key="index" :value="li.countryCode">
                      {{ li.countryName }}
                    </Option>
                  </Select>
                  <Select v-model="formModal.queryCategoryCodeList" clearable style="width: 130px" placeholder="所有类型">
                    <Option v-for="(li, index) of categoryList" :key="index" :value="li.categoryNum"> {{ li.categoryNum }} 类 （{{ li.categoryName }}） </Option>
                  </Select>
                  <Input v-model="formModal.queryTrademark" placeholder=" 商标名称，支持6-10个英文字母" style="width: 220px"></Input>
                  <Button type="primary" style="margin-left: 10px" icon="ios-search" :disabled="!formModal.queryCountryCodeList || !formModal.queryCategoryCodeList || loading" @click="search(1)" class="searchBtn">
                    {{ loading ? '查询中...' : '查询通过率' }}
                  </Button>
                  <Button type="primary" style="margin-left: 10px" icon="ios-search" @click="search(2)" class="searchBtn">
                    查询历史记录
                  </Button>
                  <Button @click="resetList" style="margin-left: 10px" icon="ios-refresh" class="resetBtn">重置</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div class="table">
          <Table :columns="columns" :data="letterData">
            <template slot="queryCountryName" slot-scope="{ row }"> {{ row.queryCountryName || '-' }} </template>
            <template slot="queryCategory" slot-scope="{ row }"> {{ row.queryCategory || '-' }} <span v-if="row.queryCategory">类</span> </template>
            <template slot="queryTrademark" slot-scope="{ row }"> {{ row.queryTrademark || '-' }} </template>
            <template slot="approximateTrademark" slot-scope="{ row }"> {{ row.approximateTrademark || '-' }} </template>
            <template slot="correspondingCountryName" slot-scope="{ row }"> {{ row.correspondingCountryName || '-' }} </template>
            <template slot="correspondingCategory" slot-scope="{ row }"> {{ row.correspondingCategory || '-' }} <span v-if="row.correspondingCategory">类</span> </template>
            <template slot="trademarkStatus" slot-scope="{ row }"> {{ row.trademarkStatus || '-' }} </template>
            <template slot="applyTime" slot-scope="{ row }"> {{ row.applyTime || '-' }} </template>
            <template slot="systemPassRate" slot-scope="{ row }">
              {{ row.systemPassRate || '-' }}
              <br />
              <span v-show="searchType === 1 && row.probability >= 70">
                建议<a @click="depthQuery(row)">深度查询</a>
              </span>
              <span v-if="row.searchStep ==='DEPTH_ING'">深度查询中...</span>
              <span v-if="row.searchStep ==='DEPTH_END'">深度查询完成</span>
            </template>
            <template slot="createTime" slot-scope="{ row }"> {{ row.createTime || '-' }} </template>
          </Table>

          <div class="pagination">
            <Page @on-change="changePageHandler" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { selectTrademarkCheckList, selectPassingRate, queryCountry, queryCategory, getDepthQuery } from '@/api/trademarkName';

export default {
  components: {},
  data() {
    return {
      listTotal: 0,
      pageInfo: {
        limit: 10,
        page: 1,
      },
      formModal: {
        shopName: '',
      },
      loading: false,
      record: {},
      letterData: [],
      searchType: 2,
      searchStepMap: {
        "FIRST_ING": "发起初步查询",
        "FIRST_END": "初步查询结束",
        "DEPTH_ING": "发起深度查询",
        "DEPTH_END": "深度查询结束"
      },
      columns: [
        {
          title: '查询国家',
          slot: 'queryCountryName',
          width: 120,
        },
        {
          title: '查询类目',
          slot: 'queryCategory',
          width: 120,
        },
        {
          title: '查询商标',
          slot: 'queryTrademark',
          width: 120,
        },
        {
          title: '系统通过率',
          slot: 'systemPassRate',
          width: 250,
        },
        {
          title: '查询时间',
          slot: 'createTime',
          width: 160,
        },
        {
          title: '近似商标',
          slot: 'approximateTrademark',
          width: 120,
        },
        {
          title: '对应国家',
          slot: 'correspondingCountryName',
          width: 120,
        },
        {
          title: '对应类目',
          slot: 'correspondingCategory',
          width: 120,
        },
        {
          title: '商标状态',
          slot: 'trademarkStatus',
          width: 120,
        },
        {
          title: '申请时间',
          slot: 'applyTime',
          width: 160,
        },
      ],
      countryList: [],
      categoryList: [],
    };
  },
  mounted() {
    this.queryCountryFun();
    this.queryCategoryFun();
    this.getList();
  },
  methods: {
    async selectPassingRateFun() {
      if (!this.formModal.queryTrademark) {
        this.$Message.error('请输入商标名称');
        return false;
      }
      this.loading = true;
      await selectPassingRate({
        country: this.formModal.queryCountryCodeList,
        trademarkCategoryNum: this.formModal.queryCategoryCodeList,
        text: this.formModal.queryTrademark,
        ...this.pageInfo,
      })
        .then((res) => {
          this.loading = false;
          this.letterData = res.data.records;
          this.listTotal = Number(res.data.total);
        })
        .catch((err) => {
          this.loading = false;
          clearInterval(this.timer);
        });
    },
    async getList() {
      await selectTrademarkCheckList({
        queryCountryCodeList: this.formModal.queryCountryCodeList ? [this.formModal.queryCountryCodeList] : [],
        queryCategoryCodeList: this.formModal.queryCategoryCodeList ? [this.formModal.queryCategoryCodeList] : [],
        queryTrademark: this.formModal.queryTrademark,
        ...this.pageInfo,
      }).then((res) => {
        this.letterData = res.data.records;
        this.listTotal = Number(res.data.total);
      });
    },
    async search(type) {
      this.pageInfo.page = 1;
      if (type === 1) {
        await this.selectPassingRateFun();
      } else if (type === 2) {
        await this.getList();
      }
      this.searchType = type
    },
    resetList() {
      this.formModal = {};
      this.pageInfo.page = 1;
      this.getList();
    },
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getList();
    },
    queryCountryFun() {
      queryCountry({}).then((res) => {
        this.countryList = res.data || [];
      });
    },
    queryCategoryFun() {
      queryCategory({}).then((res) => {
        this.categoryList = res.data || [];
      });
    },
    // 深度查询
    depthQuery(row) {
      this.$Modal.confirm({
        title: '深度查询提示',
        content: '深度查询检索分类较多，时间较长。是否开始查询？',
        onOk: () => {
          getDepthQuery({
            serialId: row.serialId
          }).then(res => {
            if(res.code === 0) {
              this.search(2)
            }
          })
        },
      });
    }
  },
};
</script>

<style lang="less" scoped>
.mainContent {
  display: inline-block;
  width: 946px;
  vertical-align: top;
  box-shadow: 0px 2px 6px 0px rgba(0, 21, 41, 0.06);
  .my-card {
    .title {
      padding-bottom: 22px;
      border-bottom: 1px solid #ebebeb;
      img {
        vertical-align: middle;
      }
      span.title {
        font-family: PingFangSC-Medium, PingFang SC;
        font-size: 20px;
        font-weight: 500;
        border: none;
      }
      span.line {
        width: 2px;
        height: 30px;
        background: #333333;
        opacity: 0.1;
        display: inline-block;
        margin: 0 16px;
        vertical-align: top;
      }
      span.status {
        display: inline-block;
        padding: 0 30px;
        font-size: 14px;
        text-align: center;
        background: #f1f1f1;
        border-radius: 16px;
        margin-right: 10px;
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        color: #666;
      }
      span.status.active {
        background-color: #00a3ff;
        color: #fff;
      }
    }
    .content {
      padding-top: 20px;
    }
    .table {
      .ivu-table td,
      .ivu-table th {
        border-bottom: 0;
      }
      th {
        background-color: #fdf3d9;
        line-height: 48px;
        font-size: 14px;
      }
      td {
        padding: 15px 10px;
        text-align: center;
        font-size: 14px;
      }
      td.order {
        display: flex;
        flex-direction: column;
        font-size: 12px;
        text-align: left;
        line-height: 30px;
      }
      td.progress {
        color: #f60;
      }
      td.operate {
        text-align: center;
        span {
          cursor: pointer;
          color: #f7b416;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            margin-right: 5px;
          }
        }
      }
    }
    .pagination {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
