<template>
  <div class="serviceProviderBox">
    <Form ref="searchForm" :model="searchForm" class="formContainer" :label-width="70" inline>
      <FormItem label="国家：" prop="countryCode">
        <Select v-model="searchForm.countryCode" style="width:200px;" clearable>
          <Option v-for="(item,index) in countryList" :value="item.countryCode" :key="index">{{ item.countryNameZh }}</Option>
        </Select>
      </FormItem>
      <FormItem prop="name" :label-width="10">
        <Button type="primary" @click="search">查询</Button>
        <Button type="primary" ghost style="margin-left: 10px" @click="clearHandler">重置</Button>
      </FormItem>
    </Form>
    <div class="table">
      <Table :loading="loading" ref="list" border :columns="columns" :data="tableData">
        <template slot="facilitator_name" slot-scope="{ row }">
          <span v-if="row.isRegConfig == 0" @click="getServices(row,1,'add')" v-show="hasAuthority('serviceProviderAllot_RegSet')" class="button">设置</span>
          <span v-if="row.isRegConfig == 1" @click="getServices(row,1,'read')" v-show="hasAuthority('serviceProviderAllot_RegRead')" class="button maginR">查看</span>
          <span v-if="row.isRegConfig == 1" @click="getServices(row,1,'write')" v-show="hasAuthority('serviceProviderAllot_RegWrite')" class="button">编辑</span>
        </template>
        <template slot="turn_facilitator_name" slot-scope="{ row }">
          <span v-if="row.isTurnConfig == 0" @click="getServices(row,2,'add')" v-show="hasAuthority('serviceProviderAllot_add')" class="button">设置</span>
          <span v-if="row.isTurnConfig == 1" @click="getServices(row,2,'read')" v-show="hasAuthority('serviceProviderAllot_read')" class="button maginR">查看</span>
          <span v-if="row.isTurnConfig == 1" @click="getServices(row,2,'write')" v-show="hasAuthority('serviceProviderAllot_write')" class="button">编辑</span>
        </template>
        <template slot="application" slot-scope="{ row }">
          <!-- <span v-if="row.id==0">暂无记录</span>
          <Poptip v-else word-wrap width="400" title="更改记录" @on-popper-show="popperShowHandler(row.id)">
            <div class="contentBody" slot="content">
              <template v-if="timelineData.length !== 0">
                <template v-for="(item,index) in timelineData">
                  <div class="lineRecord" :key="index">
                    <span>{{item.operator_name||item.create_by_name}} - {{item.created_at}}</span>
                    <p>{{item.option_name}}{{item.option_info}}</p>
                  </div>
                </template>
              </template>
              <div v-else>暂无记录</div>
              <Spin style="z-index:9999" size="large" fix v-if="spinShow"></Spin>
            </div>
            <span class="button">查看</span>
          </Poptip> -->
          <Log :sendId="row.id" btnText="查看"></Log>
        </template>
      </Table>
      <Page class="pagination" @on-page-size-change="pageSizeChangeHandler" @on-change="pageChangeHandler" :page="page" :total="total" :page-size="limit" :page-size-opts="[10, 15, 20, 30]" show-sizer show-total show-elevator />
    </div>
    <Modal class="modal" v-model="serviceProviderModal" width="600" :class="{noPadding:serviceProviderForm.isDisabled}" :mask-closable="false" :closable="false">
      <Form ref="formInline" inline :model="serviceProviderForm" label-position="right" :label-width="100">
        <FormItem label="申请国家：">
          <p style="width: 300px;">{{ serviceProviderForm.countryNameZh }}</p>
        </FormItem>
        <FormItem label="服务类型：">
          <p style="width: 300px;">{{serviceProviderForm.type==1?'注册 + 申报':serviceProviderForm.type==2?'转代理 + 申报':''}}</p>
        </FormItem>
        <FormItem label="服务商：">
          <template v-if="!serviceProviderForm.isDisabled">
            <div class="serviceFlex" v-for="(item,i) in serviceProviderForm.itemVoList">
              <Select style="width:150px;margin-right:10px;" placeholder="请选择服务商" v-model="item.supplierId" :disabled="serviceProviderForm.isDisabled">
                <Option v-for="(item,index) in facilitator_arr" :value="item.id" :key="index" :disabled="serviceProviderForm.itemVoList.map(v=>v.supplierId).includes(item.id)">{{item.shortName}}</Option>
              </Select>
              <Input style="width: 120px;margin-right:10px;" type="number" v-model="item.ratio" :disabled="serviceProviderForm.isDisabled" placeholder="请填写分配比例" />
              <p style="margin-right:30px;">%</p>
              <Button v-if="!(serviceProviderForm.itemVoList.length == 1 && i == 0)" type="error" ghost @click="deleteService(i)">删除</Button>
            </div>
            <Button type="primary" ghost @click="addService()">添加</Button>
            <p class="tips">分配比例请填写正整数，相加需为100%。</p>
          </template>
          <template v-if="serviceProviderForm.isDisabled">
            <Table style="width: 440px;" border :columns="serviceProviderColumns" :data="serviceProviderTableData"></Table>
          </template>
        </FormItem>
      </Form>
      <p>说明：以100个单为一组，按设置的比例高低进行分配，比例高的优先分配，100个单分配完之后，再循环分配。如调整了规则，则之前的分配规则暂停，重新开始分配。</p>
      <div slot="header" class="header">
        <p>{{serviceProviderTitle}}</p>
        <Icon class="closeBtn" @click="cancel" type="ios-close" />
      </div>
      <div slot="footer">
        <Button type="default" v-if="!serviceProviderForm.isDisabled" @click="cancel">取消</Button>
        <Button type="primary" v-if="!serviceProviderForm.isDisabled" @click="serviceProviderHandler()">提交</Button>
      </div>
    </Modal>
  </div>
</template>

<script>

import * as API from "@/api/taxService/serviceProviderAllot";
import Log from "@/view/module/taxService/workOrderManage/serviceProviderAllot/log";
import { getTaxCountry } from '@/api/taxService/common.js';

export default {
  components: {
    Log,
  },
  data() {
    return {
      searchForm: {},

      countryList: [],
      timelineData: [],
      facilitator_arr: [],

      page: 1,
      limit: 10,
      total: 0,

      loading: false,
      columns: [
        {
          title: '国家',
          align: 'center',
          key: 'countryNameZh'
        },
        {
          title: '注册服务商分配',
          align: 'center',
          slot: 'facilitator_name'
        },
        {
          title: '转代理服务商分配',
          align: 'center',
          slot: 'turn_facilitator_name'
        },
        {
          title: '调整记录',
          align: 'center',
          slot: 'application'
        }
      ],
      tableData: [],

      spinShow: false,
      serviceProviderTitle: '设置分配规则',
      serviceProviderModal: false,
      serviceProviderForm: {
        countryCode: '',
        type: '',
        itemVoList: [//注册服务商分配规则
          {
            id: '',
            ratio: '',
          }
        ],
        isDisabled: false,
      },

      serviceProviderColumns: [
        {
          title: '服务商',
          align: 'center',
          key: 'supplierName',
          minWidth: 40,
        },
        {
          title: '当前分配比例',
          align: 'center',
          key: 'ratio',
          render: (h, params) => {
            return h('div', params.row.ratio + '%');
          }
        },
        {
          title: '当前已分配工单数',
          align: 'center',
          key: 'serviceOrderNum'
        },
      ],
      serviceProviderTableData: [],
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
    addService() {
      this.serviceProviderForm.itemVoList.push(
        {
          supplierId: '',
          ratio: '',
        }
      )
    },
    deleteService(index) {
      if (index == 0 && this.serviceProviderForm.itemVoList.length == 1) {
        this.$Message.warning('至少保留一条服务商信息！')
        return false
      }
      this.serviceProviderForm.itemVoList.splice(index, 1)
    },
    // popperShowHandler(id) {
    //   let self = this
    //   let params = {
    //     id
    //   }
    //   self.spinShow = true
    //   API.configStateFacilitatorLogList(params)
    //     .then((res) => {
    //       self.timelineData = res.data
    //       self.spinShow = false
    //     })
    //     .catch((e) => {
    //       self.spinShow = false
    //     })
    // },
    // 确定更改服务商
    serviceProviderHandler() {
      let self = this;
      if (this.serviceProviderForm.itemVoList.some(v => !(v.supplierId && v.ratio))) {
        this.$Message.warning('请填写完整的服务商信息！')
        return
      }
      if (this.serviceProviderForm.itemVoList.some(v => !(Number.isInteger(Number(v.ratio))))) {
        this.$Message.warning('分配比例请填写正整数！')
        return
      }
      if (this.serviceProviderForm.itemVoList.reduce((accumulator, currentValue) => Number(currentValue.ratio) + accumulator, 0) != 100) {
        this.$Message.warning('分配比例相加需为100%！')
        return
      }
      let params = {
        id: self.serviceProviderForm.supplierStateConfigId,
        configType: this.serviceProviderForm.type,
        itemVoList: this.serviceProviderForm.itemVoList.map(el => {
          el.ratio = Number(el.ratio);
          el.configType = self.serviceProviderForm.type;
          el.supplierName = self.facilitator_arr.find(item => item.id == el.supplierId).shortName
          el.supplierStateConfigId = self.serviceProviderForm.supplierStateConfigId
          return el;
        })
      }
      self.serviceProviderModal = false;
      if (self.serviceProviderForm.readOrWrite == 'add') {
        API.addOrUpdateStateConfig(params).then((res) => {
          if (res.code === 0) {
            self.$Message.success('设置成功')
            self.getTableList()
          } else {
            self.$Message.success(res.message)
          }
        })
      } else {
        self.$Modal.confirm({
          title: "提示",
          content: "<p>您正在修改分配规则，是否确认？</p><p style='color:red;'>如调整了规则，则之前的分配规则终止，按新规则重新开始分配。</p>",
          onOk: () => {
            API.addOrUpdateStateConfig(params).then((res) => {
              if (res.code === 0) {
                self.$Message.success('修改成功')
                self.getTableList()
              } else {
                self.$Message.success(res.message)
              }
            })
          },
          onCancel: () => {
            this.serviceProviderModal = true;
          }
        });
      }
    },
    // 取消更改
    cancel() {
      this.serviceProviderModal = false;
      this.getTableList()
    },
    // 取相应国家服务商
    getServices(row, type, readOrWrite) {
      let self = this
      if (row.id) {
        let params = {
          countryCode: row.countryCode,
          supplierType: 1,//注册和转代理都是vat
        };
        API.getSupplierCondition(params)
          .then((res) => {
            if (res.code == 0) {
              self.facilitator_arr = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => {
            if (readOrWrite != 'add') {
              let paramsData = {
                configType: type,
                supplierStateConfigId: row.id
              }
              API.getStateConfigDetail(paramsData)
                .then((res) => {
                  if (res.code === 0) {
                    self.serviceProviderForm = res.data;
                    // 查看或编辑
                    if (readOrWrite == 'read') {
                      self.serviceProviderTitle = '查看分配规则'
                      self.serviceProviderForm.isDisabled = true;
                      self.serviceProviderTableData = res.data.itemVoList;
                    } else {
                      self.serviceProviderTitle = '设置分配规则'
                      self.serviceProviderForm.isDisabled = false;
                    }
                    self.serviceProviderForm.readOrWrite = readOrWrite
                    // 当前列表（1注册服务商   2转代理服务商 ）
                    self.serviceProviderForm.countryCode = row.countryCode
                    self.serviceProviderForm.countryNameZh = row.countryNameZh
                    self.serviceProviderForm.type = type
                    self.serviceProviderForm.supplierStateConfigId = row.id;
                    // 开启弹窗
                    self.serviceProviderModal = true
                  }
                })
                .finally(() => { })
            } else {
              self.serviceProviderTitle = '设置分配规则'
              self.serviceProviderForm.isDisabled = false;
              self.serviceProviderForm.readOrWrite = readOrWrite
              // 当前列表（1注册服务商   2转代理服务商 ）
              self.serviceProviderForm.countryCode = row.countryCode
              self.serviceProviderForm.countryNameZh = row.countryNameZh
              self.serviceProviderForm.itemVoList = []
              self.serviceProviderForm.type = type
              self.serviceProviderForm.supplierStateConfigId = row.id;
              // 开启弹窗
              self.serviceProviderModal = true
            }
          })
      }
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
    // 获取属性列表数据
    getTableList() {
      let self = this
      let params = {
        ...self.searchForm,
        page: self.page,
        limit: self.limit,
      }
      self.loading = true
      API.getTableList(params)
        .then((res) => {
          self.tableData = res.data.records
          self.total = Number(res.data.total)
          self.loading = false
        })
        .catch((e) => {
          self.loading = false
        })
    },
  },
  created() {
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
.serviceProviderBox {
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
.table {
  /deep/ .ivu-table-wrapper {
    overflow: visible;
  }
}
.lineRecord {
  margin-bottom: 10px;
  .ml {
    margin-left: 10px;
  }
}
.contentBody {
  max-height: 400px;
  overflow: auto;
}
.tips {
  color: red;
}
.serviceFlex {
  display: flex;
  margin-bottom: 10px !important;
}
.noPadding {
  /deep/ .ivu-modal-footer {
    padding: 0px !important;
  }
}
.maginR {
  margin-right: 10px;
}
</style>