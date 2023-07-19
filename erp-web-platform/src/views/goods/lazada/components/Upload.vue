<template>
  <a-spin class="me-ib" :spinning="loading">
    <a-icon slot="indicator" type="loading" style="font-size: 20px" spin />
    <div @click="onLoadImage" class="content me-ib">
      <img :src="value" v-if="value" />
      <a-icon type="plus" v-else />
    </div>
  </a-spin>
</template>

<script>
import { loadImage } from '@/util/document'
import Basic from '@/api/basic'

export default {
  props: {
    value: String
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    onLoadImage() {
      loadImage({}, async ([file]) => {
        const formData = new FormData()
        formData.append('file', file)
        var { data } = await Basic.handleUploadImages(formData)
        console.log(data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff;
  border: 1px solid #eeeeee;
  cursor: pointer;
}
</style>
