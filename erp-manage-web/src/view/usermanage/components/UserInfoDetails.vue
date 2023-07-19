<template>
  <div>
    <div class="current-user-info-title">
      <a-icon
        type="left"
        title="放大"
        @click="$emit('hideVisible')"
      />用户信息
    </div>
    <ul class="current-user-info">
      <li>
        用户身份:<span>{{ currentMember.memberUser }}</span>注册时间:<span>{{ currentMember.registeredTime }}</span> 账号状态:<span>{{ currentMember.status == '1' ? '正常' : '停用' }}</span><span>付费次数：{{ currentMember.setMealCount }}</span>
      </li>
      <li>
        用户账号:<span>{{ currentMember.maAccount }}</span>最后登录时间:<span class="long">{{ currentMember.loginTime }}</span>会员编号:<span>{{ currentMember.no }}</span>&nbsp;&nbsp;付费总额:<span>{{ currentMember.setMealAmount }}</span>
      </li>
      <li>
        站点数量:<span v-if="!currentMember.countryCount">{{
          currentMember.countryCount
        }}</span><span
          v-else
        >{{ currentMember.countryCount }}（<a-tooltip>
          <template slot="title">
            {{ currentMember.countryName }}
          </template>
          <b class="mg-countryName">{{
            currentMember.countryName
          }}</b> </a-tooltip>）</span>上次登录时间:<span class="long">{{ currentMember.lastLoginTime }}</span>套餐状况:<span v-if="currentMember.setMealName === null"> - </span>
        <span v-else>
          {{ currentMember.setMealName }} 有效期至
          {{
            currentMember.expiresTime
              ? currentMember.expiresTime.split(' ')[0]
              : ''
          }}
        </span>
      </li>
      <li>
        用户来源:<span>{{ currentMember.source }}</span>店铺类型:<span>{{
          currentMember.storeType ? currentMember.storeType : '-'
        }}</span>
        用户标签:<span class="tagsxx">
          <a-tag
            v-for="item in currentMember.memberLabelNames"
            :key="item"
            color="green"
          >{{ item }}</a-tag>
        </span>
      </li>

      <li v-if="!analysis">
        <a-button
          type="primary"
          @click="stopUserMemberFun"
        >
          停用套餐
        </a-button>
      </li>
    </ul>
    <a-tabs
      v-model="curTabs"
      class="tabss"
    >
      <a-tab-pane
        key="1"
        tab="基础资料"
      >
        <div style="display: none">
          {{ currentMember }}
          <hr>
          {{ currentObj }}
          <hr>
          {{ erpRoleSelect }}
        </div>
        <SearchForm
          :form-item="formItem"
          :form-model="this.queryMemberid ? currentMember : currentObj"
        />
        <div v-if="!analysis">
          <a-button
            type="primary"
            class="g-mr15"
            @click="hideModal"
          >保存</a-button>
          <a-button @click="$emit('hideVisible')">取消</a-button>
        </div>
      </a-tab-pane>
      <a-tab-pane
        key="2"
        tab="店铺分析"
      >
        <div class="box3">
          <div class="box">
            <h3>{{ currentMember.countryCount || '-' }}</h3>
            <p>绑定站点数</p>
          </div>
          <div class="box">
            <h3>{{ currentMember.storeCount || '-' }}</h3>
            <p>绑定店铺数</p>
          </div>
          <div class="box">
            <h3>{{ currentMember.storeSales || '-' }}</h3>
            <p>总销售额({{ moment().format('YYYY') }})</p>
          </div>
        </div>
        <a-table
          :pagination="false"
          :columns="columns"
          :data-source="dataSource"
          :row-key="(record, index) => record.merchantId + index"
          :scroll="{ x: 1200, y: 500 }"
          class="me-store-infolist"
          @change="onChange"
        >
          <template
            slot="storeName"
            slot-scope="text, record"
          >
            <ul class="me-merchant-store me-bl">
              <li
                v-for="item in record.storeInfo"
                :key="item.storeId"
              >
                <div>
                  <p>{{ item.storeName }}</p>
                </div>
              </li>
            </ul>
          </template>
          <template
            slot="countryCode"
            slot-scope="text, record"
          >
            <ul class="me-merchant-store me-bl">
              <li
                v-for="item in record.storeInfo"
                :key="item.storeId"
              >
                <div>
                  <p>{{ item.countryCode }}</p>
                </div>
              </li>
            </ul>
          </template>
          <template
            slot="storeType"
            slot-scope="text, record"
          >
            <ul class="me-merchant-store me-bl">
              <li
                v-for="item in record.storeInfo"
                :key="item.storeId"
              >
                <div>
                  <span v-if="item.storeType === 1">本土</span>
                  <span v-if="item.storeType === 2">跨境</span>
                  <span v-if="item.storeType === 0">其他</span>
                </div>
              </li>
            </ul>
          </template>
          <template
            slot="currency"
            slot-scope="text, record"
          >
            <ul class="me-merchant-store me-bl">
              <li
                v-for="item in record.storeInfo"
                :key="item.storeId"
              >
                <div>
                  <a-popover
                    v-if="text"
                    title=""
                  >
                    <template slot="content">
                      <p>{{ item.currency }}</p>
                    </template>
                    <a-icon
                      type="pay-circle"
                      width="40"
                      height="40"
                    />
                  </a-popover>
                  <span v-else>-</span>
                </div>
              </li>
            </ul>
          </template>
          <template
            slot="monthlySales"
            slot-scope="text, record"
          >
            <ul class="me-merchant-store me-bl">
              <li
                v-for="item in record.storeInfo"
                :key="item.storeId"
              >
                <div>
                  <span
                    v-if="item.monthlySales"
                  >￥{{ item.monthlySales }}</span>
                  <span v-else>0</span>
                </div>
              </li>
            </ul>
          </template>
          <template
            slot="authorizedStatus"
            slot-scope="text, record"
          >
            <ul class="me-merchant-store me-bl">
              <li
                v-for="item in record.storeInfo"
                :key="item.storeId"
              >
                <div>
                  <span v-if="item.authorizedStatus === 1">正常</span>
                  <span v-if="item.authorizedStatus === 0">已解绑</span>
                </div>
              </li>
            </ul>
          </template>
          <template
            slot="authorizedTime"
            slot-scope="text, record"
          >
            <ul class="me-merchant-store me-bl">
              <li
                v-for="item in record.storeInfo"
                :key="item.storeId"
              >
                <div>
                  <p>{{ item.authorizedTime }}</p>
                </div>
              </li>
            </ul>
          </template>
          <template
            slot="updateTime"
            slot-scope="text, record"
          >
            <ul class="me-merchant-store me-bl">
              <li
                v-for="item in record.storeInfo"
                :key="item.storeId"
              >
                <div>
                  <p>{{ item.updateTime }}</p>
                </div>
              </li>
            </ul>
          </template>
          <template #merchantName="text">
            {{ text ? text : '-' }}
          </template>
          <template
            slot="action"
            slot-scope="text, record"
          >
            <ul class="me-merchant-store me-bl">
              <li
                v-for="item in record.storeInfo"
                :key="item.storeId"
              >
                <div>
                  <a-button
                    type="link"
                    class="xxx"
                    @click="viewRecord(item)"
                  >销售额记录</a-button>
                </div>
              </li>
            </ul>
          </template>
          <!-- <template #action="record">
            <a-button
              type="link"
              class="xxx"
              @click="viewRecord(record)"
            >销售额记录</a-button>
          </template> -->
        </a-table>

        <a-modal
          title="店铺销售额统计"
          :visible="recoVisible"
          :destroy-on-close="true"
          :footer="null"
          :width="700"
          @cancel="handleCancel"
        >
          <div>
            <StoreRecord :stordid="curStoreId" />
          </div>
        </a-modal>
      </a-tab-pane>
      <a-tab-pane
        key="3"
        tab="登录日志"
      >
        <a-table
          :pagination="false"
          :columns="columnsUser"
          :data-source="dataUser"
          :row-key="(record, index) => record.time + index"
          :show-header="false"
          @change="onChange"
        >
          <template #operation="text">
            <span v-show="false">{{ text }}</span>
          </template>
        </a-table>
      </a-tab-pane>
      <a-tab-pane
        key="4"
        tab="功能用量"
      >
        <timeSection
          v-show="curTabs === '4'"
          :type="1"
          :format="'YYYY-MM-DD'"
          class="timecom"
          @changeTime="changeTime"
        />
        <userUseCount :user-use-count="userUseCount" />
      </a-tab-pane>
    </a-tabs>
    <div v-if="analysis">
      <a-button
        class="g-mt5"
        @click="
          $router.push({
            path: '/overview/analysis',
            query: { type: analysisType }
          })
        "
      >返回</a-button>
    </div>
  </div>
</template>

<script>
const timeSectionData = [
  { label: '近7天', value: 6, type: 1 },
  { label: '近15天', value: 14, type: 2 },
  { label: '近30天', value: 29, type: 3 },
  { label: '自定义时间', value: 'user', type: 6 }
]
import SearchForm from '@/components/searchForm'
import StoreRecord from '@/components/StoreRecord/index'
import timeSection from '@/components/timeSection/index'
import userUseCount from './userUseCount'
import {
  putUserInfo,
  selectStoreAnalysis,
  selectJournal,
  stopUserMember,
  getUserUseCount
} from '@/api/usermanage'
import moment from 'moment'
const initPagination = {
  current: 1,
  size: 10
}
export default {
  provide: {
    for: timeSectionData
  },
  components: {
    SearchForm,
    StoreRecord,
    timeSection,
    userUseCount
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    currentObj: {
      type: Object,
      default: () => {}
    },
    currentMember: {
      type: [Object, String],
      default: () => {}
    },
    erpRoleSelect: {
      type: [Object, Array],
      default: () => {}
    }
  },
  data() {
    return {
      paginationParams: {
        ...initPagination
      },
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}人`
      },
      columns: [
        {
          title: '商户名称',
          dataIndex: 'merchantName',
          scopedSlots: { customRender: 'merchantName' },
          width: 200
        },
        {
          title: '店铺名称',
          dataIndex: 'storeName',
          scopedSlots: {
            customRender: 'storeName'
          },
          width: 200
        },
        {
          title: '平台/站点',
          width: 120,
          dataIndex: 'countryCode',
          scopedSlots: {
            customRender: 'countryCode'
          }
        },
        {
          title: '店铺类型',
          width: 120,
          scopedSlots: { customRender: 'storeType' },
          dataIndex: 'storeType'
        },
        {
          title: '销售币',
          dataIndex: 'currency',
          scopedSlots: { customRender: 'currency' },
          width: 100
        },
        {
          title: '本月销售额',
          dataIndex: 'monthlySales',
          scopedSlots: { customRender: 'monthlySales' },
          width: 200
        },
        {
          title: '授权状态',
          dataIndex: 'authorizedStatus',
          scopedSlots: { customRender: 'authorizedStatus' },
          width: 200
        },
        {
          title: '首次授权时间',
          dataIndex: 'authorizedTime',
          scopedSlots: { customRender: 'authorizedTime' },
          width: 200
        },
        {
          title: '最近更新时间',
          dataIndex: 'updateTime',
          scopedSlots: { customRender: 'updateTime' },
          width: 200
        },
        {
          title: '操作',
          key: 'action',
          fixed: 'right',
          width: 100,
          scopedSlots: {
            customRender: 'action'
          }
        }
      ],
      dataSource: [],
      columnsUser: [
        {
          title: '时间',
          dataIndex: 'time',
          width: 250
        },
        {
          title: '备注',
          dataIndex: 'remark',
          width: 200
        },
        {
          title: '动作',
          dataIndex: 'operation',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      dataUser: [],
      recoVisible: false,
      curStoreId: '',
      queryMemberid: null,
      analysis: false,
      analysisType: '',
      curTabs: '1',
      userUseCount: {}, // 用户功能用量
      startTime: '', // 用户功能用量 开始时间
      endTime: '' // 用户功能用量 结束时间
    }
  },
  computed: {
    formItem({ currentObj, erpRoleSelect, analysis }) {
      return [
        {
          label: '角色',
          itemType: 'select',
          key: 'roleIdList',
          itemData: erpRoleSelect,
          required: true,
          itemProp: {
            mode: 'multiple',
            'allow-clear': false,
            disabled: !!analysis
          },
          span: 24
        },
        {
          label: '备注',
          key: 'remark',
          span: 24,
          render: () => {
            return (
              <a-textarea
                disabled={!!analysis}
                value={
                  this.queryMemberid
                    ? this.currentMember.remark
                    : currentObj.remark
                }
                on-change={this.textChange}></a-textarea>
            )
          }
        }
      ]
    }
  },
  created() {
    this.queryMemberid = this.$route.query.memberid
    this.analysis = this.$route.query.analysis
    this.analysisType = this.$route.query.type
  },
  mounted() {
    // 查询用户店铺信息
    this.getStoreList()
    // 查询用户日志
    this.getUserLog()

    // 时间格式YYYY-MM-DD，7天传6
    this.startTime = moment()
      .subtract(6, 'days')
      .format('YYYY-MM-DD')
    this.endTime = moment().format('YYYY-MM-DD')

    // 查询用户用量
    this.getUserUseCount()
  },
  methods: {
    moment,
    textChange(e) {
      this.queryMemberid
        ? (this.currentMember.remark = e.target.value)
        : (this.currentObj.remark = e.target.value)
    },
    // 编辑用户
    async hideModal() {
      try {
        // 当前页面是根据memberid查询出来的信息，用currentMember(单个数据组)，否则就是从列表跳转过来的综合数据(多个数据，组合使用)
        if (!this.currentObj.roleIdList) {
          this.currentMember.memberId = this.$route.query.memberid
        }
        await putUserInfo(
          !this.queryMemberid ? this.currentObj : this.currentMember
        )
        this.$message.success('修改用户信息成功')
        this.$emit('hideVisible')
        this.$emit('getList')
      } catch (error) {
        console.error(error)
        console.log(error)
      }
    },
    getStoreList() {
      selectStoreAnalysis(this.currentObj.memberId || this.queryMemberid).then(
        (res) => {
          // const arr = this.handleTableColumnSpanMethod(res.data)
          this.dataSource = res.data
        }
      )
    },
    getUserLog() {
      // this.currentObj.memberId
      selectJournal(this.currentObj.memberId || this.queryMemberid).then(
        (res) => {
          console.log(res)
          this.dataUser = res.data
        }
      )
    },
    getUserUseCount() {
      if (this.startTime === '') {
        return false
      }
      console.log(this.currentObj.memberId, this.queryMemberid)
      let params = {
        memberId: this.currentObj.memberId ? this.currentObj.memberId : this.queryMemberid,
        startTime: this.startTime,
        endTime: this.endTime
      }
      getUserUseCount(params).then((res) => {
        console.log(res)
        this.userUseCount = res.data
      })
    },
    changeTime(data) {
      let { time } = data
      if (time.length) {
        this.startTime = time[0]
        this.endTime = time[1]
      } else {
        this.startTime = ''
        this.endTime = ''
      }
      this.getUserUseCount()
    },
    onChange(pagination, filters, sorter) {
      this.pagination = { ...pagination }
      const { current, pageSize: size } = pagination
      const { field, order } = sorter
      this.paginationParams = { current, size }
      const orderObj = {
        ascend: 'asc',
        descend: 'desc'
      }
      this.params = {
        field,
        order: orderObj[order]
      }
      this.getList()
    },
    // 查看销售额记录
    viewRecord(record) {
      this.recoVisible = true
      this.curStoreId = record.storeId
    },
    handleCancel() {
      this.recoVisible = false
    },
    // 合并第一列
    handleTableColumnSpanMethod(dataArr) {
      const uniqueKey = []
      // 遍历源数据，columnOne是第一列的名字，找到第一列从当前开始合并
      dataArr.forEach((item) => {
        if (uniqueKey.some((keyItem) => keyItem === item.merchantName)) {
          item.spans = [0, 1]
          return
        }
        const projectQuantitiesFilterList = dataArr.filter(
          (projectItem) => item.merchantName === projectItem.merchantName
        )
        const projectLength = projectQuantitiesFilterList.length
        item.spans = [projectLength, 1]
        uniqueKey.push(item.merchantName)
      })
      return dataArr
    },
    stopUserMemberFun() {
      const that = this
      this.$confirm({
        title: '停用套餐用户权益将立即变更为免费版，是否继续？',
        width: '500px',
        onOk() {
          stopUserMember({
            memberId: that.currentObj.memberId
          })
            .then((res) => {
              let { code, message } = res
              if (code === '0') {
                that.$message.success('操作成功')
              } else {
                that.$message.error(message)
              }
            })
            .finally(() => {})
        },
        onCancel() {
          console.log('Cancel')
        },
        class: 'test',
        okText: '确定停用'
      })
    }
  }
}
</script>

<style lang="less" scoped>
.current-user-info-title {
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
  padding-bottom: 15px;
}
.current-user-info {
  li {
    margin-bottom: 10px;
  }
  span {
    display: inline-block;
    width: 200px;
    padding-left: 5px;
  }
  .long {
    width: 175px;
  }
}
.mg-countryName {
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
  max-width: 135px;
  vertical-align: bottom;
}
.box3 {
  .box {
    width: 12%;
    float: left;
    background: #f5f5f5;
    margin-right: 5px;
    padding: 10px;
    margin-bottom: 20px;
    h3 {
      font-size: 18px;
    }
  }
}
button.xxx {
  padding: 0px;
}
.me-merchant-store {
  margin-bottom: 0px;
  li {
    min-height: 58px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    align-items: center;
    padding: 0 8px;
    margin-bottom: -1px;
  }
  p {
    margin-bottom: 0px;
  }
}
.me-store-infolist {
  ::v-deep .ant-table-tbody > tr > td {
    padding: 0;
  }
}
.tagsxx {
  width: auto !important;
  span {
    width: auto;
  }
}
.tabss {
  position: relative;
  .timecom {
    position: absolute;
    top: 12px;
    left: 451px;
  }
}
</style>
