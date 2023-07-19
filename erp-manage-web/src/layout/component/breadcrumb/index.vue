<template>
  <a-breadcrumb class="breadcrumb">
    <!-- <transition-group name="breadcrumb"> -->
    <a-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
      <span v-if="index === levelList.length - 1 || !index">
        {{ item.meta.title }}
      </span>
      <router-link v-else :to="item.path">
        {{ item.meta.title }}
      </router-link>
    </a-breadcrumb-item>
    <!-- </transition-group> -->
  </a-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: []
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(
        (item) => item.meta?.title
      )
      this.levelList = matched.filter(
        (item) => item.meta?.breadcrumb !== false
      )
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLowerCase() === 'overview'
    }
  }
}
</script>

<style lang="less" scoped>
.breadcrumb{
  line-height: 64px;
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
