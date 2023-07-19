<template>
  <v-card>
    <v-card-title> 新增/编辑词库 </v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid">
        <v-textarea
          outlined
          label="违规词"
          v-model="word"
          :rules="wordRules"
          :hint="$t('other.notice')"
          persistent-hint
        ></v-textarea>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="primary" @click="onSubmit">提交</v-btn>
      <v-btn @click="$emit('cancel')">取消</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Basic from '@/api/basic'
export default {
  props: { current: { type: Object, default: () => ({}) } },
  data() {
    return {
      valid: true,
      word: '',
      wordRules: [(v) => !!('' + v.trim()) || '违规词不能为空']
    }
  },
  mounted() {
    this.$data.word = this.$props.current.content
  },
  methods: {
    async onSubmit() {
      if (!this.$refs.form.validate()) return
      if (this.$props.current) {
        const { violationLexiconId } = this.$props.current
        await Basic.editIllegalWord({
          content: this.$data.word,
          violationLexiconId
        })
      } else {
        await Basic.addIllegalWord({ content: this.$data.word })
      }
      this.$emit('ok')
    }
  }
}
</script>

<style lang="scss" scoped></style>
