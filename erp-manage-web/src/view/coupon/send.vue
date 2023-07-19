<template>
  <div>
    <a-space direction="vertical" style="width: 100%" :size="16">
      <a-card size="small" :bordered="false">
        <a-form-model layout="inline" :model="form">
          <a-form-model-item label="名称" prop="couponName">
            <a-input v-model="form.couponName" />
          </a-form-model-item>
          <a-form-model-item label="类型" prop="type">
            <a-select allowClear v-model="form.type" style="width: 180px">
              <a-select-option :value="1"> 会员体验券 </a-select-option>
              <a-select-option :value="2"> 旺币券 </a-select-option>
              <a-select-option :value="3"> 满减券 </a-select-option>
              <a-select-option :value="4"> 折扣券 </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="发送时间" prop="times">
            <a-range-picker allowClear v-model="form.times" showTime />
          </a-form-model-item>
          <a-form-model-item>
            <a-space>
              <a-button type="primary" @click="reLoadData">查询</a-button>
              <a-button @click="resetLoadData">重置</a-button>
            </a-space>
          </a-form-model-item>
        </a-form-model>
      </a-card>
      <a-card size="small" :bordered="false">
        <a-space direction="vertical" style="width: 100%" :size="16">
          <a-row>
            <a-col :span="12">
              <a-button type="primary" @click="onAppend">
                新增赠送优惠券
              </a-button>
            </a-col>
            <a-col :span="12" style="text-align: right">
              <a-button type="primary" @click="onExportSendData">
                导出赠送数据
              </a-button>
            </a-col>
          </a-row>

          <a-table
            :columns="columns"
            :data-source="pageResult.records"
            rowKey="mgCouponGiveId"
            :pagination="{
              current: pageResult.current,
              pageSize: pageResult.size,
              total: pageResult.total
            }"
            @change="onPageChange"
          >
            <template slot="content" slot-scope="text, record">
              <template v-if="record.couponType === 1">
                {{ getMeals(record.fieid1).name }} 免 {{ record.fieid2 }}
              </template>
              <template v-if="record.couponType === 2">
                送 {{ record.fieid1 }} 元
              </template>
              <template v-if="record.couponType === 3">
                满 {{ record.fieid1 }} 减 {{ record.fieid2 }}
              </template>
              <template v-if="record.couponType === 4">
                满 {{ record.fieid1 }} 元 {{ Number(record.fieid2) * 10 }}折
              </template>
            </template>

            <template slot="couponType" slot-scope="text">
              <template v-if="text === 1"> 会员体验券 </template>
              <template v-if="text === 2"> 旺币券 </template>
              <template v-if="text === 3"> 满减券 </template>
              <template v-if="text === 4"> 折扣券 </template>
            </template>

            <template slot="successNum" slot-scope="text, record">
              <a-button type="link" size="small" @click="onPreview(record)">
                {{ text }}
              </a-button>
            </template>

            <template slot="status" slot-scope="text, record">
              <template v-if="record.successNum == 0"> 失败 </template>
              <template
                v-if="
                  record.successNum > 0 && record.sendNum > record.successNum
                "
              >
                部分失败
              </template>
              <template v-if="record.successNum == record.sendNum">
                成功
              </template>
            </template>
          </a-table>
        </a-space>
      </a-card>
    </a-space>

    <a-modal
      title="新增赠送优惠券"
      :visible="putVisible"
      destroyOnClose
      @ok="onPutOk"
      @cancel="onPutCancel"
      :width="800"
      :maskClosable="false"
    >
      <PutGiveCoupon ref="PutGiveCoupon" />
    </a-modal>

    <a-modal
      title="人员明细"
      :visible="!!detailId"
      destroyOnClose
      @cancel="detailId = null"
      :width="800"
      :maskClosable="false"
    >
      <GiveCouponDetails :giveId="detailId" ref="GiveCouponDetails" />
    </a-modal>
  </div>
</template>

<script>
import PutGiveCoupon from './components/PutGiveCoupon'
import GiveCouponDetails from './components/GiveCouponDetails'
import { mgCouponGivePage, mgCouponGiveExportGiveCoupon } from '@/api/coupon'
import { getMarketSelect } from '@/api/usermanage'
import moment from 'moment'
import { download } from '@/utils'

const fmt = 'YYYY-MM-DD HH:mm:ss'

const columns = [
  { title: '优惠券名称', dataIndex: 'couponName', key: 'couponName' },
  {
    title: '内容',
    dataIndex: 'content',
    key: 'content',
    scopedSlots: { customRender: 'content' }
  },
  {
    title: '类型',
    dataIndex: 'couponType',
    key: 'couponType',
    scopedSlots: { customRender: 'couponType' }
  },
  { title: '发送人数', dataIndex: 'sendNum', key: 'sendNum' },
  {
    title: '接收人数',
    dataIndex: 'successNum',
    key: 'successNum',
    scopedSlots: { customRender: 'successNum' }
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    scopedSlots: { customRender: 'status' }
  },
  { title: '发送时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作人', dataIndex: 'createBy', key: 'createBy' }
]
export default {
  components: {
    PutGiveCoupon,
    GiveCouponDetails
  },
  data() {
    return {
      form: {},
      pageParams: {
        current: 1,
        size: 10
      },
      pageResult: {
        current: 0,
        size: 0,
        total: 0,
        records: []
      },
      columns,
      putVisible: false,
      currentCoupon: null,
      meals: [],

      detailVisible: false,
      detailId: null
    }
  },
  mounted() {
    this.loadData()

    getMarketSelect().then((res) => {
      this.meals = res.data
    })
  },
  methods: {
    // 加载数据
    loadData() {
      const { times, ...args } = this.form
      const data = { ...args, ...this.pageParams }
      if (Array.isArray(times)) {
        const [startTime, endTime] = times
        data.grantStartTime = moment(startTime).format(fmt)
        data.grantEndTime = moment(endTime).format(fmt)
      }
      mgCouponGivePage(data).then((res) => {
        this.pageResult = res.data
      })
    },
    // 从第一页加载
    reLoadData() {
      this.pageParams.current = 1
      this.$nextTick(this.loadData)
    },
    // 重置搜索
    resetLoadData() {
      this.form = {}
      this.reLoadData()
    },
    // 分页改变
    onPageChange({ current, size }) {
      this.pageParams.current = current
      this.pageParams.size = size
      this.$nextTick(this.loadData)
    },
    getMeals(type) {
      const meal = this.meals.find(({ id }) => id === type)
      return meal || {}
    },
    onPreview({ mgCouponGiveId }) {
      this.detailId = mgCouponGiveId
    },
    onAppend() {
      this.putVisible = true
      this.currentCoupon = null
    },
    /** 导出赠送数据 */
    onExportSendData() {
      const { times, ...args } = this.form
      const data = { ...args, ...this.pageParams }
      if (Array.isArray(times)) {
        const [startTime, endTime] = times
        data.grantStartTime = moment(startTime).format(fmt)
        data.grantEndTime = moment(endTime).format(fmt)
      }
      mgCouponGiveExportGiveCoupon(data).then((res) => {
        download(res, '赠送数据')
        this.$message.success('导出赠送数据成功')
      })
    },
    onPutOk() {
      this.$refs.PutGiveCoupon.submit()
        .then(() => {
          this.putVisible = false
          this.currentCoupon = null
          this.loadData()
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    },
    onPutCancel() {
      this.putVisible = false
      this.currentCoupon = null
    }
  }
}
</script>

<style>
</style>
