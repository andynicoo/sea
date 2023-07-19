<template>
  <div>
    <!-- 自动置顶设置选择类目 -->
    <a-tabs :default-active-key="0">
      <a-tab-pane
        :tab="site.countryName"
        v-for="(site, index) in sites"
        :key="index"
      >
        <ChooseCategoryByStore
          :selected="selected"
          :code="site.countryCode"
          @change="onChange"
        />
      </a-tab-pane>
    </a-tabs>

    <p
      class="me-text-right"
      style="border-top: 1px solid #e8e8e8; padding-top: 20px"
    >
      <a-space>
        <a-button type="primary" @click="$emit('ok')">确定</a-button>
      </a-space>
    </p>
  </div>
</template>

<script>
import store from '@/api/store'
import ChooseCategoryByStore from '@/views/goods/components/autoUp/ChooseCategoryByStore'

export default {
  components: { ChooseCategoryByStore },
  model: {
    prop: 'selected',
    event: 'input'
  },
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      sites: []
    }
  },
  mounted() {
    store.getAllSite().then(({ data }) => {
      this.$data.sites = data
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