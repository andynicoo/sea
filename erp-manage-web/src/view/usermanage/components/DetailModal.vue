<template>
  <a-modal
    :visible="value"
    :width="800"
    :after-close="afterClose"
    :closable="false"
    @cancel="$emit('input', false)"
    @ok="$emit('input', false)"
  >
    <template #title>
      <div class="detail-title">
        <a-select
          v-model="searchType"
          style="width: 100px"
        >
          <a-select-option value="regTime">
            注册时间
          </a-select-option>
          <a-select-option value="bindTime">
            绑定时间
          </a-select-option>
        </a-select>
        <a-range-picker
          v-show="searchType === 'regTime'"
          v-model="formModel.regTime"
          clear
          show-time
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        <a-range-picker
          v-show="searchType !== 'regTime'"
          v-model="formModel.bindTime"
          clear
          show-time
          value-format="YYYY-MM-DD HH:mm:ss"
        />
        <a-button
          type="primary"
          class="g-ml10"
          @click="getList"
        >搜索</a-button>

        <a-button
          v-permission:user_relationship="['export']"
          type="primary"
          :disabled="!data.length"
          class="me-fr"
          @click="handleExport"
        >导出</a-button>
      </div>
    </template>
    <a-table
      :pagination="pagination"
      :columns="columns"
      :data-source="data"
      :row-key="(record) => record.maAccount"
      :scroll="{ y: 400 }"
      @change="onChange"
    >
      <template
        slot="maAccount"
        slot-scope="text, record"
      >
        <span
          class="hand me-status-primary"
          @click="handleLook(record)"
        >{{ record.maAccount }}</span>
      </template>
    </a-table>
  </a-modal>
</template>

<script>
import { getInvitationList, exportInvitation } from '@/api/usermanage'
import { download } from '@/utils'
const initPagination = {
  current: 1,
  size: 10
}
const initFormModel = {
  regTime: [],
  bindTime: []
}
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    currentObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      data: [],
      columns: [
        {
          title: '被邀请人',
          dataIndex: 'maAccount',
          scopedSlots: { customRender: 'maAccount' }
        },
        {
          title: '用户ID',
          dataIndex: 'no'
        },
        {
          title: '订购金额',
          dataIndex: 'buySetMealAmountTotal',
          sorter: (a, b) => a.buySetMealAmountTotal - b.buySetMealAmountTotal
        },
        {
          title: '注册时间',
          dataIndex: 'registerTime',
          sorter: (a, b) => a.registerTime - b.registerTime
        },
        {
          title: '绑定店铺时间',
          dataIndex: 'bindingTime',
          sorter: (a, b) => a.bindingTime - b.bindingTime
        }
      ],
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}人`
      },
      paginationParams: {
        ...initPagination
      },
      selectedRowKeys: [],
      formModel: {},
      searchType: 'regTime',
      params: {} // 排序搜索条件
    }
  },
  computed: {
    colItem() {
      return [
        {
          label: '注册时间段',
          itemType: 'rangePicker',
          key: 'regTime',
          placeholder: '注册时间段'
        }
      ]
    }
  },
  created() {
    this.formModel = { ...initFormModel }
  },
  methods: {
    async getList() {
      const params = Object.assign({}, this.paginationParams, {
        memberId: this.currentObj.memberId,
        invitationCode: this.currentObj.invitationCode
      })
      if (this.$data.searchType === 'regTime') {
        params.regStartTime = this.$data.formModel.regTime[0]
        params.regEndTime = this.$data.formModel.regTime[1]
      } else {
        params.bindStartTime = this.$data.formModel.bindTime[0]
        params.bindEndTime = this.$data.formModel.bindTime[1]
      }
      console.log({...params, ...this.params})
      try {
        let param = {...params, ...this.params}
        param.current = this.pagination.current
        const { data } = await getInvitationList(param)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    async handleExport() {
      let params = {
        ...this.$data.formModel,
        ...this.currentObj,
        ...this.params
      }
      if (this.$data.searchType === 'regTime') {
        params.regStartTime = this.$data.formModel.regTime[0]
        params.regEndTime = this.$data.formModel.regTime[1]
      } else {
        params.bindStartTime = this.$data.formModel.bindTime[0]
        params.bindEndTime = this.$data.formModel.bindTime[1]
      }
      console.log(params)
      try {
        const result = await exportInvitation(params)
        download(result, `${this.currentObj.invitation}的邀请情况`)
        this.$message.success('导出成功')
        this.$emit('input', false)
      } catch (error) {
        console.error(error)
      }
    },
    afterClose() {
      this.data = []
      this.resetPage()
    },
    resetPage() {
      this.paginationParams = { ...initPagination }
      this.pagination.total = 0
      this.pagination.current = 1
      this.pagination.pageSize = 10
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    onChange(pagination, filters, sorter) {
      console.log(pagination, filters, sorter)
      this.pagination = { ...pagination }
      const { current, pageSize: size } = pagination
      const { field, order } = sorter
      const orderObj = {
        ascend: 'asc',
        descend: 'desc'
      }
      this.params = {
        field,
        order: orderObj[order]
      }
      // this.paginationParams.current = page
      // this.pagination.current = page
      this.getList()
    },
    resetParams() {
      this.paginationParams = { ...initPagination }
      this.pagination.current = 1
      this.pagination.pageSize = 10
    },
    handleLook(record) {
      this.$router.push({ path: `/usermanage/all-user?memberid=${record.memberId}` })
    }
  }
}
</script>

<style lang="less" scoped>
.flag-text {
  color: @primary-color;
}
.detail-title {
  // display: flex;
}
.export {
  height: 30px;
  line-height: 30px;
  margin: 5px 0px;
}
.hand{
  cursor: pointer;
}
</style>
