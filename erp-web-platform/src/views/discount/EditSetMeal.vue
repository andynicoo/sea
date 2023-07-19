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
        <a-form-model-item label="优惠名称" prop="name">
          <a-input
            v-model="form.name"
            :disabled="editType === 'view' && editStatus !== 'upcoming'"
            :suffix="form.name.length + '/ 20'"
          />
        </a-form-model-item>
        <div class="porptips">
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
          <div class="tips">
            结束时间必须大于开始时间；兑换期限必须在2-90天
          </div>
        </div>
      </div>

      <div class="me-card">
        <h2>
          优惠设置
        </h2>
        <a-form-model-item label="套装类型" prop="minAmount">
          <a-radio-group
            name="radioGroup"
            v-model="form.ruleType"
            :disabled="
              (editType === 'edit' && editStatus !== 'upcoming') ||
                editType === 'view'
            "
          >
            <a-radio :value="2" class="radioStyle">折扣比率</a-radio>
            <div class="me-ml-3" v-if="form.ruleType === 2">
              购买
              <a-input
                class="wt100"
                v-model="form.minAmount"
                :disabled="
                  (editType === 'edit' && editStatus !== 'upcoming') ||
                    editType === 'view'
                "
                suffix="个"
                v-enterIntNumber
              />
              商品享受<a-input
                class="wt100"
                v-model="form.discountPercentage"
                :disabled="
                  (editType === 'edit' && editStatus !== 'upcoming') ||
                    editType === 'view'
                "
                suffix="%折扣"
                v-enterIntNumber
              />
            </div>
            <a-radio :value="3" class="radioStyle">折扣金额</a-radio>
            <div class="me-ml-3" v-if="form.ruleType === 3">
              购买
              <a-input
                class="wt100"
                v-model="form.minAmount"
                v-enterIntNumber
                :disabled="
                  (editType === 'edit' && editStatus !== 'upcoming') ||
                    editType === 'view'
                "
                suffix="个"
              />
              商品减<a-input
                class="wt100"
                v-model="form.discountValue"
                :disabled="
                  (editType === 'edit' && editStatus !== 'upcoming') ||
                    editType === 'view'
                "
                :prefix="currency"
                v-enterIntNumber
              />
            </div>
            <a-radio :value="1" class="radioStyle">套装特价</a-radio>
            <div class="me-ml-3" v-if="form.ruleType === 1">
              购买
              <a-input
                class="wt100"
                v-model="form.minAmount"
                :disabled="
                  (editType === 'edit' && editStatus !== 'upcoming') ||
                    editType === 'view'
                "
                suffix="个"
                v-enterIntNumber
              />
              商品共<a-input
                class="wt100"
                v-model="form.fixPrice"
                :disabled="
                  (editType === 'edit' && editStatus !== 'upcoming') ||
                    editType === 'view'
                "
                :prefix="currency"
                v-enterIntNumber
              />
            </div>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item label="购买限制" prop="purchaseLimit">
          <a-input-number
            v-model="form.purchaseLimit"
            :min="1"
            :max="10000"
            :disabled="editStatus === 'expired'"
          />
        </a-form-model-item>
      </div>

      <div class="me-card">
        <div>
          <h2>
            套装优惠商品
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
            请添加商品到套装优惠
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

export default {
  mixins: [tableMixins],
  components: {
    ProductList,
    DiscountTable
  },
  data() {
    return {
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
        name: [
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
        minAmount: [
          {
            required: true,
            message: '请输入数量',
            trigger: 'blur'
          },
          { validator: this.checkGroupNum }
        ],
        setTime: [
          {
            required: true,
            message: '请输入领取期限',
            trigger: 'blur'
          }
        ]
      },
      labelCol: { span: 2 },
      wrapperCol: { span: 6 },
      djj: true,
      submitIng: false,
      form: {
        name: '',
        setTime: null,
        storeId: null,
        minAmount: null, // 购买几个
        fixPrice: null, // 固定价格
        discountValue: null, // 折扣金额
        discountPercentage: null, // 折扣百分百
        purchaseLimit: 1,
        ruleType: 1,
        itemIdList: [] // 添加的产品的itemId集合
      },
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
    // 套餐类型校验
    checkGroupNum(rule, value, callback) {
      let {
        discountPercentage,
        discountValue,
        fixPrice,
        ruleType
      } = this.$data.form
      if (!discountPercentage && ruleType === 2) {
        callback('请输入折扣比率')
      }
      if (!discountValue && ruleType === 3) {
        callback('请输入折扣金额')
      }
      if (!fixPrice && ruleType === 1) {
        callback('请输入套餐特价')
      }
      callback()
    },
    //获取所有可用店铺
    getStoreAllStore() {
      Store.getAllStore({ platform: 1 }).then(({ data }) => {
        this.storeList = data
      })
    },
    async submit() {
      let proLength = this.$data.dataSource.length
      if (!proLength) {
        this.$message.error('请添加优惠商品')
        return false
      }
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const { setTime } = this.$data.form
          let params = this.$data.form

          if (setTime && setTime.length) {
            params.startTime = setTime[0]
            params.endTime = setTime[1]
          }
          params.shopId = Number(this.getPlatformId())

          // 添加优惠产品
          let bundleDealItemVOS = []
          this.dataSource.map((ele) => {
            bundleDealItemVOS.push({ itemId: ele.itemId })
          })
          params.bundleDealItemVOS = bundleDealItemVOS

          this.submitIng = true
          let { code } = await Discount.editSetmeal(params).catch(() => {
            this.submitIng = false
          })
          this.submitIng = false
          console.log(code)
          if (code === 0) {
            this.$message.success(this.$t('common.handlerSuccess'))
            this.openPage(`/discount/set-meal`)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    checkUsageQuantity(rule, value, callback) {
      if (value < 1 || value > 10000) {
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
      Discount.getSetmealDetail({ id: this.discountId }).then(async (res) => {
        this.$data.form = res.data
        this.$set(this.$data.form, 'setTime', [
          res.data.startTime,
          res.data.endTime
        ])
        // this.$data.form.setTime = [res.data.startTime, res.data.endTime]

        this.$data.dataSource = []
        let itemIds = []
        res.data.bundleDealItemDTOS.map((ele) => {
          itemIds.push(ele.itemId)
        })
        const { size, current } = this.$data.paginationData
        // 优惠设置是商品优惠券时，回显选择的商品
        const { data } = await Goods.getProductList({
          size,
          current,
          itemIds: itemIds
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
.wt100 {
  width: 100px;
}
.porptips {
  position: relative;
  .tips {
    position: absolute;
    left: 583px;
    top: 10px;
  }
}
</style>
<style lang="scss">
.xxx {
  .ant-input-affix-wrapper .ant-input:not(:first-child) {
    padding-left: 50px !important;
  }
}
</style>
