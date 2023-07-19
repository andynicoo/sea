<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="$t('edit.goodstask')">
    </a-page-header>
    <a-layout class="me-page-layout">
      <SearchForm :type="componentsType" @search="onSearch"></SearchForm>
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
          <a-button @click="batchDelete">
            {{ $t('task.batchDelete') }}
          </a-button>
          <a-button @click="cancelPublish">
            {{ $t('commodityList.batchCancelled') }}
          </a-button>
        </a-space>
      </a-affix>
      <!-- 列表 -->
      <CommodityList
        :loading="tableLoading"
        :data-source="dataSource"
        :type="componentsType"
        :rowSelection="rowSelection"
        :pagination="getPagination"
        @change="changePage"
        @reloadPageData="reLoadData"
      >
        <div slot="actions" slot-scope="source">
          <a-button class="me-pa-1" type="link" @click="onEdit(source)">
            {{ $t('common.edit') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button class="me-pa-1" type="link" @click="cancelPublish(source)">
            {{ $t('commodityList.cancelRelease') }}
          </a-button>
          <a-divider type="vertical" />
          <a-button
            class="me-pa-1 me-error"
            type="link"
            @click="onDelete(source)"
          >
            {{ $t('common.delete') }}
          </a-button>
          <div class="me-mr-2 me-status me-status-skip me-fs12">
            <div>{{ $t('commodityList.lastModifiedTime') }}:</div>
            {{ source.source.updateTime }}
          </div>
        </div>
      </CommodityList>
    </a-layout>

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
          <a-col :span="4">{{ item.name }}</a-col>
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

    <!-- 批量修改商品价格 -->
    <a-modal
      title="批量修改商品价格"
      @cancel="batchEditPriceVisible = false"
      @ok="onBatchEditPriceSubmit"
      :visible="batchEditPriceVisible"
      destroyOnClose
    >
      <SetPriceTemplate ref="setPriceTemplate" :list="selectedRows" />
    </a-modal>
  </div>
</template>

<script>
import SearchForm from './components/SearchForm'
import CommodityList from './components/CommodityList'
import tableMixins from '@/mixins/tableMixins'
import productTableMixins from '@/mixins/productTableMixins'
import Goods from '@/api/goods'
import StatusTabs from './components/StatusTabs.vue'
import bus from '@/bus'
import SetPriceTemplate from '@/views/goods/components/setPriceTemplate/SetPriceTemplate'
import BatchEditOption from './components/BatchEditOption'

export default {
  mixins: [tableMixins, productTableMixins],
  components: {
    CommodityList,
    SearchForm,
    StatusTabs,
    SetPriceTemplate,
    BatchEditOption
  },
  data() {
    return {
      componentsType: 4
    }
  },
  methods: {
    getTableData() {
      const { size, current } = this.$data.paginationData
      const { params, componentsType } = this.$data
      return Goods.getEarlyProductList({
        ...params,
        size,
        current,
        type: componentsType
      })
    },
    // 取消发布
    cancelPublish({ source }) {
      if (source) {
        const { id } = source
        this.onSelectChange([id], [source])
      }
      this.batchCancel()
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
