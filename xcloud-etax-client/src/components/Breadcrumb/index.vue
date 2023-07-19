<template>
  <div class="breadit" v-if="breadlist.length">
    <Breadcrumb>
      <BreadcrumbItem v-for="(item, index) in breadlist" :key="index" :to="item.path">
        {{ item.name }}
      </BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<script>
export default {
  props: {},
  created() {
    // this.getBreadcrumb();
  },
  data() {
    return {
      breadlist: [],
    };
  },
  methods: {
    //面包屑 取到路由信息中的meta信息组成，排除原有的activePath，只处理'superior', 'name', 'next'，注意顺序
    getBreadcrumb() {
      let curRoute = this.$route;
      var curMate = [];
      Object.keys(curRoute.meta).map((item) => {
        var itemName = curRoute.meta[item];
        if (['superior', 'name', 'next'].includes(item)) {
          curMate.push({
            name: itemName,
            path: itemName === curRoute.name ? curRoute.path : curRoute.path,
          });
        }
      });
      this.breadlist = curMate;
    },
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    },
  },
};
</script>
<style lang="less" scoped>
&/deep/.ivu-breadcrumb > span:last-child {
  font-weight: 400;
}
.breadit {
  background: #ffffff;
  padding: 16px 25px;
  font-weight: 400;
  color: #919498;
}
</style>
