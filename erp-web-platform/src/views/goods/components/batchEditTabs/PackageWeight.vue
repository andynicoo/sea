<template>
  <BaseTable
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
    <template v-slot:before="{ record }">
      <p class="me-desc">{{ record.weight }} KG</p>
    </template>
    <template v-slot:after="{ record }">
      <p class="me-desc" v-if="record._weight_ || record._weight_ == 0">
        <a-input-number
          :step="0.01"
          v-model="record._weight_"
          :min="0"
          :max="9999"
          @blur="rowWeightBlur(record)"
        />
        KG
      </p>
    </template>

    <template>
      <a-radio-group v-model="setType">
        <table class="me-edit-setting">
          <tr>
            <td>
              <a-radio value="a">
                {{ $t('toBeEdit.useNewWeight') }}
                :
              </a-radio>
            </td>
            <td>
              <a-input-number
                :step="0.01"
                v-model="newWeight"
                :min="0"
                :max="9999"
                @blur="weightBlur('newWeight')"
              />
              KG
            </td>
          </tr>
          <tr>
            <td>
              <a-radio value="b">{{ $t('toBeEdit.addWeight') }} :</a-radio>
            </td>
            <td>
              <a-input-number
                :step="0.01"
                v-model="addWeight"
                :min="0"
                :max="9999"
                @blur="weightBlur('addWeight')"
              />
              KG
            </td>
          </tr>
          <tr>
            <td>
              <a-radio value="c">{{ $t('toBeEdit.subWeight') }} :</a-radio>
            </td>
            <td>
              <a-input-number
                :step="0.01"
                v-model="subWeight"
                :min="0"
                :max="9999"
                @blur="weightBlur('subWeight')"
              />
              KG
            </td>
          </tr>
        </table>
      </a-radio-group>
    </template>
  </BaseTable>
</template>

<script>
import { add } from '@/util'
import Goods from '@/api/goods'
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { cloneDeep } from 'lodash'
export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  props: {
    rowKeys: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      btnStyle: {
        top: 5,
        left: 162
      },
      setType: 'a',
      newWeight: 0,
      addWeight: 0,
      subWeight: 0,
      lessThan0: false
    }
  },

  mounted() {},
  methods: {
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
          this.$set(element, '_weight_', element.weight)
        }
      })
    },
    /**保存 */
    async onSave() {
      this.setDefaultValu()
      const { dataSource, selectedRowKeys } = this.$data
      let data = cloneDeep(
        dataSource.filter(({ id }) => selectedRowKeys.includes(id))
      )
      this.$data.lessThan0 = false
      for (let i = 0; i < data.length; i++) {
        console.log(data[i]._weight_)
        if (data[i]._weight_ <= 0) {
          this.$data.lessThan0 = true
          break
        }
      }
      if (this.$data.lessThan0) {
        this.$message.error(this.$t('toBeEdit.cannotBe0'))
        return Promise.reject()
      }
      data = data.map((ele) => {
        ele.weight = ele._weight_
        return ele
      })
      await Goods.handleEditBatch(data)
    },
    /**预览 */
    onPreview() {
      this.setDefaultValu()
      const {
        setType,
        dataSource,
        newWeight,
        addWeight,
        subWeight
      } = this.$data
      this.$data.lessThan0 = false
      this.$data.dataSource = dataSource.map((ele) => {
        ele._weight_ = ele.weight
        if (setType == 'a') ele._weight_ = newWeight
        if (setType == 'b') ele._weight_ = add(ele._weight_, addWeight)
        if (setType == 'c') ele._weight_ = add(ele._weight_, -subWeight)
        return ele
      })
    },

    //设置里的输入框失去焦点
    weightBlur(val) {
      let attr = this.$data[val]

      if (!isNaN(attr) && attr) {
        let fixed = attr.toFixed(2)
        this.$data[val] = parseFloat(fixed)
      }
    },
    //表格里的输入框失去焦点
    rowWeightBlur(row) {
      if (!isNaN(row._weight_) && row._weight_) {
        let fixed = row._weight_.toFixed(2)
        row._weight_ = parseFloat(fixed)
      }
    },
    initData() {
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-edit-setting {
  td {
    padding: 5px 0 5px 15px;
  }
}
</style>
