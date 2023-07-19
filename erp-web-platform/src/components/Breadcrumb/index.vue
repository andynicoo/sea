<template>
  <a-breadcrumb class="breadcrumb">
    <a-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
      <span v-if="index === breadList.length - 1 || !index">
        {{ item.title }}
      </span>
      <router-link v-else :to="item.path">{{ item.title }}</router-link>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
export default {
  props: {
    breadList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.breadcrumb {
  line-height: 30px;
  .breadcrumb-item {
    cursor: pointer;
  }
}
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}

.breadcrumb-enter,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}

.breadcrumb-move {
  transition: all 0.5s;
}

.breadcrumb-leave-active {
  position: absolute;
}
</style>
