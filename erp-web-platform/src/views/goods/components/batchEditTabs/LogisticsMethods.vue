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
    <template v-slot:before="{ record, index }">
      <ul
        class="me-edit-all"
        v-if="record.logistics.length > 0"
        :class="{ 'me-show': record._viewflag_ }"
      >
        <li v-for="item in record.logistics" :key="item.id">
          <p v-if="item.enabled">
            <span v-if="item.isFree">[{{ $t('toBeEdit.freeShipping') }} ]</span>
            {{ item.logisticName }}
          </p>
        </li>
      </ul>
      <a-button
        v-if="logisticsFlag(record.logistics)"
        type="link"
        @click="viewAll(index)"
      >
        {{ record._viewflag_ ? $t('common.putAll') : $t('common.viewAll') }}
      </a-button>
    </template>
    <template v-slot:after="{ record, index }">
      <ul
        class="me-edit-all"
        v-if="record._logistics_ && record._logistics_.length > 0"
        :class="{ 'me-show': record._viewflag_ }"
      >
        <li v-for="item in record._logistics_" :key="item.id">
          <p v-if="item.enabled">
            <span v-if="item.isFree">[{{ $t('toBeEdit.freeShipping') }} ]</span>
            {{ item.logisticName }}
          </p>
        </li>
      </ul>
      <a-button
        v-if="record._logistics_ && logisticsFlag(record._logistics_)"
        type="link"
        @click="viewAll(index)"
      >
        {{ record._viewflag_ ? $t('common.putAll') : $t('common.viewAll') }}
      </a-button>
    </template>

    <template>
      <table class="me-edit-setting">
        <tr>
          <td>
            {{ $t('toBeEdit.newLogistics') }}
            :
          </td>
          <td>
            <p class="me-cred">
              {{ $t('toBeEdit.LogisTips') }}
            </p>
            <div v-if="logistics.length && logisLoad">
              <a-checkbox
                class="me-w300 me-mt-2 me-mb-2"
                v-model="allEnabled"
                @change="LMAllChange"
                >全选</a-checkbox
              ><a-checkbox
                :disabled="!allEnabled"
                v-model="allIsFree"
                @change="FreeAllChange"
                >{{ $t('toBeEdit.freeShipping') }}
              </a-checkbox>
              <ul class="logistics-box">
                <li
                  v-for="(item, index) in filterEnableList(logistics)"
                  :key="item.logisticId"
                >
                  <a-checkbox
                    v-model="item.enabled"
                    class="me-w300"
                    @change="(e) => LMChange(e, index)"
                    >{{ item.logisticName }}</a-checkbox
                  ><a-checkbox :disabled="!item.enabled" v-model="item.isFree"
                    >{{ $t('toBeEdit.freeShipping') }}
                  </a-checkbox>
                  <a-select
                    v-if="item.sizes.length"
                    :default-value="item.sizes[0].sizeId"
                    style="width: 120px"
                    @change="(e) => sizesChange(e, index)"
                    class="me-ml-5"
                    :disabled="!item.enabled"
                  >
                    <a-select-option
                      v-for="item2 in item.sizes"
                      :key="item2.sizeId"
                      :value="item2.sizeId"
                    >
                      {{ item2.name }}
                    </a-select-option>
                  </a-select>
                </li>
              </ul>
            </div>
            <a-icon v-else type="loading" />
            <p>{{ $t('toBeEdit.LogisTips2') }}</p>
          </td>
        </tr>
      </table>
    </template>
  </BaseTable>
</template>

<script>
import Order from '@/api/order'
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
        left: 136
      },
      logistics: [],
      logisLoad: false,
      isSubmit: false,
      allEnabled: false,
      allIsFree: false
    }
  },

  computed: {
    // 过滤掉不能选的
    filterEnableList() {
      return (list) => {
        return list ? list.filter((item) => item.maskChannelId == 0) : []
      }
    }
  },

  mounted() {},
  methods: {
    //物流方式是否需要折叠
    logisticsFlag(val) {
      let len = 0
      val.forEach((item) => {
        if (item.enabled) {
          len = len + 1
        }
      })
      if (len > 2) {
        return true
      }
      return false
    },
    //添加展开收起标记和获取物流方式
    getTableDataAfter() {
      this.$data.dataSource.forEach((item) => {
        this.$set(item, '_viewflag_', false)
      })
      if (this.isSubmit) return
      Order.handleSyncLogistics({
        storeId: this.$data.dataSource[0].storeId
      }).then(({ data }) => {
        const logistics = data.map(
          ({
            logisticId,
            logisticName,
            enabled,
            isFree,
            sizes,
            maskChannelId
          }) => ({
            logisticId,
            logisticName,
            enabled,
            isFree,
            sizes,
            maskChannelId,
            sizeId: sizes.length ? sizes[0].sizeId : ''
          })
        )
        this.$data.logistics = logistics
        this.$data.logisLoad = true
      })
    },
    //显示全部
    viewAll(index) {
      this.$data.dataSource[index]._viewflag_ = !this.$data.dataSource[index]
        ._viewflag_
    },
    //物流方式改变
    LMChange(e, index) {
      console.log(e.target.checked, index)
      if (!e.target.checked) {
        this.$data.logistics[index].isFree = false
      }
    },
    //全选反选物流方式
    LMAllChange(e) {
      this.$data.allEnabled = e.target.checked
      if (!e.target.checked) {
        this.$data.allIsFree = false
      }
      this.$data.logistics.forEach((item) => {
        item.enabled = e.target.checked
        if (!e.target.checked) {
          item.isFree = false
        }
      })
    },
    //全选反选包邮
    FreeAllChange(e) {
      this.$data.allIsFree = e.target.checked
      this.$data.logistics.forEach((item) => {
        item.isFree = e.target.checked
      })
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
          this.$set(element, '_logistics_', element.logistics)
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
        ele.logistics = ele._logistics_
        return ele
      })
      await Goods.handleEditBatch(data)
      this.isSubmit = true
    },
    /**预览 */
    onPreview() {
      const { dataSource } = this.$data
      this.setDefaultValu()
      this.$data.dataSource = dataSource.map((ele) => {
        ele._logistics_ = cloneDeep(this.$data.logistics)
        return ele
      })
    },
    //黑猫物流切换
    sizesChange(val, index) {
      this.$data.logistics[index].sizeId = val
    },
    /**是否改变判断 */
    whetherChange() {
      const { dataSource } = this.$data
      const changes = dataSource.map(({ _change_ }) => _change_)
      return changes.some(Boolean)
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
  tr {
    & td:nth-child(odd) {
      text-align: right;
      vertical-align: top;
    }
  }
}
.me-edit-all {
  height: 43px;
  overflow: hidden;
}
.me-show {
  height: auto;
}
.me-w300 {
  min-width: 345px;
}
.me-cred {
  color: red;
}
.logistics-box {
  li {
    padding: 5px 0;
  }
}
</style>
