<template>
  <a-modal
    v-model="visible"
    title="Modal"
    ok-text="确认"
    cancel-text="取消"
    @ok="hideModal"
  >
    <img :src="imgSrc" :class="imgClass" />
  </a-modal>
</template>

<script>
export default {
  name: 'showImg',
  props: {}
}
</script>

<style scoped></style>
