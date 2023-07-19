import Package from '@/api/package'

/**
 *
 * @type {{data(): {provider: [], editVisible: boolean}, methods: {editModalShow(): void, editModalCancel(): void}, mounted()}}
 */
let editAnthorizationMixin = {
  data() {
    return {
      editVisible: false,
      provider: {},
      editType: 1
    }
  },
  mounted() {},

  methods: {
    /**
     * 关闭
     */
    editModalCancel() {
      this.provider = {}
      this.editVisible = false
    },
    /**
     * 打开
     */
    editModalShow() {
      this.editVisible = true
    }
  }
}

export { editAnthorizationMixin }
