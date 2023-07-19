<template>
  <div class="payAdmin">
    <Card v-show="listModel">
      <Form ref="searchForm" :model="searchForm" class :label-width="80" inline>
        <FormItem label="商户名称" prop="mchId">
          <Input style="width: 200px" clearable v-model="searchForm.merchantName" placeholder="请输入商户名称" />
        </FormItem>
        <FormItem label="创建时间">
          <DatePicker type="datetimerange" :options="dateOptions" format="yyyy-MM-dd HH:mm:ss" placeholder="请选择创建时间" style="width: 280px" clearable :value="createTime" @on-change="changeCreateTime"></DatePicker>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="searchList">查询</Button>
          <Button @click="clearHandler" type="primary" ghost>重置</Button>
        </FormItem>
      </Form>
      <Table border :columns="columns" :data="data" :loading="loadTable">
        <template slot="status" slot-scope="{ row }">
          <i-switch v-model="row.status" :value="row.status" :true-value="'ENABLE'" :false-value="'CLOSE'" @on-change="isHomeShowSwitch(row)" size="large">
            <span slot="open">开启</span>
            <span slot="close">关闭</span>
          </i-switch>
        </template>
      </Table>
      <Page :total="pageInfo.total" show-elevator show-sizer transfer :current="pageInfo.page" :page-size="pageInfo.size" show-total @on-change="handlePage" @on-page-size-change="handlePageSize" />
    </Card>
  </div>
</template>
<script>
import { getBusinesssList, addBusiness, getBusinessRoute, saveBusinessWay, getPayMainList, getPort, updatedBusiness } from '@/api/payCenter';
export default {
  data() {
    return {
      formRouteName: {
        merchantName: '',
        subjectName: '',
      },
      userName: this.$store.state.user.userName,
      formRouteData: [],
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
      listModel: true,
      isEdit: false,
      listInfo: {},
      loadTable: false,
      loadTableRoute: false,
      modalAll: false,
      modalRoute: false,
      loadEdit: false,
      createTime: '',

      addAllFrom: {
        status: 'ENABLE',
      },
      ruleAllFrom: {
        merchantName: [
          {
            required: true,
            message: '商户名称不能为空',
            trigger: 'blur',
          },
        ],
        merchantNo: [
          {
            required: true,
            message: '商户号不能为空',
            trigger: 'blur',
          },
        ],
        merchantNotifyUrl: [
          {
            required: true,
            message: '商户回调地址不能为空',
            trigger: 'blur',
          },
        ],
        merchantKey: [
          {
            required: true,
            message: 'key不能为空',
            trigger: 'blur',
          },
        ],
        paySubjectId: {
          required: true,
          message: '请选择状态',
          trigger: 'change',
        },
      },
      columns: [
        {
          title: '商户名称',
          key: 'merchantName',
        },
        {
          title: '商户号',
          key: 'merchantNo',
          minWidth: 60,
        },
        {
          title: '关联支付主体',
          key: 'subjectName',
        },
        {
          title: '状态',
          key: 'status',
          slot: 'status',
        },
        {
          title: '创建人',
          key: 'createdBy',
        },
        {
          title: '创建时间',
          key: 'createdTime',
          sortable: true,
          minWidth: 60,
        },
        {
          title: '更新人',
          key: 'updatedBy',
        },
        {
          title: '更新时间',
          key: 'updatedTime',
          sortable: true,
          minWidth: 30,
        },
        {
          title: '操作',
          slot: 'action',
          minWidth: 100,
        },
      ],
      columnsRoute: [
        {
          title: '支付方式',
          key: 'payWayName',
          width: 120,
        },
        {
          title: '介绍',
          key: 'introduce',
          width: 120,
        },
        {
          title: '是否启用',
          key: 'status',
          slot: 'status',
          width: 100,
        },
        {
          title: '支付渠道',
          key: 'paySubjectChannelDTOS',
          slot: 'paySubjectChannelDTOS',
        },
        {
          title: '适用端口',
          // align: 'center',
          key: 'payArry',
          slot: 'payArry',
        },
      ],
      data: [],
      searchForm: {
        status: '',
      },
      searchstatecode: [1, 0],
      pageInfo: {
        total: 0,
        current: 1,
        size: 10,
      },
      selectobj: '',
      selects: [],
      editId: '',
      companyArry: [],
      payWayArry: [],
    };
  },
  methods: {
    getList() {
      this.loadTable = true;
      let obj = this.searchForm;
      let data = { ...this.pageInfo, ...obj };
      getBusinesssList(data)
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
      this.searchForm.startCreatedTime = dateTime[0];
      this.searchForm.endCreatedTime = dateTime[1];
      this.createTime = dateTime;
    },
    isHomeShowSwitch(row) {
      updatedBusiness({ payMerchantId: row.payMerchantId, paySubjectId: row.paySubjectId, status: row.status })
        .then(
          (res) => {
            if (res.code == 0) {
              this.$Message.success('修改成功');
              this.getList();
            }
          },
          (err) => {
            this.loadEdit = false;
          }
        )
        .finally(() => {});
    },
    isHomeShowSwitchChange(row, index) {
      this.formRouteData[index].status = row.status;
    },
    radioChange(row, index) {
      this.formRouteData[index].payChannelId = row.payChannelId;
    },
    checkBoxChange(row, index) {
      this.formRouteData[index].applyPort = row.applyPort;
    },
    addBusinessMange(all) {
      this.$refs[all].validate((valid) => {
        if (valid) {
          let obj = this.addAllFrom;
          obj.userName = this.userName;
          if (this.isEdit) {
            this.editBusinessBtn(obj);
          } else {
            this.addBusinessBtn(obj);
          }
        } else {
          this.loadEdit = false;
        }
      });
    },
    editBusinessBtn(obj) {
      updatedBusiness(obj)
        .then(
          (res) => {
            if (res.code == 0) {
              this.$Message.success('修改成功');
              this.modalAll = false;
              this.loadEdit = false;
              this.getList();
            }
          },
          (err) => {
            this.loadEdit = false;
          }
        )
        .finally(() => {});
    },
    addBusinessBtn(obj) {
      addBusiness(obj)
        .then(
          (res) => {
            if (res.code == 0) {
              this.$Message.success('新增成功');
              this.modalAll = false;
              let data = res.data;
              this.getList();
              this.modalRoute = true;
              this.formRouteName = {
                merchantName: data.merchantName,
                paySubjectId: data.paySubjectId,
                payMerchantId: data.payMerchantId,
              };
              this.businessRouteInfo({ paySubjectId: data.paySubjectId, payMerchantId: data.payMerchantId, payPlatformWayType: 1 });
            }
          },
          (err) => {
            this.loadEdit = false;
          }
        )
        .finally(() => {});
    },
    addRoute() {
      let data = {
        payMerchantWayVOList: [],
        userName: this.userName,
        payMerchantId: this.formRouteName.payMerchantId,
      };
      let formRouteData = this.formRouteData;
      formRouteData.forEach((item) => {
        let json = {
          payChannelId: item.payChannelId,
          payMerchantId: this.formRouteName.payMerchantId,
          payWayId: item.payWayId,
          applyPort: item.applyPort.join(','),
          status: item.status,
        };
        if (item.merchantWayId) {
          json.merchantWayId = item.merchantWayId;
        }
        data.payMerchantWayVOList.push(json);
      });
      saveBusinessWay(data)
        .then(
          (res) => {
            if (res.code == 0) {
              this.modalRoute = false;
              this.getList();
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    searchList() {
      this.pageInfo.current = 1;
      this.getList();
    },
    clearHandler() {
      this.pageInfo.current = 1;
      this.searchForm = {};
      this.createTime = '';
      this.getList();
    },
    editRoute(row) {
      this.modalRoute = true;
      this.formRouteName = {
        merchantName: row.merchantName,
        paySubjectId: row.paySubjectId,
        payMerchantId: row.payMerchantId,
      };
      this.businessRouteInfo({ paySubjectId: row.paySubjectId, payMerchantId: row.payMerchantId, payPlatformWayType: 1 });
    },
    businessRouteInfo(obj) {
      this.loadTableRoute = true;
      getBusinessRoute(obj)
        .then(
          (res) => {
            if (res.code == 0) {
              this.loadTableRoute = false;
              let data = res.data;
              data.forEach((item) => {
                if (!item.status) {
                  item.status = 'ENABLE';
                }
                if (item.applyPort) {
                  item.applyPort = item.applyPort.split(',');
                } else {
                  item.applyPort = [];
                }
              });
              this.formRouteData = res.data;
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    editBtn(row) {
      this.isEdit = true;
      this.modalAll = true;
      this.addAllFrom = {
        status: row.status,
        merchantName: row.merchantName,
        paySubjectId: row.paySubjectId,
        payMerchantId: row.payMerchantId,
        merchantNotifyUrl: row.merchantNotifyUrl,
      };
    },
    changeAdd() {
      this.addAllFrom = {
        status: 'ENABLE',
      };
      this.modalAll = true;
      this.isEdit = false;
    },
    getPayLsit() {
      getPayMainList({ current: 1, size: 999, status: 'ENABLE' })
        .then(
          (res) => {
            if (res.code == 0) {
              let data = res.data.records;
              if (data) {
                this.companyArry = data;
              } else {
                this.companyArry = [];
              }
            }
          },
          (err) => {}
        )
        .finally(() => {});
    },
    getPortList() {
      getPort({ current: 1, size: 999 })
        .then(
          (res) => {
            if (res.code == 0) {
              let payWayArry = [];
              for (name in res.data) {
                payWayArry.push({ name: res.data[name], id: name });
              }
              this.payWayArry = payWayArry;
            }
          },
          (err) => {}
        )
        .finally(() => {});
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
  },
  mounted() {
    this.getList();
    this.getPayLsit();
    this.getPortList();
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
