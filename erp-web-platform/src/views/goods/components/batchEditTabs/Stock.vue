<template>
  <BaseTable
    ref="baseTable"
    :columns="getColumns"
    :dataSource="dataSource"
    :pagination="getPagination"
    :loading="tableLoading"
    :rowSelection="rowSelection"
    :onCancel="onCancel"
    :onSave="onSave"
    :onPreview="onPreview"
    :onChange="onChange"
    :saveBtnText="$t('batchEditOption.save')"
    :saveMsg="$t('common.batchEditSuccess')"
    :btnStyle="btnStyle"
    @initData="initData"
  >
    <template v-slot:before="{ record, index }">
      <template v-if="record.hasVariation">
        <ul class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
          <li class="me-desc" v-for="item in record.variants" :key="item.id">
            <span class="variationsku" :title="item.variationSku">
              <!-- {{ $t('toBeEdit.bianti') }}: -->
              {{ item.variationSku | stringSlice(25) }}</span
            >
            {{ $t('toBeEdit.kucun') }}:{{ item.stock }}
          </li>
        </ul>
        <a-button type="link" @click="viewAll(index)">
          {{
            record._viewflag_ ? $t('toBeEdit.shouqi') : $t('toBeEdit.viewall')
          }}
        </a-button>
      </template>
      <template v-else>
        <p class="me-desc">{{ record.stock }}</p>
      </template>
    </template>
    <template v-slot:after="{ record, index }">
      <!-- <p class="me-desc">{{ record._itemSku_ }}</p> -->
      <template v-if="record.hasVariation">
        <ul class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
          <li class="me-desc" v-for="item in record._variants_" :key="item.id">
            <span class="variationsku" :title="item.variationSku">
              <!-- {{ $t('toBeEdit.bianti') }}: -->
              {{ item.variationSku | stringSlice(16) }}</span
            >
            {{ $t('toBeEdit.kucun') }}:<a-input
              :rows="3"
              v-model="item.stock"
              style="width: 80px; height: 20px"
            />
          </li>
        </ul>
        <a-button
          type="link"
          @click="viewAll(index)"
          v-if="record._variants_ && record._variants_.length"
        >
          {{
            record._viewflag_ ? $t('toBeEdit.shouqi') : $t('toBeEdit.viewall')
          }}
        </a-button>
      </template>
      <template v-else>
        <p class="me-desc">
          <!-- {{ record.stock }} -->
          <a-input
            v-if="record._stock_ != undefined"
            :rows="3"
            v-model="record._stock_"
          />
        </p>
      </template>
    </template>

    <template>
      <!-- {{tableLoading}} -->
      <a-form-model :form="form" :rules="rules">
        <a-row>
          <a-col :span="24">
            <a-radio-group v-model="value">
              <a-radio class="radioStyle" :value="1">
                <span class="tit">{{ $t('toBeEdit.tongyikucun') }}</span
                ><a-input-number
                  class="input"
                  v-model="form.common"
                  :step="1"
                  :min="0"
                  :precision="0"
                  type="Number"
                />
              </a-radio>
              <a-radio class="radioStyle" :value="2">
                <span class="tit">{{ $t('toBeEdit.addkucun') }}</span
                ><a-input-number
                  class="input"
                  v-model="form.jia"
                  :step="1"
                  :min="0"
                  :precision="0"
                  type="Number"
                />
              </a-radio>
              <a-radio class="radioStyle" :value="3">
                <span class="tit">{{ $t('toBeEdit.jianshaokucun') }}</span
                ><a-input-number
                  class="input"
                  v-model="form.jian"
                  :step="1"
                  :min="0"
                  :precision="0"
                  type="Number"
                />
                <span class="tit">{{ $t('toBeEdit.budiyu') }}</span
                ><a-input-number
                  class="input"
                  v-model="form.budi"
                  :step="1"
                  :min="0"
                  :precision="0"
                  type="Number"
                />
              </a-radio>
            </a-radio-group>
          </a-col>
        </a-row>
      </a-form-model>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import Goods from '@/api/goods'
import { cloneDeep } from 'lodash'
export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    return {
      btnStyle: {
        top: 10,
        left: 145
      },
      value: 1,
      form: {
        common: 0,
        jia: 0,
        jian: 0,
        budi: 0
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Please input Activity name',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 5,
            message: 'Length should be 3 to 5',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    checkNum(val) {
      const reg = new RegExp('.', 'g')
      this.$data.form[val].toString().replace(reg, '')
    },
    getTableDataAfter() {
      this.$data.dataSource.forEach((item) => {
        this.$set(item, '_viewflag_', false)
      })
    },
    viewAll(index) {
      this.$data.dataSource[index]._viewflag_ = !this.$data.dataSource[index]
        ._viewflag_
    },
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**设置默认值 */
    setDefaultValu() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_variants_', element.variants)
          this.$set(element, '_stock_', element.stock)
        }
      })
    },
    /**保存 */
    async onSave() {
      this.setDefaultValu()
      const { dataSource, selectedRowKeys } = this.$data
      let data = cloneDeep(dataSource).filter(({ id }) => {
        return selectedRowKeys.includes(id)
      })
      // eslint-disable-next-line no-constant-condition
      if (true) {
        data = data.map((ele) => {
          ele.variants = ele._variants_
          ele.stock = ele._stock_
          return ele
        })
        await Goods.handleEditBatch(data)
      }
    },
    /**预览 */
    onPreview() {
      this.setDefaultValu()
      var that = this
      const { form, dataSource } = this.$data
      const { common, jia, jian, budi } = form
      that.$data.dataSource = dataSource.map((ele) => {
        // 有variants
        this.$set(ele, '_variants_', cloneDeep(ele.variants))
        // 无variants
        this.$set(ele, '_stock_', cloneDeep(ele.stock))
        if (this.$data.value == 1) {
          ele._variants_.forEach((item) => {
            this.$set(item, 'stock', common)
          })
          // ele._stock_ = common
          this.$set(ele, '_stock_', common)
        }
        if (this.$data.value == 2) {
          ele._variants_.forEach((item) => {
            this.$set(item, 'stock', item.stock + Number(jia))
          })
          this.$set(ele, '_stock_', ele.stock + Number(jia))
        }
        if (this.$data.value == 3) {
          // 减去
          if (budi) {
            ele._variants_.forEach((item) => {
              this.$set(item, 'stock', item.stock - Number(jian))
              if (item.stock < budi) this.$set(item, 'stock', Number(budi))
            })
            // 单个库存减去相应库存，小于‘不低于’重置为不低于
            this.$set(ele, '_stock_', ele.stock - Number(jian))
            if (ele._stock_ < budi) this.$set(ele, '_stock_', budi)
          } else {
            ele._variants_.forEach((item) => {
              this.$set(item, 'stock', item.stock - Number(jian))
              if (item.stock < 0) this.$set(item, 'stock', 0)
            })
            // 单个库存数减去相应库存，小于0重置为0
            this.$set(ele, '_stock_', ele.stock - Number(jian))
            if (ele._stock_ < 0) this.$set(ele, '_stock_', 0)
          }
        }
        return ele
      })
    },
    /**翻译 */
    onTranslate({ lang }) {},
    onDescChange(source) {},
    initData() {
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-desc {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  min-width: 250px;
  max-width: 400px;
  line-height: 32px;
  margin-bottom: 3px;
}
.replace-input {
  width: 390px;
  margin-right: 10px;
}
.variationsku {
  // width: 100px;
  display: inline-block;
}
.radioStyle {
  display: block;
  height: 40px;
  line-height: 40px;
  .tit {
    width: 120px;
    display: inline-block;
  }
  .input {
    width: 200px;
    margin-right: 10px;
  }
}
.me-spec-all {
  height: 70px;
  overflow: hidden;
}
.me-show {
  height: auto;
}
</style>
