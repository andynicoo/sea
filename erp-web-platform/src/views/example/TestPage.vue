<template>
  <div>
    <a-input-group compact>
      <a-input style="width: 50%" default-value="111" />
      <a-select default-value="XL">
        <a-select-option value="X">
          X
        </a-select-option>
        <a-select-option value="XL">
          XL
        </a-select-option>
      </a-select>
    </a-input-group>

    <a-select
      v-model="selectValue"
      mode="multiple"
      show-search
      style="width: 50%"
    >
      <div slot="dropdownRender" slot-scope="menu">
        <v-nodes :vnodes="menu" />
        <a-divider style="margin: 4px 0;" />
        <div
          style="padding: 4px 8px; cursor: pointer;"
          @mousedown="(e) => e.preventDefault()"
          @click="addItem"
        >
          <a-input v-if="editing" placeholder="Basic usage" />
          <div v-else><a-icon type="plus" /> Add item</div>
        </div>
      </div>
      <a-select-option v-for="item in items" :key="item" :value="item">
        {{ item }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
let index = 0
import { without, indexOf } from 'lodash'
export default {
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
    // MultSelect: () => import('@/components/MultSelect')
  },
  data: () => ({
    items: ['jack', 'lucy', 'Lilei', '1a', '2b', '3d', '4e', '5f', '1rr'],
    selectValue: ['lucy'],

    editing: false
  }),
  methods: {
    addItem() {
      console.log('addItem')
      // this.items.push(`New item ${index++}`)
      this.$data.editing = true
    },
    syncData(data) {
      console.log(data)
      this.$data.selectValue = data
    }
  }
}
</script>

<style lang="scss">
.me-select-input {
  position: relative;
  .input {
    border: 1px solid #d9d9d9;
    border-radius: 2px;
    line-height: 32px;
    height: 32px;
    cursor: pointer;
    background: #fff;
    &:focus {
      border: 1px solid $primaryColor;
    }
    ul {
      padding-left: 10px;
      li {
        position: relative;
        float: left;
        max-width: 99%;
        margin-right: 4px;
        padding: 0 10px 0 10px;
        overflow: hidden;
        color: rgba(0, 0, 0, 0.65);
        background-color: #fafafa;
        border: 1px solid #e8e8e8;
        border-radius: 2px;
        height: 24px;
        margin-top: 3px;
        line-height: 22px;
        span {
          transform: padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
    }
  }
}
.popoverbox {
  border: 1px solid #d9d9d9;
  background: #ffffff;
  border-radius: 3px;
  margin-top: 3px;
}
ul {
  padding-left: 0px;
}
li {
  padding: 8px 12px;
  font-size: 14px;
  line-height: 16px;
  color: #333;
  word-break: break-word;
  word-wrap: break-word;
  list-style: none;
  cursor: pointer;
  &:hover {
    color: #333;
    background-color: rgba(0, 0, 0, 0.04);
  }
  &.active {
    color: $primaryColor;
  }
}
.additem {
  border-top: 1px solid #e8e8e8;
  h3 {
    height: 35px;
    line-height: 35px;
    color: $linkColor;
  }
}
.ant-popover-inner-content {
  padding: 5px 10px !important;
}
.ant-popover-placement-bottom,
.ant-popover-placement-bottomLeft,
.ant-popover-placement-bottomRight {
  padding-top: 0px;
}
</style>
