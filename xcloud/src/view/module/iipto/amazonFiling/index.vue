<template>
  <div>
    <Card>
      <p class="title">数据筛选</p>
      <Form ref="searchForm"
            :model="searchForm"
            inline>
        <FormItem style="margin-bottom:0">
          <Input v-model="searchForm.searchContent"
                 clearable
                 placeholder="公司名称/手机号/服务号"
                 style="width:200px;" />
        </FormItem>
        <FormItem style="margin-bottom:0">
          <Input v-model="searchForm.acceptNum"
                 clearable
                 placeholder="受理号/商标名称"
                 style="width:200px;" />
        </FormItem>
        <FormItem style="margin-bottom:0">
          <Select clearable
                  v-model="searchForm.countryCode"
                  placeholder="国家">
            <Option v-for="(item,index) in countryList"
                    :value="item.countryCode"
                    :key="index">{{ item.countryNameZh }}</Option>
          </Select>
        </FormItem>
        <FormItem style="margin-bottom:0">
          <DatePicker type="daterange"
                      placeholder="选择创建时间"
                      v-model="searchForm.declareEndTime"
                      @on-change="changeDate"
                      style="width:180px;"></DatePicker>
        </FormItem>
        <FormItem style="margin-bottom:0">
          <DatePicker type="daterange"
                      placeholder="选择修改时间"
                      v-model="searchForm.updateTime"
                      @on-change="changeUpdateDate"
                      style="width:180px;"></DatePicker>
        </FormItem>
        <FormItem style="margin-bottom:0">
          <Button type="primary"
                  @click="searchList(1)"
                  style="margin: 0 12px;">查询</Button>
          <Button type="primary"
                  ghost
                  @click="resetList">重置</Button>
        </FormItem>
      </Form>
    </Card>
    <Card style="margin-top:15px;">
      <Tabs :value="searchForm.status"
            :animated="false"
            @on-click="tabsChange">
        <TabPane label="全部"
                 name=" "></TabPane>
        <TabPane label="待录入验证码"
                 name="1"></TabPane>
        <TabPane label="已录验证码"
                 name="2"></TabPane>
        <TabPane label="驳回申请"
                 name="3"></TabPane>
      </Tabs>
      <Table border
             :loading="tableLoading"
             :columns="columns"
             :data="tableData">
        <template slot="iiptoInfo"
                  slot-scope="{ row }">
          <p>商标名称：{{row.trademarkNameEn}}</p>
          <p>服务：{{row.countryNameZh}}{{$functionCodeList(row.functionCode)}}</p>
          <p>受理号：{{row.acceptNum}}</p>
        </template>
        <template slot="lawyerInfo"
                  slot-scope="{ row }">
          <p>律师：{{row.attorneyName}}</p>
          <p>邮箱：{{row.attorneyEmail}}</p>
          <p>第二邮箱：{{row.attorneyTwoEmail}}</p>
        </template>
        <template slot="operate"
                  slot-scope="{ row }">
          <p class="va-btn"
             v-if="row.status==1"
             @click="filingCodeModal=true;title='录入验证码';rowInfo=row">录入验证码</p>
          <p class="va-btn"
             v-if="row.status==2"
             @click="editorCodeFunc(row)">修改验证码</p>
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
    </Card>
    <Modal v-model="filingCodeModal"
           @on-cancel="cancelModal"
           :title="title">
      <Form :model="formCodeItem"
            :label-width="100"
            ref="formCodeItem"
            :rules="ruleValidate">
        <FormItem label="验证码："
                  prop="radioFilingCode"
                  v-if="title!='修改验证码'">
          <RadioGroup v-model="formCodeItem.radioFilingCode">
            <Radio label="0">收到了</Radio>
            <Radio label="1">没有收到，驳回重新申请</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="录入验证码："
                  prop="verificationCode"
                  v-if="formCodeItem.radioFilingCode==0">
          <Input v-model="formCodeItem.verificationCode"
                 :max-length="200"
                 placeholder="输入验证码"></Input>
        </FormItem>
      </Form>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="filingCodeModal=false">取消</Button>
        <Button type="primary"
                @click="sureFilingCode('formCodeItem')">确认</Button>
      </p>
    </Modal>
  </div>
</template>
<script>
import { getFilingCodeListApi, updateFilingCodeApi, inputFilingCodeApi, rejectFilingCodeApi } from '@/api/iipto/amazonFilingCode'
export default {
  data() {
    return {
      countryList: [
        { countryNameZh: "美国", countryCode: "US" },
        { countryNameZh: "欧盟", countryCode: "EU" },
        { countryNameZh: "日本", countryCode: "JP" },
        { countryNameZh: "英国", countryCode: "GB" },
        { countryNameZh: "加拿大", countryCode: "CA" },
      ],
      filingCodeModal: false,
      title: '录入验证码',
      searchForm: {},
      tableLoading: false,
      pageInfo: {
        total: 0,
        limit: 10,
        page: 1
      },
      tableData: [{}],
      columns: [
        {
          title: '服务编号',
          key: 'serverNo'
        },
        {
          title: '商标',
          slot: 'iiptoInfo'
        },
        {
          title: '国家',
          key: 'countryNameZh',
          width: 70
        },
        {
          title: '律师/邮箱',
          slot: 'lawyerInfo'
        },
        {
          title: '状态',
          render: (h, params) => {
            let text = this.codeStatus[params.row.status]
            return h('span', text)
          },
        },
        {
          title: '创建时间',
          sortable: true,
          key: 'createTime'
        },
        {
          title: '修改时间',
          sortable: true,
          key: 'updateTime'
        },
        {
          title: '操作',
          slot: 'operate'
        },
      ],
      formCodeItem: {},
      ruleValidate: {
        radioFilingCode: [
          { required: true, message: '请选择是否收到验证码', trigger: 'change' }
        ],
        verificationCode: [
          { required: true, message: '请录入验证码', trigger: 'blur' }
        ]
      },
      codeStatus: {
        1: '待录入验证码',
        2: '已录入验证码',
        3: '驳回申请'
      },
      rowInfo: {},
    }
  },
  methods: {
    changeDate(date) {
      this.searchForm.createEndTime = date[1]
      this.searchForm.createStartTime = date[0]
    },
    changeUpdateDate(date) {
      this.searchForm.updateEndTime = date[1]
      this.searchForm.updateStartTime = date[0]
    },
    searchList(page) {
      this.tableLoading = true
      if (page) {
        this.pageInfo.page = page
      }
      let data = { ...this.searchForm }
      delete data.declareEndTime
      delete data.updateTime
      data.page = this.pageInfo.page
      data.limit = this.pageInfo.limit
      getFilingCodeListApi(data).then(res => {
        if (res.code == 0) {
          this.tableData = res.data.records
          this.pageInfo.total = res.data.total - 0
        }
      }).finally(() => {
        this.tableLoading = false
      })
    },
    resetList() {
      this.searchForm = {}
    },
    tabsChange(val) {
      this.searchForm.status = val
      this.searchList(1)
    },
    changePageHandler(page) {
      this.pageInfo.page = page
      this.searchList()
    },
    handlePageSize(pageSize) {
      this.pageInfo.limit = pageSize
      this.searchList(1)
    },
    editorCodeFunc(row) {
      this.filingCodeModal = true;
      this.title = '修改验证码';
      this.rowInfo = row
      this.formCodeItem = {
        radioFilingCode: '0',
        verificationCode: row.verificationCode
      }
    },
    cancelModal() {
      this.formCodeItem = {
        radioFilingCode: '',
        verificationCode: ''
      }
    },
    sureFilingCode(name) {
      let that = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          console.log(this.formCodeItem.radioFilingCode)
          if (this.title == '录入验证码') {
            if (this.formCodeItem.radioFilingCode == '0') {
              that.inputSureFunc()
            } else {
              that.rejectFunc()
            }
          } else {
            that.updateFunc()
          }
        }
      })
    },
    inputSureFunc() {
      let paramsData = {
        id: this.rowInfo.id,
        verificationCode: this.formCodeItem.verificationCode
      }
      inputFilingCodeApi(paramsData).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.filingCodeModal = false
          this.searchList()
        }
      })
    },
    rejectFunc() {
      let paramsData = {
        id: this.rowInfo.id,
      }
      rejectFilingCodeApi(paramsData).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.filingCodeModal = false
          this.searchList()
        }
      })
    },
    updateFunc() {
      let paramsData = {
        id: this.rowInfo.id,
        verificationCode: this.formCodeItem.verificationCode
      }
      updateFilingCodeApi(paramsData).then(res => {
        if (res.code == 0) {
          this.$Message.success('操作成功')
          this.filingCodeModal = false
          this.searchList()
        }
      })
    }
  },
  mounted() {
    this.searchList(1)
  }
}
</script>
<style lang="less" scoped>
.va-btn {
  color: rgb(0, 121, 254);
  cursor: pointer;
}
</style>
