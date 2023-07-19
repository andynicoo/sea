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
    :recoveryCollectPrice="recoveryCollectPrice"
    :saveBtnText="$t('batchEditOption.save')"
    :saveMsg="$t('common.batchEditSuccess')"
    :btnStyle="btnStyle"
    @initData="initData"
  >
    <template v-slot:before="{ record, index }">
      <template v-if="record.hasVariation">
        <ul class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
          <li
            class="me-desc"
            v-for="item in record.variants"
            :key="item.variationSku"
          >
            <span class="variationsku" :title="item.variationSku">
              <!-- {{ $t('toBeEdit.bianti') }}: -->
              {{ item.variationSku | stringSlice(25) }}</span
            >
            {{ $t('toBeEdit.price') }}:{{ item.price }}
          </li>
        </ul>
        <a-button type="link" @click="viewAll(index)">
          {{
            record._viewflag_ ? $t('toBeEdit.shouqi') : $t('toBeEdit.viewall')
          }}
        </a-button>
      </template>
      <template v-else>
        <p class="me-desc">{{ record.price }}</p>
      </template>
    </template>

    <template v-slot:after="{ record, index }">
      <!-- <p class="me-desc">{{ record._itemSku_ }}</p> -->
      <template v-if="record.hasVariation">
        <ul class="me-spec-all" :class="{ 'me-show': record._viewflag_ }">
          <li
            class="me-desc"
            v-for="item in record._variants_"
            :key="item.variationSku"
          >
            <span class="variationsku" :title="item.variationSku">
              <!-- {{ $t('toBeEdit.bianti') }}: -->
              {{ item.variationSku | stringSlice(16) }}</span
            >{{ $t('toBeEdit.price') }}:
            <a-input
              :rows="3"
              v-model="item._price_"
              style="width: 80px; height: 20px"
            />
          </li>
        </ul>
        <a-button
          type="link"
          @click="viewAll(index)"
          v-if="record._variants_ && record._variants_.length > 0"
        >
          {{
            record._viewflag_ ? $t('toBeEdit.shouqi') : $t('toBeEdit.viewall')
          }}
        </a-button>
      </template>
      <template v-else>
        <p class="me-desc">
          <a-input
            v-if="record._price_ != undefined"
            :rows="3"
            v-model="record._price_"
          />
        </p>
      </template>
    </template>
    <SetPriceTemplate
      v-if="setPriceVisible"
      ref="setPriceTemplate"
      :key="updateData"
      :list="setPriceList"
    />
    <!-- <div class="price-template-item" v-if="setPriceVisible">
      <div></div>
      <div class="price-template-content"> -->
    <!-- <a-button
          @click="setPriceOk(false)"
          :loading="saveLoading"
          type="primary"
          class="me-mr-4"
        >
          {{ $t('batchEditOption.preview') }}
        </a-button> -->
    <!-- 恢复采集价 -->
    <!-- <a-button v-if="priceChangeFlag" @click="recoveryCollectPrice()">{{
          $t('toBeEdit.recovery')
        }}</a-button> -->
    <!-- </div>
    </div> -->
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'

import batchEditMixins from '@/mixins/batchEditMixins'
import SetPriceTemplate from './../setPriceTemplate/SetPriceTemplate'
import { isEmpty } from '@/util'
import Goods from '@/api/goods'
import { cloneDeep } from 'lodash'
export default {
  mixins: [batchEditMixins],
  components: { BaseTable, SetPriceTemplate },
  data() {
    return {
      btnStyle: {
        top: 10,
        left: 150
      },
      setPriceList: [],
      setPriceVisible: false,
      saveLoading: false,
      user: {
        age: 22
      },
      updateData: Math.random(),
      priceChangeFlag: false //价格是否有过变动，有变动才显示“恢复采集价”按钮
    }
  },
  mounted() {
    //
  },

  methods: {
    //初始化数据
    getTableDataAfter() {
      this.$data.setPriceList = this.$data.dataSource
      this.setPriceVisible = true
      this.$data.dataSource.forEach((item) => {
        this.$set(item, '_viewflag_', false)
      })
    },
    /**预览 */
    onPreview() {
      this.setPriceOk(false)
    },
    //保存修改
    async setPriceOk(saveBatch) {
      const setPriceTemplate = this.$refs.setPriceTemplate
      let error = await setPriceTemplate.verifyData()
      if (!isEmpty(error)) {
        // this.errorAlert(error)
        return error
      }

      this.$data.saveLoading = true

      // eslint-disable-next-line no-async-promise-executor
      let list = await setPriceTemplate.updateList()
      let dataError = await setPriceTemplate.verifyList(list)

      if (!isEmpty(dataError)) {
        this.$data.saveLoading = false
        if (!saveBatch) {
          this.errorAlert(dataError)
        }
        return dataError
      }
      this.$data.saveLoading = false
      this.changePriceValue(list)
      if (saveBatch == true) {
        await this.handleSave(list)
      }
    },

    async handleSave(list) {
      const { selectedRowKeys } = this.$data
      let data = cloneDeep(list).filter(({ id }) => {
        return selectedRowKeys.includes(id)
      })
      // eslint-disable-next-line no-constant-condition
      await Goods.handleEditBatch(data)
      await this.getTableData()
      // 更新定价模板组件
      this.updateData = Math.random()
    },

    viewAll(index) {
      this.$data.dataSource[index]._viewflag_ = !this.$data.dataSource[index]
        ._viewflag_
    },

    /**设置默认值 */
    setDefaultValue() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_variants_', element.variants)
          this.$set(element, '_price_', element.price)
          this.$set(element, '_price_', element.price)
          if (element.variants && element.variants.length > 0) {
            element.variants.map((spec) => {
              this.$set(spec, '_price_', spec._price_)
            })
          }
        }
      })
    },

    // 更改目标价格
    changePriceValue(list) {
      this.setDefaultValue()
      this.dataSource.map((ele) => {
        // 有variants
        this.$set(ele, '_variants_', cloneDeep(ele._variants_))
        // 无variants
        let targetGoods = list.find((el) => el.id == ele.id)
        this.$set(ele, '_price_', targetGoods ? targetGoods.price : ele._price_)
        ele._variants_.forEach((item) => {
          let targetSpec = targetGoods
            ? targetGoods.variants.find(
                (el) => el.variationSku == item.variationSku
              )
            : undefined
          if (targetSpec && targetGoods) {
            this.$set(item, '_price_', targetSpec.price)
          }
        })
      })

      this.priceChangeFlag = true
    },

    //保存
    async onSave() {
      return await this.setPriceOk(true)
    },

    // 恢复采集价
    recoveryCollectPrice() {
      const { dataSource } = this.$data
      this.$data.dataSource = dataSource.map((ele) => {
        this.$set(ele, '_price_', ele.price)
        ele._variants_.forEach((item) => {
          let targetPrice = item.price
          this.$set(item, '_price_', targetPrice)
        })
        return ele
      })
    },

    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
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

.price-template-item {
  display: flex;
  > div:first-child {
    min-width: 150px;
    min-height: 28px;
    line-height: 28px;
  }
}
.price-template-content {
  margin-top: 30px;
}
.me-spec-all {
  height: 70px;
  overflow: hidden;
}
.me-show {
  height: auto;
}
</style>
