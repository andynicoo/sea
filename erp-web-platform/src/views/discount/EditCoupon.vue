<template>
  <div class="me-pa-2 xxx">
    <div class="me-pb-2">
      <a-breadcrumb class="me-ib">
        <a-breadcrumb-item>优惠券</a-breadcrumb-item>
        <a-breadcrumb-item v-if="editType === 'eidt'">编辑</a-breadcrumb-item>
        <a-breadcrumb-item v-else-if="editType === 'view'"
          >查看</a-breadcrumb-item
        >
        <a-breadcrumb-item v-else>创建</a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <!-- 是否可用规则
    进行中  名称 期限 发放数量
    接下来  两个单选不可选，其他可以
    view 都不可用 -->
    <a-form-model
      :model="form"
      :rules="rules"
      ref="ruleForm"
      :label-col="labelCol"
      :wrapper-col="wrapperCol"
    >
      <div class="me-card">
        <h2>
          基本信息
        </h2>
        <a-form-model-item label="选择店铺" prop="storeId">
          <a-select
            v-model="form.storeId"
            class="me-w560"
            placeholder="请选择"
            :disabled="editType === 'edit' || editType === 'view'"
          >
            <a-select-option
              v-for="item in storeList"
              :key="item.storeId"
              :value="item.storeId"
            >
              {{ item.storeAlias || item.storeName }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="优惠名称" prop="voucherName">
          <a-input
            v-model="form.voucherName"
            :disabled="
              (editType === 'view' && editStatus !== 'upcoming') ||
                editType === 'view'
            "
            :suffix="form.voucherName.length + '/ 20'"
          />
        </a-form-model-item>
        <a-form-model-item label="使用期限" prop="setTime">
          <a-range-picker
            :show-time="{ format: 'HH:mm:ss' }"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
            v-model="form.setTime"
            style="min-width: 425px"
            :disabled-date="disabledDate"
            :disabled-time="disabledRangeTime"
            :disabled="
              (editType === 'edit' && editStatus !== 'upcoming') ||
                editType === 'view'
            "
          />
        </a-form-model-item>
      </div>
      <div class="me-card">
        <h2>
          优惠设置
        </h2>
        <a-form-model-item label="优惠类型">
          <a-radio-group
            @change="voucherTypeChange"
            name="radioGroup"
            v-model="form.voucherType"
            :disabled="editType === 'edit' || editType === 'view'"
          >
            <a-radio :value="1">
              店铺优惠券
            </a-radio>
            <a-radio :value="2">
              商品优惠券
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="优惠码" prop="voucherCode">
          <a-input
            v-model="form.voucherCode"
            :disabled="editType === 'edit' || editType === 'view'"
            style="width:250px"
            :prefix="form.prefix"
          />
          {{ form.voucherCode.length }}/5
        </a-form-model-item>
      </div>
      <div class="me-card">
        <h2>
          奖励设置
        </h2>
        <a-form-model-item label="奖励类型">
          <a-radio-group
            name="radioGroup"
            v-model="form.type"
            :disabled="editType === 'edit' || editType === 'view'"
            @change="onChangeType"
          >
            <a-radio :value="1">
              折扣
            </a-radio>
            <a-radio :value="2">
              shopee币回扣
            </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item
          label="折扣类型/优惠限额"
          :prop="form.searchType === 'zk' ? 'discountAmount' : 'percentage'"
        >
          <a-input-group compact>
            <a-select
              v-model="form.searchType"
              style="width:110px"
              :disabled="
                ((editType === 'edit' || editType === 'view') &&
                  editStatus !== 'upcoming') ||
                  editType === 'view'
              "
            >
              <!-- 选shopee币回扣的时候只能填 百分比折扣 -->
              <a-select-option value="zk" v-if="form.type === 1">
                折扣金额
              </a-select-option>
              <a-select-option value="bfb">
                百分比折扣
              </a-select-option>
            </a-select>
            <!-- :prefix="currency" -->
            <a-input
              v-model="form.discountAmount"
              style="width: 316px"
              placeholder="请输入金额"
              v-if="form.searchType === 'zk'"
              v-enterIntNumber
              :disabled="
                ((editType === 'edit' || editType === 'view') &&
                  editStatus !== 'upcoming') ||
                  editType === 'view'
              "
              :prefix="currency"
            />
            <a-input
              v-model="form.percentage"
              style="width: 316px"
              placeholder="请输入百分百"
              v-else
              suffix="%"
              v-enterIntNumber
              :disabled="
                ((editType === 'edit' || editType === 'view') &&
                  editStatus !== 'upcoming') ||
                  editType === 'view'
              "
            />
          </a-input-group>
        </a-form-model-item>
        <!-- 选择折扣金额时，无最高限额选项 -->
        <a-form-model-item
          label="最高限额"
          prop="maxPrice"
          v-if="form.searchType === 'bfb'"
        >
          <!-- 奖励类型选择shopee币回扣的时候，不显示最高限额 -->
          <a-input
            placeholder="请输入最高限额"
            v-model="form.maxPrice"
            v-enterIntNumber
            :disabled="
              ((editType === 'edit' || editType === 'view') &&
                editStatus !== 'upcoming') ||
                editType === 'view'
            "
            :prefix="currency"
          />
        </a-form-model-item>
        <a-form-model-item label="最低消费金额" prop="minBasketPrice">
          <a-input
            v-model="form.minBasketPrice"
            v-enterIntNumber
            placeholder="请输入最低消费金额"
            :prefix="currency"
            :disabled="
              ((editType === 'edit' || editType === 'view') &&
                editStatus !== 'upcoming') ||
                editType === 'view'
            "
          />
        </a-form-model-item>
        <a-form-model-item label="发放数量" prop="usageQuantity">
          <a-input
            v-model="form.usageQuantity"
            v-enterIntNumber
            placeholder="请输入发放数量"
            :disabled="editType === 'view'"
          />
        </a-form-model-item>
      </div>
      <!-- {{ form }} -->
      <div class="me-card">
        <h2>
          优惠券显示&可套用的商品
        </h2>
        <a-form-model-item label="优惠券显示设置">
          <a-radio-group
            name="radioGroup"
            v-model="form.displayChanne"
            :disabled="
              ((editType === 'edit' || editType === 'view') &&
                editStatus !== 'upcoming') ||
                editType === 'view'
            "
          >
            <a-radio :value="1" class="radioStyle">在所有页面显示</a-radio>
            <a-radio :value="2" class="radioStyle" v-if="form.voucherType === 1"
              >特定渠道</a-radio
            >
            <div class="me-ml-3" v-if="form.voucherType === 1">
              <a-checkbox-group
                v-model="plainOptions"
                name="checkboxgroup"
                :options="options"
                @change="onChange"
                :disabled="
                  ((editType === 'edit' || editType === 'view') &&
                    editStatus !== 'upcoming') ||
                    editType === 'view'
                "
              />
            </div>

            <a-radio :value="3" class="radioStyle">通过优惠码分享</a-radio>
          </a-radio-group>
        </a-form-model-item>
        <div v-if="form.voucherType === 2">
          <h2>
            添加优惠商品
          </h2>
          <a-button
            icon="plus"
            class="addbutton me-mt-2 me-ml-2 me-mb-2"
            @click="addProduct"
            :disabled="editStatus === 'expired'"
          >
            添加商品
          </a-button>
          <div
            class="me-status-error me-mt-2 me-ml-2"
            v-if="dataSource.length === 0"
          >
            请添加商品
          </div>

          <DiscountTable
            :loading="tableLoading"
            :data-source="dataSource"
            tableType="couponaddpro"
            v-if="dataSource.length"
            :pagination="getPagination"
            @change="changePage"
            rowKey="itemId"
          >
            <template slot="actions" slot-scope="source">
              <a-icon
                type="delete"
                :disabled="editStatus === 'expired'"
                @click="handleDeleteGoods(source.source.index)"
              />
            </template>
          </DiscountTable>
        </div>
      </div>
    </a-form-model>

    <div class="me-card">
      <a-space>
        <a-button
          class="me-ml-2 btnwid90"
          size="large"
          @click="$router.go(-1)"
          v-if="editType !== 'view'"
        >
          取消
        </a-button>
        <a-button
          type="primary"
          class="me-ml-2 btnwid90"
          size="large"
          @click="submit"
          :loading="submitIng"
          v-if="editType === 'edit' || editType === undefined"
        >
          确认
        </a-button>
        <a-button
          type="primary"
          class="me-ml-2 btnwid90"
          size="large"
          @click="$router.go(-1)"
          v-if="editType === 'view'"
        >
          确认
        </a-button>
      </a-space>
    </div>

    <a-modal
      title="选择商品"
      :visible="editVisible"
      :confirm-loading="sdConfirmLoading"
      @ok="syncOk"
      @cancel="editVisible = false"
      width="800px"
      destroyOnClose
      :maskClosable="false"
    >
      <ProductList
        ref="productlist"
        :storeId="form.storeId"
        tableType="couponaddpro"
        @getCheckPro="getCheckPro"
        :checkedProduct="dataSource"
      />
    </a-modal>
  </div>
</template>

<script>
import Store from '@/api/store'
import Discount from '@/api/discount'
import { disabledDate, disabledRangeTime } from '@/util/timeOperation'
import ProductList from './components/ProductList'
import tableMixins from '@/mixins/tableMixins'
import DiscountTable from './components/DiscountTable'
import Goods from '@/api/goods'
import { NUMBERADNLETTER } from '@/util/regex'
const options = [
  { label: 'Shopee直播', value: 4 },
  { label: 'Shopee动态', value: 3 }
]
export default {
  mixins: [tableMixins],
  components: {
    ProductList,
    DiscountTable
  },
  data() {
    /**优惠码校验 */
    const codeValidator = (rule, value, callback) => {
      if (NUMBERADNLETTER.test(value)) {
        callback()
        return
      }
      callback(new Error('只能输入数字和字母'))
    }
    return {
      codeValidator,
      disabledDate,
      disabledRangeTime,
      rules: {
        storeId: [
          {
            required: true,
            message: '请选择店铺',
            trigger: 'blur'
          }
        ],
        voucherName: [
          {
            required: true,
            message: '请输入优惠券名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 20,
            message: '不超过20个字符',
            trigger: 'blur'
          }
        ],
        voucherCode: [
          {
            required: true,
            message: '请输入优惠码',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 5,
            message: '不超过5个字符',
            trigger: 'blur'
          },
          { validator: codeValidator }
        ],
        setTime: [
          {
            required: true,
            message: '请输入领取期限',
            trigger: 'blur'
          }
        ],
        usageQuantity: [
          {
            required: true,
            message: '请输入发放数量',
            trigger: 'blur'
          },
          { validator: this.checkUsageQuantity }
        ],
        maxPrice: [
          {
            required: true,
            message: '请输入最大限额',
            trigger: 'blur'
          }
        ],
        minBasketPrice: [
          {
            required: true,
            message: '请输入最低消费金额',
            trigger: 'blur'
          }
        ],
        percentage: [
          {
            required: true,
            message: '请输入百分百',
            trigger: 'blur'
          }
        ],
        discountAmount: [
          {
            required: true,
            message: '请输入折扣金额',
            trigger: 'blur'
          }
        ]
      },
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      djj: true,
      submitIng: false,
      form: {
        voucherType: 1,
        voucherName: '',
        voucherCode: '',
        setTime: null,
        type: 1, // 接口传参的时候传rewardType，折扣金额1，百分百折扣2，shopee币回扣3
        searchType: 'zk',
        storeId: null,
        discountAmount: null,
        percentage: null,
        maxPrice: null,
        minBasketPrice: null,
        usageQuantity: null,
        displayChanne: 1,
        displayChannelList: [],
        prefix: '', // 优惠码前缀
        itemIdList: [] // 添加的产品的itemId集合
      },

      options, // 优惠券显示设置,可选项
      plainOptions: [],
      storeList: [], //店铺列表
      currency: '', // 选择店铺时，获取对应的币种
      editVisible: false, // 添加商品相关控制
      sdConfirmLoading: false,
      columns: [
        {
          dataIndex: 'product_info',
          key: 'product_info',
          scopedSlots: { customRender: 'product_info' },
          title: '商品名称',
          width: 350
        },
        {
          title: this.$t('common.handler'),
          key: 'actionSlot',
          dataIndex: 'actionSlot',
          scopedSlots: { customRender: 'actionSlot' }
        }
      ]
    }
  },
  computed: {
    // 通过url传递的编辑类型，id, 当前活动状态
    editType() {
      return this.$route.query.edit
    },
    discountId() {
      return this.$route.query.id
    },
    editStatus() {
      return this.$route.query.status
    }
  },
  watch: {
    'form.storeId': {
      handler(val) {
        this.getCurrency(val)
      },
      deep: true
    }
  },
  created() {
    this.getStoreAllStore()
  },
  async mounted() {
    // 编辑时获取活动详情
    if (this.discountId) {
      await this.getDiscountDetail()
    }
  },
  methods: {
    //获取所有可用店铺
    getStoreAllStore() {
      Store.getAllStore({ platform: 1 }).then(({ data }) => {
        this.storeList = data
      })
    },
    async submit() {
      let proLength = this.$data.dataSource.length
      if (!proLength && this.form.voucherType === 2) {
        this.$message.error('请添加优惠商品')
        return false
      }
      if (
        this.form.displayChanne === 2 &&
        this.form.voucherType === 1 &&
        !this.plainOptions.length
      ) {
        this.$message.error('请选择优惠券渠道')
        return false
      }
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const { type, setTime, searchType, voucherType } = this.$data.form
          let params = this.$data.form
          if (type === 1 && searchType === 'zk') {
            params.rewardType = 1
          } else if (type === 1 && searchType === 'bfb') {
            params.rewardType = 2
          } else if (type === 2) {
            params.rewardType = 3
          }
          if (setTime && setTime.length) {
            params.startTime = setTime[0]
            params.endTime = setTime[1]
          }
          params.usageQuantity = Number(params.usageQuantity)
          params.maxPrice = Number(params.maxPrice)
          params.minBasketPrice = Number(params.minBasketPrice)
          params.shopId = Number(this.getPlatformId())
          params.discountAmount = Number(params.discountAmount)

          // 添加优惠产品
          params.itemIdList = []
          if (voucherType === 2) {
            this.dataSource.map((ele) => {
              params.itemIdList.push(ele.itemId)
            })
          }
          // 优惠券显示设置 选特定渠道的时候，才传渠道id
          if (this.form.displayChanne === 2) {
            params.displayChannelList = this.plainOptions
          } else if (this.form.displayChanne === 1) {
            params.displayChannelList = [1]
          } else {
            params.displayChannelList = []
          }
          this.submitIng = true
          let { code } = await Discount.editCoupon(params).catch(() => {
            this.submitIng = false
          })
          this.submitIng = false
          console.log(code)
          if (code === 0) {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.openPage(`/discount/coupon`)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    checkUsageQuantity(rule, value, callback) {
      if (value < 1 || value > 200000) {
        callback('1 ~ 200000之间')
      }
      callback()
    },

    getPlatformId() {
      let shopId = null
      this.$data.storeList.map((ele) => {
        if (ele.storeId === this.form.storeId) {
          shopId = ele.platformId
        }
      })
      return shopId
    },
    // 根据url id，获取活动信息
    async getDiscountDetail() {
      Discount.getCouponDetail({ id: this.discountId }).then(async (res) => {
        this.$data.form = res.data
        this.$set(this.$data.form, 'setTime', [
          res.data.startTime,
          res.data.endTime
        ])
        // this.$data.form.setTime = [res.data.startTime, res.data.endTime]
        if (res.data.rewardType === 1) {
          this.$data.form.type = 1
          this.$data.form.searchType = 'zk'
          this.$set(this.$data.form, 'searchType', 'zk')
        } else if (res.data.rewardType === 2) {
          this.$data.form.type = 1
          this.$data.form.searchType = 'bfb'
          this.$set(this.$data.form, 'searchType', 'bfb')
        } else if (res.data.rewardType === 3) {
          this.$data.form.type = 2
          this.$data.form.searchType = 'bfb'
        }
        // // 优惠券显示设置

        let displayChannelList = res.data.displayChannelList
        // displayChannelList===[]  通过优惠码分享
        // displayChannelList===[1]  在所有页面显示
        // else 特定渠道，
        if (displayChannelList.length) {
          // this.form.displayChanne = 1
          if (displayChannelList[0] === 1) {
            this.$set(this.form, 'displayChanne', 1)
          } else {
            this.$set(this.form, 'displayChanne', 2)
            this.plainOptions = res.data.displayChannelList
          }
        }
        console.log(displayChannelList.length)
        if (!displayChannelList.length) {
          this.plainOptions = []
          this.$set(this.form, 'displayChanne', 3)
        }
        this.$data.dataSource = []
        const { size, current } = this.$data.paginationData
        // 优惠设置是商品优惠券时，回显选择的商品
        const { data } = await Goods.getProductList({
          size,
          current,
          itemIds: res.data.itemIdList
        })
        console.log(data)
        this.$data.dataSource = data.records
      })
    },
    // 根据storeId，获取对应币种显示
    getCurrency(val) {
      this.storeList.map((ele) => {
        if (ele.storeId === this.form.storeId) {
          this.currency = ele.currency
        }
      })
    },
    // 选shopee币回扣的时候只能填 百分比折扣
    onChangeType(e) {
      console.log('radio checked', e.target.value)
      if (e.target.value === 2) {
        this.$data.form.searchType = 'bfb'
      }
    },

    onChange(e) {
      console.log(e)
    },
    voucherTypeChange(e) {
      if (e.target.value === 2) {
        this.plainOptions = []
        this.form.displayChanne = 1
      }
    },
    async loadData(flag) {},
    getTableData() {
      var data = { records: [] }
      return data
    },
    // 添加商品
    addProduct() {
      const { storeId } = this.$data.form
      if (storeId == null) {
        this.$message.error('请先选择店铺！')
        return
      }
      this.$data.editVisible = true
    },
    getCheckPro(data) {
      console.log(data)
      if (data.length != 0) {
        this.$data.editVisible = false
      }
      this.$data.dataSource = this.$data.dataSource.concat(data)
    },
    syncOk() {
      this.$refs.productlist.getCheckPro()
    },
    handleDeleteGoods(index) {
      let that = this
      this.$confirm({
        title: this.$t('common.warn'),
        content: '确定删除当前产品吗？',
        onOk: async () => {
          that.$data.dataSource.splice(index, 1)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './components/table.scss';
.me-card {
  h2 {
    font-size: 16px;
    margin: 10px 0px 0px 10px;
  }
}
.btnwid90 {
  width: 90px;
}
.radioStyle {
  display: block;
  height: 30px;
  line-height: 30px;
}
</style>
<style lang="scss">
.xxx {
  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 50px !important;
  }
}
</style>
