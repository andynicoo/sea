<template>
  <div ref="container">
    <div v-show="!visible">
      <!-- 用户标签 -->
      <div class="all-user wrapper g-mb10">
        <UserTags @getTagsId="getTagsId" />
      </div>
      <div
        ref="filters"
        class="filters all-user g-mb10"
      >
        <!-- {{ formModel }} -->
        <TableFilter
          :col-item="colItem"
          :form-model="formModel"
          @submit="handleSearch"
          @reset="reset"
        />
      </div>
      <div
        ref="export"
        class="export"
      >
        <a-button
          v-permission:user_all="['export']"
          type="primary"
          @click="exportShop"
        >导出数据</a-button><a-button
          v-permission:user_all="['export']"
          type="primary"
          class="g-ml5"
          @click="exportShopData"
        >导出销售数据</a-button>
        <!-- 导出数据，由最初的点击就下载调整为点击发送请求，轮询下载文件生成状态，生成状态类别都变为已完成，停止轮询，点击打开新页面下载 -->
        <a-popover
          v-permission:user_all="['export']"
          :title="null"
          trigger="click"
          placement="bottomLeft"
        >
          <template slot="content">
            <p
              v-for="(item, index) in exportData"
              :key="item.memberId + index"
            >
              {{ item.downloadName }}
              <span v-if="item.completed === 1">
                <a @click="downloadFile(item)">
                  下载完成
                </a>
              </span>
              <span v-else>
                <a> 下载中 </a>
              </span>
            </p>
            <p v-if="!exportData.length">
              暂无数据
            </p>
          </template>
          <a-button
            type="link"
            class="me-fr"
          >
            <a-icon
              v-if="exportIng"
              type="loading"
            />
            下载记录
          </a-button>
        </a-popover>
      </div>
      <div
        class="all-user wrapper"
        style="padding:0px"
      >
        <a-table
          :pagination="pagination"
          :columns="columns"
          :data-source="data"
          :row-key="(record) => record.memberId"
          :scroll="{ x: 1200, y: 500 }"
          @change="onChange"
        >
          <template
            slot="no"
            slot-scope="text, record"
          >
            <span style="padding-right:5px">{{ record.no }}</span>
            <a-tag v-if="record.setMealName">{{ record.setMealName }}</a-tag>
            <!-- 标签数量大于1 -->
            <span
              v-if="
                record.memberLabelNames && record.memberLabelNames.length > 1
              "
            >
              <a-tag color="green">{{ record.memberLabelNames[0] }}</a-tag>

              <a-popover
                :title="null"
                trigger="click"
                placement="bottomLeft"
              >
                <template slot="content">
                  <div class="tagbox">
                    <a-tag
                      v-for="item in record.memberLabelNames"
                      :key="item.memberLabelId"
                      color="green"
                    >{{ item }}</a-tag>
                  </div>
                </template>
                <a-tag color="green">...</a-tag>
              </a-popover>
            </span>
            <span v-else>
              <a-tag
                v-if="record.memberLabelNames.length !== 0"
                color="green"
              >{{ record.memberLabelNames[0] }}</a-tag>
            </span>
          </template>
          <template #count="text">
            <span>{{ text }}</span>
          </template>
          <template #status="text">
            <div>{{ STATUS[text] }}</div>
          </template>
          <template #currency="text">
            <div>
              <a-popover
                v-if="text"
                title=""
              >
                <template slot="content">
                  <p>{{ text }}</p>
                </template>
                <a-icon
                  type="pay-circle"
                  width="40"
                  height="40"
                />
              </a-popover>
              <span v-else>-</span>
            </div>
          </template>
          <template #storeSales="text">
            <div>￥{{ text ? text : 0 }}</div>
          </template>

          <template #action="record">
            <span
              v-permission:user_all="['edit']"
              class="edit g-cup"
              @click="handleEdit(record)"
            >编辑</span>
          </template>
        </a-table>
      </div>
    </div>
    <div
      v-if="visible"
      class="all-user wrapper"
    >
      <UserInfoDetails
        :current-member="currentMember"
        :current-obj="currentObj"
        :erp-role-select="erpRoleSelect"
        :visible="visible"
        @getList="getList"
        @hideVisible="hideVisible"
      />
    </div>
    <!-- <a-modal
      v-model="visible"
      :width="620"
      title="用户编辑"
      ok-text="保存"
      cancel-text="取消"
      :after-close="afterClose"
      :mask-closable="false"
      @ok="hideModal"
    >
      <SearchForm :form-item="formItem" :form-model="currentObj" />
    </a-modal> -->
    <a-modal
      v-model="exportVisible"
      :width="620"
      title="导出销售数据"
      :after-close="afterClose"
      :mask-closable="false"
      @cancel="exportVisible = false"
    >
      选择导出的时间：
      <a-select
        v-model="yearVal"
        style="width: 120px"
        @change="yearChange"
      >
        <a-select-option
          v-for="item in year"
          :key="item"
          :value="item"
        >
          {{ item }}年
        </a-select-option>
      </a-select>
      <a-select
        v-model="monthVal"
        class="g-ml10"
        style="width: 120px"
        @change="monthChange"
      >
        <a-select-option
          v-for="item in month"
          :key="item"
          :value="item"
        >
          {{ item }}月
        </a-select-option>
      </a-select>
      <dl
        v-if="selectedDate.length"
        class="g-mt15"
      >
        <dt>已选</dt>
        <dd class="g-mt10">
          <span
            v-for="(item, index) in selectedDate"
            :key="item.value"
            class="curr-date"
          >{{ item.label }}<a-icon
            type="close"
            @click="deleteDate(index)"
          /></span>
        </dd>
      </dl>
      <template slot="footer">
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="exportOk"
        >
          导出销售数据
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import TableFilter from '@/components/tableFilter'
// import SearchForm from '@/components/searchForm'
import UserInfoDetails from './components/UserInfoDetails'
import UserTags from './components/UserTags'
import moment from 'moment'
import {
  getUserList,
  exportUser,
  erpRoleSelect,
  memberDetails,
  userSalesExport,
  getDownloadList,
  downloadFile
} from '@/api/usermanage'
import { download, debounce, setTableHeight } from '@/utils/index'
const initPagination = {
  current: 1,
  size: 10
}
const STATUS = {
  0: '禁用',
  1: '正常',
  2: '已删除'
}
const initFormModel = {
  maAccount: '',
  status: '',
  source: '',
  sourceCode: '',
  countMin: '',
  countMax: '',
  roleId: '',
  beginSales: '',
  endSales: '',
  registeredStartTime: undefined,
  bindingStartTime: undefined,
  isForwarder: '',
  memberLabelIds: [],
  setMealCode: ''
}
// const timeSectionData = [
//   { label: '近7天', value: 7 },
//   { label: '近15天', value: 15 },
//   { label: '近1月', value: 30 },
//   { label: '自定义时间', value: 'user' }
// ]
// const colorList = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple']
export default {
  // provide: {
  //   for: timeSectionData
  // },
  name: 'Alluser',
  components: {
    TableFilter,
    // SearchForm,
    UserInfoDetails,
    UserTags
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      formModel: {
        ...initFormModel
      },
      erpRoleSelect: [],
      STATUS,
      data: [],
      selectedRowKeys: [],
      paginationParams: {
        ...initPagination
      },
      params: {},
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}人`
      },
      visible: false,
      shopTags: [],
      sorter: {},
      currentObj: {},
      selectAll: false,
      tableHeight: 500,
      exportVisible: false,
      year: [
        2010,
        2011,
        2012,
        2013,
        2014,
        2015,
        2016,
        2017,
        2018,
        2019,
        2020,
        2021,
        2022,
        2023,
        2024,
        2025
      ],
      month: [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12'
      ],
      yearVal: 2021,
      monthVal: '',
      loading: false,
      selectedDate: [],
      currentMember: '',
      exportIng: false,
      exportData: [], // 导出数据，返回的数组列表
      interval: null
    }
  },
  computed: {
    colItem({ erpRoleSelect }) {
      return [
        {
          label: '用户查询',
          itemType: 'input',
          placeholder: '卖家账号/会员编号',
          key: 'maAccount'
        },
        {
          label: '用户来源',
          itemType: 'select',
          key: 'source',
          itemData: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '运营邀请',
              value: '1'
            },
            {
              label: '渠道邀请',
              value: '2'
            },
            {
              label: '用户邀请',
              value: '3'
            },
            {
              label: '自然注册',
              value: '4'
            }
          ],
          itemProp: {
            style: {
              width: '100px',
              minWidth: '100px'
            },
            modelitem: {
              marginRight: '0px'
            }
          }
        },
        {
          label: '',
          itemType: 'input',
          placeholder: '渠道号',
          key: 'sourceCode'
        },
        // {
        //   itemType: 'number',
        //   key: 'count',
        //   label: '站点数',
        //   itemProp: {
        //     min: 0,
        //     max: 9,
        //     style: {
        //       width: '200px'
        //     }
        //   }
        // },
        {
          label: '站点数',
          itemType: 'numberRange',
          key: 'countMin',
          itemProp: {
            style: {
              width: '90px',
              minWidth: '90px'
            },
            placeholder: '最小值'
          },
          key2: 'countMax',
          itemProp2: {
            style: {
              width: '90px',
              minWidth: '90px'
            },
            placeholder: '最大值'
          }
        },
        {
          label: '角色',
          itemType: 'select',
          itemData: [{ label: '全部', value: '' }, ...erpRoleSelect],
          key: 'roleId'
        },
        {
          label: '销售额区间',
          itemType: 'numberRange',
          key: 'beginSales',
          itemProp: {
            style: {
              width: '90px',
              minWidth: '90px'
            },
            placeholder: 'RMB'
          },
          key2: 'endSales',
          itemProp2: {
            style: {
              width: '90px',
              minWidth: '90px'
            },
            placeholder: 'RMB'
          }
        },
        {
          label: '注册时间段',
          itemType: 'rangePicker',
          key: 'registeredStartTime',
          itemProp: {
            disabledDate(current) {
              return current && current > moment().endOf('day')
            }
          }
        },
        {
          label: '登录时间段',
          itemType: 'rangePicker',
          key: 'lastLoginTime',
          itemProp: {
            disabledDate(current) {
              return current && current > moment().endOf('day')
            }
          }
        },
        {
          label: '是否货代用户',
          itemType: 'select',
          key: 'isForwarder',
          itemData: [
            {
              label: '默认',
              value: ''
            },
            {
              label: '否',
              value: 2
            },
            {
              label: '是',
              value: 1
            }
          ]
        },
        {
          label: '套餐订购类型',
          itemType: 'select',
          key: 'setMealCode',
          itemData: [
            {
              label: '全部',
              value: ''
            },
            {
              label: '免费版',
              value: '1'
            },
            {
              label: 'VIP',
              value: '2'
            },
            {
              label: 'VIP1',
              value: '3'
            },
            {
              label: 'VIP2',
              value: '4'
            },
            {
              label: 'VIP3',
              value: '5'
            }
          ],
          itemProp: {}
        }
      ]
    },
    columns() {
      return [
        {
          title: '会员编号',
          dataIndex: 'no',
          width: 200,
          scopedSlots: { customRender: 'no' }
        },
        {
          title: '卖家账号',
          dataIndex: 'maAccount',
          customRender: (text) => {
            return <div class="text-maAccount">{text}</div>
          },
          width: 150
        },
        {
          title: '注册时间',
          width: 200,
          dataIndex: 'registeredTime'
        },
        {
          title: '最后登录时间',
          width: 200,
          dataIndex: 'lastLoginTime'
        },
        {
          title: '站点数',
          dataIndex: 'count',
          scopedSlots: { customRender: 'count' },
          width: 100
        },
        {
          title: '用户来源',
          dataIndex: 'source',
          width: 150
        },
        {
          title: '邀请人',
          dataIndex: 'invitationCode',
          width: 100
        },
        {
          title: '本月销售额',
          dataIndex: 'storeSales',
          sorter: (a, b) => a.storeSales - b.storeSales,
          scopedSlots: { customRender: 'storeSales' },
          width: 150
        },
        {
          title: '角色',
          dataIndex: 'roleNameList',
          width: 100,
          customRender: (text) => {
            const arr = (text && text.split(',')) || []
            // function randomColor(index) {
            //   index = index > colorList.length - 1 ? 0 : index
            //   return colorList[index]
            // }
            return (
              <div class="role-list">
                <a-tag>{arr[0]}</a-tag>
                {!!arr.slice(1).length && (
                  <a-popover>
                    <div slot="content">
                      {arr.slice(1).map((item) => (
                        <a-tag>{item}</a-tag>
                      ))}
                    </div>
                    <span class="role-more">更多</span>
                  </a-popover>
                )}
              </div>
            )
          }
        },
        {
          title: '备注',
          dataIndex: 'remark',
          ellipsis: true,
          width: 100
        },
        {
          title: '操作',
          key: 'action',
          width: 100,
          fixed: 'right',
          scopedSlots: {
            customRender: 'action'
          }
        }
      ]
    }
  },
  async created() {
    let queryMemberid = this.$route.query.memberid
    // url有memberid参数，直接根据id查找单个，否则getlist
    if (queryMemberid) {
      this.visible = true
      let { data } = await memberDetails(queryMemberid)
      let roleIdListTemp = ''
      roleIdListTemp =
        data.roleIdList &&
        data.roleIdList.split(',').map((item) => Number(item))
      this.$set(data, 'roleIdList', roleIdListTemp)
      // this.$set(data, 'remark', data.remark)
      this.currentMember = data
    } else {
      this.getList()
    }
    this.getErpRoleSelect()
  },
  async mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)

    let { data } = await getDownloadList()
    this.exportData = data
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight)
    clearInterval(this.$data.interval)
  },
  methods: {
    async setTableHeight() {
      setTableHeight(this)
    },
    formattime(time) {
      if (time) {
        return moment(time).format('YYYY-MM-DD HH:mm:ss')
      } else {
        return time
      }
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams, // 分页参数
        this.params, // 排序参数或者别的
        this.formModel, // 过滤参数
        this.getStartOrEndTime(), // 时间的一些参数
        this.salesRange()
      )
      try {
        const { data } = await getUserList(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    // 销售额
    salesRange() {
      let sales = {}
      if (this.formModel.salesRange === '1') {
        sales.endSales = 10000
      } else if (this.formModel.salesRange === '2') {
        sales.beginSales = 10000
        sales.endSales = 50000
      } else if (this.formModel.salesRange === '3') {
        sales.beginSales = 50000
        sales.endSales = 100000
      } else if (this.formModel.salesRange === '4') {
        sales.beginSales = 100000
      }
      return sales
    },
    async getErpRoleSelect() {
      try {
        const { data } = await erpRoleSelect()
        this.erpRoleSelect =
          data &&
          data.map((item) => ({
            label: item.name,
            value: item.roleId,
            disabled: item.roleId === 1
          }))
      } catch (error) {
        console.error(error)
      }
    },
    onSelectChange(selected) {
      this.selectAll = !selected.length
      this.selectedRowKeys = selected
    },
    // 编辑
    async handleEdit(record) {
      this.visible = true
      let roleIdList = ''
      roleIdList =
        record.roleIdList &&
        record.roleIdList.split(',').map((item) => Number(item))

      this.currentObj = { ...record, roleIdList }
      let { data } = await memberDetails(record.memberId)
      this.currentMember = data
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
    // 关闭详情
    hideVisible() {
      this.visible = false
    },
    afterClose() {
      this.currentObj = {}
    },
    handleChange(e) {
      this.shopTags = e
    },
    // textChange(e) {
    //   this.currentObj.remark = e.target.value
    // },
    reset() {
      this.formModel = { ...initFormModel }
    },
    handleSearch() {
      this.resetParams()
      this.getList()
    },
    resetParams() {
      this.paginationParams = { ...initPagination }
      this.pagination.current = 1
      this.pagination.pageSize = 10
    },
    // 解构时间字段
    getStartOrEndTime() {
      const [registeredStartTime, registeredEndTime] =
        this.formModel.registeredStartTime || []
      const [lastLoginStartTime, lastLoginEndTime] =
        this.formModel.lastLoginTime || []
      return {
        lastLoginTime: undefined,
        registeredTime: undefined,
        registeredStartTime: this.formattime(registeredStartTime),
        registeredEndTime: this.formattime(registeredEndTime),
        loginStartTime: this.formattime(lastLoginStartTime),
        loginEndTime: this.formattime(lastLoginEndTime),
        yearMonth: this.formModel.yearMonth
          ? moment(this.formModel.yearMonth).format('YYYY-MM')
          : ''
      }
    },
    async exportShop() {
      const params = Object.assign(
        {},
        {
          ...this.formModel,
          ...this.getStartOrEndTime(),
          ...this.salesRange()
        }
      )
      try {
        this.exportIng = true
        await exportUser(params)
        this.$message.info("后台下载中,请稍后在'下载记录'中查看")
        this.$data.interval = setInterval(async () => {
          let { data } = await getDownloadList()
          let completedLength = data.filter((ele) => ele.completed === 1).length
          console.log(completedLength, data.length)
          if (completedLength === data.length || !data.length) {
            //
            this.exportData = data
            clearInterval(this.$data.interval)
            this.exportIng = false
          }
        }, 1000 * 2)
        // download(result, '导出用户')
      } catch (error) {
        console.error(error)
        this.exportIng = false
      }
    },

    async downloadFile(item) {
      let {downloadName, downloadUrl} = item
      const result = await downloadFile({
        fileName: downloadName,
        fileUrl: downloadUrl
      })
      download(result, downloadName)
    },

    // 导出销售数据
    exportShopData() {
      this.yearVal = 2021
      this.monthVal = ''
      this.selectedDate = []
      this.exportVisible = true
    },
    yearChange(e) {
      console.log(e)
      this.monthVal = ''
    },
    monthChange(e) {
      console.log(e)
      this.selectedDate.push({
        label: `${this.yearVal}年${this.monthVal}月`,
        value: `${this.yearVal}-${this.monthVal}`
      })
    },
    deleteDate(index) {
      this.selectedDate.splice(index, 1)
    },
    async exportOk() {
      if (!this.selectedDate.length) {
        return this.$message.warning('请选择导出年月')
      }
      let yearMonthList = []
      this.selectedDate.forEach((item) => {
        yearMonthList.push(item.value)
      })
      const params = Object.assign(
        {},
        {
          ...this.formModel,
          ...this.getStartOrEndTime(),
          ...this.salesRange(),
          yearMonthList
        }
      )

      try {
        const result = await userSalesExport(params)
        download(result, '导出用户')
        this.$message.success('导出成功')
      } catch (error) {
        console.error(error)
      }
    },
    radioChange(e) {
      this.currentObj.status = e.target.value
      this.$forceUpdate()
    },
    getTagsId(data) {
      this.$data.formModel.memberLabelIds = data
    }
  }
}
</script>

<style lang="less" scoped>
.all-user {
  padding: 16px;
  padding-top: 20px;
  background-color: #fff;
  height: 100%;
  // overflow: hidden;
  .export {
    display: flex;
    padding-top: 22px;
    padding-bottom: 16px;
  }
  .edit {
    color: @primary-color;
    cursor: pointer;
  }
  .role-list {
    padding: 5px 0;
    /deep/.ant-tag:not(:last-child) {
      margin-bottom: 5px;
    }
    /deep/.role-more {
      color: @primary-color;
      cursor: pointer;
    }
  }
  .text-maAccount {
    text-overflow: hidden;
    white-space: nowrap;
  }
}
.shop-item {
  display: flex;
  align-content: center;
  &:not(:last-child) {
    margin-bottom: 24px;
  }
  .label {
    margin-right: 10px;
    text-align: right;
    min-width: 60px;
    &::after {
      content: ':';
      height: 100%;
    }
  }
  .wrapper {
    flex: 1;
    ::v-deep .ant-select {
      width: 320px;
    }
  }
}

.curr-date {
  background: #eee;
  padding: 8px;
  margin-right: 10px;
  display: inline-block;
  margin-bottom: 5px;
}
.tagbox {
  width: 400px;
}
</style>
