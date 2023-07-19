<template>
  <div class="categroy">
    <a-cascader
      placeholder="请选择"
      :show-search="{ filter }"
      :value="value"
      :options="options"
      :disabled="disabled"
      @change="change"
      :getPopupContainer="(target) => target.parentNode"
      :fieldNames="{
        label: 'cnName',
        value: 'categoryId',
        children: 'children'
      }"
    />
    <a-button
      v-if="showRecomend"
      ref="reference"
      class="categroy-button"
      :loading="isLoading"
      @click.self="handleClick"
      >推荐类目</a-button
    >
    <transition :name="transition">
      <div v-show="visible" ref="popover" class="popover">
        <ul v-if="recommendList.length" class="options-content">
          <li
            class="options-content-item"
            :class="{ selected: isActive(item) }"
            v-for="item in recommendList"
            :key="item.id"
            @click="onSelect(item)"
          >
            <span style="width:80%">{{ item.value }}</span>
            <span class="me-status-skip">{{
              item.type == 1 ? '常用' : '推荐'
            }}</span>
            <!-- <a-icon v-if="isActive(item)" slot="prefix" type="check" /> -->
          </li>
        </ul>
        <a-empty v-else :image="simpleImage" />
      </div>
    </transition>
  </div>
</template>

<script>
import { Empty } from 'ant-design-vue'
import Goods from '@/api/goods'
export default {
  props: {
    value: {
      type: [Array, String, undefined, null]
    },
    options: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: 'fade-in-linear'
    },
    recommendList: {
      type: Array,
      default: () => []
    },
    search: {
      type: Function,
      default: async () => {}
    },
    showRecomend: {
      type: Boolean,
      default: true
    },
    shopId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      visible: false,
      isLoading: false,
      simpleImage: '',
      recommendVal: ''
    }
  },
  created() {
    this.simpleImage = Empty.PRESENTED_IMAGE_SIMPLE
  },
  mounted() {
    window.addEventListener('click', this.handleDocumentCLick)
    this.$watch('value', (val) => {
      if (val) {
        this.recommendVal = val.join()
      }
    })
  },
  destroyed() {
    window.removeEventListener('click', this.handleDocumentCLick)
  },
  methods: {
    change(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      const params = {
        shopId: this.shopId,
        categoryIds: val
      }
      Goods.chooseCategory(params).then((res) => {
        console.log(res)
      })
    },
    filter(inputValue, path) {
      return path.some(
        (option) =>
          option.cnName.toLowerCase().indexOf(inputValue.toLowerCase()) > -1
      )
    },
    handleDocumentCLick(e) {
      const popover = this.$refs.popover
      const reference = this.$refs.reference
      if (
        !this.$el ||
        popover?.contains(e.target) ||
        reference?.$el.contains(e.target)
      ) {
        return
      }
      this.visible = false
    },
    async handleClick() {
      this.isLoading = true
      this.$emit('update:recommendList', [])
      try {
        await this.search()
        this.visible = !this.visible
      } catch (error) {
        console.error(error)
      }
      this.isLoading = false
    },
    onSelect(val) {
      let value = val?.id.split(',') || []
      if (value.length) {
        value = value.map((item) => Number(item))
      }
      this.$emit('input', value)
      this.$emit('change', value)
      this.visible = false
      this.recommendVal = val?.id
      const params = {
        shopId: this.shopId,
        categoryIds: value
      }
      Goods.chooseCategory(params).then((res) => {
        console.log(res)
      })
    },
    isActive(item) {
      return item.id === this.recommendVal
    }
  }
}
</script>

<style lang="scss" scoped>
.categroy {
  position: relative;
}
.popover {
  position: absolute;
  width: 100%;
  background-color: #fff;
  z-index: 1;
  box-shadow: 0 1px 1px rgb(0 0 0 / 15%);
  border-radius: 4px;
}
.categroy-button {
  position: absolute;
  top: 4px;
  margin-left: 5px;
  border-radius: 4px;
}
.options-content {
  max-height: 205px;
  overflow-y: auto;
  padding: 12px 0;
  &-item {
    color: #333;
    line-height: 16px;
    font-size: 14px;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    &:hover {
      background-color: #fff6f0;
      cursor: pointer;
    }
  }
  .selected {
    color: $primaryColor;
  }
}
.fade-in-linear-enter-active,
.fade-in-linear-leave-active {
  transition: all 0.2s linear;
}
.fade-in-linear-enter,
.fade-in-linear-leave,
.fade-in-linear-leave-active {
  opacity: 0;
  transform: translateY(-10px);
}
.categroy {
  ::v-deep .ant-cascader-menu {
    height: 300px;
    .ant-cascader-menu-item {
      padding: 7px 24px 7px 12px;
    }
  }
}
</style>
