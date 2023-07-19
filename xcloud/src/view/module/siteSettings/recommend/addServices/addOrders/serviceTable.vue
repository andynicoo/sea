<!-- 网站首页-编辑-服务商品 -->
<template>
  <div>
    <AddServiceTable ref="serviceTable" :key="serviceKey" :tableData="tableData" @getOrderItem="getOrderItem" :value="serviceTable" />
    <span class="footer">
      <el-button size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="serviceSumbit">确认</el-button>
    </span>
  </div>
</template>

<script>
import AddServiceTable from '../../../components/addOrderItem.vue';
import { addServiceProduct, getIndexRemcommendById, addIndexRemcommend } from '@/api/newApi/siteSettings/index.js';
import { setTreeLabel } from '@/view/module/siteSettings/libs/setttingLibs.js';
export default {
  inject: ['highest', 'closeService', 'serviceCategory'],
  data() {
    return {
      tableData: this.setTableData(),
      serviceTable: [],
      serviceKey: new Date().getTime(),
    };
  },

  components: {
    AddServiceTable,
  },

  created() {
    this.isEdit();
  },

  methods: {
    /**回显 */
    isEdit() {
      const self = this;
      !this.highest.isAdd && getIndexRemcommendByIdAPI();
      /**回显 */
      async function getIndexRemcommendByIdAPI() {
        let { code, data } = await getIndexRemcommendById({ id: self.highest.editId });
        if (code == 0) {
          let orderTableDataList = data[0].productVOList.map((item) => {
            item.label = String(item.label).length == 0 ? '不使用标签' : item.label;
            item.countryCode = item.countryName;
            return item;
          });

          self.$set(self, 'serviceTable', orderTableDataList);
          self.serviceKey = new Date().getTime();
        }
      }
    },

    setTableData() {
      let inlineBlock = { display: 'inline-block' };
      return [
        { label: '*选择国家', style: { width: '142px', ...inlineBlock } },
        { label: '*选择服务商品', style: { width: '283px', ...inlineBlock } },
        { label: '排序', style: { width: '140px', ...inlineBlock } },
        { label: '*标签', style: { width: '148px', ...inlineBlock } },
      ];
    },

    /**事件点击 */
    serviceSumbit() {
      const self = this;
      function setParams(data) {
        let list = data.map((element) => {
          element.label = setTreeLabel(element.label);
          element.serviceRecommendId = self.highest.editId;
          element.countryName = element.countryCode;
          return element;
        });

        return list;
      }

      self.$refs['serviceTable'].sumbit((val) => {
        const servicetype = self.serviceCategory.serviceCategory;
        if (val.valid) {
          if (!self.highest.isAdd) {
            //不是编辑
            addServiceProductAPi({ productList: setParams([...self.serviceTable]) });
          } else {
            //编辑
            servicetype.$refs['form'].validate((valid) => {
              !valid ? self.$message.success('请先填写服务分类') : addServcieOrder(servicetype, val);
            });
          }
        }
      });

      /**
       * 新增首页服务
       * @param {*} servicetype
       * @param {*} orderFromData 商品表单数据
       */
      function addServcieOrder(servicetype, orderFromData) {
        let params = JSON.parse(JSON.stringify(servicetype.form));
        params.status = params.status == true ? 1 : 2;
        params.productList = self.setParams(orderFromData.orderTableDataList);
        addIndexRemcommendAPI(params);
      }
      /***添加 服务 */
      async function addIndexRemcommendAPI(params) {
        let { code } = await addIndexRemcommend(params);
        if (code == 0) {
          self.$message.success('添加成功');
          self.close();
        }
      }

      async function addServiceProductAPi(params) {
        let { code } = await addServiceProduct(params);
        if (code == 0) {
          self.$message.success('添加成功');
          self.close();
        }
      }
    },

    close() {
      this.closeService();
      this.highest.getList();
    },

    /**双向绑定*/
    getOrderItem(value) {
      this.serviceTable = value.from.orderTableDataList;
    },
  },
};
</script>
<style lang="less" scoped>
.template-form {
  width: 380px;
}
.footer {
  float: right;
}
</style>
