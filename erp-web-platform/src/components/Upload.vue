<template>
  <div v-show="value">
    <div class="upload-btn-box">
      <input
        ref="filElem"
        type="file"
        class="upload-file"
        @change="getFile()"
        :multiple="multiple"
      />
    </div>
  </div>
</template>

<script>
import Basic from '@/api/basic'
export default {
  data() {
    return {
      imgList: []
    }
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value: {
      handler(newVal) {
        if (newVal) {
          console.log(this.multiple)
          this.choiceImg()
        }
      }
    }
  },
  mounted() {},
  methods: {
    choiceImg() {
      this.$refs.filElem.dispatchEvent(new MouseEvent('click'))
      this.$emit('input', false)
      this.$refs.filElem.value = null
    },
    getFile() {
      const inputFiles = this.$refs.filElem.files
      this.handleUpload(inputFiles)
    },
    handleUpload(inputFiles) {
      let formData = new FormData()
      for (let i in inputFiles) {
        if (!isNaN(i)) {
          formData.append('file', inputFiles[i])
        }
      }
      Basic.handleUploadImages(formData).then(({ data }) => {
        this.$emit('on-success', data)
        this.$emit('input', false)
        this.$refs.filElem.value = null
      })
    }
  }
}
</script>

<style lang="scss">
.upload-btn-box {
  display: none;
}
</style>
