<template>
  <ComputedPage />
</template>

<script>
import ComputedPage from '@/views/home/computeTax/index.vue';
export default {
  components: {
    ComputedPage,
  },
  beforeRouteEnter(to, from, next) {
    if (['/declareSuccess', '/taxFinishSuccess'].includes(from.path)) {
      sessionStorage.setItem('getDeclareData', true);
    } else {
      sessionStorage.removeItem('getDeclareData');
      sessionStorage.removeItem('declareData');
    }
    next();
  },
};
</script>

<style></style>
