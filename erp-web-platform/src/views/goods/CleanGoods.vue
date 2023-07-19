<template>
  <div class="me-pa-2">
    <a-page-header
      class="me-page-header"
      :title="$t('goodsCollection.unsalableCommodities')"
    >
    </a-page-header>
    <a-layout class="me-page-layout">
      <ul class="me-steps">
        <li class="me-curr me-after">
          1.{{ $t('goodsCollection.OneKeyAnalysis') }}
        </li>
        <li class="me-before" :class="{ 'me-curr': steps != 1 }">
          2.{{ $t('goodsCollection.SelectCleaningProducts') }}
        </li>
      </ul>
      <div class="me-steps-one" v-if="steps == 1">
        <a-form
          :form="form"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 12 }"
        >
          <a-form-item :label="$t('goodsCollection.AnalysisShop')">
            <a-select
              allowClear
              mode="multiple"
              v-decorator="[
                'storeIds',
                {
                  rules: [
                    {
                      required: true,
                      message: $t('goodsCollection.autoPublishSet32')
                    }
                  ]
                }
              ]"
              style="width: 100%"
            >
              <a-select-option
                v-for="store in storeList"
                :key="store.storeId"
                :value="store.storeId"
              >
                {{ store.storeAlias ? store.storeAlias : store.storeName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <span slot="label">
              <a-tooltip
                title="为避免在清理时误删除有销量或流量的产品，可以将其锁定。"
              >
                <a-icon type="question-circle-o" />
              </a-tooltip>
              {{ $t('goodsCollection.LockingCondition') }}
            </span>
            <a-row>
              <a-col :span="12" :style="{ textAlign: 'left' }">
                <b> {{ $t('goodsCollection.productsSales') }} </b>
                {{ $t('goodsCollection.greaterThan') }}
                <a-input-number
                  v-decorator="['sales']"
                  :min="0"
                  :max="99999"
                  :precision="0"
                  class="me-w80"
                />
                {{ $t('goodsCollection.OurProducts') }}
              </a-col>
              <a-col :span="12" :style="{ textAlign: 'left' }">
                <b>{{ $t('goodsCollection.productsViews') }} </b>
                {{ $t('goodsCollection.greaterThan') }}
                <a-input-number
                  v-decorator="['views']"
                  :min="0"
                  :max="99999"
                  :precision="0"
                  class="me-w80"
                />
                {{ $t('goodsCollection.OurProducts') }}
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="12" :style="{ textAlign: 'left' }">
                <b> {{ $t('goodsCollection.Star') }} </b>
                {{ $t('goodsCollection.greaterThan') }}
                <a-input-number
                  v-decorator="['ratingStar']"
                  :min="0"
                  :max="99999"
                  :precision="0"
                  class="me-w80"
                />
                {{ $t('goodsCollection.OurProducts') }}
              </a-col>
              <a-col :span="12" :style="{ textAlign: 'left' }">
                <b>{{ $t('goodsCollection.productsCollections') }} </b>
                {{ $t('goodsCollection.greaterThan') }}
                <a-input-number
                  v-decorator="['likes']"
                  :min="0"
                  :max="99999"
                  :precision="0"
                  class="me-w80"
                />
                {{ $t('goodsCollection.OurProducts') }}
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
        <div class="me-text-center me-mb-4 me-mt-4">
          <a-button
            type="primary"
            class="me-mr-4"
            size="large"
            @click="startAnalysis"
            :loading="loading"
            >{{ $t('goodsCollection.StartAnalyzing') }}
          </a-button>
          <a-button size="large" @click="returnAnalysis" v-if="analysis"
            >{{ $t('goodsCollection.ReturnLastAnalysis') }}
          </a-button>
        </div>
        <p class="me-text-center" v-if="analysis">
          {{ $t('goodsCollection.LastAnalysisTime') }} :{{ analysis.time }}
        </p>
      </div>
      <div class="me-steps-two" v-else>
        <SelectCleanGoods
          @steps="reSteps"
          :storeList="selStoreList"
          :time="analysis.time"
        />
      </div>
    </a-layout>
  </div>
</template>
<script>
import Store from '@/api/store'
import Goods from '@/api/goods'
import SelectCleanGoods from './components/SelectCleanGoods'
import moment from 'moment'
export default {
  components: {
    SelectCleanGoods
  },
  data() {
    return {
      form: this.$form.createForm(this),
      storeList: [],
      selStoreList: [],
      steps: 1,
      loading: false,
      analysis: ''
    }
  },
  created() {
    /**
     * 店铺
     */
    Store.getAllStore().then(({ data }) => {
      this.$data.storeList = data
    })
    this.analysis = localStorage.analysis
      ? JSON.parse(localStorage.analysis)
      : ''
  },
  methods: {
    //重新分析
    reSteps(value) {
      this.$data.steps = value
    },
    //开始分析
    startAnalysis() {
      this.$data.selStoreList = []
      this.form.validateFields(async (err, values) => {
        if (!err) {
          this.$data.loading = true
          await Goods.analysisUnsalable({ ...values, calculationType: 2 })
          this.$data.loading = false
          values.storeIds.forEach((item) => {
            let store = this.$data.storeList.find(
              (item2) => item2.storeId == item
            )
            this.$data.selStoreList.push(store)
          })
          this.$data.steps = 2
          this.$data.analysis = {
            ...values,
            time: moment(new Date()).format('YY-MM-DD HH:mm:ss'),
            storeList: this.$data.selStoreList
          }
          localStorage.analysis = JSON.stringify(this.$data.analysis)
        }
      })
    },
    //返回上一次分析
    returnAnalysis() {
      this.$data.steps = 2
    }
  }
}
</script>

<style lang="scss" scoped>
.me-steps {
  width: 80%;
  margin: 0 auto 20px;
  display: flex;
  justify-content: center;
  padding-left: 0;
  li {
    height: 40px;
    background: #f2f2f2;
    border-radius: 0px 2px 2px 0px;
    line-height: 40px;
    color: #727272;
    width: 100%;
    text-align: center;
    position: relative;
    margin-right: 6px;
  }
  .me-after:after,
  .me-before:before {
    content: '';
    z-index: 2;
    position: absolute;
    top: 0;
    right: -20px;
    display: block;
    width: 0;
    height: 0;
    border: 20px solid transparent;
    border-width: 20px 10px;
    border-left-color: #ff720d;
  }
  .me-before::before {
    right: auto;
    left: 0;
    border-left-color: #fff;
    z-index: 1;
  }
  .me-curr {
    background: #ff720d;
    color: #fff;
  }
}
.me-w80 {
  width: 80px;
}
</style>
