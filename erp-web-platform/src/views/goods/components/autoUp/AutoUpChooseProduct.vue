<template>
  <!-- 自动置顶设置选择产品 -->
  <div>
    <a-tabs :default-active-key="0">
      <a-tab-pane
        :tab="site.countryName"
        v-for="(site, index) in sites"
        :key="index"
      >
        <ChooseProductByStore
          @change="onChange"
          :disableds="disableds"
          :selected="selected"
          :code="site.countryCode"
          :siteName="site.countryName"
          :multiple="multiple"
          :listTitle="listTitle"
        />
      </a-tab-pane>
    </a-tabs>

    <p
      class="me-text-right"
      style="border-top: 1px solid #e8e8e8; padding-top: 20px"
    >
      <a-button type="primary" @click="$emit('ok')">确定</a-button>
    </p>
  </div>
</template>

<script>
import store from '@/api/store'
import ChooseProductByStore from '@/views/goods/components/autoUp/ChooseProductByStore'

export default {
  model: {
    prop: 'selected',
    event: 'input'
  },
  props: {
    listTitle: String,
    disableds: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    multiple: Number
  },
  components: { ChooseProductByStore },
  data() {
    return {
      sites: []
    }
  },
  mounted() {
    store.getAllSite().then((res) => {
      this.$data.sites = res.data
    })
  },
  methods: {
    onChange(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>