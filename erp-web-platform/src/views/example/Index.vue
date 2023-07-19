<template>
  <v-container grid-list-xs>
    <v-row align="center" justify="space-around">
      <v-btn color="primary">
        按钮 primary
      </v-btn>
      <v-btn color="error">按钮 error</v-btn>
      <v-btn color="success">按钮 success</v-btn>
      <v-btn color="secondary">按钮 secondary</v-btn>
      <v-btn color="accent">按钮 accent</v-btn>
      <v-btn color="info">按钮 info</v-btn>
      <v-btn color="warning">按钮 warning</v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      visible: true
    }
  },
  mounted() {
    this.$Modal.confirm({
      title: '警告',
      content: '询问内容',
      okText: '保存',
      onOk: () => {
        this.$Message({ content: '你点了保存' })
      },
      onCancel: () => {
        this.$Message({ type: 'error', content: '你点了取消' })
      }
    })
    // this.confirmModal('sisi', this, (self) => {
    //   self.dump()
    // })
    // this.$Modal.confirm({
    //   render: (h) => {
    //     return h('div', {}, 'aaaa')
    //   }
    // })
    this.$Message({ type: 'error', content: 'aaa', duration: 0 })
  },
  methods: {
    dump() {
      console.log('啊哈哈哈')
    }
  }
}
</script>

<style lang="scss" scoped></style>
