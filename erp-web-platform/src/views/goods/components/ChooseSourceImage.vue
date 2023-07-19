<template>
  <div class="source-image-choose-main">
    <a-row :gutter="24">
      <a-col :span="12">
        <img style="width: 100%" :src="sources[current]" />
      </a-col>
      <a-col :span="12">
        <div class="image-list">
          <div
            class="image-item"
            v-for="(image, index) in sources"
            @mouseover="current = index"
            @click="onChoose(image, index)"
            :style="{ backgroundImage: `url(${image})` }"
            :key="index"
          >
            <div
              class="check-icon-box"
              :class="{ active: chooses[index] }"
            ></div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { compact } from 'lodash'
export default {
  props: {
    sources: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      current: 0,
      chooses: []
    }
  },
  methods: {
    onChoose(src, index) {
      const { chooses } = this.$data
      const { limit } = this.$props
      const arr = compact(chooses)
      if (chooses[index]) {
        this.$set(chooses, index, null)
      } else {
        if (arr.length >= limit) {
          this.$message.error(this.$t('edit.chooseImageError'))
          return
        }
        this.$set(chooses, index, src)
      }
    },
    getSource() {
      const { chooses } = this.$data
      return compact(chooses)
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

    .image-item {
      height: 100px;
      background-position: center;
      background-size: cover;
      cursor: pointer;
      border: 2px solid rgba(0, 0, 0, 0);
      position: relative;

      .check-icon-box {
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
</style>