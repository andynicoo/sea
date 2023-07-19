<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
    <a-form-item :label="this.$t('other.IllegalWords')">
      <!-- <a-input
        v-decorator="[
          'note',
          { rules: [{ required: true, message: 'Please input your note!' }] }
        ]"
      /> -->
      <a-textarea
        :placeholder="this.$t('other.IllegalWordsPlease')"
        :auto-size="{ minRows: current == null ? 3 : 1, maxRows: 5 }"
        v-decorator="[
          'content',
          {
            rules: [
              { required: true, message: this.$t('other.IllegalWordsPlease') }
            ]
          }
        ]"
      />
      <template v-if="current==null">
          {{$t('other.notice')}}
      </template>
    </a-form-item>
  </a-form>
</template>

<script>
import Basic from '@/api/basic'
export default {
  props: {
    current: { type: Object, default: () => ({}) },
    handleCancel: {
      type: Function,
      default: null
    },
    updataList: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      form: this.$form.createForm(this),
      valid: true,
      word: '',
      wordRules: [(v) => !!('' + v.trim()) || this.$t('other.IllNotNull')]
    }
  },
  mounted() {
    this.$props.current == null
      ? (this.$data.word = '')
      : (this.$data.word = this.$props.current.content)
    // console.log(this.$data.word)
    this.$nextTick(() => {
      this.$data.form.setFieldsValue({
        content: this.$data.word
      })
    })
  },
  methods: {
    // 添加、编辑提交
    submit(e) {
      // e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // this.confirmLoading = true
          if (this.$props.current == null) {
            // 新增
            Basic.addIllegalWord(values).then((res) => {
              if (res.code == 0) {
                this.handleCancel('appendVisible')
                this.updataList()
              }
            })
          } else {
            // 编辑
            const { violationLexiconId } = this.$props.current
            Basic.editIllegalWord({
              ...values,
              violationLexiconId
            })
              .then((res) => {
                if (res.code == 0) {
                  this.handleCancel('appendVisible')
                  this.updataList()
                }
              })
              .finally()
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
