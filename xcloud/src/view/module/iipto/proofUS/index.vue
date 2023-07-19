<template>
  <div>
    <Card v-if="!isShowDetail">
      <p class="title">数据筛选</p>
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem style="margin-bottom:10px">
          <Input v-model="searchForm.serverNo"
                 clearable
                 placeholder="服务编号"
                 style="width:200px;" />
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Input v-model="searchForm.searchContent"
                 clearable
                 placeholder="商标名称"
                 style="width:200px;" />
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <DatePicker type="daterange"
                      placeholder="初审通过日期"
                      v-model="searchForm.passTime"
                      @on-change="changePasseDate"
                      style="width:180px;"></DatePicker>
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <DatePicker type="daterange"
                      placeholder="最新处理日期"
                      v-model="searchForm.updateTime"
                      @on-change="changeUpdateDate"
                      style="width:180px;"></DatePicker>
        </FormItem>
        <FormItem style="margin-bottom:10px">
          <Select v-model="searchForm.evidenceReamrkStatus"
                  clearable
                  placeholder="备注状态"
                  style="width:150px;">
            <Option value="0">待处理</Option>
            <Option value="1">已处理</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Select clearable
                  v-model="searchForm.orderSource"
                  placeholder="渠道来源">
            <Option value="0">PC网页端</Option>
            <!-- <Option value="1">微信小程序</Option> -->
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
        <FormItem style="margin-bottom:10px">
          <Button type="primary"
                  @click="searchList(1)"
                  style="margin: 0 12px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card style="margin-top:15px;"
          v-if="!isShowDetail">
      <div class="tableArea">
        <Tabs :value="searchForm.status"
              :animated="false"
              @on-click="tabsChange">
          <TabPane label="全部"
                   name="0"></TabPane>
          <TabPane label="待录入"
                   name="1"></TabPane>
          <TabPane label="待审核"
                   name="2"></TabPane>
          <TabPane label="被驳回"
                   name="3"></TabPane>
          <TabPane label="已完成"
                   name="4"></TabPane>
          <Button style="float:right;"
                  v-show="hasAuthority('btn_usdata_export')"
                  @click="exportOrderFunc">批量导出</Button>
        </Tabs>
        <Table border
               :loading="tableLoading"
               style="margin-top:14px;"
               :columns="columns"
               @on-selection-change="selectChange"
               :data="tableData">
          <template slot="handlerLi"
                    slot-scope="{ row }">
            <p v-for="(item,index) in row.handlerUserInfoStr"
               :key="index"
               style="line-height:24px;">{{item}}</p>
          </template>
          <template slot="markPlan"
                    slot-scope="{ row }">
            <p>{{row.evidenceComboName}}
              <Icon type="ios-create-outline"
                    size="18"
                    style="cursor:pointer;"
                    v-show="hasAuthority('btn_usdata_package')&&(row.progressBar==6||row.progressBar==8)"
                    @click="editorPlan(row)" />
            </p>
          </template>
          <template slot="operate"
                    slot-scope="{ row }">
            <Button type="info"
                    ghost
                    v-show="hasAuthority('btn_usdata_add')"
                    @click="toDetail(row)"
                    v-if="row.progressBar==6">{{'录入证据'}}</Button>
            <Button type="info"
                    ghost
                    v-show="hasAuthority('btn_usdata_look')"
                    @click="toDetail(row)"
                    v-else>{{'查看'}}</Button>
            <!-- <Button type="info"
                    style="margin-left:10px;"
                    ghost
                    v-show="hasAuthority('btn_usdata_remark')"
                    @click="remarkModal=true;editorRow = row">{{'备注'}}</Button> -->
          </template>
        </Table>
        <Page @on-change="changePageHandler"
              @on-page-size-change="handlePageSize"
              :current="pageInfo.page"
              :total="pageInfo.total"
              :page-size="pageInfo.limit"
              show-total
              show-elevator
              show-sizer />
      </div>
    </Card>
    <workOrderDetail v-if="isShowDetail"
                     @back="isShowDetail=false;searchList()"
                     :orderStatus="orderStatus"
                     :countryCode="countryCode"
                     :categoryCount="categoryCount"
                     :servicesId="servicesId"></workOrderDetail>
    <Modal v-model="planModal"
           title="修改制作套餐">
      <Form :model="editorRow"
            :label-width="0"
            ref="editorRow">
        <FormItem>
          <Select v-model="editorRow.evidenceComboName"
                  placeholder="请选择处理人类型">
            <Option v-for="(item,index) in evidenceComboList"
                    :value="item"
                    :key="index">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem v-if="editorRow.evidenceComboName=='其他'">
          <Input v-model="planValue"
                 type="textarea"
                 :maxlength="50"
                 :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="请录入制作套餐,最多50字" />
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary"
                @click="surePlan">确认提交</Button>
      </p>
    </Modal>
    <Modal v-model="remarkModal"
           title="备注">
      <Form :model="editorRow"
            :label-width="90"
            ref="editorRow">
        <FormItem label="内容：">
          <Input v-model="editorRow.evidenceReamrk"
                 type="textarea"
                 :maxlength="1000"
                 :autosize="{minRows: 8,maxRows: 8}"
                 placeholder="输入备注，参考格式：
1、不包括单价超过30块钱的产品，超过的需要客户补差价或者邮寄产品
2、35类及以上的类目不能做使用证据（因为35至45类为服务类）
3、需要外包装的需单独付费，成本30-50不等" />
        </FormItem>
        <FormItem label="状态：">
          <RadioGroup v-model="editorRow.evidenceReamrkStatus">
            <Radio :label="0">待处理</Radio>
            <Radio :label="1">已处理</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary"
                @click="sureRemark">确认提交</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { evidencelistApi, evidenceComboListApi, evidenceUpdateApi } from '@/api/iipto/proofUs'
import workOrderDetail from "./workOrderDetail";
import { getToken } from '@/libs/util'
export default {
  components: {
    workOrderDetail
  },
  data() {
    return {
      searchForm: {
        status: '0'
      },
      tableLoading: false,
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: '服务编号',
          key: 'serverNo'
        },
        {
          title: '商标名称',
          // key: 'trademarkName',
          render(h, { row }) {
            return h('div', {
              props: {
                type: 'text'
              },
              domProps: {
                innerHTML: row.trademarkName
              }
            })
          },
        },
        {
          title: '商标类型',
          width: 120,
          render: (h, params) => {
            let trademarkType = params.row.trademarkType
            return h('span', trademarkType == 1 ? '纯文字' : trademarkType == 2 ? '纯图形' : trademarkType == 3 ? '图形+文字' : '')
          },
        },
        {
          title: '商标类目',
          width: 70,
          key: 'trademarkCategoryOneNum'
        },
        {
          title: '处理人',
          slot: 'handlerLi'
        },
        {
          title: '制作套餐',
          slot: 'markPlan'
        },
        {
          title: '初审通过日期',
          sortable: true,
          key: 'materialAuditDate',
          render(h, params) {
            let acceptTime = params.row.materialAuditDate
            let text = ''
            if (acceptTime != '') {
              text = acceptTime.slice(0, 10)
            }
            return h('span', text)
          },
        },
        {
          title: '最新处理时间',
          sortable: true,
          key: 'updateTime'
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
          width: 190
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
      planModal: false,
      //制作套餐
      evidenceComboList: [],
      planValue: '',
      //备注
      remarkModal: false,
      editorRow: {}
    }
  },
  methods: {
    getEvidenceComboListFunc() {
      evidenceComboListApi().then(res => {
        if (res.code == 0) {
          this.evidenceComboList = res.data
        }
      })
    },
    searchList(page) {
      this.selectList = []

      if (page) {
        this.pageInfo.page = page
      }
      let data = { ...this.searchForm }
      delete data.passTime
      delete data.updateTime
      data.page = this.pageInfo.page
      data.limit = this.pageInfo.limit
      evidencelistApi(data).then(res => {
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
    changePasseDate(date) {
      this.searchForm.materialAuditDateEnd = date[1]
      this.searchForm.materialAuditDateStart = date[0]
    },
    changeUpdateDate(date) {
      this.searchForm.updateTimeEnd = date[1]
      this.searchForm.updateTimeStart = date[0]
    },
    exportOrderFunc() {
      if (this.selectList.length == 0) {
        this.$Message.info('请先选择服务')
        return
      }
      let ids = ''
      this.selectList.map(item => {
        ids += item.trademarkWorkOrderId + ','
      })
      let formData = new FormData()
      // 获取时间戳
      let timestamp = new Date().getTime()
      // 获取XMLHttpRequest
      let xmlResquest = new XMLHttpRequest()
      xmlResquest.open('get', this.baseUrl + '/trademark/management/services/importWorkOrderEvidenceList?workOrderEvidenceIds=' + ids, true)
      // 设置请求token
      xmlResquest.setRequestHeader('Authorization', 'Bearer ' + getToken())
      xmlResquest.responseType = 'blob'
      // 返回
      xmlResquest.onload = function (oEvent) {
        let content = xmlResquest.response
        // 组装a标签
        let elink = document.createElement('a')
        // 设置下载文件名
        elink.download = timestamp + '.xlsx'
        elink.style.display = 'none'

        let blob = new Blob([content])
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        document.body.removeChild(elink)
      }
      xmlResquest.send(formData)
    },
    editorPlan(row) {
      this.planModal = true
      this.editorRow = row
    },
    surePlan() {
      let paramsData = {
        evidenceComboName: this.editorRow.evidenceComboName,
        trademarkWorkOrderStatus: this.editorRow.trademarkWorkOrderStatus,
        id: this.editorRow.trademarkWorkOrderId,
        servicesId: this.editorRow.id,
      }
      if (this.editorRow.evidenceComboName == '其他') {
        if (this.planValue == '') {
          this.$Message.info('请填写制作套餐')
          return
        }
        paramsData.evidenceComboName = this.planValue
      }
      this.updateFunc(paramsData)
    },
    sureRemark() {
      let paramsData = {
        evidenceReamrk: this.editorRow.evidenceReamrk,
        evidenceReamrkStatus: this.editorRow.evidenceReamrkStatus,
        trademarkWorkOrderStatus: this.editorRow.trademarkWorkOrderStatus,
        servicesId: this.editorRow.id,
        id: this.editorRow.trademarkWorkOrderId
      }
      this.updateFunc(paramsData)
    },
    updateFunc(paramsData) {
      evidenceUpdateApi(paramsData).then(res => {
        if (res.code == 0) {
          this.$Message.success('提交成功')
          this.planModal = false
          this.remarkModal = false
          this.searchList(1)
        }
      })
    }
  },
  created() {
    this.searchList()
    this.getEvidenceComboListFunc()
  },
}
</script>
<style lang="less" scoped>
</style>