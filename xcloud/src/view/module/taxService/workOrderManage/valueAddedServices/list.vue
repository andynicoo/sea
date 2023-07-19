<template>
  <div class="container">
    <div class="mainPage" v-if="!isDetailShow">
      <Form ref="searchForm" class="formContainer" :model="searchForm" inline>
        <FormItem>
          <Input v-model="searchForm.searchContent" clearable placeholder="公司名称/手机号/服务号" style="width:200px;" />
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.countryCode" @on-change="countryChange" style="width:100px;" placeholder="国家">
            <!-- <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option> -->
            <Option value="GB" key="1">英国</Option>
            <Option value="DE" key="2">德国</Option>
            <Option value="IT" key="3">意大利</Option>
            <Option value="EU" key="4">欧盟</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.supplierId" placeholder="服务商" style="width:150px;">
            <Option v-for="(item,index) in facilitatorList" :value="item.id" :key="index">{{ item.shortName }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable v-model="searchForm.applyType" style="width:200px;" placeholder="服务类型">
            <!-- <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option> -->
            <Option value="1" key="1">英国低税率（保留）</Option>
            <Option value="2" key="2">德国EORI申请</Option>
            <Option value="3" key="3">意大利EORI申请</Option>
            <Option value="4" key="4">英代DOC申请</Option>
            <Option value="5" key="5">欧代DOC申请</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select v-model="searchForm.disposeId" clearable placeholder="税务经理">
            <Option v-for="(item,index) in taxManagerList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchList('searchForm')" style="margin: 0 12px;">查询</Button>
          <Button type="primary" ghost @click="resetList">重置</Button>
        </FormItem>
      </Form>
      <div class="tab">
        <Button type="primary" v-if="['1'].includes(searchForm.status)" style="margin-right:10px;" v-show="hasAuthority('valueAddedServices_batchEditSupplier')" @click="openEditSupplierModal()">修改服务商</Button>
        <Button type="primary" v-show="hasAuthority('valueAddedServices_batchClaimTaxManager')" @click="openClaimTaxManagerModal()">修改税务经理</Button>
      </div>
      <div class="tableArea">
        <Tabs :value="searchForm.status" :animated="false" @on-click="tabsChange">
          <TabPane label="全部" name="-1"></TabPane>
          <TabPane label="待处理" name="1"></TabPane>
          <TabPane label="处理中" name="4"></TabPane>
          <TabPane label="处理完成" name="6"></TabPane>
          <TabPane label="无需处理" name="5"></TabPane>
        </Tabs>
        <Table border :loading="tableLoading" :columns="columns" :data="tableData" @on-selection-change="selectChange">
          <template slot="operate" slot-scope="{ row }">
            <Button type="primary" ghost @click="toDetail(row)">查看</Button>
          </template>
          <template slot="supplierName" slot-scope="{ row }">
            <div class="supplierName">
              <span v-show="hasAuthority('valueAddedServices_lookSupplier')">{{row.supplierName}}</span>
              <Icon v-if="[1].includes(row.status)" class="icon" type="md-create" v-show="hasAuthority('valueAddedServices_editSupplier')" @click="openEditSupplierModal(row)"></Icon>
            </div>
          </template>
          <template slot="disposeName" slot-scope="{ row }">
            <div class="disposeName">
              <span v-if="row.disposeId">{{row.disposeName}}</span>
              <span v-if="!row.disposeId" class="button" v-show="hasAuthority('valueAddedServices_claimTaxManager')" @click="openClaimTaxManagerModal(row)">认领</span>
            </div>
          </template>
        </Table>
        <Page @on-change="changePageHandler" :current="pageInfo.page" :total="listTotal" :page-size="pageInfo.limit" show-total show-elevator />
      </div>
    </div>
    <!-- 修改服务商 -->
    <Modal class="modal" v-model="editSupplierModal" :mask-closable="false" :closable="false">
      <div class="text" v-if="editSupplierForm.ids">
        <p v-if="editSupplierForm.type == 2 && editSupplierForm.ids.length > 1">共选择了{{editSupplierForm.ids.length}}条工单</p>
        <p v-if="editSupplierForm.type == 1 || editSupplierForm.ids.length == 1">
          <span>当前服务商：</span>
          <span>{{editSupplierForm.supplierName}}</span>
        </p>
        <p>
          <span>修改服务商：</span>
          <Select clearable v-model="editSupplierForm.supplierId" placeholder="服务商" style="width:200px;">
            <Option v-for="(item,index) in editSupplierForm.facilitatorList" :value="item.id" :key="index">{{ item.shortName }}</Option>
          </Select>
        </p>
        <!-- <p style="color:red;">提示：更改服务商后，资料模板也将更新，客户需要重新提交资料，请谨慎操作！</p> -->
      </div>
      <div slot="header" class="header">
        <p>修改服务商</p>
        <Icon class="closeBtn" @click="editSupplierCancel()" type="ios-close" />
      </div>
      <div slot="footer">
        <Button type="default" @click="editSupplierCancel()">取消</Button>
        <Button type="primary" :loading="editSupplierLoading" @click="editSupplierSubmit()">确认</Button>
      </div>
    </Modal>
    <!-- 修改税务经理 -->
    <Modal class="modal" v-model="claimTaxManagerModal" :mask-closable="false" :closable="false">
      <div class="text" v-if="claimTaxManagerForm.ids">
        <p v-if="claimTaxManagerForm.type == 2 && claimTaxManagerForm.ids.length > 1">共选择了{{claimTaxManagerForm.ids.length}}条工单</p>
        <p v-if="claimTaxManagerForm.type == 1 || claimTaxManagerForm.ids.length == 1">
          <span>当前税务经理：</span>
          <span>{{claimTaxManagerForm.OldDisposeName}}</span>
        </p>
        <p>
          <span>修改税务经理：</span>
          <Select v-model="claimTaxManagerForm.disposeId" clearable placeholder="税务经理" style="width:200px;">
            <Option v-for="(item,index) in taxManagerModalList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </p>
      </div>
      <div slot="header" class="header">
        <p>修改税务经理</p>
        <Icon class="closeBtn" @click="claimTaxManagerCancel()" type="ios-close" />
      </div>
      <div slot="footer">
        <Button type="default" @click="claimTaxManagerCancel()">取消</Button>
        <Button type="primary" :loading="claimTaxManagerLoading" @click="claimTaxManagerSubmit()">确认</Button>
      </div>
    </Modal>
    <Details v-if="isDetailShow && detailObj!=null" :serviceId="serviceId" :detailObj="detailObj" @back="isDetailShow=false" @refresh="getList"></Details>
  </div>
</template>
<script>
import Details from './components/details'
import * as API from '@/api/taxService/addedService.js';
import { getTaxCountry } from '@/api/taxService/common.js';
import * as extendsAPI from "@/api/extends/facilitatorAndTax";
import facilitatorAndTax from '@/view/module/taxService/common/facilitatorAndTax.js';
export default {
  extends: facilitatorAndTax,
  name: 'mainList',
  components: {
    Details
  },
  data() {
    return {
      detailObj: null,
      isDetailShow: false,
      searchForm: {
        status: '-1',
        searchContent: '',
        countryCode: '',
        applyType: ''
      },
      countryList: [],
      tableLoading: false,
      columns_showSupplierName: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'applyWorkNo',
        },
        {
          title: '服务进度',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.status])
          }
        },
        {
          title: '服务类型',
          key: 'applyType',
          render(h, params) {
            let serviceName = '', code = params.row.applyType;
            serviceName = code == 1 ? '英国低税率（保留）' : code == 2 ? '德国EORI申请' : code == 3 ? '意大利EORI申请' : code == 4 ? '英代DOC申请' : code == 5 ? '欧代DOC申请' : ''
            return h('span', serviceName)
          },
        },
        {
          title: '公司名称',
          key: 'companyNameZh'
        },
        {
          title: '国家',
          key: 'countryNameZh',
        },
        {
          title: '服务商',
          slot: 'supplierName'
        },
        {
          title: '申请时间',
          key: 'createTime'
        },
        {
          title: '客户手机号',
          key: 'userMobile',
        },
        {
          title: '税务经理',
          slot: 'disposeName',
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      columns_noShowSupplierName: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务号',
          key: 'applyWorkNo',
        },
        {
          title: '服务进度',
          render: (h, params) => {
            let self = this
            return h('span', self.progressStatus[params.row.status])
          }
        },
        {
          title: '服务类型',
          key: 'applyType',
          render(h, params) {
            let serviceName = '', code = params.row.applyType;
            serviceName = code == 1 ? '英国低税率（保留）' : code == 2 ? '德国EORI申请' : code == 3 ? '意大利EORI申请' : code == 4 ? '英代DOC申请' : code == 5 ? '欧代DOC申请' : ''
            return h('span', serviceName)
          },
        },
        {
          title: '公司名称',
          key: 'companyNameZh'
        },
        {
          title: '国家',
          key: 'countryNameZh',
        },
        {
          title: '申请时间',
          key: 'createTime'
        },
        {
          title: '客户手机号',
          key: 'userMobile',
        },
        {
          title: '税务经理',
          slot: 'disposeName',
        },
        {
          title: '操作',
          slot: 'operate'
        }
      ],
      tableData: [],
      pageInfo: {
        limit: 10,
        page: 1,
      },
      listTotal: 0,
      workId: '',
      progressBar: '',
      serviceId: '',
      progressStatus: {
        1: '待处理',
        4: '处理中',
        5: '无需处理',
        6: '处理完成',
      },

      editSupplierModal: false,
      editSupplierLoading: false,
      editSupplierForm: {},

      claimTaxManagerModal: false,
      claimTaxManagerLoading: false,
      claimTaxManagerForm: {},
    }
  },
  computed: {
    roles() {
      return this.$store.state.user.roles;
    },
    columns(){
      if(this.hasAuthority('valueAddedServices_lookSupplier')){
        return this.columns_showSupplierName;
      }else{
        return this.columns_noShowSupplierName;
      }
    },
  },
  mounted() {
    this.getList();
  },
  methods: {
    //获取列表
    getList() {
      this.tableLoading = true;
      let params = { ...this.searchForm, ...this.pageInfo }
      if (params.status == -1) params.status = ''
      API.getAddServiceList(params).then((res) => {
        this.tableLoading = false;
        if (res.code == 0) {
          this.tableData = res.data.records;
          this.listTotal = Number(res.data.total);
        } else {
          this.$Message.warning(res.message)
        }
      })
        .catch(err => console.log(err))
    },
    //获取税号国家下拉数据
    getCountryList() {
      getTaxCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    //搜索列表
    searchList(type) {
      this.pageInfo.page = 1;
      this.searchForm.status = '-1';
      this.getList();
    },
    //重置列表
    resetList() {
      this.searchForm = {
        status: '-1',
        searchContent: '',
        countryCode: '',
        applyType: ''
      },
        this.pageInfo = {
          limit: 10,
          page: 1,
        },
        this.getList()
    },
    //选择tab状态
    tabsChange(name) {
      // if(name == -1) name = ''
      this.pageInfo.page = 1;
      this.searchForm.status = name;
      this.getList()
    },
    //分页
    changePageHandler(page) {
      this.pageInfo.page = page;
      this.getList();
    },
    //查看详情
    toDetail(row) {
      // 如果当前用户是税务经理，且税务经理未认领，不可查看详情
      if (!row.disposeId && this.roles.some(el => el.roleCode == 'tax_commissioner')) {
        this.$Message.warning('该工单未认领！');
        return false;
      }
      this.isDetailShow = true;
      this.detailObj = row
      this.serviceId = row.id;
    },

    // 开启修改服务商弹窗
    openEditSupplierModal(row) {
      // row有值，表示单个，没值表示批量
      let self = this;
      let params = {};
      if (row) {
        if (![1].includes(row.status)) {
          this.$Message.warning('仅进度为待上传注册资料和待审核的工单可以修改服务商！')
          return false;
        }
        params = {
          countryCode: row.countryCode,
          supplierType: 1,
        };
        self.editSupplierForm.type = 1;
        self.editSupplierForm.ids = [row.id];
        self.editSupplierForm.supplierName = row.supplierName;
      } else {
        if (this.selectList.length == 0) {
          this.$Message.warning('请先选择要操作的工单！')
          return false;
        }
        if (this.selectList.some(el => ![1].includes(el.status))) {
          this.$Message.warning('仅进度为待上传注册资料和待审核的工单可以修改服务商！')
          return false;
        }
        if (this.selectList.some(el => el.countryCode != this.selectList[0].countryCode)) {
          this.$Message.warning('仅支持同一个国家的工单批量修改服务商，请重新选择！')
          return false;
        }
        params = {
          countryCode: self.selectList[0].countryCode,
          supplierType: 1,
        };
        self.editSupplierForm.type = 2;
        self.editSupplierForm.ids = self.selectList.map(el => el.id);
        self.editSupplierForm.supplierName = self.selectList[0].supplierName;
      }
      self.editSupplierForm.countryCode = params.countryCode;
      extendsAPI.getSupplierCondition(params)
        .then((res) => {
          if (res.code == 0) {
            self.editSupplierModal = true;
            self.editSupplierForm.facilitatorList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        })
    },
    // 取消修改
    editSupplierCancel() {
      this.editSupplierModal = false;
      this.editSupplierForm = {};
    },
    // 修改服务商
    editSupplierSubmit() {
      let self = this;
      if (!self.editSupplierForm.supplierId) {
        this.$Message.warning('请选择要修改的服务商！')
        return false;
      }
      let params = {
        ...this.editSupplierForm,
        ortherFunctionCode: '1',
        supplierType:1,
      };
      this.editSupplierLoading = true;
      this.extendsEditSupplier(params)
        .then((res) => {
          if (res.code == 0) {
            self.$Message.success('修改成功！');
            self.getList();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          self.editSupplierLoading = false;
          self.selectList = [];
          self.editSupplierCancel();
        });
    },

    // 开启修改税务经理弹窗
    openClaimTaxManagerModal(row) {
      // row有值，表示单个，没值表示批量
      let self = this;
      if (row) {
        // self.claimTaxManagerForm.type = 1;
        // self.claimTaxManagerForm.ids = [row.id];
        // self.claimTaxManagerForm.OldDisposeName = row.disposeName;
        let params = {
          serviceId: row.id
        };
        self.$Modal.confirm({
          title: '确定认领吗？',
          content: '',
          onOk: () => {
            self.applyServicesClaimTaxManager(params)
              .then((res) => {
                if (res.code == 0) {
                  self.$Message.success('认领成功！');
                  self.getList();
                }
              })
              .catch((err) => {
                console.log(err);
              })
          },
          onCancel: () => { }
        });
      } else {
        if (this.selectList.length == 0) {
          this.$Message.warning('请先选择要操作的工单！')
          return false;
        }
        self.claimTaxManagerForm.type = 2;
        self.claimTaxManagerForm.ids = self.selectList.map(el => el.id);
        self.claimTaxManagerForm.OldDisposeName = self.selectList[0].disposeName;
        self.claimTaxManagerModal = true;
      }
    },
    // 取消税务经理
    claimTaxManagerCancel() {
      this.claimTaxManagerModal = false;
      this.claimTaxManagerForm = {};
    },
    // 修改税务经理
    claimTaxManagerSubmit() {
      let self = this;
      if (!self.claimTaxManagerForm.disposeId) {
        this.$Message.warning('请选择要修改的税务经理！')
        return false;
      }
      let params = {
        ...this.claimTaxManagerForm,
        disposeName: self.taxManagerModalList.find(el => el.id == self.claimTaxManagerForm.disposeId).name,
        ortherFunctionCode: '1',
      };
      this.claimTaxManagerLoading = true;
      this.extendsClaimTaxManager(params)
        .then((res) => {
          if (res.code == 0) {
            self.$Message.success('修改成功！');
            self.getList();
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          self.claimTaxManagerLoading = false;
          self.selectList = [];
          self.claimTaxManagerCancel();
        });
    },
  }
}
</script>
<style lang="less" scoped>
.container {
  background: #fff;
  padding: 15px;
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
}
.formContainer {
  background: #f8f8f8;
  padding: 20px 20px 0px 20px;
  margin-bottom: 20px;
}
.supplierName {
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    cursor: pointer;
    margin-left: 10px;
    font-size: 16px;
  }
}
.tab {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 20px;
}
.modal {
  /deep/ .ivu-modal-header {
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      p {
        font-size: 16px;
        font-weight: 600;
      }
    }
    .closeBtn {
      font-size: 31px;
      cursor: pointer;
    }
  }
  /deep/ .ivu-transfer {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /deep/ .ivu-table-wrapper {
    overflow: visible;
  }
  .button {
    color: #2d8cf0;
    cursor: pointer;
  }
  .text {
    p {
      height: 40px;
      line-height: 40px;
    }
  }
}
.action {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  /deep/ .ivu-btn {
    margin: 5px 0;
  }
}
</style>