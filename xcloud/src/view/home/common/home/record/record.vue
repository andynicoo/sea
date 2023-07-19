<template>
  <div class="r-main">
    <button @click="goPage(item)" class="record-item" :key="index" v-for="(item, index) in reacordList">{{ item.nav }}</button>
  </div>
</template>

<script>
import { getNavRecords } from '@/api/home/service.js';
export default {
  name: '',
  components: {},
  data() {
    return {
      reacordList: [],
    };
  },
  async created() {
    let { code, data } = await getNavRecords();
    this.reacordList = code == 0 ? data.filter(({ nav }) => !!nav) : [];
  },
  methods: {
    goPage(item) {
      const menuRecord = (this.$store.state.user.menus || []).find((v) => v.path == item.url) || {};
      if (this.$qkActions) {
        this.$qkActions.setGlobalState({
          menuRecord: menuRecord,
        });
      }
      this.$router.push({ path: item.url });
    },
  },
};
</script>

<style lang="scss" scoped>
.r-main {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  .record-item {
    max-width: 253px;
    min-width: 100px;
    height: 44px;
    background: #f5f8fb;
    border-radius: 0px 0px 0px 0px;
    opacity: 1;
    color: #333333;
    font-size: 12px;
    border: none;
    margin: 0px 20px 20px 0px;
  }
  .record-item:hover {
    background: #ebf5ff;
  }
}
</style>
