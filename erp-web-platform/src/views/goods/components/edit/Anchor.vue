<template>
  <a-anchor
    ref="anchor"
    :targetOffset="130"
    wrapperClass="anchor-goods-edit"
    @click="handleClick"
  >
    <a-anchor-link
      v-for="(item, key) in anchorObj"
      :key="key"
      :href="item.href"
      :title="item.title"
    >
      <template v-if="item.error">
        <a-tooltip placement="left">
          <template v-if="item.errorList && item.errorList.length" #title>
            <div v-for="(it, ind) in item.errorList" :key="ind">{{ it }}</div>
          </template>
          <a-icon type="info-circle" class="error-icon me-ml-2" />
        </a-tooltip>
      </template>
    </a-anchor-link>
  </a-anchor>
</template>

<script>
import { debounce } from '@/util/index'
export default {
  props: {
    anchorObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    this.handleScroll = debounce(this.handleScroll, 100)
    return {}
  },
  mounted() {
    document.addEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleClick(e) {
      e.preventDefault()
    },
    handleScroll(e) {
      const scrollTop = document.documentElement.scrollTop
      const { scrollHeight, offsetHeight } = e.target.body
      if (scrollTop + offsetHeight > scrollHeight - 150) {
        console.log('最底')
        this.$refs.anchor.activeLink = '#extraInfoForm'
      }
    }
  },
  destroyed() {
    document.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style lang="scss" scoped>
::v-deep .anchor-goods-edit {
  position: fixed;
  top: 103px;
  left: calc((100vw - 1140px) / 2 + 1145px);
  background-color: unset;
}
@media screen and (max-width: 1366px) {
  ::v-deep .anchor-goods-edit {
    left: auto;
    right: 10px;
  }
}
::v-deep .ant-anchor-link {
  a {
    font-size: 18px;
    font-weight: bold;
  }
  display: flex;
  .error-icon {
    color: $primaryColor;
  }
  a:hover {
    color: $primaryColor;
  }
}
</style>
