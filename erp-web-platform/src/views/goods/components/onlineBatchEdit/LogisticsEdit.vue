<template>
  <BaseTable
    :columns="getColumns"
    :dataSource="dataSource"
    :pagination="getPagination"
    :loading="tableLoading"
    :onCancel="onCancel"
    :onSave="onSave"
    :onPreview="onPreview"
    :onChange="onChange"
    :saveBtnText="$t('edit.update')"
    :saveMsg="$t('edit.updateSuccess')"
  >
    <template v-slot:before="{ record }">
      <p
        v-for="(logisticsStr, index) in getLogistics(record.logistics)"
        :key="`${logisticsStr}${index}`"
      >
        {{ logisticsStr }}
      </p>
    </template>
    <template v-slot:after="{ record }">
      <p
        v-for="(logisticsStr, index) in getLogistics(record._logistics_)"
        :key="`${logisticsStr}${index}`"
      >
        {{ logisticsStr }}
      </p>
    </template>

    <template>
      <table>
        <tr>
          <td>
            <span class="me-mr-2">{{ $t('logisticsEdit.label') }}：</span>
          </td>
          <td colspan="2">{{ $t('logisticsEdit.msg1') }}</td>
        </tr>
        <tr>
          <td></td>
          <td>
            <div class="me-pt-2 me-mb-2">
              <a-form-item
                :validate-status="logisticsValidate ? 'error' : null"
                :help="logisticsValidate"
              >
                <table>
                  <tr
                    v-for="logistics in logisticsOptions"
                    :key="logistics.logisticId"
                  >
                    <td>
                      <a-checkbox
                        @change="onChangLogistics($event, logistics, 'enabled')"
                        :checked="logistics.enabled"
                      >
                        {{ logistics.logisticName }}
                      </a-checkbox>
                    </td>
                    <td>
                      <a-checkbox
                        :disabled="!logistics.enabled"
                        @change="onChangLogistics($event, logistics, 'isFree')"
                        :checked="logistics.isFree"
                      >
                        {{ $t('logisticsEdit.isfree') }}
                      </a-checkbox>
                    </td>
                    <td>
                      <a-select
                        v-if="logistics.sizes.length"
                        v-model="logistics.sizeId"
                        :default-value="logistics.sizeId"
                        style="width: 120px"
                        class="me-ml-5"
                        :disabled="!logistics.enabled"
                      >
                        <a-select-option
                          v-for="item2 in logistics.sizes"
                          :key="item2.size_id"
                          :value="item2.size_id"
                        >
                          {{ item2.name }}
                        </a-select-option>
                      </a-select>
                    </td>
                  </tr>
                </table>
              </a-form-item>
            </div>
          </td>
        </tr>
      </table>
    </template>
  </BaseTable>
</template>

<script>
import BaseTable from '@/views/goods/components/batchEditTabs/BatchEditBaseTable'
import batchEditMixins from '@/mixins/batchEditMixins'
import Order from '@/api/order'
import { cloneDeep } from 'lodash'
import Goods from '@/api/goods'

export default {
  mixins: [batchEditMixins],
  components: { BaseTable },
  data() {
    return {
      logisticsOptions: [],
      logisticsValidate: null
    }
  },
  computed: {
    getLogistics() {
      return (logistics) => {
        if (!logistics) return null
        return logistics
          .filter(({ enabled }) => enabled)
          .map(({ logisticName, isFree }) => {
            let str = logisticName
            if (isFree) str += `【${this.$t('logisticsEdit.free')}】`
            return str
          })
      }
    }
  },
  mounted() {
    const { storeId } = this.$props
    const { platformId: shopId } = this.$attrs.currentObj || {}
    Order.handleSyncLogisticsV2({ storeId, shopId }).then(({ data }) => {
      console.log(data)
      this.$data.logisticsOptions = data
        .filter((item) => item.maskChannelId == 0)
        .map((item) => {
          if (item.sizes && item.sizes.length && !item.sizeId) {
            item.sizeId = String(item.sizes[0].size_id)
          }
          return item
        })
    })
  },
  methods: {
    /**保存 */
    onSave() {
      this.setDefaultValue()
      return new Promise((resolve, reject) => {
        let dataSource = cloneDeep(this.$data.dataSource)
        dataSource.map((element) => {
          element.logistics = element._logistics_
          return element
        })
        const loading = this.$Loading()
        let step = 0
        const progress = () => parseInt((++step / dataSource.length) * 100)
        const reqQueue = dataSource.map(async (element) => {
          let res = await Goods.goodsBatchUpdate(element)
          loading.progress(progress())
          return res
        })
        Promise.all(reqQueue)
          .then(() => {
            this.$message.warning({
              content: (h) => (
                <p style="color: red">
                  {this.$t('batchEditOption.resolveMessage1')}
                </p>
              ),
              duration: 10
            })
            resolve()
          })
          .catch(reject)
          .finally(async () => {
            await loading.clear()
          })
      })
    },
    /**预览 */
    onPreview() {
      this.setDefaultValue()
      const { logisticsOptions, dataSource } = this.$data
      this.$data.logisticsValidate = null
      const isE = logisticsOptions.map(({ enabled }) => enabled).some(Boolean)
      if (!isE) {
        this.$data.logisticsValidate = this.$t('logisticsEdit.valid1')
        return
      }

      let _logisticsOptions = cloneDeep(logisticsOptions)
      _logisticsOptions = _logisticsOptions.map((logistics) => ({
        enabled: logistics.enabled,
        isFree: logistics.isFree,
        logisticId: logistics.logisticId,
        logisticName: logistics.logisticName,
        sizeId: logistics.sizeId
      }))
      dataSource.forEach((element) => {
        this.$set(element, '_logistics_', _logisticsOptions)
      })
    },
    /**物流方式编辑 */
    onChangLogistics({ target }, data, field) {
      if (field === 'enabled') this.$set(data, 'isFree', false)
      this.$set(data, field, target.checked)
    },
    /**设置默认值 */
    setDefaultValue() {
      this.$data.dataSource.forEach((element) => {
        if (!element._change_) {
          this.$set(element, '_change_', true)
          this.$set(element, '_logistics_', element.logistics)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
