<template>
  <div style="min-height: calc(100vh - 60px)">
    <div class="clearfix title_wait">
      <div class="commontitle">
        店铺列表 <span @click="openTips()" class="tips"><a>自动获取销售报告教程</a></span>
      </div>
      <div class="platform-wrap">
        <div class="cell" @click="addStore()">
          <div class="img">
            <img src="@/assets/images/store/yamaxun-logo.png" />
          </div>
          <div class="text">Amazon</div>
          <div class="btn">去授权</div>
        </div>
      </div>
      <div class="content">
        <div class="flex title">
          <Form :model="formModal" :label-width="0" inline ref="formModal" style="width: 100%">
            <Row>
              <Col span="8">
                <FormItem label="店铺名称：" :label-width="90" label-position="left" prop="likeName">
                  <Input v-model="formModal.shopName" placeholder="请输入公司名称" style="width: 200px"></Input>
                </FormItem>
              </Col>
              <Col span="8">
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
          <template slot="storeInfo" slot-scope="{ row }">
            <p>{{ row.shopName || '-' }}</p>
            <p>ID: {{ row.id || '-' }}</p>
          </template>
          <template slot="relateTaxNoList" slot-scope="{ row }">
            <p v-for="(li, index) of row.relateTaxNoList || []">税号: {{ li || '-' }}</p>
            <p v-if="!row.relateTaxNoList || row.relateTaxNoList.length === 0">-</p>
          </template>
          <template slot="autoReport" slot-scope="{ row }">
            <i-switch v-model="row.autoReport" size="large" @on-change="onChange($event, row)"> </i-switch>
          </template>
          <template slot="operate" slot-scope="{ row }">
            <span class="cursor" @click="relationTaxNo(row)">关联税号</span>
            <span class="cursor" style="color: #02a7f0; margin-left: 10px" @click="deleteStore(row)">
              删除
            </span>
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
    <AddStore ref="AddStore"></AddStore>
    <RelationTaxNo ref="RelationTaxNo" :record="record"></RelationTaxNo>
    <TipsModal ref="TipsModal"></TipsModal>
  </div>
</template>

<script>
import { getStoreList, autoReport, deleteStoreAuth } from '@/api/store';
import AddStore from './components/AddStore.vue';
import RelationTaxNo from './components/RelationTaxNo.vue';
import TipsModal from './components/TipsModal.vue';
export default {
  components: {
    AddStore,
    RelationTaxNo,
    TipsModal,
  },
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
      record: {},
      letterData: [],
      columns: [
        {
          title: '店铺名称',
          slot: 'storeInfo',
          width: 180,
        },
        {
          title: '店铺别名',
          key: 'shopNickName',
        },
        {
          title: '所属平台',
          key: 'platformDesc',
        },
        {
          title: '开通站点',
          key: 'siteCountryName',
        },
        {
          title: '授权状态',
          key: 'authStatusDesc',
        },
        {
          title: '授权时间',
          key: 'authTime',
        },
        {
          title: '关联税号',
          slot: 'relateTaxNoList',
          width: 160,
        },
        {
          title: '自动获取报告',
          slot: 'autoReport',
          width: 120,
        },
        {
          title: '操作',
          slot: 'operate',
        },
      ],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    //添加绑定店铺
    addStore() {
      this.$refs.AddStore.showModal = true;
    },
    //自动获取报告
    onChange(val, row) {
      autoReport({
        id: row.id,
      }).then((res) => {
        this.$Message.success('操作成功');
      });
    },
    //关联税号
    relationTaxNo(row) {
      this.record = row;
      this.$refs.RelationTaxNo.showModal = true;
    },
    //删除店铺授权
    deleteStore(row) {
      this.$Modal.confirm({
        title: '是否确认解绑店铺？',
        content: '点击确定后解绑店铺',
        loading: true,
        onOk: () => {
          this.$Modal.remove();
          deleteStoreAuth({
            id: row.id,
          }).then((res) => {
            if (res.code === 0) {
              this.$Message.success('删除成功');
              this.getList();
            }
          });
        },
      });
    },
    //教程
    openTips() {
      this.$refs.TipsModal.showModal = true;
    },
    getList() {
      getStoreList({
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
        shopName: '',
      };
      this.pageInfo.page = 1;
      this.getList();
    },
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getList();
    },
  },
};
</script>

<style lang="less" scoped>
.platform-wrap {
  margin: 15px 24px;
  overflow: hidden;
  .cell {
    float: left;
    background-color: #fff;
    font-weight: bold;
    line-height: 54px;
    display: flex;
    padding: 0 5px;
    cursor: pointer;
    position: relative;
    .img {
      width: 28px;
      height: 28px;
      margin: 13px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        float: left;
      }
    }
    .text {
      flex: 1;
      font-size: 22px;
      padding-right: 20px;
    }
    .btn {
      opacity: 0;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      z-index: 1;
      background-color: rgba(0, 0, 0, 0.4);
    }
  }
  .cell:hover .btn {
    opacity: 1;
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
