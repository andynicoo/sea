<template>
  <div>
    <a-card class="me-table-card me-mt-4 me-mb-3" size="small" :title="null">
      <a-table
        rowKey="id"
        size="middle"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        :rowSelection="rowSelection"
        @change="onChange"
        :scroll="{ y: 95 * 4 }"
      >
        <div
          :slot="column.scopedSlots.customRender"
          v-for="column in columns"
          :key="column.dataIndex"
          slot-scope="text, record, index"
        >
          <template v-if="column.scopedSlots.customRender === 'name'">
            <div style="display: flex; align-items: center">
              <a-popover :title="null" placement="right">
                <template slot="content">
                  <img
                    style="width: 300px; height: 300px"
                    v-lazy="record.mainImage"
                  />
                </template>
                <img
                  style="width: 70px; height: 70px"
                  v-lazy="record.mainImage"
                />
              </a-popover>
              <span class="me-ml-2 me-product-name">
                <b v-if="record.discountId" class="me-promotion">
                  {{ $t('commodityList.promotion') }}
                </b>
                {{ record.name }}
              </span>
            </div>
          </template>
          <template v-else-if="column.scopedSlots.customRender === 'source'">
            <span>
              {{
                (country.find((item) => item.key == record.countryCode) || {})
                  .name
              }}
            </span>
          </template>
          <template v-else-if="column.scopedSlots.customRender === 'itemSku'">
            <span>
              {{ record.itemSku }}
            </span>
          </template>
          <template v-else>
            <slot
              :name="column.scopedSlots.customRender"
              :text="text"
              :record="record"
              :index="index"
            ></slot>
          </template>
        </div>
      </a-table>
    </a-card>

    <a-card
      size="small"
      class="me-mb-3"
      :title="$t('batchEditOption.batchEditMethod')"
    >
      <slot></slot>
      <div
        :style="{
          'margin-left': btnStyle.left + 'px',
          'margin-top': btnStyle.top + 'px'
        }"
      >
        <template v-if="onPreview">
          <a-button
            :loading="previewLoading"
            :disabled="!dataSource.length || previewDisabled"
            @click="onPreviewBefor"
            type="primary"
          >
            {{ $t('batchEditOption.preview') }}
          </a-button>
        </template>
        <a-button
          v-if="recoveryCollectPrice"
          class="me-ml-2"
          :disabled="!dataSource.length"
          @click="recoveryCollectPrice"
        >
          {{ $t('toBeEdit.recovery') }}
        </a-button>
        <a-button
          v-if="oneClickCreateSku"
          class="me-ml-2"
          :disabled="!dataSource.length"
          @click="oneClickCreateSku"
        >
          一键生成SKU
        </a-button>
        <a-button
          class="me-ml-2"
          :disabled="!dataSource.length"
          @click="goBack"
          v-if="initfunc && !isOnLine"
        >
          重置
        </a-button>
        <slot name="preStep"></slot>
      </div>
    </a-card>

    <div class="me-text-right">
      <!-- <span class="me-fl">{{ $t('batchEditOption.bottommessage1') }}</span> -->
      <a-space>
        <slot name="bottom-btn">
          <template v-if="rowSelection">
            {{ $t('batchEditOption.selected') }}
            <span class="me-link">{{
              rowSelection.selectedRowKeys.length
            }}</span>
            {{ $t('batchEditOption.product') }}
          </template>

          <template v-if="onTranslate">
            <a-dropdown placement="topCenter">
              <a-button
                type="primary"
                :disabled="!dataSource.length || translateDisabled"
                :loading="translateLoading"
              >
                {{ $t('batchEditOption.translate') }}<a-icon type="up" />
              </a-button>
              <a-menu slot="overlay">
                <!-- <a-menu-item
                  v-for="(langItem, index) in targetLangList"
                  :key="index"
                  @click="onTranslateBefor(langItem)"
                >
                  {{ langItem.name }}
                </a-menu-item> -->
                <a-menu-item key="1" @click="onTranslateBefor({ lang: 'CN' })"
                  >当地语言</a-menu-item
                >
                <a-menu-item key="2" @click="onTranslateBefor({ lang: 'EN' })"
                  >英语</a-menu-item
                >
              </a-menu>
            </a-dropdown>
          </template>
          <!-- 附加的操作 -->
          <slot name="before-operation"></slot>

          <template v-if="onSave">
            <a-tooltip>
              <template slot="title" v-if="preview">
                {{ $t('toBeEdit.previewFirst') }}
              </template>
              <a-button
                :disabled="!dataSource.length || saveDisabled"
                :loading="saveLoading"
                @click="onSaveBefor"
                type="primary"
              >
                {{ saveBtnText }}
              </a-button>
            </a-tooltip>
          </template>

          <template v-if="onCancel">
            <a-button @click="onCancel">
              {{ $t('batchEditOption.cancel') }}
            </a-button>
          </template>
        </slot>
      </a-space>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    pagination: Object,
    loading: Boolean,
    rowSelection: Object,
    onCancel: Function,
    onSave: Function,
    onPreview: Function,
    recoveryCollectPrice: Function,
    oneClickCreateSku: Function,
    onTranslate: Function,
    onChange: Function,
    saveBtnText: String,
    saveMsg: String,
    preview: {
      type: Boolean,
      default: true
    },
    initfunc: {
      type: Boolean,
      default: true
    },
    btnStyle: {
      type: Object,
      default: () => {
        return {
          top: 10,
          left: 79
        }
      }
    }
  },
  data() {
    return {
      translateLoading: false,
      saveLoading: false,
      country: [
        { key: 'SG', name: this.$t('common.SG') },
        { key: 'PH', name: this.$t('common.PH') },
        { key: 'MY', name: this.$t('common.MY') },
        { key: 'ID', name: this.$t('common.ID') },
        { key: 'TH', name: this.$t('common.TH') },
        { key: 'VN', name: this.$t('common.VN') },
        { key: 'BR', name: this.$t('common.BR') },
        { key: 'TW', name: this.$t('common.TW') },
        { key: 'MX', name: '墨西哥' },
        { key: 'CL', name: '智利' },
        { key: 'CO', name: '哥伦比亚' },
        { key: 'ES', name: '西班牙' },
        { key: 'PL', name: '波兰' },
        { key: 'FR', name: '法国' },
        { key: 'IN', name: '印度' },
        { key: 'CNSC', name: 'CNSC' }
      ],
      previewLoading: false,
      translateDisabled: false,
      saveDisabled: false,
      previewDisabled: false,
      specTranslate: true,
      isOnLine: false
    }
  },
  computed: {
    ...mapState({
      targetLangList: (state) => state.product.targetLangList
    })
  },
  mounted() {
    const hash = location.hash
    if (hash.indexOf('goods/on-sale') > -1) {
      this.$data.isOnLine = true
    }
  },
  methods: {
    async onSaveBefor() {
      this.$data.translateDisabled = true
      this.$data.previewDisabled = true
      this.$data.saveLoading = true
      try {
        let res = await this.$props.onSave()
        console.log(res)
        // 保存时报错
        if (res && location.hash == '#/goods/to-be-edit') {
          this.$message.error(res)
        } else if (res == '请选择要更新的商品') {
          this.$message.error(res)
        } else {
          this.$parent.getTableData()
          this.$message.success(this.$props.saveMsg)
        }
      } catch (error) {
        if (error) this.$message.error(error)
        console.error(error)
      }
      this.$data.translateDisabled = false
      this.$data.previewDisabled = false
      this.$data.saveLoading = false
    },
    async onPreviewBefor() {
      this.$data.translateDisabled = true
      this.$data.previewLoading = true
      this.$data.saveDisabled = true
      try {
        await this.$props.onPreview()
      } catch (error) {
        console.error(error)
      }
      this.$data.translateDisabled = false
      this.$data.previewLoading = false
      this.$data.saveDisabled = false
    },
    async onTranslateBefor(params) {
      this.$data.translateLoading = true
      this.$data.previewDisabled = true
      this.$data.saveDisabled = true
      try {
        await this.$props.onTranslate(params)
        this.$message.success(this.$t('common.translatSuccess'))
      } catch (error) {
        if (error) this.$message.error(error)
        console.error(error)
      }
      if (this.$data.specTranslate) {
        this.$data.translateLoading = false
        this.$data.previewDisabled = false
        this.$data.saveDisabled = false
      }
    },
    goBack() {
      this.$emit('initData', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.me-product-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  max-width: 300px;
}
.me-promotion {
  display: inline-block;
  height: 18px;
  padding: 2px 5px;
  line-height: 18px;
  text-align: center;
  font-size: 12px;
  background: #1abc9c;
  color: #fff;
  margin-right: 6px;
  font-weight: normal;
}
</style>

<style lang="scss">
.me-table-card {
  &.ant-card-small > .ant-card-body {
    padding: 0 !important;
  }
}
</style>
