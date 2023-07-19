<template>
  <el-dialog title="选择商品" :visible.sync="dialogvisible" width="800px" center @close="reset" destroy-on-close>
    <el-form :model="form" inline ref="form">
      <!-- <el-form-item prop="productName" label="商品名称:">
        <el-input v-model="form.productName" placeholder="请输入商品名称" clearable style="width: 200px" />
      </el-form-item> -->
      <el-form-item prop="productCategoryId" label="商品分类:">
        <!-- <el-cascader ref="cascader" v-model="form.productCategoryId" :key="isResouceShow" :props="{ expandTrigger: 'hover',emitPath: true,multiple: true,checkStrictly: true }" :options="options" popper-class="my-cascader-class" collapse-tags clearable filterable style="width: 398px" v-if="options.length > 0"> </el-cascader> -->
        <div style="width: 550px">
          <cascaderMulti :data="options" multiple filterable v-model="checkList"></cascaderMulti>
        </div>
      </el-form-item>
      <el-button type="primary" @click="addGoodsButton">新增商品</el-button>
    </el-form>
    <el-table :data="productData" ref="multipleTable" border v-loading="listLoading" @selection-change="handleSelectionChange" @select="selectRow" @select-all="selectAll" :height="450">
      <Empty slot="empty" />
      <el-table-column type="selection" :selectable="selectable"></el-table-column>
      <el-table-column align="center" label="商品信息" width="200px">
        <template slot-scope="scope">
          <div class="goods-info-wrapper">
            <el-image class="goods-img" style="width: 48px; height: 33px" :src="scope.row.productImagePc" :preview-src-list="[scope.row.productImagePc]">
              <div slot="error" class="image-slot">
                <img src="@/assets/images/infoDetail/default.png" alt="" />
              </div>
            </el-image>
            <div class="goods-name">
              <div>{{ scope.row.productName }}</div>
              <el-tag type="info">{{ scope.row | filterCombination }}</el-tag>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品分类">
        <template slot-scope="scope">{{ scope.row.productCategoryName }}</template>
      </el-table-column>
      <el-table-column align="center" label="销售价" prop="basePrice" width="100px">
        <template slot-scope="scope">{{ getServicePrice(scope.row) }}</template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- <div class="pagination-container">
      <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50, 100]" :page-size="form.size" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
    </div> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogvisible = false" size="small">取消</el-button>
      <el-button type="primary" size="small" @click="submit">确认</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getProductList, getProductCategory } from '@/api/newApi/servicemerchant/serviceMerchant.js';
import { categoryList } from '@/api/newApi/channelGoods/channel';
export default {
  props: {
    addGoodsDialog: Boolean,
    tableData: {
      type: Array,
      default() {
        return [];
      },
    },
    limit: {
      type: Number,
      default: -1,
    },
    clientList: {
      type: Array,
      default() {
        return ['PC', 'H5', 'APPLET'];
      },
    },
  },
  data() {
    return {
      form: {
        size: 30,
        current: 1,
        productName: '',
        productCategoryId: '',
        productStatus: 'PENDED_PUBLISH',
      },
      isResouceShow: 0,
      serviceCascaderProps: {
        expandTrigger: 'hover',
        emitPath: true,
        multiple: true,
        checkStrictly: true,
      },
      options: [],
      checkList: [],
      //商品服务名称列表
      serviceList: [],
      listTotal: 0,
      listLoading: false,
      productData: [],
      serviceCascader: [],
      selected: [],
      selectedAllList: [],
      configTips: '',
    };
  },
  filters: {
    filterCombination(row) {
      if (row.isCombinationProduct === 'IS_COMBINATION_PRODUCT') {
        return '组合商品';
      } else if (row.productSpecsDTOList.length > 1) {
        return '多规格';
      } else {
        return '单规格';
      }
    },
  },
  computed: {
    dialogvisible: {
      get() {
        return this.addGoodsDialog;
      },
      set(val) {
        this.$emit('update:addGoodsDialog', val);
      },
    },
  },
  mounted() {
    // this._getallcategory();
    this.getCategoryList();
    //this.noReloaded()
    // this._getServiceMerchantList();
  },
  methods: {
    // noReloaded() {
    //   if (location.href.indexOf("#reloaded") == -1) {
    //     location.href = location.href + "#reloaded";
    //     window.location.reload();
    //   }
    // },
    // 获取所有商品类目和属性，级联选择器分类数据
    _getallcategory() {
      categoryList({ status: 'ENABLE' }).then((res) => {
        if (res.code == 0) {
          this.serviceCascader = res.data.records;
        }
      });
    },
    // 获取表数据
    _getServiceMerchantList() {
      this.listLoading = true;
      getProductList(this.form)
        .then((res) => {
          if (res.code == 0) {
            this.productData = res.data.records;
            this.listTotal = Number(res.data.total);

            // 切换分页时调用，合并选中的数据
            this.selectedAllList = this.selectedAllList.concat(this.selected);
            this.$nextTick(() => {
              this.toggleSelection();
            });
          }
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    // 分页保留选择的数据
    toggleSelection() {
      this.selectedAllList.forEach((row) => {
        let item = this.productData.find((p) => p.id == row.id);
        if (item) {
          this.$refs.multipleTable.toggleRowSelection(item, true);
        }
      });
    },
    // 禁用已选择的商品
    selectable(row, index) {
      // 如果已选择的数据中有当前行的数据，则禁用当前行（商品数据中id为productId，活动商品中id为productInfoId）
      if (this.tableData.some((el) => el.id == row.id || el.productInfoId == row.id)) {
        return false;
      } else {
        return true;
      }
    },
    // 选择的商品数据
    handleSelectionChange(selection) {
      this.selected = selection;
    },
    // 全选后切换分页取消全选排除以取消的数据
    selectAll(selection) {
      if (selection.length == 0) {
        this.selectedAllList = this.selectedAllList.filter((item) => {
          return !this.productData.some((el) => el.id == item.id);
        });
      }
    },
    // 切换分页后排除单选取消的数据
    selectRow(selection, row) {
      this.selected = selection;
      // 是否选中
      let isCheck = selection.find((item) => item.id === row.id);
      if (!isCheck) {
        this.selectedAllList = this.selectedAllList.filter((item) => item.id !== row.id);
      }
    },
    // 确认选择的商品
    submit() {
      // 合并所有选择数据并去重
      this.selectedAllList = this.selectedAllList.concat(this.selected).filter((item, index, arr) => arr.findIndex((el) => el.id == item.id) == index);
      if (this.limit !== -1) {
        if (this.selectedAllList.length === 0) {
          this.$message.warning(`请选择商品`);
          return;
        }
        if (this.selectedAllList.length > this.limit) {
          this.$message.warning(`最多选择${this.limit}个商品`);
          return;
        }
      }
      this.$emit('selectProduct', this.selectedAllList);
    },
    getServicePrice(row) {
      row.salePrice = row.productSpecsDTOList.length ? row.productSpecsDTOList.map((item) => item.servicePrice - 0).sort((a, b) => a - b)[0] : 0;
      return row.salePrice;
    },
    // 重置
    reset() {
      if (this.$refs.form) {
        this.selectedAllList = [];
        this.selected = [];
        this.$refs.form.resetFields();
      }
    },
    changePageNo(val) {
      this.form.current = val;
      this._getServiceMerchantList();
    },
    changePageSize(val) {
      this.form.size = val;
      this._getServiceMerchantList();
    },
    // 获取商品分类
    getCategoryList() {
      return new Promise((resolve) => {
        getProductCategory({
          size: -1,
          status: 'ENABLE',
        }).then((res) => {
          let data = res.data.records;
          data.forEach((item) => {
            item.label = item.categoryName;
            item.value = item.id;
          });
          this.categoryList = data;
          this.getOptions();
          // if (this.isEdit) {
          //   this.categoryList.forEach((item) => {
          //     this.options.push({
          //       value: item.id,
          //       label: item.categoryName,
          //       children: this.serviceList[item.id],
          //     });
          //   });
          // }
          resolve();
        });
      });
    },
    getOptions() {
      let list = this.categoryList.map((item) => this.getProductInfoList({ productCategoryId: item.id }));
      const p = Promise.all(list);
      p.then((res) => {
        this.options = this.categoryList.map((item, index) => ({
          ...item,
          label: item.categoryName,
          value: item.id,
          children: res[index].length ? res[index] : undefined,
        }));
        this.isResouceShow++;
      });
    },
    // 获取商品信息
    getProductInfoList({ productCategoryId }) {
      return new Promise((resolve) => {
        getProductList({
          size: -1,
          productStatus: 'PENDED_PUBLISH', // 上架商品
          productCategoryId,
          clientList: this.clientList,
        }).then((res) => {
          let data = res.data.records;
          data.forEach((item) => {
            item.label = item.productName;
            item.value = item.id;
            if (this.isCombinationProduct(item.isCombinationProduct)) {
              // item.children = item.productInfoDTOList.map((p) => ({
              //   // ...p,
              //   label: p.productName,
              //   value: p.id,
              //   leaf: true,
              // }));
            } else if (item.productSpecsDTOList && item.productSpecsDTOList.length) {
              item.children = item.productSpecsDTOList.map((p) => ({
                // ...p,
                label: p.specsName,
                value: p.id,
              }));
            }
          });
          this.serviceList[productCategoryId] = data;
          resolve(data);
        });
      });
    },
    isCombinationProduct(value) {
      return value === 'IS_COMBINATION_PRODUCT';
    },
    addGoodsButton() {
      let arry1 = [];
      this.options.forEach((item) => {
        if (item.children) {
          arry1.push.apply(arry1, item.children);
        }
      });
      let selectArry = [];
      arry1.forEach((item) => {
        if (this.checkList.indexOf(item.id) > -1) {
          let newObj = JSON.parse(JSON.stringify(item));
          if (item.isCombinationProduct == 'IS_COMBINATION_PRODUCT') {
            selectArry.push(newObj);
          } else {
            let arry = this.getproductSpecsDTOList(item.productSpecsDTOList, this.checkList);
            newObj.productSpecsDTOList = this.getproductSpecsDTOList(item.productSpecsDTOList, this.checkList);
            if (arry.length > 0) {
              selectArry.push(newObj);
            }
          }
        }
      });
      this.productData.push.apply(this.productData, selectArry);
    },
    getproductSpecsDTOList(row, children) {
      let arry = [];
      row.forEach((item) => {
        if (children.indexOf(item.id) > -1) {
          arry.push(item);
        }
      });
      return arry;
    },
  },
};
</script>

<style scoped lang="scss">
.pagination-container {
  margin-top: 20px;
  text-align: right;
}
.goods-info-wrapper {
  display: flex;
  align-items: center;
  .goods-img {
    flex: 0 0 48px;
    margin-right: 20px;
  }
  .goods-name {
    text-align: left;
  }
}
/deep/.cascader-multi {
  .ivu-cascader-menu {
    width: 250px;
  }
}
</style>
