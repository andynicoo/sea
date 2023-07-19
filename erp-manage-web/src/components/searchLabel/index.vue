<template>
  <div class="search-label">
    <a-row :gutter="gutter">
      <a-col v-for="(item, index) in labelItem" :key="item.label" :span="item.span">
        <div class="label-grounp">
          <div
            v-if="item.label"
            class="label"
            :style="{ width: labelWidth, 'min-width': labelMinWidth }"
            :class="labelClass"
          >
            {{ item.label }}
          </div>
          <slot
            :name="item.slotName"
            :record="data"
            :text="data[item.dataIndex]"
            :index="index"
          >
            <div v-if="!item.render" class="value">
              {{ data[item.dataIndex] || item.valeu }}
            </div>
            <RenderExpand
              v-if="item.render"
              :render="item.render"
              :record="data"
              :text="data[item.dataIndex]"
              :index="index"
            />
          </slot>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import RenderExpand from '../render'
export default {
  name: 'SearchLable',
  components: {
    RenderExpand
  },
  props: {
    labelItem: {
      type: Array,
      default: () => []
    },
    data: {
      type: Object,
      default: () => ({})
    },
    gutter: {
      type: Number,
      default: 16
    },
    labelAlign: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: String,
      default: ''
    },
    labelMinWidth: {
      type: String,
      default: ''
    }
  },
  computed: {
    labelClass({ labelAlign }) {
      console.log(labelAlign)
      return `${labelAlign}-label`
    }
  }
}
</script>

<style lang="less" scoped>
.search-label {
  .label-grounp {
    display: flex;
    margin-bottom: 24px;
    .label {
      position: relative;
      color: rgba(0, 0, 0, 0.6);
      white-space: nowrap;
      min-width: 60px;
      &.left-label {
        text-align: left;
      }
      &.right-label {
        text-align: right;
      }
      &::after {
        content: ":";
        position: relative;
        top: -0.5px;
        margin: 0 8px 0 2px;
      }
    }
  }
}
</style>
