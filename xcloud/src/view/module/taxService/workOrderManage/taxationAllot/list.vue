<template>
  <div>
    <div class="taxationAllot">
      <Form class="formContainer" :model="searchForm" inline :label-width="90">
        <FormItem label="国家：" prop="countryCode">
          <Select v-model="searchForm.countryCode" style="width:200px;" clearable>
            <Option v-for="(item,index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem label="配置状态：" prop="status">
          <Select v-model="searchForm.status" style="width:200px;" clearable>
            <Option :value="1">已配置</Option>
            <Option :value="0">未配置</Option>
          </Select>
        </FormItem>
        <FormItem label="税务经理：" prop="taxManagerId">
          <Select v-model="searchForm.taxManagerId" style="width:200px;" clearable>
            <Option v-for="(item,index) in taxManagerList" :value="item.id" :key="index">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="name" :label-width="10">
          <Button type="primary" @click="search">查询</Button>
          <Button type="primary" ghost style="margin-left: 10px" @click="clearHandler">重置</Button>
        </FormItem>
      </Form>
      <!-- 表格 -->
      <div style="margin-top:20px;">
        <Table border :loading="loading" :columns="columns" :data="tableData">
          <template slot="taxAtionAllot" slot-scope="{ row,index }">
            <div>{{row.taxAtionAllotName}}</div>
          </template>
          <template slot="log" slot-scope="{ row,index }">
            <Log :sendId="row.id" btnText="查看"></Log>
            <!-- <span v-if="row.logCount == 0">暂无</span> -->
          </template>
          <template slot="operation" slot-scope="{ row,index }">
            <span class="button" v-if="row.status == 0" @click="openAllocModal(row,'addAlloc')" v-show="hasAuthority('taxationAllot_addAllot')">【新增配置】</span>
            <template v-else>
              <span class="button" @click="openAllocModal(row,'editAlloc')" v-show="hasAuthority('taxationAllot_editAlloc')">【修改】</span>
              <span class="button" @click="deleteAlloc(row)" v-show="hasAuthority('taxationAllot_deleteAlloc')">【删除】</span>
            </template>
          </template>
        </Table>
        <Page class="pagination" @on-page-size-change="pageSizeChangeHandler" @on-change="pageChangeHandler" :current="page" :total="total" :page-size="limit" :page-size-opts="[10, 15, 20, 30]" show-sizer show-total show-elevator />
      </div>
      <!-- 新增配置 -->
      <Modal class="modal" v-model="addAllocModal" :mask-closable="false" :closable="false">
        <div>
          <Transfer :data="taxManagerList" :titles="['可选择税务经理','已选择税务经理']" :target-keys="targetKeys" :render-format="renderFormat" @on-change="handleChange"></Transfer>
        </div>
        <div slot="header" class="header">
          <p>当前配置国家：{{currentCountryName}}</p>
          <Icon class="closeBtn" @click="addAllocCancel" type="ios-close" />
        </div>
        <div slot="footer">
          <Button type="primary" :loading="addAllocLoading" @click="addAllocConfirm">确定</Button>
          <Button type="default" @click="addAllocCancel">取消</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>

<script>
import * as API from "@/api/taxService/taxationAllot";
import { getTaxCountry } from '@/api/taxService/common.js';
import Log from "@/view/module/taxService/workOrderManage/taxationAllot/components/log";
export default {
  components: {
    Log,
  },
  data() {
    return {
      searchForm: {},
      countryList: [],
      taxManagerList: [],

      columns: [
        {
          title: "编号",
          key: "id",
          align: "center",
          width: 60,
        },
        {
          title: "国家",
          key: "countryName",
          align: "center",
        },
        {
          title: "关联税务经理",
          slot: "taxAtionAllot",
          align: "center",
        },
        {
          title: "操作记录",
          slot: "log",
          align: "center",
          minWidth: 200,
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

      deleteAllocModal: false,
      deleteAllocLoading: false,

      addAllocModal: false,
      addAllocLoading: false,
      currentCountryName: '',
      currentCountryCode: '',
      currentModalType: '',
      currentID: '',
      targetKeys: [],
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
    // 开启弹窗
    openAllocModal(row, type) {
      this.addAllocModal = true;
      this.currentModalType = type;
      this.currentCountryName = row.countryName;
      this.currentCountryCode = row.countryCode;
      this.currentID = row.id;
      if (row.value) {
        this.targetKeys = row.value.map(el => el.id);
      } else {
        this.targetKeys = [];
      }
    },
    // 穿梭框显示内容
    renderFormat(item) {
      return item.name;
    },
    // 穿梭框change
    handleChange(newTargetKeys, direction, moveKeys) {
      this.targetKeys = newTargetKeys;
    },
    // 确认新增
    addAllocConfirm() {
      let self = this;
      if (this.targetKeys.length == []) {
        this.$Message.warning('请选择要关联的税务经理！');
        return false;
      }
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认提交？</p><p>提交后，该国家的工单将按最新的配置进行自动分配。</p>',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let params = {
            id: self.currentID,
            countryCode: self.currentCountryCode,
            allocJson: JSON.stringify(self.targetKeys.map(el => {
              return {
                id: el,
                name: self.taxManagerList.find(item => item.id == el).name
              };
            })),
          };
          self.addAllocLoading = true;
          API[self.currentModalType](params)
            .then((res) => {
              if (res.code == 0) {
                self.$Message.success('提交成功！');
                self.addAllocCancel();
                self.getTableList();
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .finally(() => {
              self.addAllocLoading = false;
            });
        },
        onCancel: () => {
          self.addAllocCancel();
        }
      });
    },
    // 取消新增
    addAllocCancel() {
      this.addAllocModal = false;
      this.currentModalType = '';
    },
    // 删除配置
    deleteAlloc(row) {
      let self = this;
      this.$Modal.confirm({
        title: '提示',
        content: '<p>是否确认删除配置？</p><p>删除后，该国家的工单将不进行自动分配，需要税务经理自行认领。</p>',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let params = {
            id: row.id,
            countryCode: row.countryCode,
            allocJson: JSON.stringify(row.value),
          };
          API.deleteAlloc(params)
            .then((res) => {
              if (res.code == 0) {
                self.$Message.success('删除成功！');
                self.getTableList();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        },
        onCancel: () => { }
      });
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
    // 获取税务经理下拉
    getTaxManagerList() {
      let self = this;
      API.taxManagerList()
        .then((res) => {
          if (res.code == 0) {
            self.taxManagerList = res.data.map(el => {
              return {
                key: el.userId,
                id: el.userId,
                name: el.nickName,
              };
            });
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
      API.allocList(params)
        .then((res) => {
          if (res.code == 0) {
            // console.log(res)
            this.tableData = res.data.records;
            this.tableData.forEach(el => {
              if (el.value) {
                el.value = JSON.parse(el.value);
                el.taxAtionAllotName = el.value.reduce((acc, cur) => { return acc += '\\' + cur.name }, '').slice(1);
              } else {
                el.taxAtionAllotName = '未配置'
              }
            })
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
    this.getTaxManagerList();
    this.getCountryList();
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
}
</style>