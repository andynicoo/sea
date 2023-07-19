<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="$t('edit.productEdit')">
    </a-page-header>
    <a-layout class="me-page-layout">
      <div>
        <SearchForm @search="onSearch" :type="componentsType">
          <!-- <template v-slot:form-item>
            <a-form-item :label="$t('store.storeType')">
              <a-select
                v-decorator="['isCnsc']"
                style="width: 190px"
                allowClear
                :placeholder="$t('edit.placeChoose')"
              >
                <a-select-option value="0">
                  {{ $t('toBeEdit.qitadian') }}
                </a-select-option>
                <a-select-option value="1">
                  CNSC
                </a-select-option>
              </a-select>
            </a-form-item>
          </template> -->
        </SearchForm>
      </div>
      <!-- {{ quickSetGoods }} -->
      <StatusTabs ref="sub" />

      <a-affix :offset-top="60" class="custom-affix">
        <a-space class="me-mb-3">
          <a-button-group>
            <a-popover
              @visibleChange="onVisibleChange"
              :visible="batchEditVisible"
              :title="null"
              trigger="click"
              placement="bottomLeft"
            >
              <template slot="content">
                <BatchEditOption
                  @cancel="reLoadData"
                  @selected="batchEditVisible = false"
                  :rows="selectedRows"
                />
              </template>
              <a-button type="primary">
                {{ $t('searchForm.batchEdit') }}
              </a-button>
            </a-popover>
            <a-button @click="onBatchEditCategory"> 批量设置类目 </a-button>
            <a-button @click="onBatchEditPrice"> 批量修改价格 </a-button>
          </a-button-group>

          <a-dropdown>
            <a-menu slot="overlay" @click="onBatchPublish">
              <a-menu-item key="1"> 批量立即发布 </a-menu-item>
              <a-menu-item key="2"> 批量定时发布 </a-menu-item>
            </a-menu>
            <a-date-picker
              class="me-custorm-date-picker"
              :show-time="{ format: 'HH:mm' }"
              placeholder="Time"
              :disabled-date="disabledDate"
              inputReadOnly
              @ok="onDatePickerOk"
              @openChange="onShowDatePicker"
              :open="batchTimePublishLoading"
              :showToday="false"
              :disabled-time="disabledDateTime"
            >
              <template slot="renderExtraFooter">
                <div>
                  {{ $t('common.setting') }}:{{ $t('toBeEdit.eachInterval') }}
                  <a-select
                    style="width: 86px"
                    v-model="minuteNum"
                    size="small"
                  >
                    <a-select-option
                      v-for="(item, index) in autoNum"
                      :key="item + index"
                      :value="item.num"
                    >
                      {{ item.text }}
                    </a-select-option>
                  </a-select>
                  {{ $t('toBeEdit.publishProduct') }}
                </div>
                <a-button
                  class="custorm-cancel"
                  size="small"
                  @click="batchTimePublishLoading = false"
                >
                  取消
                </a-button>
              </template>
              <a-button> 批量发布 <a-icon type="down" /> </a-button>
            </a-date-picker>
          </a-dropdown>

          <a-button @click="batchDelete">
            {{ $t('searchForm.batchTimedDelete') }}
          </a-button>
          <a-button @click="quickSetTran">
            <a-icon type="setting" />{{ $t('searchForm.quickSetTran') }}
          </a-button>
        </a-space>
      </a-affix>

      <CommodityList
        :loading="tableLoading"
        :data-source="dataSource"
        :type="componentsType"
        :rowSelection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
        @changeType="changeType"
        @reloadPageData="reLoadData"
      >
        <div slot="actions" slot-scope="source">
          <a-button class="me-pa-1" type="link" @click="onEdit(source)">
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            class="me-pa-1 me-error"
            type="link"
            @click="onDelete(source)"
            :loading="source.source._d_loading_"
          >
            {{ $t('common.delete') }}
          </a-button>
          <div class="me-mr-2 me-status me-status-skip me-fs12">
            <div>{{ $t('toBeEdit.lastModifiedTime') }}:</div>
            {{ source.source.updateTime }}
          </div>
        </div>
      </CommodityList>
    </a-layout>
    <!-- 快速设置/翻译 -->
    <a-modal
      :visible="quickSetVisible"
      :title="$t('searchForm.quickSetTran')"
      :confirm-loading="quickSetLoading"
      @cancel="quickSetVisible = false"
      :maskClosable="false"
      destroyOnClose
      :width="1200"
      :footer="null"
      :bodyStyle="{ padding: '10px 16px 20px' }"
    >
      <QuickSet
        ref="quickSet"
        :list="quickSetGoods"
        @func="quickSetVisible = false"
        @funclose="loadTable"
      >
      </QuickSet>
    </a-modal>

    <!-- 批量修改站点类目 -->
    <a-modal
      class="batch-edit-category-modal"
      title="批量修改站点类目"
      @cancel="batchEditCategory = null"
      @ok="onBatchEditCategorySubmit"
      :visible="!!batchEditCategory"
      :confirmLoading="batchEditCategoryLoading"
      destroyOnClose
    >
      <a-space direction="vertical">
        <a-row v-for="(item, index) in batchEditCategory" :key="index">
          <a-col :span="4">
            {{ item.countryCode === 'CNSC' ? item.countryCode : item.name }}
          </a-col>
          <a-col :span="20">
            <a-row>
              <a-col :span="22">
                <template v-if="item.value">
                  <span
                    class="category-name"
                    v-for="(name, index) in item.value.categoryNames"
                    :key="index"
                  >
                    {{ name }}
                  </span>
                </template>
              </a-col>
              <a-col :span="2">
                <a-icon type="edit" @click="onCategoryChoose(item)" />
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </a-space>
    </a-modal>
  </div>
</template>

<script>
import CommodityList from './components/CommodityList'
import SearchForm from './components/SearchForm'
import tableMixins from '@/mixins/tableMixins'
import productTableMixins from '@/mixins/productTableMixins'
import releaseTimeMix from '@/mixins/release-time-mix'
import QuickSet from './components/QuickSet'
import Goods from '@/api/goods'
import BatchEditOption from './components/BatchEditOption'
import { cloneDeep, flatten } from 'lodash'

import '@/views/goods/components/common.scss'
import StatusTabs from './components/StatusTabs.vue'
import bus from '@/bus'
import { message } from 'ant-design-vue'

export default {
  mixins: [tableMixins, productTableMixins, releaseTimeMix],
  components: {
    CommodityList,
    SearchForm,
    BatchEditOption,
    QuickSet,
    StatusTabs
  },
  mounted() {
    this.getAutoNum()
  },
  data() {
    return {
      params: {},
      batchPublishLoading: false,
      batchTimePublishLoading: false,
      componentsType: 2,

      batchEditPriceVisible: false,
      quickSetVisible: false,
      quickSetLoading: false,
      quickSetGoods: []
    }
  },
  methods: {
    /**批量发布 */
    onBatchPublish(e) {
      const { selectedRowKeys, selectedRows } = this.$data
      if (!selectedRowKeys.length) {
        return message.error('请选择需要发布的商品')
      }
      console.log(e)
      if (e.key == 2 && selectedRows.some((item) => item.merchantId)) {
        return this.$message.error('CNSC产品不支持批量定时发布')
      }
      /**批量立即发布 */
      if (e.key == 1) return this.batchPublish()
      /**批量定时发布 */
      if (e.key == 2) return (this.$data.batchTimePublishLoading = true)
    },
    loadTable() {
      this.loadData()
    },
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params, componentsType } = this.$data
      return Goods.getEarlyProductList({
        ...params,
        size: size || 10,
        current,
        status: 1,
        type: componentsType
      }).then((res) => {
        res.data.records = res.data.records.map((item) => {
          if (item.currency === 'CNY') item.countryCode = 'CNSC'
          return item
        })
        return res
      })
    },
    // 快速设置 翻译
    quickSetTran() {
      const { dataSource, selectedRowKeys } = this.$data
      console.log(selectedRowKeys)
      if (selectedRowKeys.length === 0) {
        this.$message.error(this.$t('common.handlerLimit'))
        return
      }
      let data = cloneDeep(
        dataSource.filter(({ id }) => selectedRowKeys.includes(id))
      )
      data.forEach((element) => {
        element.images = JSON.parse(element.images)
      })
      this.$data.quickSetGoods = data
      this.$data.siteName = data[0].siteName
      data.map((ele) => {
        if (ele.siteName == this.$data.siteName)
          this.$data.curSiteNameGoods += 1
      })
      this.$data.quickSetVisible = true
    },

    quickSetOk() {},
    handleCancel(visible) {
      this.$data[visible] = false
    },
    getCountNum() {
      this.$nextTick(() => {
        bus.$emit('updateCount')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.me-custorm-date-picker {
  &.ant-calendar-picker {
    min-width: auto !important;
  }
}
.dynamic-title-dialog {
  color: #40a9ff;
  margin: 0 10px;
}
.custorm-cancel {
  float: right;
  margin-left: 10px;
  margin-top: 7px;
  border-radius: 4px;
}
</style>

<style lang="scss" scoped>
.category-name {
  &::after {
    content: '>';
  }

  &:last-child {
    &::after {
      display: none;
    }
  }
}
</style>

<style lang="scss">
.batch-edit-category-modal {
  .ant-modal-body {
    .ant-space {
      &.ant-space-vertical {
        width: 100%;
      }

      .anticon {
        &.anticon-edit {
          color: #008dff;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
