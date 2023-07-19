<template>
  <div ref="container">
    <div v-if="model === 'list'">
      <div class="wrapper g-mb15">
        <a-space>
          <span style="display:none">{{ env }}</span>
          马六甲ERP套餐推广链接:
          <span v-if="env==='pro'">
            https://hm-erp.emalacca.com/buy.html
          </span>
          <span v-else>
            https://hm-erp-sit1.emalacca.com/buy.html
          </span>
          <a-button
            v-if="env==='pro'"
            v-copy="'https://hm-erp.emalacca.com/buy.html'"
            type="primary"
          > 复制 </a-button>
          <a-button
            v-else
            v-copy="'https://hm-erp-sit1.emalacca.com/buy.html'"
            type="primary"
          > 复制 </a-button>
          <a-button
            type="primary"
            @click="downloadImg"
          > 二维码下载 </a-button>
        </a-space>
      </div>
      <div class="wrapper">
        <div class="tabs">
          <a-tabs v-model="activeKey">
            <a-tab-pane
              key="1"
              tab="推广列表"
            />
            <!-- <a-tab-pane
            key="2"
            tab="分销设置"
            force-render
          /> -->
          </a-tabs>
        </div>
        <a-table
          :pagination="pagination"
          :columns="columns"
          :data-source="data"
          :row-key="(record, index) => index"
          :scroll="{ y: tableHeight }"
          @change="onChange"
        >
          <template
            slot="giveUnit"
            slot-scope="text, record"
          >
            {{ record.configName }}/<span
              v-if="record.configUnit === 'MONTH'"
            >月
            </span>
            <span v-else>年 </span>
          </template>
          <template
            slot="activityType"
            slot-scope="text, record"
          >
            <!-- 买几送几 -->
            <span v-if="record.activityType === 1">
              买{{ record.purchaseQuantity }}送{{ record.giveQuantity }}个<span
                v-if="record.giveUnit === 1"
              >月</span>
              <span v-else>年</span>
            </span>
            <!-- 折扣 -->
            <span v-if="record.activityType === 2">
              打{{ record.discount * 10 }}折
            </span>
            <span v-if="record.activityType === 3">
              一口价{{ record.specialPrice }}旺币
            </span>
          </template>
          <template
            slot="enableStatus"
            slot-scope="text, record"
          >
            <span
              v-if="record.enableStatus"
              class="me-status-success"
            >
              启用
            </span>
            <span
              v-else
              class="me-status-skip"
            > 禁用 </span>
          </template>

          <template #action="text, record">
            <a-button
              type="link"
              @click="handleEdit(record)"
            >修改</a-button>
            <a-button
              v-if="record.enableStatus"
              type="link"
              :loading="record._loading"
              @click="eidtStatus(record)"
            >
              禁用
            </a-button>
            <a-button
              v-else
              type="link"
              :loading="record._loading"
              @click="eidtStatus(record)"
            >
              启用
            </a-button>
            <a-button
              type="link"
              @click="viewMobile = true"
            >
              预览
            </a-button>
          </template>
        </a-table>
      </div>
    </div>
    <div v-else>
      <editPromotion
        :current-obj="currentObj"
        @cancalContent="cancalContent"
      />
    </div>
    <a-modal
      v-model="viewMobile"
      :footer="null"
      :destroy-on-close="true"
      :width="350"
      :centered="true"
      :body-style="{ 'padding': 0 }"
      dialog-class="mobilecontent"
    >
      <Mobile />
    </a-modal>
  </div>
</template>

<script>
import { debounce, setTableHeight, downloadIamge } from '@/utils'
import { getPromotionList, editPromotionStatus } from '@/api/usermanage'
import editPromotion from './editPromotion'
import Mobile from './mobile'
import moment from 'moment'
const initPagination = {
  current: 1,
  size: 10
}
const imgUrl1 = require('@/assets/memberH51.png')
const imgUrl2 = require('@/assets/memberH52.png')
export default {
  components: {
    editPromotion,
    Mobile
  },
  data() {
    this.setTableHeight = debounce(this.setTableHeight, 200)
    return {
      moment,
      pagination: {
        current: 1,
        pageSize: 10,
        pageSizeOptions: ['10', '30', '50'],
        showQuickJumper: true,
        showSizeChanger: true,
        total: 0,
        showTotal: (total) => `共${total}条`
      },
      tableHeight: 400,
      params: {},
      paginationParams: {
        ...initPagination
      },
      visible: false,
      data: [],
      currentObj: {},
      model: 'list',
      originData: [],

      activeKey: '1',
      viewMobile: false,
      imgUrl: '',
      imgUrl1,
      imgUrl2,
      env: ''
    }
  },
  computed: {
    columns() {
      return [
        {
          title: '工具名称',
          dataIndex: 'toolName'
        },
        {
          title: '启用状态',
          dataIndex: 'enableStatus',
          scopedSlots: { customRender: 'enableStatus' }
        },
        {
          title: '更新时间',
          dataIndex: 'updateTime',
          scopedSlots: { customRender: 'updateTime' },
          width: 350
        },
        {
          title: '操作',
          scopedSlots: { customRender: 'action' }
        }
      ]
    }
  },
  created() {
    this.getList() // 主列表
  },
  mounted() {
    this.setTableHeight()
    window.addEventListener('resize', this.setTableHeight)
    process.env.NODE_ENV === 'production' && location.host.indexOf('sit1') < 0 ? this.env = 'pro' : this.env = 'dev'
    process.env.NODE_ENV === 'production' && location.host.indexOf('sit1') < 0 ? this.imgUrl = this.imgUrl1 : this.imgUrl = this.imgUrl2
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    async setTableHeight(e) {
      setTableHeight(this)
    },
    async getList() {
      const params = Object.assign(
        {},
        this.paginationParams, // 分页参数
        this.params // 排序参数或者别的
      )
      try {
        const { data } = await getPromotionList(params)
        this.data = data?.records || []
        this.pagination.total = data?.total || 0
      } catch (error) {
        console.error(error)
      }
    },
    // 修改单个活动状态
    eidtStatus(record) {
      this.$set(record, '_loading', true)
      let params = record
      params.enableStatus = !record.enableStatus
      editPromotionStatus(params)
        .then((res) => {
          if (res.code === '0') {
            this.getList()
          } else {
            this.$message.error(res.message)
          }
        })
        .finally(() => {
          this.$set(record, '_loading', false)
        })
        .catch((err) => {
          this.$message.error(err.message)
        })
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
    handleEdit(record) {
      this.currentObj = record
      this.model = 'edit'
    },
    viewContent(record) {
      this.currentObj = record
      this.visible = true
    },
    onTimeChange(date, dateString) {
      console.log(date, dateString)
    },
    golist() {
      this.getList()
    },
    downloadImg() {
      downloadIamge(this.imgUrl, '马六甲ERP套餐推广H5二维码')
    },
    cancalContent() {
      this.model = 'list'
      this.getList()
    }
  }
}
</script>

<style lang="less" scoped>
.wrapper {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  border-radius: 3px;
  padding: 16px;
  .filters {
    padding-bottom: 12px;
  }
}
.box1 {
  width: 80px;
  height: 36px;
  display: inline-block;
  background: #ff4a4a;
  color: #fff;
  text-align: center;
  line-height: 36px;
}
.box2 {
  width: 80px;
  height: 36px;
  display: inline-block;
  background: #fff;
  color: #ff4a4a;
  text-align: center;
  line-height: 34px;
  border: 2px solid #ff4a4a;
}
</style>
<style lang="less">
.mobilecontent{
// padding: 10px 0px 5px 0px;
  .ant-modal-close {
     left: 0 !important;
  }
}
</style>
