<template>
  <div class="me-pa-2">
    <v-card>
      <v-card-text>
        <v-btn
          @click="
            appendVisible = true
            current = null
          "
          color="primary"
        >
          新增
        </v-btn>
      </v-card-text>
    </v-card>
    <v-card class="mt-2">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="desserts"
          hide-default-footer
          disable-sort
          item-key="id"
          :items-per-page="paginationData.size"
        >
          <template v-slot:[`item.options`]="{ item }">
            <a
              class="option-link"
              @click="
                appendVisible = true
                current = item
              "
            >
              编辑
            </a>
            <a class="option-link" @click="onDelete(item)"> 删除 </a>
          </template>
        </v-data-table>

        <Pagination
          :paginationData="paginationData"
          @change="changePage"
        ></Pagination>
      </v-card-text>
    </v-card>

    <v-dialog v-model="appendVisible" max-width="900">
      <AddEditIllegalWord
        v-if="appendVisible"
        :current="current"
        @cancel="
          appendVisible = false
          current = null
        "
        @ok="
          appendVisible = false
          current = null
          onReload()
        "
      />
    </v-dialog>
  </div>
</template>

<script>
import tableMixins from '@/mixins/tableMixins'
import Basic from '@/api/basic'
import AddEditIllegalWord from './components/AddEditIllegalWordbak'
export default {
  components: {
    AddEditIllegalWord
  },
  mixins: [tableMixins],
  data() {
    return {
      headers: [
        { text: '违规词', value: 'content' },
        { text: '添加时间', value: 'createTime', align: 'center' },
        { text: '更新时间', value: 'updateTime', align: 'center' },
        { text: '操作', value: 'options', align: 'center' }
      ],
      appendVisible: false
    }
  },
  methods: {
    getTableData() {
      return Basic.getIllegalWord(this.$data.paginationData)
    },
    onDelete({ violationLexiconId }) {
      this.$Modal.confirm({
        title: '提示',
        content: '确定要删除吗？',
        okText: '确认',
        onOk: async () => {
          await Basic.delIllegalWord({ violationLexiconId })
          this.$Message({
            type: 'success',
            content: '操作成功'
          })
          this.onReload()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
