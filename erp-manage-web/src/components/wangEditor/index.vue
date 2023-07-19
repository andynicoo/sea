<template>
  <div id="wangEditor" />
</template>

<script>
import E from 'wangeditor'
import { uploadImg } from '@/api/uploadImgUrl'
export default {
  name: 'WangEditor',
  props: {
    value: {
      type: [String, undefined],
      default: ''
    }
  },
  data() {
    return {
      content: this.value
    }
  },
  watch: {
    value(val) {
      // 只在第一次有值才初始化赋值
      if (this.content) return
      this.editor.txt.html(val)
    }
  },
  mounted() {
    this.initEditor()
  },
  methods: {
    async initEditor() {
      const editor = new E('#wangEditor')
      this.editor = editor
      editor.config.onchange = this.onchange
      editor.config.zIndex = 0
      editor.config.height = 400
      editor.config.uploadFileName = 'file'
      editor.config.customUploadImg = this.uploadImg
      editor.config.customAlert = this.customAlert
      editor.create()
      if (this.content) this.editor.txt.html(this.content)
    },
    async uploadImg(resultFiles, insertImgFn) {
      try {
        const params = new FormData()
        params.append('file', resultFiles[0])
        const { data = [] } = await uploadImg(params)
        insertImgFn(data && data.join())
      } catch (error) {
        console.error(error)
      }
    },
    onchange(newHhtml) {
      this.content = newHhtml
      this.$emit('input', newHhtml)
      this.$emit('change', newHhtml)
    },
    customAlert(s, t) {
      switch (t) {
        case 'success':
          this.$message.success(s)
          break
        case 'info':
          this.$message.info(s)
          break
        case 'warning':
          this.$message.warning(s)
          break
        case 'error':
          this.$message.error(s)
          break
        default:
          this.$message.info(s)
          break
      }
    },
    clear() {
      this.editor && this.editor.text.clear()
    }
  }

}
</script>

<style lang="less">
#wangEditor{
img{
  max-width: 100%;
}
div[contenteditable]{
  word-break: break-all;
}
i{
  font-style: italic !important;
}
}
</style>
