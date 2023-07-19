<template>
  <div class="w-table-container">
    <table width="100%" class="table-sticky w-table-main">
      <thead class="scroll-table-head">
        <tr>
          <td
            v-for="item in columns"
            :key="item.key"
            :width="item.width || 120"
            :class="{
              'flex-left': item.fixed === 'left',
              'flex-right': item.fixed === 'right'
            }"
          >
            <slot :name="`head.${item.dataIndex}`" :item="item">
              {{ item.title }}
            </slot>
          </td>
        </tr>
      </thead>
    </table>
    <table width="100%" class="w-table-main" style="margin-top: -32px">
      <thead class="scroll-table-head">
        <tr>
          <td
            v-for="item in columns"
            :key="item.key"
            :width="item.width || 120"
            :class="{
              'flex-left': item.fixed === 'left',
              'flex-right': item.fixed === 'right'
            }"
          ></td>
        </tr>
      </thead>
      <tbody class="scroll-table-body">
        <template v-if="dataSource">
          <template v-if="dataSource.length">
            <template v-for="(data, index) in dataSource">
              <tr :key="'before' + index">
                <!-- 插槽 -->
                <slot
                  name="before.item"
                  :item="data"
                  :id="`data-item-${data[indexKey]}`"
                  :index="indexKey"
                ></slot>
              </tr>
              <tr
                :ref="`data-item-${data[indexKey]}`"
                :key="'item' + index"
                :id="`data-item-${data[indexKey]}`"
              >
                <td
                  :valign="valign"
                  v-for="column in columns"
                  :key="column.key"
                  :width="column.width || 120"
                  :colspan="column.colspan"
                  :style="column.colspan ? 'padding: 0' : ''"
                  :class="{
                    'flex-left': column.fixed === 'left',
                    'flex-right': column.fixed === 'right'
                  }"
                >
                  <!-- 插槽 -->
                  <slot
                    :name="`item.${column.dataIndex}`"
                    :item="data"
                    :index="index"
                    :id="`data-item-${data[indexKey]}`"
                  >
                    {{ data[column.dataIndex] }}
                  </slot>
                </td>
              </tr>
              <tr :key="'after' + index">
                <!-- 插槽 -->
                <slot
                  name="after.item"
                  :item="data"
                  :id="`data-item-${data[indexKey]}`"
                  :index="indexKey"
                ></slot>
              </tr>
            </template>
          </template>
        </template>
        <template v-else>
          <tr>
            <td :colspan="columns.length">
              <slot name="loading">
                <p class="pa-5 text-center">{{ $t('copy.loading') }}</p>
              </slot>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <template v-if="!dataSource.length">
      <slot name="empty-data">
        <div style="width: 100%; position: sticky; left: 0">
          <div class="empty-data"></div>
        </div>
      </slot>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    valign: {
      type: String,
      default: 'center'
    },
    columns: {
      type: Array,
      default: () => []
    },
    indexKey: String,
    maxHeight: {
      type: [Number, Boolean],
      default: 0
    },
    dataSource: Array
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.w-table-container {
  width: 100%;
  margin: 0 auto;
  overflow-x: scroll;
  overflow-y: scroll;
  color: #303031;

  .w-table-main {
    min-width: 100%;
    table-layout: fixed;

    thead {
      tr {
        td {
          white-space: nowrap;
          background-color: #f6f6f6;
        }
      }
    }

    tr {
      td {
        position: relative;
        padding: 16px;
        overflow-wrap: break-word;
        box-sizing: border-box;
        background-color: #ffffff;
        border-bottom: 1px solid #f4f4f4;

        &.flex-left {
          position: sticky;
          left: 0px;
          z-index: 4;
        }

        &.flex-right {
          position: sticky;
          right: 0;
          z-index: 4;
        }
      }
    }
  }
}

.scroll-table-head {
}
.scroll-table-body {
}

.table-sticky {
  position: sticky;
  top: 0;
  z-index: 5;
}
</style>