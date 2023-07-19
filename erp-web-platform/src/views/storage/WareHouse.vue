<template>
  <div>
    <a-space class="me-mb-2 marginTen">
      <a-button @click="authorShow" type="primary">
        {{ $t('packages.increaseAuthorization') }}
      </a-button>
    </a-space>

    <a-table
      :columns="columns"
      :rowKey="(record) => record.empowerId"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      style="background-color: #fff;margin: 10px"
    >
      <template slot="name" slot-scope="name">
        {{ name.first }} {{ name.last }}</template
      >
      <template slot="seaStoreDetails" slot-scope="text, record">
        <span v-for="(item, index) in record.seaStoreDetails" :key="index">
          {{ item.storeName }}</span
        >
      </template>
      <template slot="action" slot-scope="text, record">
        <a @click="editShow(record)"> 编辑</a>
        <a-divider type="vertical" />
        <a @click="synchronizeStore(record)"> 同步海外仓</a>
        <a-divider type="vertical" />
        <a :href="record.serviceProviderOmsUrl" target="_blank">
          登录海外仓系统</a
        >
      </template>
    </a-table>

    <AuthorizationModel
      :authorization-visible="authorVisible"
      @oldUsers="oldUsers"
      @cancel="authorCancel"
      :authorization-list="authorizationList"
      :service-provider="serviceProviderList"
    ></AuthorizationModel>

    <EditAuthorizationModal
      :visible="editVisible"
      @cancel="editModalCancel"
      :provider="provider"
      @selectProvider="selectProvider"
      @submit="submit"
      :edit-type="editType"
    ></EditAuthorizationModal>
  </div>
</template>
<script>
import AuthorizationModel from './components/warehouse/AuthorizationModal'
import EditAuthorizationModal from './components/warehouse/EditAuthorizationModal'
import { anthorizationMixin } from './components/warehouse/authorizationMixin'
import { editAnthorizationMixin } from './components/warehouse/EditActhorizationMixin'
import Package from '@/api/package'

/**
 *   表格字段
 * @type {[{dataIndex: string, title: string}, {dataIndex: string, title: string}, {dataIndex: string, title: string}, {dataIndex: string, title: string}, {scopedSlots: {customRender: string}, dataIndex: string, title: string}]}
 */
const columns = [
  {
    title: '服务商',
    dataIndex: 'serviceProviderName'
  },
  {
    title: '自定义名称',
    dataIndex: 'customName'
  },
  {
    title: '开启仓库',
    dataIndex: 'seaStoreDetails',
    scopedSlots: { customRender: 'seaStoreDetails' }
  },
  {
    title: '授权时间',
    dataIndex: 'authorizationTime'
  },
  {
    title: '操作',
    dataIndex: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

const EDIT_TYPE = {
  ADD: 1,
  EDIT: 2
}

export default {
  components: {
    EditAuthorizationModal,
    AuthorizationModel
  },
  mixins: [anthorizationMixin, editAnthorizationMixin],
  data() {
    return {
      dataSource: [],
      pagination: {
        pageSize: 20,
        current: 1,
        total: 20
      },
      loading: false,
      columns,
      editType: 0
    }
  },
  mounted() {
    const params = {
      current: this.pagination.current,
      size: this.pagination.pageSize
    }
    this.fetch(params)
  },
  methods: {
    /**
     *  表格操作 编辑
     * @param record
     *
     */
    editShow(record) {
      record.seaReqAuths = record.seaReqAuthDetails
      console.log(this.provider)
      this.provider = record
      this.editType = EDIT_TYPE.EDIT
      //seaReqAuthDetails
      this.provider.overSeasStores = this.provider.seaStoreDetails?.map(
        (item) => {
          return { name: item.storeName }
        }
      )
      this.editModalShow()
    },
    synchronizeStore(record) {
      this.$message.success(this.$t('storage.synchronizeStoreTips'))
      const params = { seaSystemId: record.seaSystemId }
      Package.synchronizeStore(params).then((res) => {
        this.fetch(params)
      })
    },
    /**
     *  提交服务商秘钥
     * @param params
     * @param  type    类型
     * @param provider    服务商信息
     *
     */
    submit(info) {
      if (info.type === EDIT_TYPE.ADD) {
        Package.addSeaEmpower(info.params).then((res) => {
          this.editModalCancel()
          this.fetch({})
        })
      } else {
        Package.editSeaEmpower(info.params).then((res) => {
          this.editModalCancel()
          this.fetch({})
        })
      }
    },
    /**
     * 选择服务商
     */
    selectProvider() {
      this.editVisible = false
      this.authorVisible = true
    },
    /**
     * 老账户授权
     * @param params
     * @param  type    类型
     * @param provider    服务商信息
     *
     */
    oldUsers(params) {
      if (params.provider) {
        this.editType = EDIT_TYPE.ADD
        this.provider = {}
        this.provider = params.provider
        this.authorVisible = false
        this.editVisible = true
      } else {
        this.successAlert(this.$t('packages.selectProvider'))
      }
    },
    /**
     *   表格修改分页
     * @param pagination
     * @param filters
     * @param sorter
     */
    handleTableChange(pagination, filters, sorter) {
      this.fetch({})
    },
    /**
     * 获取列表
     *  @param params  搜索参数
     */
    fetch(item) {
      const params = {
        current: this.pagination.current,
        size: this.pagination.pageSize,
        ...item
      }
      this.loading = true
      Package.getSeaEmpower(params)
        .then((res) => {
          this.pagination.total = res.data.total
          this.loading = false
          this.dataSource = res.data.records
        })
        .catch((reason) => {
          this.loading = false
        })
    }
  }
}
</script>

<style>
.editable-add-btn {
  margin-bottom: 8px;
}
.marginTen {
  margin: 10px;
}
</style>
