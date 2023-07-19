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
      <span v-if="record.status == 'NORMAL'">{{ $t('deleteEdit.sj') }}</span>
      <span v-else-if="record.status == 'UNLIST'">{{
        $t('deleteEdit.xj')
      }}</span>
      <span v-else>{{ $t('deleteEdit.jm') }}</span>
    </template>
    <template v-slot:after="{ record }">
      <template v-if="record._delete_ !== undefined">
        <template v-if="record._delete_">
          <span style="color: red">{{ $t('deleteEdit.ysc') }}</span>
        </template>
        <template v-else>
          <span v-if="record.status == 'NORMAL'">{{
            $t('deleteEdit.sj')
          }}</span>
          <span v-else-if="record.status == 'UNLIST'">{{
            $t('deleteEdit.xj')
          }}</span>
          <span v-else>{{ $t('deleteEdit.jm') }}</span>
        </template>
      </template>
    </template>
    <!-- {{ $attrs.status }}--{{ params }} -->
    <template>
      <table>
        <tr v-if="$attrs.status == 1">
          <td>{{ $t('deleteEdit.filter1') }}：</td>
          <td>
            <a-checkbox v-model="params.delete1" class="me-mb-2 me-mt-2">
              {{ $t('deleteEdit.filter2') }}
            </a-checkbox>
          </td>
        </tr>
        <tr>
          <td>
            <span v-if="$attrs.status == 0"
              >{{ $t('deleteEdit.filter1') }}：</span
            >
          </td>
          <td>
            <a-checkbox v-model="params.delete2" class="me-mb-2 me-mt-2">
              {{ $t('deleteEdit.filter3') }}
            </a-checkbox>
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <p style="color: red" class="me-mb-2 me-mt-2">
              <a-icon type="exclamation-circle" class="me-mr-1" />
              {{ $t('deleteEdit.filter4') }}
            </p>
          </td>
        </tr>
      </table>
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
      params: {
        delete1: false,
        delete2: false
      }
    }
  },
  methods: {
    /**保存 */
    onSave() {
      return new Promise((resolve, reject) => {
        // const { dataSource } = this.$data
        const { selectedRowKeys } = this.$data
        if (!selectedRowKeys.length) {
          reject('请选择要更新的商品')
          return
        }
        let dataSource = cloneDeep(this.$data.dataSource).filter(({ id }) => {
          return selectedRowKeys.includes(id)
        })
        const isChange = dataSource
          .map(({ _change_ }) => _change_)
          .every(Boolean)
        if (!isChange) {
          return reject(this.$t('deleteEdit.valid1'))
        }

        this.$confirm({
          title: this.$t('common.warn'),
          content: this.$t('common.deleteConfirm'),
          okType: 'danger',
          onOk: async () => {
            const ids = dataSource
              .map(({ _delete_, id }) => _delete_ && id)
              .filter(Boolean)
            await Goods.deleteBatchUpdatePrice({ productId: ids })
            resolve()
          },
          onCancel: () => {
            resolve()
          }
        })
      })
    },
    /**预览 */
    onPreview() {
      const { delete1, delete2 } = this.$data.params
      this.$data.dataSource.forEach((element) => {
        this.$set(element, '_change_', true)
        this.$set(element, '_delete_', true)
        if (delete1 && element.status === 'NORMAL') {
          // 已上架
          this.$set(element, '_delete_', false)
        }

        if (delete2 && element.discountId) {
          // 已参加活动
          this.$set(element, '_delete_', false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
