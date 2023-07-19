<template>
  <div style="width: 90vw; text-align: center;">
    <a-spin :spinning="loading"></a-spin>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true
    }
  },
  mounted() {
    this.$router.go(-1)
  }
}
</script>
