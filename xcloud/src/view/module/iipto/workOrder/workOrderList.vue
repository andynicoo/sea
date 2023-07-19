<template>
  <div>
    <Card v-if="!isShowDetail"
          class="top-card">
      <p class="title">数据筛选</p>
      <Form ref="searchForm"
            :model="searchForm"
            class="top-serach-box"
            inline>
        <FormItem style="margin-bottom:10px">
          <Input v-model="searchForm.orderNo"
                 clearable
                 placeholder="订单编号"
                 style="width:150px;" />
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Input v-model="searchForm.searchContent"
                 clearable
                 placeholder="公司名称/手机号/服务号"
                 style="width:150px;" />
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Input v-model="searchForm.acceptNum"
                 clearable
                 placeholder="受理号/商标名称"
                 style="width:150px;" />
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Input v-model="searchForm.productName"
                 clearable
                 placeholder="服务名称"
                 style="width:150px;" />
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Select clearable
                  v-model="searchForm.countryCode"
                  placeholder="国家">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Select clearable
                  v-model="searchForm.status"
                  placeholder="注册进度">
            <Option v-for="(item,index) in progressBarList"
                    :value="item.key"
                    :key="index">{{ item.val }}</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Select clearable
                  v-model="searchForm.servicesStatus"
                  placeholder="服务状态">
            <Option v-for="(item,index) in serviceBarList"
                    :value="item.key"
                    :key="index">{{ item.val }}</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Input v-model="searchForm.handleUser"
                 clearable
                 placeholder="处理人"
                 style="width:150px;" />
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <DatePicker type="daterange"
                      placeholder="选择创建时间"
                      v-model="searchForm.declareEndTime"
                      @on-change="changeDate"
                      style="width:180px;"></DatePicker>
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <DatePicker type="daterange"
                      placeholder="选择修改时间"
                      v-model="searchForm.updateTime"
                      @on-change="changeUpdateDate"
                      style="width:180px;"></DatePicker>
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <DatePicker type="daterange"
                      placeholder="选择受理日期"
                      v-model="searchForm.acceptTime"
                      @on-change="changeAcceptDate"
                      style="width:180px;"></DatePicker>
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Select clearable
                  v-model="searchForm.orderSource"
                  placeholder="渠道来源">
            <Option value="0">PC网页端</Option>
            <Option value="2">H5</Option>
            <Option value="3">录入订单</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.orderBusinessSource"
                  placeholder="订单来源">
            <Option value="1">必胜道</Option>
            <Option value="2">卖家成长</Option>
            <Option value="3">跨标云</Option>
          </Select>
        </FormItem>
        <FormItem class="search-btn">
          <Button type="primary"
                  @click="searchList(1)"
                  style="margin: 0 12px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card style="margin-top:15px;padding-bottom:70px;"
          v-if="!isShowDetail">
      <div class="tableArea">
        <Tabs :value="searchForm.status"
              :animated="false"
              @on-click="tabsChange">
          <TabPane label="全部"
                   name=" "></TabPane>
          <TabPane label="待提交资料"
                   name="1"></TabPane>
          <TabPane label="初步审核"
                   name="2"></TabPane>
          <TabPane label="待录入证据"
                   name="6"></TabPane>
          <TabPane label="律师审核"
                   name="5"></TabPane>
          <TabPane label="资料被驳回"
                   name="4"></TabPane>
          <TabPane label="审核期"
                   name="-1"></TabPane>
          <Button style="float:right;"
                  v-show="hasAuthority('task_list_20')"
                  @click="batchChangeHandlerFunc">批量修改处理人</Button>
        </Tabs>
        <Table border
               :loading="tableLoading"
               :columns="columns"
               :data="tableData"
               style="margin-top:14px;"
               @on-selection-change="selectChange">
          <template slot="trademarkInfo"
                    slot-scope="{ row }">
            <p>订单号：{{row.orderNo}}</p>
            <p>服务编号：{{row.serverNo}}</p>
            <p>商标名称：
              <span v-html="row.trademarkName"></span>
            </p>
            <p>服务：{{row.countryNameZh}}{{$functionCodeList(row.productFunctionCode)}}</p>
          </template>
          <template slot="acceptInfo"
                    slot-scope="{ row }">
            <p>受理号：
              <span>{{row.acceptNum}}</span>
            </p>
            <p>受理日期：{{row.acceptTime.slice(0, 10)}}</p>
          </template>
          <template slot="handleInfo"
                    slot-scope="{ row }">
            <p style="margin-bottom:4px;">客服：{{row.customerServiceName || '无'}}</p>
            <p style="margin-bottom:4px;">订单跟进人：{{row.followUserName || '无'}}</p>
            <div v-if="row.handlerUserInfos!=''">
              <p style="margin-bottom:4px;"
                 v-for="(item,index) in JSON.parse(row.handlerUserInfos)"
                 :key="index">{{item.assessmentType==1?'初审处理人：':item.assessmentType==2?'律师：':item.assessmentType==3?'注册处理人：':item.assessmentType==4?'审查意见处理人：':''}}
                <span>{{item.realName}}</span>
              </p>
            </div>
          </template>
          <template slot="operate"
                    slot-scope="{ row }">
            <!-- <Button v-if="row.status == 0" type="info" @click="sendMessage(row)" ghost>发送提醒</Button> -->
            <Button type="info"
                    ghost
                    v-show="hasAuthority('task_list01')"
                    @click="toDetail(row)">查看</Button>
          </template>
        </Table>
      </div>
    </Card>
    <Card class="page-box"
          v-if="!isShowDetail">
      <Page @on-change="changePageHandler"
            @on-page-size-change="handlePageSize"
            :current="pageInfo.page"
            :total="pageInfo.total"
            :page-size="pageInfo.limit"
            show-total
            show-elevator
            show-sizer />
    </Card>
    <workOrderDetail v-if="isShowDetail"
                     @back="isShowDetail=false;searchList()"
                     :orderStatus="orderStatus"
                     :countryCode="countryCode"
                     :categoryCount="categoryCount"
                     :productFunctionCode="productFunctionCode"
                     :serviceTemplatetype="serviceTemplatetype"
                     :servicesId="servicesId"></workOrderDetail>
    <Modal v-model="handlerTypeModal"
           title="修改处理人">
      <Form :model="formCodeItem"
            :label-width="100"
            ref="formCodeItem">
        <FormItem label="处理人类型："
                  prop="assessmentType">
          <Select v-model="formCodeItem.assessmentType"
                  @on-change="changeAssessmentType"
                  label-in-value
                  placeholder="请选择处理人类型">
            <Option v-for="(item,index) in handlerList"
                    :value="item.value"
                    :key="index">{{ item.roleType }}</Option>
          </Select>
        </FormItem>
        <FormItem label="指定处理人：">
          <span class="handler-class"
                @click="checkHandlerFunc">{{staffInfo.realName||'选择处理人'}}
            <Icon type="ios-create-outline"
                  size="18" />
          </span>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="handlerTypeModal=false">取消</Button>
        <Button type="primary"
                @click="sureFilingCode('formCodeItem')">确认</Button>
      </p>
    </Modal>
    <Modal v-model="handlerModal"
           @on-cancel="cancelUserFunc"
           :title="formCodeItem.assessmentType==2?'指派律师':'指派处理人'">
      <Select v-if="formCodeItem.assessmentType==2"
              v-model="staffInfo.userId"
              label-in-value
              @on-change="changeLaywyer">
        <Option v-for="(item,index) in lawyerList"
                :value="item.id"
                :key="index">{{ item.attorneyName }}</Option>
      </Select>
      <div v-else>
        <Form :model="staffInfo"
              class="form-box"
              :label-width=80>
          <FormItem label="部门名称:">
            <Select v-model="staffInfo.departmentId"
                    label-in-value
                    @on-change="changeDepartment"
                    placeholder="部门名称">
              <Option :value="item.departmentId"
                      v-for="(item,index) in departmentList"
                      :key="index">{{item.departmentName}}</Option>
            </Select>
          </FormItem>
          <FormItem label="员工姓名:">
            <Select v-model="staffInfo.userId"
                    label-in-value
                    @on-change="changeStaffFunc"
                    placeholder="员工姓名">
              <Option :value="item.userId"
                      v-for="(item,index) in staffList"
                      :key="index">{{item.nickName}}</Option>
            </Select>
          </FormItem>
        </Form>
      </div>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="cancelUserFunc()">取消</Button>
        <Button type="primary"
                @click="sureUserFunc()">确定</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { serviceList, UpdateApproveUserApi } from '@/api/iipto/workOrder'
import workOrderDetail from "./workOrderDetail";
import { progressBarList } from '@/libs/iipto.js'
import { getAllUserAndDepartmentApi } from '@/api/iipto/deliveryData'
import { lawyerListApi } from '@/api/iipto/lawyer.js'
import { getServiceCountry } from '@/api/iipto/common.js';
export default {
  components: {
    workOrderDetail
  },
  data() {
    return {
      countryList: [],
      searchForm: {
        status: ''
      },
      tableLoading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center',
          fixed: 'left'
        },
        {
          title: '商标',
          slot: 'trademarkInfo',
          width: 180
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: '70px'
        },
        {
          title: '申请人',
          render(h, params) {
            let applyType = params.row.applyType
            let applyName = ''
            if (applyType == 1) {
              applyName = params.row.applycompanyEn
            } else if (applyType == 0) {
              if (params.row.applyLastNameEn != '') {
                applyName = params.row.applyLastNameEn + ',' + params.row.applyNameEn
              }
            }
            return h('span', applyName)
          }
        },
        {
          title: '注册进度',
          render: (h, { row }) => {
            let status = row.progressBar
            return h('span', this.$iiptoProgressBar(status))
          }
        },
        {
          title: '服务状态',
          width: 80,
          render(h, { row }) {
            let status = row.status, type = '', color = ''
            switch (status) {
              case 1:
                type = '正常'
                break;
              case 2:
                type = '已退款'
                break;
              case 3:
                type = '退款中'
                break;
              default:
                break;
            }
            return h('span', [
              h('span', {
                style: {
                  color: color
                }
              }, type)
            ])
          }
        },
        {
          title: '受理号/日期',
          slot: 'acceptInfo'
        },
        {
          title: '修改时间',
          sortable: true,
          key: 'dataSubmitTime'
        },
        {
          title: '创建时间',
          sortable: true,
          key: 'createTime'
        },
        {
          title: '处理人',
          slot: 'handleInfo',
          width: 170
        },
        {
          title: '备注',
          key: 'orderRemark',
          width: 160,
          tooltip: true
        },
        {
          title: '操作',
          slot: 'operate',
          width: 80,
          fixed: 'right'
        }
      ],
      tableData: [],
      pageInfo: {
        total: 0,
        limit: 10,
        page: 1
      },
      isShowDetail: false,
      orderStatus: '',
      selectList: [],
      countryCode: '',
      progressBarList: [],
      serviceBarList: [
        {
          key: '1',
          val: '正常'
        },
        {
          key: '2',
          val: '已退款'
        },
        {
          key: '3',
          val: '退款中'
        }
      ],
      handlerTypeModal: false,
      formCodeItem: {},
      handlerList: [
        {
          roleType: '客服',
          value: '0'
        },
        {
          roleType: '初审处理人',
          value: '1'
        },
        {
          roleType: '律师',
          value: '2'
        },
        {
          roleType: '注册处理人',
          value: '3'
        },
        {
          roleType: '审查意见处理人',
          value: '4'
        }
      ],
      handlerModal: false,
      staffInfo: {
        realName: ''
      },
      departmentList: [],
      staffList: [],
      lawyerList: [],
      categoryCount: '',
      productFunctionCode: 0,
      serviceTemplatetype: ''
    }
  },
  methods: {
    getCountryList() {
      getServiceCountry().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data
        }
      })
    },
    searchList(page) {
      if (page) {
        this.pageInfo.page = page
      }
      let data = { ...this.searchForm }
      delete data.declareEndTime
      delete data.updateTime
      delete data.acceptTime
      if (data.status == '') {
        delete data.status
      }
      data.page = this.pageInfo.page
      data.limit = this.pageInfo.limit
      this.selectList = []
      serviceList(data).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.records
          this.pageInfo = {
            page: Number(res.data.current),
            total: Number(res.data.total),
            limit: Number(res.data.size)
          }
        }
      })
    },
    resetList() {
      this.searchForm = {};
    },
    selectChange(val) {
      this.selectList = val
    },
    tabsChange(name) {
      this.searchForm.status = name;
      this.searchList(1)
    },
    toDetail(row) {
      this.servicesId = row.id
      this.orderStatus = row.progressBar
      this.countryCode = row.countryCode
      this.categoryCount = row.categoryCount
      this.productFunctionCode = row.productFunctionCode
      this.serviceTemplatetype = row.serviceTemplatetype
      this.isShowDetail = true
    },
    changePageHandler(page) {
      this.pageInfo.page = page
      this.searchList()
    },
    handlePageSize(pageSize) {
      this.pageInfo.limit = pageSize
      this.searchList(1)
    },
    copyLink() {
      let _this = this;
      let clipboard = new this.clipboard(".cobyOrderSn");
      clipboard.on('success', function () {
        _this.$Message.success("复制成功")
      });
      clipboard.on('error', function () {
        _this.$Message.info("复制失败")
      });
      setTimeout(() => {
        clipboard.destroy()
      }, 1000);
    },
    changeDate(date) {
      this.searchForm.createEndTime = date[1]
      this.searchForm.createStartTime = date[0]
    },
    changeUpdateDate(date) {
      this.searchForm.dataSubmitEndTime = date[1]
      this.searchForm.dataSubmitStartTime = date[0]
    },
    changeAcceptDate(date) {
      this.searchForm.acceptEndTime = date[1]
      this.searchForm.acceptStartTime = date[0]
    },
    //批量修改处理人
    batchChangeHandlerFunc() {
      if (this.selectList.length == 0) {
        this.$Message.info('请先选择服务')
        return
      }
      this.handlerTypeModal = true
    },
    checkHandlerFunc() {
      if (this.formCodeItem.assessmentType == '') {
        this.$Message.info('请先选择处理人类型')
        return
      }
      if (this.formCodeItem.assessmentType == 2) {
        this.getLawyerListFunc()
      } else {
        this.getUserAPi()
      }
      this.handlerModal = true
    },
    getUserAPi() {
      getAllUserAndDepartmentApi().then(res => {
        if (res.code == 0) {
          if (res.data) {
            this.departmentList = res.data
          }
        }
      })
    },
    getLawyerListFunc() {
      let data = {
        limit: 20,
        page: 1,
        isOpen: '1'
      }
      lawyerListApi(data).then(res => {
        if (res.code === 0) {
          this.lawyerList = res.data.records
        }
      })
    },
    changeAssessmentType(val) {
      if (val != undefined) {
        this.formCodeItem.assessmentName = val.label
      }
      this.staffInfo.realName = ''
    },
    changeLaywyer(val) {
      if (val != undefined) {
        this.staffInfo.realName = val.label
        this.staffInfo.userId = val.value
      }
    },
    changeDepartment(val) {
      if (val != undefined) {
        this.departmentList.map(item => {
          if (val.value == item.departmentId) {
            this.staffList = item.children
          }
        })
        this.staffInfo.department = val.label
      }
    },
    changeStaffFunc(val) {
      if (val != undefined) {
        this.staffInfo.realName = val.label
      }
    },
    cancelUserFunc() {
      this.handlerModal = false
      this.formCodeItem.assessmentType = ''
      this.staffInfo = {
        departmentId: '',
        realName: '',
        userId: ''
      }
    },
    sureUserFunc() {
      this.handlerModal = false
    },
    sureFilingCode() {
      if (this.formCodeItem.assessmentType == '') {
        this.$Message.info('请先选择处理人类型')
        return
      }
      if (this.staffInfo.realName == '') {
        this.$Message.info('请先指派处理人')
        return
      }
      let serviceIds = ''
      this.selectList.map((item, index) => {
        if (this.selectList.length > 1) {
          serviceIds += item.id + ','
        } else {
          serviceIds += item.id + ','
        }
      })
      let data = { ...this.staffInfo }
      data.serviceIds = serviceIds
      data.assessmentType = this.formCodeItem.assessmentType
      this.$Modal.confirm({
        title: '',
        content: `所选工单的${this.formCodeItem.assessmentName}将改为${this.staffInfo.realName}。你确定要修改吗？`,
        okText: '确认修改',
        cancelText: '取消',
        onOk: () => {
          UpdateApproveUserApi(data).then(res => {
            if (res.code == 0) {
              this.$Message.success('操作成功')
              this.staffInfo.realName = ''
              this.formCodeItem.assessmentType = ''
              this.handlerTypeModal = false
              this.searchList()
            }
          })
        }
      });
    }
  },
  created() {
    this.progressBarList = progressBarList
    if (this.$route.params.id != undefined) {
      this.isShowDetail = true
      this.servicesId = this.$route.params.id
    } else {
      this.getCountryList()
      this.searchList()
    }
  }
}
</script>
<style lang="less" scoped>
.page-box {
  position: fixed;
  bottom: 0;
  right: 22px;
  left: 220px;
  z-index: 999;
}
.handler-class {
  cursor: pointer;
  color: '#0079FE';
}
.top-card {
  position: relative;
}
</style>
