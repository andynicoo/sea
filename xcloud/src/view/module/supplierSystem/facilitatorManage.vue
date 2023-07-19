<template>
  <div>
    <div class="taxationAllot">
      <Form class="formContainer" :model="searchForm" inline :label-width="80">
        <FormItem label="服务国家：" prop="countryCode">
          <Select v-model="searchForm.countryCode" style="width:200px;" clearable>
            <Option v-for="(item,index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem label="服务类型：" prop="supplierType">
          <Select v-model="searchForm.supplierType" style="width:200px;" clearable>
            <Option v-for="(item,index) in supplierTypeList" :value="item.code" :key="index">{{ item.value }}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态：" prop="status">
          <Select v-model="searchForm.status" style="width:200px;" clearable>
            <Option :value="1">未启用</Option>
            <Option :value="2">已启用</Option>
          </Select>
        </FormItem>
        <FormItem label="" prop="inputStr" :label-width="40">
          <Input v-model="searchForm.inputStr" style="width:200px;" placeholder="请输入服务商名称/简称" clearable />
        </FormItem>
        <FormItem prop="name" :label-width="10">
          <Button type="primary" @click="search">查询</Button>
          <Button type="primary" ghost style="margin-left: 10px" @click="clearHandler">重置</Button>
        </FormItem>
      </Form>
      <div class="tabBar">
        <Button type="primary" @click="openAddFacilitatorModal()" v-show="hasAuthority('facilitatorManage_add')">+ 新增服务商</Button>
      </div>
      <!-- 表格 -->
      <div style="margin-top:20px;">
        <Table border :loading="loading" :columns="columns" :data="tableData">
          <template slot="supplierType" slot-scope="{ row,index }">
            <p v-if="row.supplierType">{{supplierTypeList[row.supplierType - 1].value}}</p>
          </template>
          <template slot="status" slot-scope="{ row,index }">
            <p v-if="row.status == 1">未启用</p>
            <p v-if="row.status == 2">已启用</p>
          </template>
          <template slot="log" slot-scope="{ row,index }">
            <Log :sendId="row.id" btnText="查看"></Log>
          </template>
          <template slot="operation" slot-scope="{ row,index }">
            <span class="button" style="margin-right:10px;" @click="openLookFacilitator(row,'新增')" v-show="hasAuthority('facilitatorManage_look')">查看</span>
            <span class="button" @click="openAddFacilitatorModal(row,'编辑')" v-show="hasAuthority('facilitatorManage_edit')">编辑</span>
          </template>
        </Table>
        <Page class="pagination" @on-page-size-change="pageSizeChangeHandler" @on-change="pageChangeHandler" :current="page" :total="total" :page-size="limit" :page-size-opts="[10, 15, 20, 30]" show-sizer show-total show-elevator />
      </div>
      <!-- 新增服务商 -->
      <Modal class="modal" v-model="addFacilitatorModal" :mask-closable="false" :closable="false">
        <Form ref="form" :model="addFacilitatorForm" :rules="addFacilitatorRules" :label-width="120">
          <FormItem label="服务商名称" prop="supplierName">
            <Input v-model="addFacilitatorForm.supplierName" style="width:200px;" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="服务商简称" prop="shortName">
            <Input v-model="addFacilitatorForm.shortName" style="width:200px;" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="服务商类型" prop="supplierType">
            <RadioGroup v-model="addFacilitatorForm.supplierType">
              <Radio :label="item.code" v-for="(item,index) in supplierTypeList">{{item.value}}</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="服务国家" prop="countryCode">
            <Select v-model="addFacilitatorForm.countryCode" style="width:200px;" clearable>
              <Option v-for="(item,index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
            </Select>
          </FormItem>
          <FormItem label="联系人" prop="contacts">
            <Input v-model="addFacilitatorForm.contacts" style="width:200px;" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="联系电话" prop="contactsTell">
            <Input v-model="addFacilitatorForm.contactsTell" style="width:200px;" placeholder="请输入"></Input>
          </FormItem>
          <FormItem label="联系邮箱" prop="email">
            <Input v-model="addFacilitatorForm.email" style="width:200px;" placeholder="请输入"></Input>
            <p class="redFont">服务商通过邮箱接收注册资料、申报数据，请确保信息填写无误</p>
          </FormItem>
          <FormItem label="是否需要支付税金" prop="isPayTaxes">
            <RadioGroup v-model="addFacilitatorForm.isPayTaxes">
              <Radio label="2">是</Radio>
              <Radio label="1">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="服务商状态" prop="status">
            <RadioGroup v-model="addFacilitatorForm.status">
              <Radio label="1">未启用</Radio>
              <Radio label="2">已启用</Radio>
            </RadioGroup>
          </FormItem>
        </Form>
        <div slot="header" class="header">
          <p>{{addFacilitatorTitle}}</p>
          <Icon class="closeBtn" @click="addFacilitatorCancel" type="ios-close" />
        </div>
        <div slot="footer">
          <Button type="default" @click="addFacilitatorCancel">取消</Button>
          <Button type="primary" :loading="addFacilitatorLoading" @click="addFacilitatorSubmit('form')">提交</Button>
        </div>
      </Modal>
      <!-- 查看 -->
      <Modal class="modal modal1" v-model="lookFacilitatorModal" :mask-closable="false" :closable="false">
        <Form :model="lookFacilitatorForm" :label-width="120">
          <FormItem label="服务商名称：" prop="supplierName">
            <p>{{lookFacilitatorForm.supplierName}}</p>
          </FormItem>
          <FormItem label="服务商简称：" prop="shortName">
            <p>{{lookFacilitatorForm.shortName}}</p>
          </FormItem>
          <FormItem label="服务商类型：" prop="supplierType">
            <p v-if="lookFacilitatorForm.supplierType">{{supplierTypeList[lookFacilitatorForm.supplierType - 1].value}}</p>
          </FormItem>
          <FormItem label="服务国家：" prop="countryCode">
            <p>{{lookFacilitatorForm.countryName}}</p>
          </FormItem>
          <FormItem label="联系人：" prop="contacts">
            <p>{{lookFacilitatorForm.contacts}}</p>
          </FormItem>
          <FormItem label="联系电话：" prop="contactsTell">
            <p>{{lookFacilitatorForm.contactsTell}}</p>
          </FormItem>
          <FormItem label="联系邮箱：" prop="email">
            <p>{{lookFacilitatorForm.email}}</p>
          </FormItem>
          <FormItem label="是否需要支付税金：" prop="isPayTaxes">
            <p v-if="lookFacilitatorForm.isPayTaxes == 2">是</p>
            <p v-if="lookFacilitatorForm.isPayTaxes == 1">否</p>
          </FormItem>
          <FormItem label="服务商状态：" prop="status">
            <p v-if="lookFacilitatorForm.status == 1">未启用</p>
            <p v-if="lookFacilitatorForm.status == 2">已启用</p>
          </FormItem>
        </Form>
        <div slot="header" class="header">
          <p>查看服务商信息</p>
          <Icon class="closeBtn" @click="lookFacilitatorCancel" type="ios-close" />
        </div>
        <div slot="footer"></div>
      </Modal>
    </div>
  </div>
</template>

<script>
import * as API from "@/api/supplierSystem/facilitatorManage";
import { getTaxCountry } from '@/api/taxService/common.js';
import Log from "@/view/module/supplierSystem/components/log";
export default {
  components: {
    Log,
  },
  data() {
    return {
      searchForm: {},
      countryList: [],
      supplierTypeList: [],

      columns: [
        {
          title: "序号",
          key: "id",
          align: "center",
          width: 60,
        },
        {
          title: "服务商名称",
          key: "supplierName",
          align: "center",
        },
        {
          title: "服务商简称",
          key: "shortName",
          align: "center",
        },
        {
          title: "服务类型",
          slot: "supplierType",
          align: "center",
        },
        {
          title: "服务国家",
          key: "countryName",
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
          width: 150,
        },
      ],
      tableData: [],
      loading: false,

      page: 1,
      limit: 10,
      total: 0,

      addFacilitatorModal: false,
      addFacilitatorLoading: false,
      addFacilitatorTitle: '新增服务商',
      addFacilitatorForm: {},
      addFacilitatorRules: {
        supplierName: [
          {
            required: true,
            message: "服务商名称不能为空!",
            trigger: "blur",
          },
        ],
        shortName: [
          {
            required: true,
            message: "服务商简称不能为空!",
            trigger: "blur",
          },
        ],
        supplierType: [
          {
            required: true,
            message: "请选择服务商类型!",
            trigger: "change",
          },
        ],
        countryCode: [
          {
            required: true,
            message: "服务国家不能为空!",
            trigger: "blur",
          },
        ],
        contacts: [
          {
            required: true,
            message: "联系人不能为空!",
            trigger: "blur",
          },
        ],
        contactsTell: [
          {
            required: true,
            message: "联系电话不能为空!",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "联系邮箱不能为空!",
            trigger: "blur",
          },
        ],
        isPayTaxes: [
          {
            required: true,
            message: "请选择是否需要支付税金!",
            trigger: "change",
          },
        ],
        status: [
          {
            required: true,
            message: "请选择服务商状态!",
            trigger: "change",
          },
        ],
      },

      lookFacilitatorModal: false,
      lookFacilitatorForm: {},
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
    // 开启新增服务商弹窗
    openAddFacilitatorModal(row,type) {
      let self = this;
      if (!!row) {
        this.addFacilitatorTitle = type + '服务商';
        let params = {
          supplierId: row.id
        };
        API.getSupplierConfigDetail(params)
          .then((res) => {
            if (res.code == 0) {
              self.addFacilitatorModal = true;
              self.addFacilitatorForm = res.data;
              for (const attr in self.addFacilitatorForm) {
                if (typeof self.addFacilitatorForm[attr] == 'number') {
                  self.addFacilitatorForm[attr] = '' + self.addFacilitatorForm[attr];
                }
              };
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        this.addFacilitatorModal = true;
        this.addFacilitatorForm = {};
      }
    },
    // 提交
    addFacilitatorSubmit(name) {
      let self = this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          let params = {
            ...self.addFacilitatorForm,
            countryName: self.countryList.find(el => el.countryCode == self.addFacilitatorForm.countryCode).countryNameZh,
          };
          self.addFacilitatorLoading = true;
          API.addOrUpdateSupplier(params)
            .then((res) => {
              if (res.code == 0) {
                self.$Message.success('提交成功！');
                self.addFacilitatorCancel();
                self.getTableList();
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              self.addFacilitatorLoading = false;
            });
        }
      })
    },
    // 取消
    addFacilitatorCancel() {
      this.addFacilitatorModal = false;
      this.addFacilitatorForm = {};
    },
    // 查看
    openLookFacilitator(row) {
      let self = this;
      let params = {
        supplierId: row.id
      };
      API.getSupplierConfigDetail(params)
        .then((res) => {
          if (res.code == 0) {
            self.lookFacilitatorModal = true;
            self.lookFacilitatorForm = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 关闭查看
    lookFacilitatorCancel() {
      this.lookFacilitatorModal = false;
      this.lookFacilitatorForm = {};
    },
    // 获取国家下拉
    getCountryList() {
      let self = this;
      getTaxCountry()
        .then((res) => {
          if (res.code == 0) {
            self.countryList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 获取服务类型下拉
    getEtaxTypesInfo() {
      let self = this;
      API.getEtaxTypesInfo()
        .then((res) => {
          if (res.code == 0) {
            self.supplierTypeList = res.data;
          }
        })
        .catch((err) => {
          console.log(err);
        });
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
    // 获取列表数据
    getTableList() {
      let self = this;
      let pageData = {
        page: self.page,
        limit: self.limit,
      };
      let params = {
        ...pageData,
        ...self.searchForm,
      };
      API.facilitatorList(params)
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
    this.getEtaxTypesInfo();
    this.getCountryList();
    this.getTableList();
  },
}
</script>

<style scoped lang="less">
.formContainer {
  background: #f8f8f8;
  padding: 20px 20px 0px 20px;
  margin-bottom: 20px;
}
.taxationAllot {
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
.tabBar {
  // padding: 10px;
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
  .boldFont {
    font-weight: 600;
  }
  .redFont {
    color: red;
  }
}
.modal1 {
  /deep/ .ivu-modal-footer {
    border: none;
    padding: 0;
  }
}
</style>