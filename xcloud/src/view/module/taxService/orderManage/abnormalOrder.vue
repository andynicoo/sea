
<template>
  <div>
    <div class="orderList" v-if="!showOrderDetail">
      <Form class="cateForm" :model="searchForm" inline :label-width="90">
        <FormItem label="输入搜索：" prop="inputStr">
          <Input v-model="searchForm.inputStr" style="width:200px;" placeholder="订单编号/用户账号/公司名称" clearable />
        </FormItem>
        <FormItem label="订单归属：" prop="sellerId">
          <Select v-model="searchForm.oneSector" @on-change="getSecondOrThirdlyDepartment($event,'two')" placeholder="一级部门" style="width:130px;margin-right:10px;" clearable>
            <Option v-for="(v, i) in oneSectorList" :value="String(v.code)" :key="i">{{ v.value }}</Option>
          </Select>
          <Select v-model="searchForm.twoSector" @on-change="getSecondOrThirdlyDepartment($event,'three')" placeholder="二级部门" style="width:130px;margin-right:10px;" clearable>
            <Option v-for="(v, i) in twoSectorList" :value="String(v.code)" :key="i">{{ v.value }}</Option>
          </Select>
          <Select v-if="threeSectorList.length > 0" v-model="searchForm.threeSector" @on-change="getStaffDepartment($event)" placeholder="三级部门" style="width:130px;margin-right:10px;" clearable>
            <Option v-for="(v, i) in threeSectorList" :value="String(v.code)" :key="i">{{ v.value }}</Option>
          </Select>
          <Select v-model="searchForm.sellerId" placeholder="销售姓名" style="width:130px;" clearable>
            <Option v-for="(v, i) in sellerList" :value="String(v.code)" :key="i">{{ v.value }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="name" :label-width="10">
          <Button type="primary" @click="search">查询</Button>
          <Button type="primary" ghost style="margin-left: 10px" @click="clearHandler">重置</Button>
        </FormItem>
      </Form>
      <!-- tab栏 -->
      <div class="hintBar">
        提示：以下订单内款项登记有误，财务已驳回，请查看原因并及时修改款项信息！
      </div>
      <!-- 表格 -->
      <div style="margin-top:20px;">
        <Table border :loading="loading" :columns="columns" :data="tableData" @on-selection-change="selectChange">
          <template slot="operation" slot-scope="{ row,index }">
            <p class="button" v-show="hasAuthority('abnormalOrder_look')" @click.stop="goDetails(row,index)">去处理</p>
          </template>
          <template slot="orderTypeName" slot-scope="{ row,index }">
            <p>{{orderTypeList[row.orderType]}}</p>
          </template>
          <template slot="statusName" slot-scope="{ row,index }">
            <p>{{stautsList[row.status]}}</p>
          </template>
          <template slot="orderSourceName" slot-scope="{ row,index }">
            <p>{{orderSourceNameList[row.orderSource]}}</p>
          </template>
        </Table>
        <Page class="pagination" @on-page-size-change="pageSizeChangeHandler" @on-change="pageChangeHandler" :current="page" :total="total" :page-size="limit" :page-size-opts="[10, 15, 20, 30]" show-sizer show-total show-elevator />
      </div>
    </div>
    <OrderDetail v-if="showOrderDetail" @getDetailStatus="detailStatusChange" :parentData="childData"></OrderDetail>
  </div>
</template>

<script>
import * as API from "@/api/orderManage/orderList";
import OrderDetail from '@/view/module/taxService/orderManage/components/OrderDetail'
export default {
  components: {
    OrderDetail
  },
  data() {
    return {
      showOrderDetail: false,
      searchForm: {},
      orderSourceList: [
        {
          label: 'PC网页端',
          value: '0'
        },
        {
          label: '后台录入',
          value: '1'
        },
      ],
      serverStatusList: [
        {
          label: '正常',
          value: '0'
        },
        {
          label: '取消服务',
          value: '1'
        },
      ],
      countryList: [],
      categoryList: [],
      productList: [],
      attributeList: [],

      stautsList: ['待付款', '付款待确认', '已付款', '已取消', '部分付款', '部分退款', '全额退款', '待审核', '审核驳回', '已关闭'],
      orderTypeList: ['首次下单', '续费订单', '服务订单', '普通订单'],
      orderSourceNameList: ['PC网页端', '后台录入'],
      loading: false,
      columns: [
        {
          type: "selection",
          align: "center",
          width: 60,
        },
        {
          title: "订单编号",
          key: "orderNo",
          align: "center",
        },
        {
          title: "创建时间",
          key: "createTime",
          align: "center",
        },
        {
          title: "用户账号",
          key: "userMobile",
          align: "center",
        },
        {
          title: "合同公司",
          key: "companyName",
          align: "center",
        },
        {
          title: "总公司",
          key: "headOfficeName",
          align: "center",
        },
        {
          title: "商品信息",
          key: "productNames",
          align: "center",
        },
        {
          title: "应付金额",
          key: "orderMoney",
          align: "center",
        },
        {
          title: "实付金额",
          key: "amountMoney",
          align: "center",
        },
        {
          title: "退款金额",
          key: "refundMoney",
          align: "center",
        },
        {
          title: "订单来源",
          slot: "orderSourceName",
          align: "center",
        },
        {
          title: "订单类型",
          slot: "orderTypeName",
          align: "center",
        },
        {
          title: "订单状态",
          slot: "statusName",
          align: "center",
        },
        {
          title: "订单归属",
          key: "sellerName",
          align: "center",
        },
        {
          title: "操作",
          slot: "operation",
          align: "center",
        },
      ],
      tableData: [],
      page: 1,
      limit: 10,
      total: 0,
      childData: {},

      oneSectorList: [],
      twoSectorList: [],
      threeSectorList: [],
      sellerList: [],
    }
  },
  methods: {
    // 查询
    search() {
      this.page = 1;
      this.getTableList();
    },
    // 重置
    clearHandler() {
      this.searchForm = {};
      this.search();
    },
    // 查看详情
    goDetails(row, index) {
      this.showOrderDetail = true;
      this.childData = {
        orderId: row.orderId,
        orderNo: row.orderNo,
        orderType: 2,
      };
    },
    // 子组件状态
    detailStatusChange(val) {
      this.showOrderDetail = val;
      this.search();
    },
    // // 获取国家下拉
    // getCountryList() {
    //   let self = this;
    //   API.allList()
    //     .then((res) => {
    //       if (res.code == 0) {
    //         self.countryList = res.data;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    // // 获取商品分类下拉
    // getCategoryList() {
    //   let self = this;
    //   API.getCategoryList({ delFlag: 0 })
    //     .then((res) => {
    //       if (res.code == 0) {
    //         self.categoryList = res.data;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    // 获取商品下拉
    getProductList(id) {
      if (id) {
        let self = this;
        API.getProductList({
          categoryId: id
        })
          .then((res) => {
            if (res.code == 0) {
              self.productList = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 获取商品属性下拉
    getAttrList(id) {
      if (id) {
        let self = this;
        API.getAttrList({
          productId: id
        })
          .then((res) => {
            if (res.code == 0) {
              self.attributeList = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 获取一级部门下拉框
    getFirstDepartment() {
      let self = this;
      API.getFirstDepartment()
        .then((res) => {
          if (res.code == 0) {
            self.oneSectorList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取二或三级部门下拉框
    getSecondOrThirdlyDepartment(val, type) {
      let self = this;
      if (val) {
        let params = {
          departmentId: val,
        };
        API.getSecondOrThirdlyDepartment(params)
          .then((res) => {
            if (res.code == 0) {
              self[type + 'SectorList'] = res.data;
              if (JSON.stringify(res.data) == '{}') {
                // 获取人员信息
                self.getStaffDepartment(val);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        if (type == 'two') {
          self.searchForm.twoSector = '';
          self.twoSectorList = [];
          self.searchForm.threeSector = '';
          self.threeSectorList = [];
          self.searchForm.sellerId = '';
          self.sellerList = [];
        } else {
          self.searchForm.threeSector = '';
          self.threeSectorList = [];
          self.searchForm.sellerId = '';
          self.sellerList = [];
        }
      }
    },
    // 获取三级部门下的人员信息
    getStaffDepartment(val) {
      let self = this;
      let params = {
        departmentId: val,
      };
      API.getStaffDepartment(params)
        .then((res) => {
          if (res.code == 0) {
            self.sellerList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 表格select
    selectChange(rowData) {
      this.selectArr = rowData;
    },
    // 每页条数改变
    pageSizeChangeHandler(pageSize) {
      this.limit = pageSize
      this.pageChangeHandler()
    },
    // 翻页
    pageChangeHandler(page = 1) {
      this.page = page;
      this.getTableList();
    },
    // 获取table列表数据
    getTableList() {
      let self = this;
      let pageData = {
        page: self.page,
        limit: self.limit,
      };
      let params = {
        ...pageData,
        ...self.searchForm,
        departmentId: self.searchForm.threeSector || self.searchForm.twoSector || self.searchForm.oneSector || '',
      };
      API.abnormalOrderList(params)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.total = Number(res.data.total);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getTableList();
    this.getFirstDepartment();
    // this.getCategoryList();
  },
}
</script>

<style scoped lang="less">
.orderList {
  background: #fff;
  padding: 15px;
}
.hintBar {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
  color: red;
}
.tabBar1 {
  height: 40px;
  padding-bottom: 10px;
  .left {
    font-size: 14px;
    .item {
      margin-right: 10px;
    }
  }
}
.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-bottom: 15px;
}
.button {
  color: #2d8cf0;
  cursor: pointer;
}
.operationFlex {
  text-align: left;
  .button {
    display: inline-block;
    width: 50%;
    height: 20px;
    line-height: 20px;
  }
}
.height30 {
  height: 30px;
  line-height: 30px;
}
</style>