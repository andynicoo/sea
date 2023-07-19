<template>
  <div class="ant-modal-root">
    <div class="ant-modal-mask"></div>
    <div class="ant-modal-wrap">
      <div
        role="document"
        class="ant-modal"
        style="min-width: 50%; transform-origin: 102.5px 1059px; width:1024px;"
      >
        <div style="width: 0px; height: 0px; overflow: hidden"></div>
        <div class="ant-modal-content">
          <div class="ant-modal-body">
            <div class="source-image-choose-main" v-if="images.length">
              <div
                class="ant-row"
                style="margin-left: -12px; margin-right: -12px"
              >
                <div
                  class="ant-col ant-col-12"
                  style="padding-left: 12px; padding-right: 12px; text-align: center;"
                >
                  <img
                    :src="images[current]"
                    style="max-width:400px; max-height: 400px"
                  />
                </div>
                <div
                  class="ant-col ant-col-12"
                  style="padding-left: 12px; padding-right: 12px"
                >
                  <div class="image-list">
                    <div
                      @mouseover="current = index"
                      @click="onChoose(image, index)"
                      v-for="(image, index) in images"
                      class="image-item"
                      :style="{ backgroundImage: `url(${image})` }"
                      :key="index"
                    >
                      <div
                        class="disable"
                        v-if="originImages.includes(image)"
                      ></div>
                      <div
                        class="check-icon-box"
                        :class="{ active: selected[index] }"
                        v-if="!originImages.includes(image)"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              无可选图片
            </div>
          </div>
          <div class="ant-modal-footer">
            <div>
              <button @click="onCancel" type="button" class="ant-btn">
                <span>{{ options.$vv.$t('common.cancel') }}</span>
              </button>
              <button
                @click="onOk"
                type="button"
                class="ant-btn ant-btn-primary"
              >
                <span>{{ options.$vv.$t('common.ok') }}</span>
              </button>
            </div>
          </div>
        </div>
        <div
          tabindex="0"
          aria-hidden="true"
          style="width: 0px; height: 0px; overflow: hidden"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { compact } from 'lodash'
export default {
  data() {
    return {
      images: [],
      selected: [],
      options: {},
      current: 0,
      limit: 1,
      originImages: []
    }
  },
  methods: {
    onChoose(src, index) {
      const { selected, limit, options, originImages } = this.$data
      if (originImages.includes(src)) {
        return
      }
      const arr = compact(selected)
      if (selected[index]) {
        this.$set(selected, index, null)
      } else {
        if (arr.length >= limit) {
          this.$message.error(options.$vv.$t('edit.chooseImageError'))
          return
        }
        this.$set(selected, index, src)
      }
    },
    onCancel() {
      this.reject()
      document.body.removeChild(this.$el)
    },
    onOk() {
      let { selected } = this.$data
      selected = compact(selected)
      this.resolve(selected)
      document.body.removeChild(this.$el)
    }
  }
}
</script>

<style lang="scss" scoped>
.source-image-choose-main {
  .image-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 100px);
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    max-height: calc(100vh - 24px - 200px - 108px);
    overflow: auto;

    .image-item {
      height: 100px;
      background-position: center;
      background-size: cover;
      cursor: pointer;
      border: 2px solid rgba(0, 0, 0, 0);
      position: relative;
      .disable {
        position: absolute;
        width: 97px;
        height: 97px;
        background: #000;
        opacity: 0.4;
        z-index: 1000;
        cursor: no-drop;
      }
      .check-icon-box {
        z-index: 100;
        border: 2px solid rgba(0, 0, 0, 0.54);
        border-radius: 2px;
        position: absolute;
        right: 5px;
        bottom: 5px;
        width: 20px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        font-weight: 800;

        &.active {
          color: #f7622f;
          border: 2px solid #f7622f;
          &::before {
            content: '✓';
          }
        }
      }

      &:hover {
        border: 2px solid #ff8859;
      }
    }
  }
}
::v-deep.ant-modal-body {
  max-height: calc(100vh - 24px - 200px);
  overflow: auto;
}
</style>

<style lang="scss"></style>
