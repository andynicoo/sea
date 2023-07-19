<template>
  <div class="me-pa-2">
    <a-page-header class="me-page-header" :title="$t('edit.goodsfaild')">
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

          <a-button @click="batchPublish" type="primary">
            {{ $t('commodityList.batchRelease') }}
          </a-button>
          <a-button @click="batchDelete">
            {{ $t('faild.batchDelete') }}
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
          <a-button
            class="me-pa-1"
            :loading="source.source._loading_"
            type="link"
            @click="onRePush(source)"
          >
            {{ $t('faild.rePush') }}
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
import BatchEditOption from './components/BatchEditOption'
import bus from '@/bus'
import SetPriceTemplate from '@/views/goods/components/setPriceTemplate/SetPriceTemplate'

export default {
  mixins: [tableMixins, productTableMixins],
  components: {
    CommodityList,
    SearchForm,
    StatusTabs,
    BatchEditOption,
    SetPriceTemplate
  },
  data() {
    return {
      componentsType: 3,
      params: {}
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
    onSearch(params) {
      this.$data.params = params
      this.reLoadData()
    },
    /**
     * 重新发布
     */
    onRePush({ source }) {
      const { id } = source
      this.onSelectChange([id], [source])
      this.batchPublish()
    },
    getCountNum() {
      this.$nextTick(() => {
        bus.$emit('updateCount')
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>

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
