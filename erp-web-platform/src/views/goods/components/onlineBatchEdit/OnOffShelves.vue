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
      <span v-if="record.status == 'NORMAL'">{{ $t('onOffShelves.sj') }}</span>
      <span v-else-if="record.status == 'UNLIST'">{{
        $t('onOffShelves.xj')
      }}</span>
      <span v-else>{{ $t('onOffShelves.jm') }}</span>
    </template>
    <template v-slot:after="{ record }">
      <template v-if="record._status_ !== undefined">
        <span v-if="record._status_ == 'NORMAL'">{{
          $t('onOffShelves.sj')
        }}</span>
        <span v-else-if="record._status_ == 'UNLIST'">{{
          $t('onOffShelves.xj')
        }}</span>
        <span v-else>{{ $t('onOffShelves.jm') }}</span>
      </template>
    </template>

    <template>
      <a-form-model
        class="custom-style-form"
        :model="editForm"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item class="me-ma-0">
          {{ $t('onOffShelves.pstatus') }}：
          <a-radio-group v-model="editForm.editType">
            <a-radio :value="1"> {{ $t('onOffShelves.sj') }} </a-radio>
            <a-radio :value="2"> {{ $t('onOffShelves.xj') }} </a-radio>
          </a-radio-group>
        </a-form-model-item>
        <a-form-model-item>
          <div class="me-fl">{{ $t('onOffShelves.pfilter') }}：</div>
          <div class="me-fl">
            <table>
              <tr>
                <td>
                  <a-checkbox v-model="editForm.xl">
                    {{ $t('onOffShelves.xl') }}
                  </a-checkbox>
                </td>
                <td>
                  <span class="me-mr-2">{{ beforeText }}</span>
                </td>
                <td>
                  <a-input-number
                    v-model="editForm.xlValue"
                    :min="0"
                    :disabled="!editForm.xl"
                  />
                </td>
                <td>
                  <span class="me-ma-2">{{ $t('onOffShelves.dsp') }}</span>
                </td>
                <td>
                  <span>{{ afterText }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <a-checkbox v-model="editForm.xj">
                    {{ $t('onOffShelves.xj2') }}
                  </a-checkbox>
                </td>
                <td>
                  <span class="me-mr-2">{{ beforeText }}</span>
                </td>
                <td>
                  <a-input-number
                    v-model="editForm.xjValue"
                    :min="0"
                    :disabled="!editForm.xj"
                  />
                </td>
                <td>
                  <span class="me-ma-2">{{ $t('onOffShelves.dsp') }}</span>
                </td>
                <td>
                  <span>{{ afterText }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <a-checkbox v-model="editForm.scl">
                    {{ $t('onOffShelves.scl') }}
                  </a-checkbox>
                </td>
                <td>
                  <span class="me-mr-2">{{ beforeText }}</span>
                </td>
                <td>
                  <a-input-number
                    v-model="editForm.sclValue"
                    :min="0"
                    :disabled="!editForm.scl"
                  />
                </td>
                <td>
                  <span class="me-ma-2">{{ $t('onOffShelves.dsp') }}</span>
                </td>
                <td>
                  <span>{{ afterText }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <a-checkbox v-model="editForm.lll">
                    {{ $t('onOffShelves.lll') }}
                  </a-checkbox>
                </td>
                <td>
                  <span class="me-mr-2">{{ beforeText }}</span>
                </td>
                <td>
                  <a-input-number
                    v-model="editForm.lllValue"
                    :min="0"
                    :disabled="!editForm.lll"
                  />
                </td>
                <td>
                  <span class="me-ma-2">{{ $t('onOffShelves.dsp') }}</span>
                </td>
                <td>
                  <span>{{ afterText }}</span>
                </td>
              </tr>
              <tr>
                <td>
                  <a-checkbox v-model="editForm.pjl">
                    {{ $t('onOffShelves.pjl') }}
                  </a-checkbox>
                </td>
                <td>
                  <span class="me-mr-2">{{ beforeText }}</span>
                </td>
                <td>
                  <a-input-number
                    v-model="editForm.pjlValue"
                    :min="0"
                    :disabled="!editForm.pjl"
                  />
                </td>
                <td>
                  <span class="me-ma-2">{{ $t('onOffShelves.dsp') }}</span>
                </td>
                <td>
                  <span>{{ afterText }}</span>
                </td>
              </tr>
            </table>
          </div>
        </a-form-model-item>
      </a-form-model>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import { cloneDeep } from 'lodash'
import Goods from '@/api/goods'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    return {
      editForm: {
        editType: 1
      },
      labelCol: { span: 1 },
      wrapperCol: { span: 14 },
      editTypeGrouop: {}
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    beforeText() {
      const { editType } = this.$data.editForm
      if (editType === 1) return this.$t('onOffShelves.xy')
      if (editType === 2) return this.$t('onOffShelves.dy')
    },
    // eslint-disable-next-line vue/return-in-computed-property
    afterText() {
      const { editType } = this.$data.editForm
      if (editType === 1) return this.$t('onOffShelves.bsj')
      if (editType === 2) return this.$t('onOffShelves.bxj')
    },
    changeResult() {
      return (source) => {
        const { editType } = this.$data.editForm
        if (source._status_ === true) {
          let str
          if (editType === 1) str = this.$t('onOffShelves.sj')
          if (editType === 2) str = this.$t('onOffShelves.xj')
          return str
        }
        return null
      }
    }
  },
  methods: {
    /**保存 */
    async onSave() {
      this.setDefaultValue()
      const { selectedRowKeys } = this.$data
      console.log(selectedRowKeys.length)
      if (!selectedRowKeys.length) {
        return '请选择要更新的商品'
      }
      let dataSource = cloneDeep(this.$data.dataSource).filter(({ id }) => {
        return selectedRowKeys.includes(id)
      })
      dataSource = dataSource.map((element) => {
        element.status = element._status_
        return element
      })

      const { editType } = this.$data.editForm

      const upIds = dataSource
        .map(({ status, id }) => {
          if (status === 'NORMAL') return id
        })
        .filter(Boolean)

      const downIds = dataSource
        .map(({ status, id }) => {
          if (status === 'UNLIST') return id
        })
        .filter(Boolean)

      const params = {
        productId: editType === 2 ? downIds : upIds,
        unlist: editType === 2
      }
      try {
        await Goods.unListBatchUpdatePrice(params)
      } catch (error) {
        console.error(error)
      }
    },
    /**预览 */
    onPreview() {
      this.setDefaultValue()
      const {
        editType,
        xl,
        xlValue,
        xj,
        xjValue,
        scl,
        sclValue,
        lll,
        lllValue,
        pjl,
        pjlValue
      } = this.$data.editForm

      this.$data.dataSource.forEach((element) => {
        let _status_ = element.status

        /**上架操作 */
        if (editType === 1) {
          _status_ = 'NORMAL'
          if (xl) {
            if (element.sales < xlValue) _status_ = 'UNLIST'
          }

          if (xj) {
            if (element.ratingStar < xjValue) _status_ = 'UNLIST'
          }

          if (scl) {
            if (element.likes < sclValue) _status_ = 'UNLIST'
          }

          if (lll) {
            if (element.views < lllValue) _status_ = 'UNLIST'
          }

          if (pjl) {
            if (element.cmtCount < pjlValue) _status_ = 'UNLIST'
          }
        }

        /**下架操作 */
        if (editType === 2) {
          _status_ = 'UNLIST'
          if (xl) {
            if (element.sales > xlValue) _status_ = 'NORMAL'
          }

          if (xj) {
            if (element.ratingStar > xjValue) _status_ = 'NORMAL'
          }

          if (scl) {
            if (element.likes > sclValue) _status_ = 'NORMAL'
          }

          if (lll) {
            if (element.views > lllValue) _status_ = 'NORMAL'
          }

          if (pjl) {
            if (element.cmtCount > pjlValue) _status_ = 'NORMAL'
          }
        }
        this.$set(element, '_status_', _status_)
      })
    },
    /**上下架 */
    setDefaultValue() {
      const { dataSource } = this.$data
      dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_status_', element.status)
          this.$set(element, '_change_', true)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
