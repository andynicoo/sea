<template>
  <div class="auto-up-form-custom-style">
    <a-form-model
      :model="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
    >
      <div class="me-info">
        <p>{{ $t('autoUp.settingMsg1') }}</p>
        <p>{{ $t('autoUp.settingMsg2') }}</p>
        <p>{{ $t('autoUp.settingMsg3') }}</p>
        <p>{{ $t('autoUp.settingMsg4') }}</p>
        <p>{{ $t('autoUp.settingMsg5') }}</p>
      </div>

      <!-- 自动置顶推广开关 -->
      <a-form-model-item :label="$t('autoUp.autoUpSwitch')">
        <a-switch
          v-model="form.status"
          :checked-children="$t('autoUp.autoUpSwitchChecked')"
          :un-checked-children="$t('autoUp.autoUpSwitchUnChecked')"
        />
      </a-form-model-item>

      <!-- 置顶产品范围 -->
      <a-form-model-item :label="$t('autoUp.productRange')">
        <a-radio-group v-model="form.bootsProductRange">
          <a-radio style="height: 37px; line-height: 37px" :value="1">
            {{ $t('autoUp.productRangeMsg1', { num: stores.length }) }}
            <span class="add-message">
              {{ $t('autoUp.addMsg1') }}
            </span>
          </a-radio>
          <br />
          <a-radio style="height: 37px; line-height: 37px" :value="2">
            {{ $t('autoUp.productRangeMsg2') }}
            <a-button
              size="small"
              ghost
              type="primary"
              @click="chooseCategoryVisible = true"
            >
              {{ $t('autoUp.productRangeBtn1') }}
            </a-button>
          </a-radio>
          <br />
          <a-radio style="height: 37px; line-height: 37px" :value="3">
            {{ $t('autoUp.productRangeMsg3') }}
            <a-button
              size="small"
              ghost
              type="primary"
              @click="chooseProductVisible = true"
            >
              {{ $t('autoUp.productRangeBtn2') }}
            </a-button>
          </a-radio>
        </a-radio-group>
      </a-form-model-item>

      <!-- 置顶时段 -->
      <a-form-model-item class="me-mb-0">
        <span slot="label">
          {{ $t('autoUp.upTimeRange') }}
          <a-tooltip>
            <template slot="title">
              {{ $t('autoUp.tmimeTip') }}
            </template>
            <a-icon type="exclamation-circle" />
          </a-tooltip>
        </span>
        <AutoUpTimeRange
          ref="autoUpTimeRange"
          v-model="form.bootsTimeInterval"
        />
      </a-form-model-item>

      <!-- 必须置顶产品 -->
      <a-form-model-item class="me-mb-0">
        <span slot="label">
          {{ $t('autoUp.mustUpProduct') }}
          <a-tooltip>
            <template slot="title">
              {{ $t('autoUp.productTip') }}
            </template>
            <a-icon type="exclamation-circle" />
          </a-tooltip>
        </span>
        <a-button
          size="small"
          ghost
          type="primary"
          @click="requisUpChooseProductVisible = true"
        >
          {{ $t('autoUp.productRangeBtn2') }}
        </a-button>
        <span class="add-message">
          {{
            $t('autoUp.addMsg2', { num: getMultipleNum(form.mustBootsProduct) })
          }}
        </span>
      </a-form-model-item>

      <!-- 不置顶产品 -->
      <a-form-model-item :label="$t('autoUp.noUpProduct')" class="me-mb-0">
        <a-button
          size="small"
          ghost
          type="primary"
          @click="unUpChooseProductVisible = true"
        >
          {{ $t('autoUp.productRangeBtn2') }}
        </a-button>
        <span class="add-message">
          {{
            $t('autoUp.addMsg2', {
              num: getMultipleNum(form.notMustBootsProduct)
            })
          }}
        </span>
      </a-form-model-item>
    </a-form-model>

    <!-- 置顶产品范围 => 置顶类目产品 => 选择类目 -->
    <a-modal
      :maskClosable="false"
      width="70%"
      :mask="false"
      destroyOnClose
      v-model="chooseCategoryVisible"
      :title="$t('autoUp.productRangeBtn1')"
      @cancel="chooseCategoryVisible = false"
      :footer="null"
    >
      <AutoUpChooseCategory
        v-model="form.bootsProductContent2"
        @ok="chooseCategoryVisible = false"
      />
    </a-modal>

    <!-- 置顶产品范围 => 自定义产品 => 选择产品 -->
    <a-modal
      :maskClosable="false"
      destroyOnClose
      width="70%"
      :mask="false"
      v-model="chooseProductVisible"
      :title="$t('autoUp.productRangeBtn2')"
      :footer="null"
      @cancel="chooseProductVisible = false"
    >
      <AutoUpChooseProduct
        :type="4"
        listTitle="自定义产品"
        v-model="form.bootsProductContent3"
        @ok="chooseProductVisible = false"
        :multiple="0"
      />
    </a-modal>

    <!-- 必须置顶产品 => 选择产品 -->
    <a-modal
      :maskClosable="false"
      destroyOnClose
      width="70%"
      :mask="false"
      v-model="requisUpChooseProductVisible"
      :title="$t('autoUp.productRangeBtn3')"
      :footer="null"
      @cancel="requisUpChooseProductVisible = false"
    >
      <AutoUpChooseProduct
        :type="3"
        listTitle="必须置顶产品"
        :disableds="form.notMustBootsProduct"
        v-model="form.mustBootsProduct"
        @ok="requisUpChooseProductVisible = false"
      />
    </a-modal>

    <!-- 不置顶产品 => 选择产品 -->
    <a-modal
      :maskClosable="false"
      destroyOnClose
      width="70%"
      :mask="false"
      v-model="unUpChooseProductVisible"
      :title="$t('autoUp.productRangeBtn4')"
      :footer="null"
      @cancel="unUpChooseProductVisible = false"
    >
      <AutoUpChooseProduct
        :type="2"
        listTitle="不置顶产品"
        :disableds="form.mustBootsProduct"
        v-model="form.notMustBootsProduct"
        @ok="unUpChooseProductVisible = false"
        :multiple="0"
      />
    </a-modal>
  </div>
</template>

<script>
import AutoUpChooseCategory from '@/views/goods/components/autoUp/AutoUpChooseCategory'
import AutoUpChooseProduct from '@/views/goods/components/autoUp/AutoUpChooseProduct'
import AutoUpTimeRange from '@/views/goods/components/autoUp/AutoUpTimeRange'
import store from '@/api/store'
import goods from '@/api/goods'
import { cloneDeep, sum } from 'lodash'
import moment from 'moment'

export default {
  components: {
    AutoUpChooseCategory,
    AutoUpChooseProduct,
    AutoUpTimeRange
  },
  data() {
    return {
      form: {},
      chooseCategoryVisible: false /**置顶类目产品 => 选择类目弹窗 */,
      chooseProductVisible: false /**自定义产品 => 选择产品弹窗 */,
      requisUpChooseProductVisible: false /**必须置顶产品 => 选择产品弹窗 */,
      unUpChooseProductVisible: false /**不置顶产品 => 选择产品弹窗 */,
      stores: [] /**所有店铺 */
    }
  },
  async mounted() {
    const stores = await store.getAllStore()
    this.$data.stores = stores.data

    const storeIds = []
    this.$data.stores.map(({ storeId }) => {
      storeIds.push(storeId)
    })
    console.log(storeIds)

    /**初始化配置时段 */
    const sites = await store.getAllSite()
    const config = await goods.getGoodsBootsConfig()

    const initJson = {
      memberId: 0,
      status: false, // 状态 0 未开启 1 已开启
      bootsProductRange: 1, // 置顶产品范围 1、全部在售商品，2、指定类目产品，3、自定义产品
      bootsProductContent2: [],
      bootsProductContent2Json: '',
      bootsProductContent3: [],
      bootsProductContent3Json: '',
      bootsTimeInterval: [],
      bootsTimeIntervalJson: '',
      mustBootsProduct: [],
      mustBootsProductJson: '',
      notMustBootsProduct: [],
      notMustBootsProductJson: ''
    }

    if (!config.data) config.data = initJson

    if (!config.data.bootsProductContent2) config.data.bootsProductContent2 = []
    if (!config.data.bootsProductContent3) config.data.bootsProductContent3 = []
    if (!config.data.bootsTimeInterval) config.data.bootsTimeInterval = []
    if (!config.data.mustBootsProduct) config.data.mustBootsProduct = []
    if (!config.data.notMustBootsProduct) config.data.notMustBootsProduct = []

    /**初始化时间 */
    config.data.bootsTimeInterval = sites.data.map((site) => {
      const { countryCode, countryName } = site
      const current = config.data.bootsTimeInterval.find(({ site }) => {
        return site === countryCode
      })

      let bootsTimes
      if (current) {
        bootsTimes = current.bootsTimes
      } else {
        bootsTimes = []
      }
      bootsTimes = bootsTimes.map((time) => {
        let [s_time_hour, s_time_minute] = time.startTime.split(':')
        s_time_hour = parseInt(s_time_hour)
        s_time_minute = parseInt(s_time_minute)
        let startTime = moment()
        startTime.hours(s_time_hour)
        startTime.minutes(s_time_minute)
        startTime.seconds(0)

        let [e_time_hour, e_time_minute] = time.endTime.split(':')
        e_time_hour = parseInt(e_time_hour)
        e_time_minute = parseInt(e_time_minute)
        let endTime = moment()
        endTime.hours(e_time_hour)
        endTime.minutes(e_time_minute)
        endTime.seconds(59)

        return {
          startTime,
          endTime
        }
      })

      if (!bootsTimes.length) {
        const startTime = moment()
          .hours(0)
          .minutes(0)
          .seconds(0)
        const endTime = moment(startTime)
          .add(24, 'hours')
          .add(-1, 'seconds')
        bootsTimes.push({ startTime, endTime })
      }

      return {
        bootsTimes,
        site: countryCode,
        countryName
      }
    })

    this.$data.form = config.data

    // 清除form里必须置顶产品、不置顶产品残留的多余的店铺信息
    this.$data.form.mustBootsProduct = this.$data.form.mustBootsProduct.filter(
      (item) => storeIds.includes(item.storeId)
    )
    this.$data.form.notMustBootsProduct = this.$data.form.notMustBootsProduct.filter(
      (item) => storeIds.includes(item.storeId)
    )
  },
  methods: {
    async submit() {
      const form = cloneDeep(this.$data.form)
      const timeValid = await this.$refs['autoUpTimeRange'].validate()
      form.bootsTimeInterval = timeValid

      await goods.goodsBootsConfigSave(form)
      this.$message.success(this.$t('common.handlerSuccess'))
    },
    getMultipleNum(vo) {
      if (!vo) return 0
      return sum(vo.map(({ productNumber }) => productNumber && 1))
    }
  }
}
</script>

<style lang="scss" scoped>
.me-info {
  background: #fff8f4 !important;
  border-radius: 4px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #c5775c;
  line-height: 20px;
  padding: 14px 20px;
  margin-bottom: 20px;
}

.add-message {
  font-size: 12px;
  color: #aaaaaa;
}
</style>

<style lang="scss">
.auto-up-form-custom-style {
  .ant-btn-background-ghost {
    background-color: #fef5f0 !important;
    border-color: #fbd0c4 !important;
  }
}
</style>
