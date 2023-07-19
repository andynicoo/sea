<template>
  <div>
    <div class="me-handler-red me-mb-2">
      <p>{{ $t('goodsCollection.autoPublishSet41') }}</p>
      <p>{{ $t('goodsCollection.autoPublishSet42') }}</p>
    </div>
    <div v-if="logisticList.length > 0">
      <div>
        <a-checkbox
          :indeterminate="indeterminate"
          :checked="checkAll"
          @change="onLogisticsCheckAll"
        >
          {{ $t('edit.all') }}
        </a-checkbox>
      </div>
      <div v-for="logistics in logisticList" :key="logistics.logisticId">
        <a-row>
          <a-col :span="12">
            <a-checkbox
              @change="onLogisticsChange($event, logistics)"
              v-model="logistics.enabled"
            >
              {{ logistics.logisticName }}
            </a-checkbox>
          </a-col>
          <a-col :span="12">
            <a-checkbox
              :disabled="!logistics.enabled"
              v-model="logistics.isFree"
            >
              {{ $t('edit.isFree') }}
            </a-checkbox>
          </a-col>
        </a-row>
      </div>
    </div>
    <div v-else>
      <a-empty
        :image="simpleImage"
        :description="$t('goodsCollection.autoPublishSet40')"
      />
    </div>
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { Empty } from 'ant-design-vue'

export default {
  props: {
    list: {
      type: Array,
      defalut: []
    },
    selectList: {
      type: Array,
      defalut: []
    }
  },
  beforeCreate() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  data() {
    return {
      logisticList: [],
      discountChecked: false,
      indeterminate: false,
      checkAll: false
    }
  },
  mounted() {
    // 初始化
    this.initData()
  },
  methods: {
    async initData() {
      const list = await cloneDeep(this.list)
      list.map((item) => {
        item.enabled = false
        item.isFree = false
      })
      if (this.selectList && this.selectList.length !== 0) {
        list.map((item) => {
          this.selectList.map((val) => {
            if (val.logisticId === item.logisticId) {
              item.enabled = val.enabled
              item.isFree = val.isFree
            }
          })
        })
        const enabledArr = this.selectList.filter((val) => val.enabled)
        this.indeterminate =
          !!enabledArr.length && enabledArr.length < list.length
        this.checkAll = list.length === enabledArr.length
      }

      this.$set(this.$data, 'logisticList', list)
    },
    submit() {
      return new Promise(async (resolve) => {// eslint-disable-line
        const arr = await this.logisticList.filter((item) => item.enabled)
        resolve(arr)
      })
    },
    /**物流方式全选 */
    onLogisticsCheckAll({ target }) {
      const value = target.checked
      this.logisticList.map((val) => {
        val.enabled = value
        val.isFree = value ? val.isFree : false
      })
      Object.assign(this, {
        indeterminate: false,
        checkAll: value
      })
    },
    /**物流方式变化事件 */
    onLogisticsChange({ target }, item) {
      const value = target.checked
      item.enabled = value
      const enabledArr = this.logisticList.filter((val) => val.enabled)
      this.indeterminate =
        !!enabledArr.length && enabledArr.length < this.logisticList.length
      this.checkAll = this.logisticList.length === enabledArr.length
    }
  }
}
</script>

<style lang="scss" scoped>
.create-template {
  color: #f7622f;
  margin-left: 10px;
  cursor: pointer;
}
</style>
