<template>
  <div class="pa-2">
    <v-card>
      <v-card-text>
        <v-row>
          <v-col md="3" offset="6" offset-md="7" offset-xl="8">
            <v-text-field v-model="name" label="模板名称">
              <template v-slot:append-outer>
                <v-btn small color="primary">搜索</v-btn>
              </template>
            </v-text-field>
          </v-col>
          <v-col md="2" xl="1" align-self="center">
            <v-btn
              @click="
                appendVisible = true
                current = null
              "
              block
              small
              color="success"
            >
              添加合同模板
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card class="mt-2">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="desserts"
          item-key="true"
          :loading="tableLoading"
          hide-default-footer
          disable-sort
        >
          <template v-slot:[`header.creation`]="">
            <p>创建人</p>
            <p>创建时间</p>
          </template>
          <template v-slot:[`header.update`]="">
            <p>更新人</p>
            <p>更新时间</p>
          </template>
          <template v-slot:[`item.options`]="{ item }">
            <v-btn @click="onEdit(item)" x-small color="success" text>
              编辑
            </v-btn>
            <v-btn @click="onDelete(item)" x-small color="error" text>
              删除
            </v-btn>
            <v-btn @click="onBind(item)" x-small color="info" text>
              关联供应商
            </v-btn>
          </template>
        </v-data-table>

        <Pagination
          :paginationData="paginationData"
          @change="changePage"
        ></Pagination>
      </v-card-text>
    </v-card>

    <v-dialog persistent v-model="appendVisible" max-width="1200">
      <AddEditContract
        v-if="appendVisible"
        :current="current"
        @cancel="
          appendVisible = false
          current = null
        "
        @ok="
          appendVisible = false
          current = null
          loadData()
        "
      />
    </v-dialog>
  </div>
</template>

<script>
/**
 * 主SKU
 */
import Product from '@/api/product'
import tableMixins from '@/mixins/tableMixins'
import AddEditContract from './components/AddEditContract'

export default {
  mixins: [tableMixins],
  components: {
    AddEditContract
  },
  data() {
    return {
      name: '',

      headers: [
        { text: '模板名称', value: 'name' },
        { text: '已关联供应商数', value: 'protein' },
        { text: '默认合同', value: 'default' },
        { text: '创建人\n创建时间', value: 'creation' },
        { text: '更新人\n更新时间', value: 'update' },
        { text: '操作', value: 'options' }
      ]
    }
  },
  methods: {
    getTableData() {
      return Product.getMasterSkuProduct({ name: this.$data.name })
    },
    /**
     * 编辑
     */
    onEdit(val) {
      this.$data.current = val
      this.$data.appendVisible = true
    },
    /**
     * 删除
     */
    onDelete() {},
    /**
     * 关联
     */
    onBind() {}
  }
}
</script>

<style lang="scss" scoped>
.col {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
