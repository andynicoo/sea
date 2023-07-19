<template>
  <div>
    <a-space direction="vertical" style="width: 100%" :size="16">
      <!-- 搜索 start -->
      <a-card size="small" :bordered="false">
        <a-form-model layout="inline" :model="form">
          <a-form-model-item label="名称">
            <a-input v-model="form.couponName" />
          </a-form-model-item>
          <a-form-model-item label="类型">
            <a-select allowClear v-model="form.couponType" style="width: 180px">
              <a-select-option :value="1"> 会员体验券 </a-select-option>
              <a-select-option :value="2"> 旺币券 </a-select-option>
              <a-select-option :value="3"> 满减券 </a-select-option>
              <a-select-option :value="4"> 折扣券 </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="状态">
            <a-select
              allowClear
              v-model="form.couponStatus"
              style="width: 180px"
            >
              <a-select-option :value="1"> 启用 </a-select-option>
              <a-select-option :value="2"> 停用 </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="有效期">
            <a-range-picker allowClear v-model="form.validity" showTime />
          </a-form-model-item>
          <a-form-model-item>
            <a-space>
              <a-button type="primary" @click="reLoadData"> 查询 </a-button>
              <a-button @click="resetLoadData">重置</a-button>
            </a-space>
          </a-form-model-item>
        </a-form-model>
      </a-card>
      <!-- 搜索 end -->

      <!-- 表格 start -->
      <a-card size="small" :bordered="false">
        <a-space direction="vertical" style="width: 100%" :size="16">
          <a-row type="flex">
            <a-col :span="12">
              <a-button type="primary" @click="onAppendCoupon">
                新增优惠券
              </a-button>
            </a-col>
            <a-col :span="12" style="text-align: right">
              <a-space :size="16">
                <a-button type="primary" @click="onExportCouponData">
                  导出优惠券数据
                </a-button>
                <a-button type="primary" @click="onExportDetailData">
                  导出明细数据
                </a-button>
              </a-space>
            </a-col>
          </a-row>

          <a-table
            :columns="columns"
            :data-source="pageResult.records"
            rowKey="mgCouponId"
            :scroll="{ x: 2000 }"
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
                满{{ record.fieid1 }}元减{{ record.fieid2 }}元
              </template>
              <template v-if="record.couponType === 4">
                满{{ record.fieid1 }} 元 {{ Number(record.fieid2) * 10 }}折
              </template>
            </template>
            <template slot="couponType" slot-scope="text">
              <template v-if="text === 1"> 会员体验券 </template>
              <template v-if="text === 2"> 旺币券 </template>
              <template v-if="text === 3"> 满减券 </template>
              <template v-if="text === 4"> 折扣券 </template>
            </template>
            <template slot="times" slot-scope="text, record">
              <template v-if="record.startTime && record.endTime">
                {{ record.startTime }} ~ {{ record.endTime }}
              </template>
            </template>
            <template slot="couponStatus" slot-scope="text">
              <template v-if="text === 1"> 启用 </template>
              <template v-if="text === 2"> 停用 </template>
            </template>
            <template slot="totalQuantity" slot-scope="text">
              {{ text == 0 ? '无限' : text }}
            </template>
            <template slot="remark" slot-scope="text">
              <p class="text-line-2">{{ text }}</p>
            </template>
            <template slot="actions" slot-scope="text, record">
              <a-space>
                <span class="action-button" @click="onEdit(record)">编辑</span>
                <span class="action-button" @click="onDetail(record)">
                  明细
                </span>
              </a-space>
            </template>
          </a-table>
        </a-space>
      </a-card>
      <!-- 表格 end -->
    </a-space>

    <!-- 新增、编辑优惠券 start -->
    <a-modal
      destroyOnClose
      :visible="putVisible"
      :title="`${currentCoupon ? '编辑' : '新增'}优惠券`"
      @ok="onPutOk"
      @cancel="onPutCancel"
      :width="800"
      :loading="editLoading"
      :maskClosable="false"
    >
      <PutCoupon ref="PutCoupon" :coupon="currentCoupon" />
    </a-modal>
    <!-- 新增、编辑优惠券 end -->

    <!-- 优惠券明细 start -->
    <a-modal
      destroyOnClose
      :visible="detailsVisible"
      :title="`${currentCoupon && currentCoupon.couponName}-人员明细`"
      @cancel="onDetailCancel"
      :width="800"
      :maskClosable="false"
    >
      <template v-if="currentCoupon">
        <CouponDetails :couponId="currentCoupon.mgCouponId" />
      </template>
    </a-modal>
    <!-- 优惠券明细 end -->
  </div>
</template>

<script>
import PutCoupon from './components/PutCoupon'
import CouponDetails from './components/CouponDetails'
import {
  mgCouponPage,
  mgCouponExportCoupon,
  mgCouponExportCouponDetail
} from '@/api/coupon'
import { getMarketSelect } from '@/api/usermanage'
import moment from 'moment'
import { download } from '@/utils'

const fmt = 'YYYY-MM-DD HH:mm:ss'

const columns = [
  {
    dataIndex: 'couponName',
    key: 'couponName',
    title: '优惠券名称'
  },
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
  {
    title: '兑换码',
    key: 'exchangeCode',
    dataIndex: 'exchangeCode'
  },
  {
    title: '启用时间',
    key: 'times',
    dataIndex: 'times',
    scopedSlots: { customRender: 'times' },
    width: 350
  },
  {
    title: '状态',
    key: 'couponStatus',
    dataIndex: 'couponStatus',
    scopedSlots: { customRender: 'couponStatus' }
  },
  {
    title: '总数',
    key: 'totalQuantity',
    dataIndex: 'totalQuantity',
    scopedSlots: { customRender: 'totalQuantity' }
  },
  {
    title: '已发放',
    key: 'issuedNumber',
    dataIndex: 'issuedNumber'
  },
  {
    title: '已使用',
    key: 'usedNumber',
    dataIndex: 'usedNumber'
  },
  {
    title: '备注',
    key: 'remark',
    dataIndex: 'remark',
    scopedSlots: { customRender: 'remark' }
  },
  {
    title: '创建时间',
    key: 'createTime',
    dataIndex: 'createTime',
    width: 200
  },
  {
    title: '创建人',
    key: 'createBy',
    dataIndex: 'createBy'
  },
  {
    title: '操作',
    key: 'actions',
    dataIndex: 'actions',
    scopedSlots: { customRender: 'actions' },
    fixed: 'right'
  }
]
export default {
  components: {
    PutCoupon,
    CouponDetails
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
      detailsVisible: false,
      putVisible: false,
      currentCoupon: null,

      editLoading: false,

      meals: []
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
      const { validity, ...args } = this.form
      const data = { ...args, ...this.pageParams }
      if (Array.isArray(validity)) {
        const [startTime, endTime] = validity
        data.startTime = moment(startTime).format(fmt)
        data.endTime = moment(endTime).format(fmt)
      }
      mgCouponPage(data).then((res) => {
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
    // 分页
    onPageChange({ current, size }) {
      this.pageParams.current = current
      this.pageParams.size = size
      this.$nextTick(this.loadData)
    },
    // 编辑
    onEdit(coupon) {
      this.currentCoupon = coupon
      this.putVisible = true
    },
    // 明细
    onDetail(coupon) {
      this.currentCoupon = coupon
      this.detailsVisible = true
    },
    // 关闭明细
    onDetailCancel() {
      this.currentCoupon = null
      this.detailsVisible = false
    },
    getMeals(type) {
      const meal = this.meals.find(({ id }) => id === type)
      return meal || {}
    },
    onAppendCoupon() {
      this.$data.putVisible = true
      this.$data.currentCoupon = null
    },
    /** 导出优惠券数据 */
    onExportCouponData() {
      const { validity, ...args } = this.form
      const data = { ...args, ...this.pageParams }
      if (Array.isArray(validity)) {
        const [startTime, endTime] = validity
        data.startTime = moment(startTime).format(fmt)
        data.endTime = moment(endTime).format(fmt)
      }
      mgCouponExportCoupon(data).then((res) => {
        download(res, '优惠券数据')
        this.$message.success('导出优惠券数据成功')
      })
    },
    /** 导出明细数据 */
    onExportDetailData() {
      const { validity, ...args } = this.form
      const data = { ...args, ...this.pageParams }
      if (Array.isArray(validity)) {
        const [startTime, endTime] = validity
        data.startTime = moment(startTime).format(fmt)
        data.endTime = moment(endTime).format(fmt)
      }
      mgCouponExportCouponDetail(data).then((res) => {
        download(res, '优惠券明细数据')
        this.$message.success('导出优惠券明细数据成功')
      })
    },
    onPutOk() {
      this.editLoading = true
      this.$refs.PutCoupon.submit()
        .then(() => {
          this.$message.success('新增成功')
          this.editLoading = false
          this.$data.putVisible = false
          this.$data.currentCoupon = null
          this.loadData()
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    },
    onPutCancel() {
      this.$data.putVisible = false
      this.$data.currentCoupon = null
    }
  }
}
</script>

<style lang="less" scoped>
.text-line-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>
