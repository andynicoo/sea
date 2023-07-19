<template>
  <a-modal
    :visible="value"
    :bodyStyle="bodyStyle"
    @cancel="cancel"
    :width="840"
  >
    <div class="title">{{ title }}</div>
    <div class="content" v-html="content"></div>
    <template #footer>
      <a-button @click="cancel" type="primary">确定</a-button>
    </template>
  </a-modal>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      defautl: false
    },
    content: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      bodyStyle: {
        'max-height': 'calc(100vh - 224px)',
        'min-height': '260px',
        overflow: 'auto'
      }
    }
  },
  methods: {
    cancel() {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  font-size: 23px;
  font-weight: 600;
  color: #262424;
  text-align: center;
  margin-bottom: 43px;
}
</style>
