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
    :saveBtnText="$t('edit.update')"
    :saveMsg="$t('edit.updateSuccess')"
  >
    <template v-slot:before="{ record }">
      <p class="me-desc">{{ record.weight }}KG</p>
    </template>
    <template v-slot:after="{ record }">
      <p class="me-desc">
        <!-- {{ typeof record._itemSku_ }} -->
        <a-input-number
          v-if="record._weight_ != undefined"
          :precision="2"
          type="Number"
          v-model="record._weight_"
          class="_input_"
        /><span v-if="record._weight_ != undefined">KG</span>
      </p>
    </template>

    <template>
      <a-form-model>
        <table class="form-table">
          <tr>
            <td>
              <a-radio
                @change="editType = 1"
                :checked="editType === 1"
                :value="1"
              >
                {{ $t('toBeEdit.fangshi1a') }}
              </a-radio>
            </td>
            <td>{{ $t('toBeEdit.xinzhongliang') }}</td>
            <td colspan="4">
              <a-form-model-item class="me-ma-0">
                <a-input-number
                  v-model="form.xin"
                  :disabled="editType !== 1"
                  class="input"
                  :max="100000"
                  :step="1"
                  :precision="2"
                  type="Number"
                  :placeholder="$t('toBeEdit.xinzhongliang')"
                />KG
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td>
              <a-radio
                @change="editType = 2"
                :checked="editType === 2"
                :value="1"
              >
                {{ $t('toBeEdit.fangshi2a') }}
              </a-radio>
            </td>
            <td>{{ $t('toBeEdit.jiazhongliang') }}</td>
            <td colspan="4">
              <a-form-model-item class="me-ma-0">
                <a-input-number
                  v-model="form.jia"
                  :disabled="editType !== 2"
                  class="input"
                  :max="100000"
                  :min="0"
                  :step="1"
                  :precision="2"
                  type="Number"
                  :placeholder="$t('toBeEdit.jiazhongliang')"
                />KG
              </a-form-model-item>
            </td>
          </tr>
          <tr>
            <td>
              <a-radio
                @change="editType = 3"
                :checked="editType === 3"
                :value="1"
              >
                {{ $t('toBeEdit.fangshi3a') }}
              </a-radio>
            </td>
            <td>{{ $t('toBeEdit.jianzhongliang') }}</td>
            <td colspan="4">
              <a-form-model-item class="me-ma-0">
                <a-input-number
                  v-model="form.jian"
                  :disabled="editType !== 3"
                  class="input"
                  :max="100000"
                  :min="0"
                  :step="1"
                  :precision="2"
                  type="Number"
                  :placeholder="$t('toBeEdit.jianzhongliang')"
                />KG
              </a-form-model-item>
            </td>
          </tr>
        </table>
      </a-form-model>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { cloneDeep, add, subtract } from 'lodash'
// import { add } from '@/util'
import Goods from '@/api/goods'
export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    return {
      // value: 1,
      editType: 1,
      form: {
        xin: 0,
        jia: 0,
        jian: 0
      },
      whetherSave: true
    }
  },
  methods: {
    /**取消 */
    onCancel() {
      this.$emit('cancel')
    },
    /**设置默认值 */
    setDefaultValu() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (element._weight_ == undefined) {
          this.$set(element, '_weight_', element.weight)
        }
      })
    },
    onSave() {
      this.setDefaultValu()

      return new Promise((resolve, reject) => {
        const { dataSource, selectedRowKeys } = this.$data
        if (!selectedRowKeys.length) {
          reject('请选择要更新的商品')
          return
        }
        let data = cloneDeep(
          dataSource.filter(({ id }) => selectedRowKeys.includes(id))
        )
        data = data.map((element) => {
          // element.weight = element._weight_
          this.$set(element, 'weight', element._weight_)
          return element
        })

        const loading = this.$Loading()
        let step = 0
        const progress = () => parseInt((++step / data.length) * 100)
        const reqQueue = data
          // .filter(({ id }) => selectedRowKeys.includes(id))
          .map(async (element) => {
            let res = await Goods.goodsBatchUpdate(element)
            loading.progress(progress())
            return res
          })
        Promise.all(reqQueue).finally(async () => {
          await loading.clear()
          resolve()
        })
      })
    },

    /**预览 */
    onPreview() {
      const { form, dataSource, editType, selectedRowKeys } = this.$data
      const { xin, jia, jian } = form

      this.$data.dataSource = dataSource.map((ele) => {
        // ele._weight_ = ele.weight
        this.$set(ele, '_weight_', ele.weight)
        if (editType === 1) {
          ele._weight_ = xin
        }
        if (editType === 2) {
          // ele._weight_ = add(Number(ele._weight_), Number(jia))
          this.$set(ele, '_weight_', add(Number(ele._weight_), Number(jia)))
        }
        if (editType === 3) {
          // ele._weight_ = add(ele._weight_, -jian)
          this.$set(
            ele,
            '_weight_',
            subtract(Number(ele._weight_), Number(jian))
          )
          if (ele._weight_ < 0) this.$set(ele, '_weight_', 0)
          //ele._weight_ = 0
        }
        return ele
      })
    },
    whetherChange() {
      const { dataSource } = this.$data
      const changes = dataSource.map(({ weight, _weight_ }) => {
        if (_weight_ && weight != _weight_) {
          return true
        } else {
          return false
        }
      })
      return changes.some(Boolean)
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
  max-width: 350px;
}

.form-table {
  tr {
    td {
      text-align: right;
      padding: 0 5px;

      &:nth-child(1) {
        min-width: 70px;
      }
      &:nth-child(2) {
        min-width: 100px;
      }
      .input {
        width: 200px;
        margin-right: 5px;
      }
    }
  }
}
._input_ {
  width: 90px;
  margin-right: 5px;
}
</style>
