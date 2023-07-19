<template>
  <div>
    <div class="commodity" v-if="!showPostProduct">
      <Form class="cateForm" :model="addForm" inline :label-width="90">
        <FormItem label="输入搜索：" prop="inputStr">
          <Input v-model="addForm.inputStr" style="width:200px;" placeholder="商品名称/商品ID" clearable />
        </FormItem>
        <FormItem label="商品分类：" prop="categoryId">
          <Select v-model="addForm.categoryId" style="width:200px;" clearable>
            <Option v-for="item in categotyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="商品类型：" prop="productType">
          <Select v-model="addForm.productType" style="width:200px;" placeholder="请选择商品类型" clearable>
            <Option v-for="item in productTypeList" :value="item.code" :key="item.code">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="服务国家：" prop="countryCode">
          <Select v-model="addForm.countryCode" style="width:200px;" clearable>
            <Option v-for="item in countryList" :value="item.country" :key="item.country">{{ item.countryName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="发布平台：" prop="pubPlatform">
          <Select v-model="addForm.pubPlatform" style="width:200px;" clearable>
            <Option v-for="item in platformList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="name" :label-width="10">
          <Button type="primary" @click="search">查询</Button>
          <Button type="primary" ghost style="margin-left: 10px" @click="clearHandler">重置</Button>
        </FormItem>
      </Form>
      <div class="tabBar">
        <div class="left">
          <span @click="toggle(4)" :class="{'active':infoNumActive == 4}">全部商品({{infoNum.productTotalNumber}})</span>
          <span @click="toggle(3)" :class="{'active':infoNumActive == 3}">已上架({{infoNum.productTotalRelease}})</span>
          <span @click="toggle(1)" :class="{'active':infoNumActive == 1}">未上架({{infoNum.productTotalOnRelease}})</span>
          <span @click="toggle(0)" :class="{'active':infoNumActive == 0}">待审核({{infoNum.productTotalReviewy}})</span>
          <span @click="toggle(2)" :class="{'active':infoNumActive == 2}">不通过({{infoNum.productTotalFailed}})</span>
          <span @click="toggle(5)" :class="{'active':infoNumActive == 5}">已作废({{infoNum.productTotalCancel}})</span>
        </div>
        <div class="right">
          <Button type="primary" @click="goDetails('add')" v-show="hasAuthority('commodityList_addProduct')">添加商品</Button>
          <Button type="primary" style="margin-left: 10px" @click="editPlatform" v-show="hasAuthority('commodityList_editPlatform')">修改发布平台</Button>
        </div>
      </div>
      <div>
        <Table border :loading="loading" :columns="columns" :data="tableData" @on-selection-change="selectChange">
          <template slot="productHeadImgUrl" slot-scope="{ row }">
            <img class="img" :src="row.productHeadImgUrl" alt="商品图片">
          </template>
          <template slot="productType" slot-scope="{ row }">
            <span>{{productTypeList[row.productType].value}}</span>
          </template>
          <template slot="pubPlatform" slot-scope="{ row }">
            <span v-if="row.pubPlatform == '0'">客户端</span>
            <span v-if="row.pubPlatform == '1'">管理后台</span>
            <span v-if="row.pubPlatform == '3'">客户端 + 管理后台 </span>
          </template>
          <template slot="status" slot-scope="{ row }">
            <span v-if="row.status == 0">待审核</span>
            <span v-if="row.status == 1">未上架</span>
            <span v-if="row.status == 2">审核不通过</span>
            <span v-if="row.status == 3">已上架</span>
            <span v-if="row.status == 5">已作废</span>
          </template>
          <template slot="log" slot-scope="{ row }">
            <Log v-if="row.logFlag == 1" :sendId="row.id" btnText="查看"></Log>
            <span v-else>暂无</span>
          </template>
          <template slot="operation" slot-scope="{ row,index }">
            <p class="operationFlex">
              <span class="button" @click.stop="goDetails('look',row)" v-show="hasAuthority('commodityList_lookDetails')">查看</span>
              <span class="button" @click.stop="goDetails('edit',row)" v-show="hasAuthority('commodityList_edit')" v-if="[0,1,2,3].includes(row.status)">编辑</span>
              <span class="button" @click.stop="upOrDownStand(row,3)"  v-show="hasAuthority('commodityList_upStand')" v-if="[0,1].includes(row.status)">上架</span>
              <span class="button" @click.stop="upOrDownStand(row,4)"  v-show="hasAuthority('commodityList_downStand')" v-if="[3].includes(row.status)">下架</span>
              <span class="button" @click.stop="productVerify(row)"    v-show="hasAuthority('commodityList_check')" v-if="[0].includes(row.status)">审核</span>
              <span class="button" @click.stop="cancellationOrRestore(row,5)" v-show="hasAuthority('commodityList_cancel')" v-if="[0,1,2].includes(row.status)">作废</span>
              <span class="button" @click.stop="cancellationOrRestore(row,0)" v-show="hasAuthority('commodityList_restore')" v-if="[5].includes(row.status)">还原</span>
              <span class="button" @click.stop="deleteProduct(row)" v-show="hasAuthority('commodityList_delete')" v-if="[5].includes(row.status)">删除</span>
            </p>
          </template>
        </Table>
        <Page class="pagination" @on-page-size-change="pageSizeChangeHandler" @on-change="pageChangeHandler" :current="page" :total="listTotal" :page-size="pageSize" :page-size-opts="[10, 15, 20, 30]" show-sizer show-total show-elevator />
      </div>
      <!-- 修改发布平台 -->
      <Modal class="modal" v-model="platformModal" width="600" title="修改发布平台" cancelText :mask-closable="false">
        <p class="height30">共选择了{{platform.productIdArr.length}}个商品</p>
        <p class="height30" style="display:flex;">
          <span>发布平台：</span>
          <CheckboxGroup v-model="platform.pubPlatform">
            <Checkbox label="0">客户端</Checkbox>
            <Checkbox label="1">管理后台</Checkbox>
          </CheckboxGroup>
        </p>
        <div slot="footer">
          <Button type="default" @click="platformCancel">取消</Button>
          <Button type="primary" :loading="platformLoading" @click="platformSubmit">提交</Button>
        </div>
      </Modal>
      <!-- 商品审核 -->
      <Modal class="modal" v-model="productVerifyModal" width="600" title="商品审核" cancelText :mask-closable="false">
        <Form ref="attrModal" :model="productVerifyForm" :label-width="100">
          <FormItem label="商品名称：">
            <p>{{productVerifyForm.productName}}</p>
          </FormItem>
          <FormItem label="商品审核：" prop="name">
            <RadioGroup v-model="productVerifyForm.status">
              <Radio label="1">审核通过</Radio>
              <Radio label="2">审核不通过</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="反馈详情：" prop="reason" v-if="productVerifyForm.status == 2">
            <Input v-model="productVerifyForm.reason" type="textarea" :rows="6" placeholder="请输入内容" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button type="default" @click="productVerifyCancel">取消</Button>
          <Button type="primary" :loading="productVerifyLoading" @click="productVerifySubmit">提交</Button>
        </div>
      </Modal>
    </div>
    <PostProduct v-if="showPostProduct" @changeShowPostProduct="changeShowPostProduct" :postProductData="postProductData"></PostProduct>
  </div>
</template>

<script>
import { getProductList, statisticsInfo, getCategoryItem, updatePlatform, productVerify, productUpstatus, productCancelStatus, deleteProduct, allList, getProductTypeList } from "@/api/commodityManage/commodityList";
import Log from "@/view/module/commodityManage/components/log";
import PostProduct from "@/view/module/commodityManage/components/postProduct";
export default {
  components: {
    Log,
    PostProduct
  },
  data() {
    return {
      showPostProduct: false,
      postProductData: {
        type: 'add',
        productId: '',
      },
      addForm: {},
      categotyList: [],//商品分类列表
      countryList: [],//服务国家列表
      productTypeList: [],
      platformList: [
        {
          label: '客户端',
          value: '0',
        },
        {
          label: '管理后台',
          value: '1',
        },
        {
          label: '客户端 + 管理后台',
          value: '3',
        },
      ],//发布平台列表

      infoNum: {
        productTotalNumber: '',
        productTotalRelease: '',
        productTotalOnRelease: '',
        productTotalReviewy: '',
        productTotalFailed: '',
        productTotalCancel: '',
      },
      infoNumActive: 4,

      loading: false,
      columns: [
        {
          type: "selection",
          align: "center",
          width: 60,
        },
        {
          title: "商品ID",
          key: "id",
          align: "center",
        },
        {
          title: "商品图片",
          slot: "productHeadImgUrl",
          align: "center",
        },
        {
          title: "商品名称",
          key: "productName",
          align: "center",
        },
        {
          title: "所属分类",
          key: "categoryName",
          align: "center",
        },
        {
          title: "商品类型",
          slot: "productType",
          align: "center",
        },
        {
          title: "服务国家",
          key: "countryName",
          align: "center",
        },
        {
          title: "当前售价（元）",
          key: "priceInterval",
          align: "center",
        },
        {
          title: "原价（元）",
          key: "originalPriceInterval",
          align: "center",
        },
        {
          title: "累计销量",
          key: "cumulativeNo",
          align: "center",
        },
        {
          title: "近30日销量",
          key: "latelyCumulativeNo",
          align: "center",
        },
        {
          title: "发布平台",
          slot: "pubPlatform",
          align: "center",
        },
        {
          title: "状态",
          slot: "status",
          align: "center",
        },
        {
          title: "操作记录",
          slot: "log",
          align: "center",
        },
        {
          title: "操作",
          slot: "operation",
          align: "center",
        },
      ],
      tableData: [],
      selectArr: [],
      page: 1,
      pageSize: 10,
      listTotal: 0,

      platformModal: false,
      platform: {
        productIdArr: []
      },
      platformLoading: false,

      productVerifyModal: false,
      productVerifyForm: {},
      productVerifyLoading: false,
    }
  },
  methods: {
    changeShowPostProduct(val) {
      this.showPostProduct = val;
      this.getTableList();
    },
    goDetails(type, row) {
      this.postProductData.type = type;
      if (type != 'add') {
        this.postProductData.productId = row.id;
        this.postProductData.categoryName = row.categoryName;
        this.postProductData.countryName = row.countryName;
      };
      this.showPostProduct = true;
    },
    //查询
    search() {
      this.page = 1;
      this.getTableList();
    },
    // 重置
    clearHandler() {
      let status = this.addForm.status;
      this.addForm = {};
      this.addForm.status = status;
    },
    // 获取统计数据
    // getStatisticsInfo() {
    //   let self = this;
    //   let pageData = {
    //     page: self.page,
    //     limit: self.pageSize,
    //   };
    //   let params = { ...pageData };
    //   statisticsInfo(params)
    //     .then((res) => {
    //       this.infoNum = res.data;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    // 获取分类下拉
    getCategoryList() {
      let self = this;
      let params = { delFlag: 0 };
      getCategoryItem(params)
        .then((res) => {
          if (res.code == 0) {
            self.categotyList = res.data.map(el => {
              return {
                label: el.value,
                value: el.code
              }
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取商品类型下拉列表
    getProductTypeList() {
      let self = this;
      getProductTypeList()
        .then((res) => {
          if (res.code == 0) {
            self.productTypeList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取国家下拉
    getCountryList() {
      let self = this;
      allList()
        .then((res) => {
          if (res.code == 0) {
            self.countryList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 状态切换
    toggle(num) {
      this.infoNumActive = num;
      if (num == 4) {
        delete this.addForm.status;
        this.getTableList();
        return;
      }
      this.addForm.status = num;
      this.page = 1;
      this.getTableList();
    },
    // 表格select
    selectChange(rowData) {
      this.selectArr = rowData;
    },
    // 修改发布平台
    editPlatform() {
      if (this.selectArr.length == 0) {
        this.$Message.warning('请选择要操作的商品！');
        return false;
      }
      this.platform.productIdArr = this.selectArr.map(el => el.id);
      this.platformModal = true;
    },
    // 修改发布平台取消
    platformCancel() {
      this.platformModal = false;
    },
    // 修改发布平台提交
    platformSubmit() {
      if (this.platform.pubPlatform.length == 0) {
        this.$Message.warning('请选择发布平台！');
        return false;
      }
      let params = {
        productId: this.platform.productIdArr,
        pubPlatform: this.platform.pubPlatform.length == 1 ? this.platform.pubPlatform[0] : 3,
      };
      updatePlatform(params)
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('修改成功！');
            this.platformModal = false;
            this.selectArr = [];
            this.platform.pubPlatform = [];
            this.getTableList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 商品审核
    productVerify(row) {
      this.productVerifyForm.productId = row.id;
      this.productVerifyForm.productName = row.productName;
      this.productVerifyModal = true;
    },
    // 商品审核取消
    productVerifyCancel() {
      this.productVerifyForm = {};
      this.productVerifyModal = false;
    },
    // 商品审核提交
    productVerifySubmit() {
      if (!this.productVerifyForm.status) {
        this.$Message.warning('请选择审核状态！');
        return false;
      }
      if (this.productVerifyForm.status == 2 && !this.productVerifyForm.reason) {
        this.$Message.warning('请填写反馈详情！');
        return false;
      }
      let params = { ...this.productVerifyForm };
      productVerify(params)
        .then((res) => {
          if (res.code == 0) {
            this.$Message.success('审核成功！');
            this.productVerifyCancel();
            this.getTableList();
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 上下架 3上架  4下架
    upOrDownStand(row, status) {
      let text = status == 3 ? '上架' : '下架';
      let params = {
        productId: row.id,
        status
      };
      this.$Modal.confirm({
        title: `请确认是否${text}？`,
        onOk: () => {
          productUpstatus(params)
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success(`${text}成功！`);
                this.getTableList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel: () => { }
      });
    },
    // 作废 or 还原  5作废  0还原
    cancellationOrRestore(row, status) {
      let text = status == 5 ? '作废' : '还原';
      let params = {
        productId: row.id,
        status
      };
      this.$Modal.confirm({
        title: `请确认是否${text}？`,
        onOk: () => {
          productCancelStatus(params)
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success(`${text}成功！`);
                this.getTableList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel: () => { }
      });
    },
    // 删除商品
    deleteProduct(row) {
      let params = { productId: row.id };
      this.$Modal.confirm({
        title: `请确认是否删除？`,
        onOk: () => {
          deleteProduct(params)
            .then((res) => {
              if (res.code == 0) {
                this.$Message.success(`删除成功！`);
                this.getTableList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel: () => { }
      });
    },
    // 每页条数改变
    pageSizeChangeHandler(pageSize) {
      this.pageSize = pageSize
      this.pageChangeHandler()
    },
    // 翻页
    pageChangeHandler(page = 1) {
      this.page = page;
      this.getTableList();
    },
    // 获取列表数据
    getTableList() {
      let self = this;
      let pageData = {
        page: self.page,
        limit: self.pageSize,
      };
      let params = { ...pageData, ...this.addForm };
      if (params.status || params.status == 0) {
        params.status = String(this.addForm.status);
      }
      getProductList(params)
        .then((res) => {
          if (res.code == 0) {
            this.tableData = res.data.records;
            this.listTotal = Number(res.data.total);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // 统计信息
      statisticsInfo(params)
        .then((res) => {
          if (res.code == 0) {
            this.infoNum = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  created() {
    this.getTableList();
    this.getCategoryList();
    this.getCountryList();
    this.getProductTypeList();
  },
}
</script>

<style scoped lang="less">
.commodity {
  background: #fff;
  padding: 15px;
}
.cateForm {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.tabBar {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8f8f8;
  padding: 0 15px;
  .left {
    span {
      display: inline-block;
      margin-right: 10px;
      padding: 5px 20px;
      background: #fff;
      border: 1px solid #ddd;
      cursor: pointer;
    }
    .active {
      background-color: #2d8cf0;
      color: #fff;
    }
  }
}
.img {
  width: 50px;
  height: 50px;
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