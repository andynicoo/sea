<template>
  <div>
    <a-tabs :active-key="activeKey" :animated="false" @change="onTabsChange">
      <a-tab-pane
        :tab="siteName[index] === null ? 'CNSC' : siteName[index]"
        v-for="(item, index) in siteName"
        :key="index"
      >
        <QuickSiteName
          :ref="`site-name-${index}`"
          :list="siteList[item]"
          :site="siteName[index]"
          @func="closeQuick"
          @funclose="closeQuickSetVis"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import { uniq, cloneDeep } from 'lodash'
import QuickSiteName from './QuickSiteName'
export default {
  components: {
    QuickSiteName
  },
  props: {
    list: {
      type: Array,
      defalut: []
    }
  },
  data() {
    return {
      siteName: [], // tab切换站点集合,
      siteList: {},
      activeKey: 0
    }
  },
  mounted() {
    this.$data.siteName = this.getGoodsSiteName()
    this.renderSiteList()

    this.onTabsChange(this.$data.activeKey)
  },
  methods: {
    getGoodsSiteName() {
      let siteArr = this.$props.list.map((ele) => ele.siteName)
      return uniq(siteArr)
    },
    renderSiteList() {
      return new Promise((resolve) => {
        const { activeKey, siteList } = this.$data
        const list = cloneDeep(this.$props.list)
        const siteName = this.getGoodsSiteName()
        const _siteName = siteName.map((name) => {
          const l = list.filter((element) => {
            return element.siteName === name
          })
          this.$set(siteList, name, l)
          return l
        })
        resolve(_siteName)
      })
    },
    onTabsChange(activeKey) {
      const oldActiveKey = this.$data.activeKey
      let oldComponents = this.$refs[`site-name-${oldActiveKey}`]
      if (oldComponents) {
        oldComponents = this.$refs[`site-name-${oldActiveKey}`][0]
      }
      if (oldComponents && oldComponents.onChange) {
        this.$confirm({
          title: this.$t('common.warn'),
          content: this.$t('toBeEdit.changeTabsWarning'),
          onOk: () => {
            this.$data.activeKey = activeKey
            this.renderSiteList().then((siteName) => {
              const [product] = siteName[activeKey]
              this.$store.dispatch('setTargetLangList', {
                currency: product.currency,
                countryCode: product.countryCode
              })
            })
          }
        })
      } else {
        this.$data.activeKey = activeKey
        this.renderSiteList().then((siteName) => {
          const [product] = siteName[activeKey]
          this.$store.dispatch('setTargetLangList', {
            currency: product.currency,
            countryCode: product.countryCode
          })
        })
      }
    },
    closeQuick(data) {
      this.$emit('func', data)
    },
    closeQuickSetVis(data) {
      this.$emit('funclose', data)
    }
  }
}
</script>
