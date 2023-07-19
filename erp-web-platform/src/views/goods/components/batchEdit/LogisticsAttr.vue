<template>
  <a-spin :spinning="loading">
    <div class="logistics-attr-components">
      <a-row :gutter="[24, 24]">
        <a-col>
          <a-checkbox
            :indeterminate="isChooseAll === 'indeterminate'"
            :checked="isChooseAll === 'chooseAll'"
            @change="onChooseAll"
          >
            {{$t('batchEdit.all')}}
          </a-checkbox>
        </a-col>
      </a-row>
      <template v-if="attrList">
        <a-row
          :gutter="[24, 24]"
          v-for="attr in attrList"
          :key="attr.logisticId"
        >
          <a-col span="8">
            <a-checkbox v-model="attr.enabled" @change="onChange(attr)">
              {{ attr.logisticName }}
            </a-checkbox>
          </a-col>
          <a-col span="8">
            <div class="size-attr">
              <span v-if="attr.itemMaxDimension.length !== null">
                {{ attr.itemMaxDimension.length }}CM
              </span>
              <span v-if="attr.itemMaxDimension.width !== null">
                {{ attr.itemMaxDimension.width }}CM
              </span>
              <span v-if="attr.itemMaxDimension.height !== null">
                {{ attr.itemMaxDimension.height }}CM
              </span>
            </div>
          </a-col>
          <a-col span="8">
            <a-checkbox
              @change="onEnabledChange"
              :disabled="!attr.enabled"
              v-model="attr.isFree"
            >
              {{$t('batchEdit.isFreeShipping')}}
            </a-checkbox>
          </a-col>
        </a-row>
      </template>
    </div>
    <template v-if="errorMessage">
      <a-row :gutter="[24, 24]">
        <a-col>
          <p class="error-message">{{ errorMessage }}</p>
        </a-col>
      </a-row>
    </template>
  </a-spin>
</template>

<script>
import { mapState } from 'vuex'
// 物流属性
export default {
  props: {
    logistics: Array
  },
  data() {
    return {
      attrList: null,
      loading: false
    }
  },
  computed: {
    isChooseAll() {
      const { attrList } = this.$data
      if (!attrList || !attrList.length) return null
      const chooseAll = attrList.every(({ enabled }) => enabled)
      if (chooseAll) return 'chooseAll'
      const indeterminate = attrList.some(({ enabled }) => enabled)
      if (indeterminate) return 'indeterminate'
      return null
    },
    ...mapState({
      logisticsStore: (state) => state.product.logistics
    }),
    errorMessage() {
      const { attrList } = this.$data
      if (!attrList) return false
      const isErr = attrList.map(({ enabled }) => enabled).some(Boolean)
      return isErr ? false : this.$t('batchEdit.logisticsValid')
    }
  },
  watch: {
    logisticsStore() {
      this.initData()
    },
    logistics() {
      this.initData()
    }
  },
  async mounted() {
    this.initData()
  },
  methods: {
    validate() {
      return new Promise(async (resolve) => {
        if (!this.errorMessage) {
          resolve(true)
        } else {
          resolve(false)
        }
      })
    },
    initData() {
      if (!this.logisticsStore) return
      const data = JSON.parse(JSON.stringify(this.logisticsStore))
      const { logistics } = this.$props
      this.$data.attrList = data

      if (!logistics) {
        data.forEach((element) => {
          this.$set(element, 'enabled', false)
          this.$set(element, 'isFree', false)
        })
        this.onEnabledChange()
        return
      }

      data.forEach((element) => {
        let current
        if (logistics) {
          current = logistics.find((lg) => element.logisticId === lg.logisticId)
          this.$set(element, 'enabled', (current && current.enabled) || false)
          this.$set(element, 'isFree', (current && current.isFree) || false)
        }
      })
    },
    onChange(attr) {
      if (!attr.enabled) this.$set(attr, 'isFree', false)
      this.onEnabledChange()
    },
    onEnabledChange() {
      this.$nextTick(() => {
        this.$emit('change', this.$data.attrList)
      })
    },
    getAttr() {
      return this.$data.attrList
    },
    onChooseAll(event) {
      const value = event.target.checked
      this.$data.attrList.forEach((element) => {
        this.$set(element, 'enabled', value)
        if (!value) this.$set(element, 'isFree', false)
      })
      this.$nextTick(() => {
        this.$emit('change', this.$data.attrList)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.size-attr {
  display: flex;
  justify-content: space-around;
}
.error-message {
  font-size: 14px;
  line-height: 1.5;
  color: red;
}
</style>