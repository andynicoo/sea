<!-- 新增 | 编辑 广告 -->
<template>
  <div class="template-form">
    <el-dialog :title="title" :visible.sync="dialogvisible" :width="dialogWidth" :before-close="handleClose">
      <el-row>
        <el-col :span="2">三级导航模板:</el-col>
        <el-col :span="20">
          <el-radio disabled v-model="modeuleRadio" :label="0">产品服务</el-radio>
          <el-radio disabled v-model="modeuleRadio" :label="1">优选服务</el-radio>
        </el-col>
      </el-row>
      <el-row>
        <el-tree :data="treeData" node-key="id" :props="defaultProps" ref="tree" draggable default-expand-all :allow-drop="allowDrop" :allow-drag="allowDrag" @node-click="handleNodeClick">
          <div class="custom-tree-node" slot-scope="{ node, data }">
            <el-form :model="data" :ref="'customTree' + data.id" class="custom-tree-node-item xxxxx">
              <el-form-item v-if="data.hierarchy == 1" prop="name" :rules="[{ required: true, message: '请输入子菜单分类名称', trigger: 'blur' }]">
                <el-row class="custom-tree-node-item-category">
                  <el-col :span="5">
                    <el-input v-model="data.name" placeholder="请输入子菜单分类名称"></el-input>
                  </el-col>
                  <el-col :span="15"></el-col>
                  <el-col :span="4">
                    <el-button type="text" size="mini" @click="() => removeItem(node, data)"> 删除 </el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <div v-else>
                <AddOrderItem :ref="data.id" class="custiom-addorderItem" :custiomWidth="modeuleRadio == 0 ? 'width:850px' : 'width:900px'" :type="modeuleRadio == 0 ? 1 : 2" v-model="data.orderNode" :value="data.orderNode" :serviceKey="node" addItemBtnName="+添加" @getOrderItem="getOrderItem" />
              </div>
            </el-form>
          </div>
        </el-tree>
      </el-row>
      <div class="add-click-tree-item">
        <el-link type="primary" @click="clickAddTreeItem()">+添加子菜单分类</el-link>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogvisible = false" size="small">取消</el-button>
        <el-button type="primary" size="small" @click="submit">确认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { navTertiaryHandle, getNavigationById } from '@/api/newApi/siteSettings/index.js';
import AddOrderItem from '../../../components/addOrderItem.vue';
import { setTreeLabel } from '@/view/module/siteSettings/libs/setttingLibs.js';
export default {
  props: {
    show: Boolean,
    title: {
      type: String,
      default: '',
    },

    dialogWidth: {
      type: String,
      default: '555px',
    },
  },
  data() {
    return {
      modeuleRadio: 0,
      treeData: [
        {
          hierarchy: 1,
          id: new Date().getTime(),
          name: '',
          children: [
            {
              id: new Date().getTime() + 100,
              hierarchy: 2,
              orderNode: [],
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        hierarchy: 'hierarchy',
      },
      value: '',
      num: 1,
      classificationName: '',
      treeID: this.$parent.treeID,
      detalis: null,
    };
  },
  created() {
    this.treeID && this.getNavigationByIdAPI();
  },

  components: {
    AddOrderItem,
  },
  computed: {
    dialogvisible: {
      get() {
        return this.show;
      },
      set(val) {
        this.$emit('update:show', val);
      },
    },
  },

  methods: {
    /**回显三级菜单 */
    async getNavigationByIdAPI() {
      let list = [];
      let { code, data } = await getNavigationById({ id: this.treeID });
      this.modeuleRadio = data.tertiaryType;
      /**回显表单第一层数据 */
      function setTreeData(index, name = '', orderNode) {
        orderNode = orderNode.map((item) => {
          item.label = item.tag == null ? '1' : item.tag == '热门' ? '2' : '3';
          item.countryCode = item.country;
          item.productId = item.id;
          return item;
        });
        let obj = {
          hierarchy: 1,
          id: new Date().getTime() + index,
          name,
          children: [
            {
              id: new Date().getTime() + index + 100,
              hierarchy: 2,
              orderNode: orderNode,
            },
          ],
        };
        return obj;
      }
      if (code == 0) {
        console.log(JSON.parse(data.jsonData));
        JSON.parse(data.jsonData).aggregates.forEach((item, index) => {
          list.push(setTreeData(index, item.name, item.items));
        });

        this.$set(this, 'treeData', list);
      }
    },

    /**更新二级菜单 */
    getOrderItem(orderNode) {
      this.treeData.forEach((element) => {
        let signIndex = element.children.findIndex((item) => item.id == orderNode.parentNode.data.id);
        if (element && signIndex != -1) element.children[signIndex].orderNode = orderNode.value;
      });
    },

    handleClose() {
      this.$emit('update:show', false);
      this.$Message.success('操作成功');
      this.$parent.getList();
    },

    clickAddTreeItem() {
      this.treeData.push({
        hierarchy: 1,
        id: new Date().getTime(),
        children: [
          {
            id: new Date().getTime() + 1,
            hierarchy: 2,
          },
        ],
      });
    },

    handleNodeClick(data) {},

    /**
     * 拖拽时判定目标节点能否被放置。type 参数有三种情况：'prev'、'inner' 和 'next'，分别表示放置在目标节点前、插入至目标节点和放置在目标节点后
     * @param {*} draggingNode
     * @param {*} dropNode
     * @param {*} type
     */
    allowDrop(draggingNode, dropNode, type) {
      return !!(dropNode.level == 1);
    },

    removeItem(node, data) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex((d) => d.id === data.id);
      children.splice(index, 1);
    },

    /**判断节点能否被拖拽 */
    allowDrag(draggingNode) {
      return !!(draggingNode.level === 1);
    },

    submit() {
      const self = this;
      let codeBoe = true;
      self.treeData.forEach((item) => {
        item.children.forEach((item) => {
          if (this.$refs[item.id]) {
            self.$refs[item.id].sumbit(async (value) => {
              let { valid } = value;
              codeBoe = valid;
            });
          }
        });
      });

      if (codeBoe) {
        self.treeData.forEach((item) => {
          item.children.forEach((item) => {
            if (this.$refs[item.id]) {
              self.$refs[item.id].sumbit(async (value) => {
                navTertiaryHandle({ aggregates: this.setParm() }, self.treeID);
              });
            }
          });
        });
        self.handleClose();
      }
    },

    setParm() {
      function setAggregates({ name, children } = {}) {
        const [orderList] = children.map((element) => element.orderNode);
        return {
          info: self.modeuleRadio,
          items: orderList.map((element) => {
            return setItemvalue(element);
          }),
          name: name,
        };
      }

      function setItemvalue(element) {
        return {
          country: element.countryCode || '',
          productId: element.productId || '',
          sort: element.sort || '',
          status: element.status || '',
          tag: setTreeLabel(element.label),
          info: element.info || '',
          picUrl: element.picUrl || '',
          platformName: element.platformName || '',
          sort: element.sort || '',
          url: element.url || '',
        };
      }
      const param = this.treeData.map((item) => setAggregates(item));
      return param;
    },
  },
};
</script>
<style lang="scss" scoped>
.tree-component-radio {
  padding-left: 25%;
}
.tree-component-checkbox-tips {
  font-family: 'ArialMT', 'Arial';
  font-weight: 400;
  font-style: normal;
  font-size: 13px;
  letter-spacing: normal;
  color: #b0b0b0;
  padding-left: 10px;
}
.custom-tree-node-item-category {
  // display: flex;
  // justify-content: space-between;
  width: 1250px;
}
/deep/.el-tree-node__content {
  height: auto !important;
  margin-top: 20px;
}
.add-click-tree-item {
  height: 30px;
  line-height: 30px;
  margin-top: 35px;
}
</style>
