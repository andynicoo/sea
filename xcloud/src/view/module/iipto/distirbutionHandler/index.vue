<template>
  <div>
    <Card>
      <p class="title line"
         style="font-size:18px;">分配列表</p>
      <div class="content-box">
        <div class="box border">
          <div class="top-content">
            <Select v-model="searchForm.assessmentType"
                    @on-change="getDataFunc()"
                    style="width:150px">
              <Option v-for="item in handlerList"
                      :value="item.value"
                      :key="item.value">{{ item.roleType }}</Option>
            </Select>
            <div class="tabs-box">
              <span v-for="item in productList"
                    :value="item.id"
                    :key="item.id"
                    :class="item.isChecked?'isChecked':''"
                    @click="changeProduct(item.id)">{{item.paroductName}}</span>
            </div>
            <Button type="primary"
                    @click="changeHandlerBtnFunc">修改</Button>
          </div>
          <div class="bottom-content">
            <p>
              <span class="left-num">总基数：{{returnData.baseNum}}件</span>
              <Tooltip placement="left"
                       v-if="searchForm.assessmentType==1"
                       style="float:right"
                       :transfer="true"
                       max-width="400"
                       content="分配初审处理人：指定服务进入初审后自动分配处理人，该处理人记录为初审处理人。
今日分配件数：0点截止到现在，按分配规则计算累计的件数。
当月分配件数：当月1号至今日，该处理人被分配的件数。（此累计工单实际的处理人）
累计件数：截止到现在，该处理人共处理过的件数。（此累计工单实际的处理人）"
                       theme="light">
                <img src="@/assets/images/iipto-common/wenhao.svg">
              </Tooltip>
              <Tooltip placement="left"
                       v-if="searchForm.assessmentType==2"
                       style="float:right"
                       :transfer="true"
                       max-width="400"
                       content="分配律师：指定服务进入律师审核后自动分配该国的律师，该处理人记录为律师。
今日分配件数：0点截止到现在，按分配规则计算累计的件数。
当月分配件数：当月1号至今日，该处理人被分配的件数。（此累计工单实际的处理人）
累计件数：截止到现在，该处理人共处理过的件数。（此累计工单实际的处理人）"
                       theme="light">
                <img src="@/assets/images/iipto-common/wenhao.svg">
              </Tooltip>
              <Tooltip placement="left"
                       v-if="searchForm.assessmentType==3"
                       style="float:right"
                       :transfer="true"
                       max-width="400"
                       content="分配注册处理人：指定服务进入律师审核后自动分配处理人，该处理人记录为注册处理人。
今日分配件数：0点截止到现在，按分配规则计算累计的件数。
当月分配件数：当月1号至今日，该处理人被分配的件数。（此累计工单实际的处理人）
累计件数：截止到现在，该处理人共处理过的件数。（此累计工单实际的处理人）"
                       theme="light">
                <img src="@/assets/images/iipto-common/wenhao.svg">
              </Tooltip>
              <Tooltip placement="left"
                       v-if="searchForm.assessmentType==4"
                       style="float:right"
                       :transfer="true"
                       max-width="400"
                       content="分配审查意见处理人：指定服务收到审查意见（OA、暂停信、异议）后自动分配处理人，该处理人记录为审查意见处理人。
今日分配件数：0点截止到现在，按分配规则计算累计的件数。
当月分配件数：当月1号至今日，该处理人被分配的件数。（此累计工单实际的处理人）
累计件数：截止到现在，该处理人共处理过的件数。（此累计工单实际的处理人）"
                       theme="light">
                <img src="@/assets/images/iipto-common/wenhao.svg">
              </Tooltip>
            </p>
            <Table :data="returnData.handleDetals"
                   :columns="columns"
                   style="margin:10px 0;"></Table>
            <div class="rule-box">
              分配规则：<br> ①在基数内（整数），按分配比率平均分配；<br> ②超过基数后，分配给比率小的同事；<br> ③重新调整基数后，在已分配的数值上，按①和②的规则继续分配；<br> ④第二天自动继续昨天的设置，且每人的分配件数从0开始累计。
            </div>
          </div>
        </div>
      </div>
    </Card>
    <Modal v-model="distirbutionModal"
           :title="searchForm.assessmentType==1?'分配初审处理人':searchForm.assessmentType==2?'分配律师':searchForm.assessmentType==3?'分配注册处理人':searchForm.assessmentType==4?'分配审查意见处理人':''">
      <Form :model="formCodeItem"
            :label-width="100"
            ref="formCodeItem"
            :rules="ruleValidate">
        <FormItem label="指定服务："
                  prop="productId">
          <Select v-model="formCodeItem.productId"
                  placeholder="请选择服务"
                  :disabled="true">
            <Option v-for="(item,index) in productList"
                    :value="item.id"
                    :key="index">{{ item.paroductName }}</Option>
          </Select>
        </FormItem>
        <FormItem label="总基数："
                  prop="baseNum"
                  style="margin-bottom:14px;">
          <Input v-model="formCodeItem.baseNum"
                 placeholder="请输入＞0的整数"
                 @on-blur="verificationBlur()"></Input>
          <p v-show="isTipsShow"
             style="color:red;font-size:12px;">{{'只允许输入正整数'}}</p>
        </FormItem>
        <FormItem label="设置分配规则："
                  style="margin-bottom:8px;">
        </FormItem>
        <div class="set-box">
          <Table :data="ruleData"
                 :columns="ruleColumns">
            <template slot="handlerTemp"
                      slot-scope="{ row }">
              <p style="cursor:pointer"
                 @click="allotHandlerFunc(row)">
                <span v-if="row.realName!=''">{{row.realName}}
                  <Icon type="ios-create-outline"
                        size="18" />
                </span>
                <span v-else
                      style="color:#3AA1FF">指派处理人</span>
              </p>
            </template>
            <template slot="department"
                      slot-scope="{ row }">
              <p>{{row.department==''?'指派处理人后，获取所属部门':row.department}}</p>
            </template>
            <template slot="percentTemp"
                      slot-scope="{ row }">
              <Input v-model="row.percentage"
                     @on-blur="changePercentage($event,row)"
                     size="small">
              <span slot="append">%</span>
              </Input>
            </template>
            <template slot="operation"
                      slot-scope="{ row ,index}">
              <div class="operation-box">
                <img src="@/assets/images/infoDetail/add.svg"
                     alt=""
                     @click="addRuleData">
                <img src="@/assets/images/infoDetail/minus.svg"
                     alt=""
                     @click="removeRuleData(index)">
              </div>
            </template>
          </Table>

        </div>
        <p style="margin-top:10px;">注：分配百分比：最小0%，最大100%</p>
      </Form>
      <p slot="footer">
        <Button type="primary"
                ghost
                style="margin-right:20px;"
                @click="distirbutionModal=false">取消</Button>
        <Button type="primary"
                @click="sureFilingCode('formCodeItem')">确认修改</Button>
      </p>
    </Modal>
    <Modal v-model="handlerModal"
           :title="searchForm.assessmentType==2?'指派律师':'指派处理人'">
      <Select v-if="searchForm.assessmentType==2"
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
import { handleRuleListApi, handleRuleAddApi, handleRuleUpdateApi } from '@/api/iipto/distirbutionHandler'
import { getAllUserAndDepartmentApi } from '@/api/iipto/deliveryData'
import { lawyerListApi } from '@/api/iipto/lawyer.js'
export default {
  components: {
  },
  data() {
    return {
      handlerList: [
        {
          roleType: '分配客服',
          value: '0'
        },
        {
          roleType: '分配初审处理人',
          value: '1'
        },
        {
          roleType: '分配律师',
          value: '2'
        },
        {
          roleType: '分配注册处理人',
          value: '3'
        },
        {
          roleType: '分配审查意见处理人',
          value: '4'
        },
      ],
      productList: [
        {
          paroductName: '美国商标',
          id: '1',
          isChecked: true,
          countryCode: 'US',
          functionCode: '1'
        },
        {
          paroductName: '美国商标(顾问)',
          id: '2',
          isChecked: false,
          countryCode: 'US',
          functionCode: '3'
        },
        {
          paroductName: '欧盟商标',
          id: '3',
          isChecked: false,
          countryCode: 'EU',
          functionCode: '1'
        },
        {
          paroductName: '英国商标',
          id: '4',
          isChecked: false,
          countryCode: 'GB',
          functionCode: '1'
        },
        {
          paroductName: '日本商标',
          id: '5',
          isChecked: false,
          countryCode: 'JP',
          functionCode: '1'
        },
        {
          paroductName: '其他商标注册',
          id: '7',
          isChecked: false,
          countryCode: 'OTHER',
          functionCode: '1'
        },
      ],
      columns: [
        {
          title: '处理人',
          key: 'realName'
        },
        {
          title: '所属部门',
          key: 'department'
        },
        {
          title: '分配百分比',
          key: 'percentage',
          render(h, params) {
            return h('span', params.row.percentage + '%')
          },
        },
        {
          title: '今日分配件数',
          key: 'dayNum'
        },
        {
          title: '当月分配件数',
          key: 'monthNum'
        },
        {
          title: '累计件数',
          key: 'totalNum'
        },
      ],
      distirbutionModal: false,
      formCodeItem: {},
      ruleValidate: {},
      userList: [],
      ruleData: [],
      ruleColumns: [
        {
          title: '处理人',
          slot: 'handlerTemp'
        },
        {
          title: '所属部门',
          slot: 'department',
          width: 180
        },
        {
          title: '分配百分比',
          slot: 'percentTemp'
        },
        {
          title: '操作',
          slot: 'operation'
        },
      ],
      handlerModal: false,
      searchForm: {
        countryCode: 'US',
        functionCode: '1',
        assessmentType: '1'
      },
      returnData: {},
      staffInfo: {},
      departmentList: [],
      staffList: [],
      productId: '1',
      lawyerList: [],
      editorUserId: '',
      isTipsShow: false
    }
  },
  methods: {
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
      this.lawyerList = []
      let data = {
        limit: 20,
        page: 1,
        isOpen: '1',
        attorneyCountryCode: this.formCodeItem.countryCode
      }
      lawyerListApi(data).then(res => {
        if (res.code === 0) {
          this.lawyerList = res.data.records
        }
      })
    },
    changeProduct(id) {
      this.productId = id
      this.productList.map(item => {
        item.isChecked = false
        if (item.id == id) {
          item.isChecked = true
          this.searchForm.countryCode = item.countryCode
          this.searchForm.functionCode = item.functionCode
        }
      })
      this.getDataFunc()
    },
    changeHandlerBtnFunc() {
      this.distirbutionModal = true
      this.formCodeItem.countryCode = this.searchForm.countryCode
      this.formCodeItem.functionCode = this.searchForm.functionCode
      this.formCodeItem.productId = this.productId
      this.formCodeItem.baseNum = this.returnData.baseNum
    },
    getDataFunc() {
      this.columns = [
        {
          title: '处理人',
          key: 'realName'
        },
        {
          title: '所属部门',
          key: 'department'
        },
        {
          title: '分配百分比',
          key: 'percentage',
          render(h, params) {
            return h('span', params.row.percentage + '%')
          },
        },
        {
          title: '今日分配件数',
          key: 'dayNum'
        },
        {
          title: '当月分配件数',
          key: 'monthNum'
        },
        {
          title: '累计件数',
          key: 'totalNum'
        },
      ]
      this.ruleColumns = [
        {
          title: '处理人',
          slot: 'handlerTemp'
        },
        {
          title: '所属部门',
          slot: 'department',
          width: 180
        },
        {
          title: '分配百分比',
          slot: 'percentTemp'
        },
        {
          title: '操作',
          slot: 'operation'
        },
      ]
      if (this.searchForm.assessmentType == 2) {
        this.ruleColumns = [
          {
            title: '处理人',
            slot: 'handlerTemp'
          },
          {
            title: '分配百分比',
            slot: 'percentTemp'
          },
          {
            title: '操作',
            slot: 'operation'
          },
        ]
        this.columns = [
          {
            title: '处理人',
            key: 'realName'
          },
          {
            title: '分配百分比',
            key: 'percentage',
            render(h, params) {
              return h('span', params.row.percentage + '%')
            },
          },
          {
            title: '今日分配件数',
            key: 'dayNum'
          },
          {
            title: '当月分配件数',
            key: 'monthNum'
          },
          {
            title: '累计件数',
            key: 'totalNum'
          },
        ]
      } else if (this.searchForm.assessmentType == 0) {
        this.columns = [
          {
            title: '客服',
            key: 'realName'
          },
          {
            title: '所属部门',
            key: 'department'
          },
          {
            title: '分配百分比',
            key: 'percentage',
            render(h, params) {
              return h('span', params.row.percentage + '%')
            },
          },
          {
            title: '今日分配件数',
            key: 'dayNum'
          },
          {
            title: '当月分配件数',
            key: 'monthNum'
          },
          {
            title: '累计件数',
            key: 'totalNum'
          },
        ]
      }
      handleRuleListApi(this.searchForm).then(res => {
        if (res.code == 0) {
          this.returnData = res.data
          this.ruleData = [...res.data.handleDetals]
          if (this.ruleData.length == 0) {
            let obj = {
              department: '',
              realName: '',
              percentage: '',
              userId: ''
            }
            this.ruleData.push(obj)
          }
        }
      })
    },
    addRuleData() {
      let obj = {
        department: '',
        realName: '',
        percentage: ''
      }
      this.ruleData.push(obj)
    },
    removeRuleData(i) {
      this.ruleData.splice(i, 1)
    },
    changePercentage(event, row) {
      this.ruleData[row._index].percentage = row.percentage;
    },
    sureFilingCode() {
      let baseNum = 0
      this.ruleData.map(item => {
        baseNum += Number(item.percentage)
      })
      if (this.ruleData.length > 0 && baseNum != 100) {
        this.$Message.error('分配百分比之和必须等于100%')
        return
      }
      let data = { ...this.formCodeItem }
      data.assessmentType = this.searchForm.assessmentType
      data.handleDetals = [...this.ruleData]
      if (this.returnData.id == '') {
        handleRuleAddApi(data).then(res => {
          if (res.code == 0) {
            this.$Message.success('操作成功')
            this.distirbutionModal = false
            this.getDataFunc()
          }
        })
      } else {
        data.id = this.returnData.id
        handleRuleUpdateApi(data).then(res => {
          if (res.code == 0) {
            this.$Message.success('操作成功')
            this.distirbutionModal = false
            this.getDataFunc()
          }
        })
      }
    },
    allotHandlerFunc(row) {
      this.handlerModal = true
      this.editorUserId = row._index
      this.staffInfo = {
        departmentId: row.departmentId,
        userId: row.userId,
        realName: row.realName,
        department: row.department,
      }
      if (this.searchForm.assessmentType == 2) {
        this.getLawyerListFunc()
      } else {
        let values = {
          label: row.department,
          value: row.departmentId
        }
        this.changeDepartment(values)
      }
    },
    changeDepartment(val) {
      this.staffList = []
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
      this.staffInfo = {
        departmentId: '',
        userId: ''
      }
    },
    sureUserFunc() {
      this.ruleData[this.editorUserId].department = this.staffInfo.department
      this.ruleData[this.editorUserId].departmentId = this.staffInfo.departmentId
      this.ruleData[this.editorUserId].realName = this.staffInfo.realName
      this.ruleData[this.editorUserId].userId = this.staffInfo.userId
      this.handlerModal = false
      this.staffInfo = {
        departmentId: '',
        realName: '',
        userId: ''
      }
    },
    changeLaywyer(val) {
      if (val != undefined) {
        this.staffInfo.realName = val.label
        this.staffInfo.userId = val.value
      }
    },
    verificationBlur() {
      let reg1 = /^[0-9]*$/;
      if (!reg1.test(this.formCodeItem.baseNum)) {
        this.isTipsShow = true;
      } else if (this.formCodeItem.baseNum.length == 0) {
        this.isTipsShow = false;
      } else {
        this.isTipsShow = false;
      }
    }
  },
  mounted() {
    this.getUserAPi()
    this.getDataFunc()
  }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-card-body {
  padding: 0;
}
/deep/ .ivu-card-body {
  .title {
    font-size: 16px;

    font-family: SourceHanSansSC-Medium, SourceHanSansSC;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 18px;
    padding: 16px 20px;
  }
  .title.line {
    border-bottom: 1px solid #dddddd;
  }
  .content-box {
    padding: 16px 20px;
    .box.border {
      border: 1px solid #ddd;
      .top-content {
        background-color: #f4f6f7;
        padding: 0 20px;
        border-bottom: 1px solid #dddddd;
        .tabs-box {
          display: inline-block;
          span {
            display: inline-block;
            margin-left: 16px;
            cursor: pointer;
          }
          span.isChecked {
            color: #fff;
            padding: 10px 20px;
            background-color: #1890ff;
          }
        }
        button {
          float: right;
          margin-top: 4px;
        }
      }
      .bottom-content {
        padding: 30px 20px;
        .left-num {
          font-weight: 700;
          color: #333;
        }
      }
      .rule-box {
        line-height: 22px;
      }
    }
  }
}
/deep/ .top-content .ivu-select-selection {
  border: none;
  background-color: #f4f6f7;
}
.set-box {
  position: relative;
  .operation-box {
    img {
      margin-right: 10px;
      cursor: pointer;
    }
  }
}
/deep/ .ivu-tooltip-inner {
  max-width: 400px;
  white-space: break-spaces;
}
/deep/ .ivu-table-cell {
  overflow: inherit;
}
</style>

