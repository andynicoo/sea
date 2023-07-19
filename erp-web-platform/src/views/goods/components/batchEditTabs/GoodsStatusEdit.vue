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
      <p class="me-desc">
        {{
          record.itemCondition == 'NEW'
            ? $t('toBeEdit.gsNew')
            : $t('toBeEdit.gsUse')
        }}
      </p>
    </template>
    <template v-slot:after="{ record }">
      <p class="me-desc" v-if="record._itemCondition_">
        {{
          record._itemCondition_ == 'NEW'
            ? $t('toBeEdit.gsNew')
            : $t('toBeEdit.gsUse')
        }}
      </p>
    </template>

    <template>
      <table class="me-title-setting">
        <tr>
          <td>{{ $t('toBeEdit.unifiedTo') }} :</td>
          <td>
            <a-radio-group v-model="goodsStatus">
              <a-radio value="NEW">
                {{ $t('toBeEdit.gsNew') }}
              </a-radio>
              <a-radio value="USED">
                {{ $t('toBeEdit.gsUse') }}
              </a-radio>
            </a-radio-group>
          </td>
        </tr>
      </table>
    </template>
  </BaseTable>
</template>

<script>
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
        top: 10,
        left: 94
      },
      goodsStatus: 'NEW'
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
          this.$set(element, '_itemCondition_', element.itemCondition)
          this.$set(element, '_change_', true)
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
      data = data.map((ele) => {
        ele.itemCondition = ele._itemCondition_
        return ele
      })
      await Goods.handleEditBatch(data)
    },
    /**预览 */
    onPreview() {
      this.setDefaultValu()
      const { goodsStatus, dataSource } = this.$data
      this.$data.dataSource = dataSource.map((ele) => {
        ele._itemCondition_ = goodsStatus
        return ele
      })
    },
    initData() {
      this.getTableData()
    }
  }
}
</script>

<style lang="scss" scoped>
.me-title-setting {
  td {
    padding: 5px 0 5px 15px;
  }
  tr {
    & td:nth-child(odd) {
      text-align: right;
    }
  }
}
</style>
