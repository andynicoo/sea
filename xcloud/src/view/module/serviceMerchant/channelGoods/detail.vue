<template>
  <div id="merchantDetailContent" class="app-container">
    <div class="header-conteiner">
      <el-row class="header">
        <el-link :underline="false" type="info" @click="goBack">
          <i class="el-icon-arrow-left"></i>返回列表
          <!-- <span class="state">{{ getStatus(publishFormData.baseForm.state) }}</span> -->
        </el-link>
      </el-row>
    </div>
    <div class="content-container">
      <div class="sider">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{ categoryName }}</el-checkbox>
        <div style="margin: 15px 0"></div>
        <el-checkbox-group style="margin-left: 20px" v-model="checkedList" @change="handleCheckedChange">
          <el-checkbox style="width: 100px" v-for="(item, index) in servicesList" :label="item.id" :key="index">{{ item.categoryName }}</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="content">
        <div class="top-table">
          <!-- 表格 -->
          <div class="table-container">
            <el-table :data="formatList" v-loading="listLoading" :span-method="objectSpanMethod" element-loading-spinner="icon loading" element-loading-text="拼命加载中" highlight-current-row border :height="height" ref="table" @selection-change="handleSelectionChange" @select="select">
              <el-table-column type="selection" width="50" prop="selection"></el-table-column>
              <Empty slot="empty" />
              <el-table-column align="center" label="商品图片" prop="productImagePc">
                <template slot-scope="{ row }">
                  <img width="90px" height="67px" :src="row.productImageMarketing || row.productImagePc" alt="" />
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品名称" prop="productName">
                <template slot-scope="{ row }">
                  {{ row.productName }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="商品规格" prop="specsName">
                <template slot-scope="{ row }">
                  {{ row.specsName }}
                </template>
              </el-table-column>
              <el-table-column align="center" label="价格" width="150" prop="servicePrice">
                <template slot-scope="{ row }"
                  ><span style="color: #333; font-size: 16px; font-weight: 500">￥{{ row.servicePrice }}</span></template
                >
              </el-table-column>
              <el-table-column align="center" label="秒杀价格" width="250" prop="editPrice">
                <template slot-scope="{ row }">
                  <el-input v-model="row.editPrice" type="number" clearable placeholder=""></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <!-- <div class="pagination-container">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="listQuery.pageNo"
                        :page-sizes="[10, 20, 30, 50]"
                        :page-size="listQuery.pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="listTotal"
                    ></el-pagination>
                    </div> -->
        </div>
        <div class="operation">
          <div class="title">批量编辑方式</div>
          <div class="methodsBox">
            <el-form ref="methodsForm" :model="methodsForm" inline label-width="100px">
              <div class="methods">
                <div class="left">
                  <el-form-item label="">
                    <el-radio-group v-model="methodsForm.methods" class="radioww" @change="methodChange">
                      <el-radio :label="1" class="raidn">方式一</el-radio>
                      <el-radio :label="2">方式二</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </div>
                <div class="right">
                  <el-form-item label="销售价 X"> <el-input type="number" v-model="methodsForm.sealPricePersent" placeholder="请输入" clearable style="width: 168px" /> % </el-form-item>
                  <el-form-item label="价格调整" style="width: 500px">
                    <el-radio-group v-model="methodsForm.adjust">
                      <el-radio :label="1">四舍五入</el-radio>
                      <el-radio :label="2">向上取整</el-radio>
                      <el-radio :label="3">向下取整</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="价格尾数">
                    <el-input type="number" v-model="methodsForm.mantissa" placeholder="请输入" clearable style="width: 168px" />
                  </el-form-item>
                  <el-form-item label="使用新值">
                    <el-input type="number" v-model="methodsForm.newPrice" placeholder="请输入" clearable style="width: 168px" />
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <div class="btns">
          <el-button type="primary" @click="preview">预览</el-button>
          <el-button type="success" @click="submit" v-show="hasAuthority('D1_31')">提交</el-button>
          <el-button @click="goBack">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getuserGoods, addEditorUser, categoryList, getproductInfoList } from '@/api/newApi/channelGoods/channel';
export default {
  data() {
    return {
      id: this.$route.query.id || 0,
      listLoading: false,
      list: [],
      list2: [],
      productList: [],
      formatList: [],
      listTotal: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
      },
      checkAll: false,
      checkedList: [],
      servicesList: [],
      isIndeterminate: false,
      tableHeight: '500px',
      categoryName: '',
      selectList: [],
      serviceOptions: [],
      methodsForm: {
        methods: 1,
        sealPricePersent: '',
        adjust: 1,
        mantissa: '',
        newPrice: '',
      },
      choseAllList: [],
      listParams: {
        current: 1,
        size: -1,
        status: 1,
        subProductCategoryIds: [],
        applySit: 1,
      },
      userGoods: [],
      height: '525px',
      sideAllList: [],
    };
  },
  created() {
    let width = document.documentElement.clientWidth;
    if (width > 1440) {
      this.height = '525px';
    } else {
      this.height = '414px';
    }
    this.servicesList = this.serviceOptions;
    this.init();
  },
  watch: {
    checkedList(newValue, oldValue) {
      if (!newValue.length) {
        this.list = [];
        this.list2 = [];
        this.formatList = [];
        this.selectList = [];
        this.listLoading = false;
        return false;
      }
      this.listParams.subProductCategoryIds = newValue;
      this.getProductInfoList();
    },
    height(newValue) {
      this.height = newValue;
    },
    methodsForm: {
      deep: true,
      handler: function () {
        this.reviewd = false;
      },
    },
  },
  methods: {
    async init() {
      this.handleCheckAllChange();
      // 获取用户的商品
      await this.getUserGoods();
      // 获取商品列表
      this.getProductInfoList();
      // 获取左侧选项栏
      this.getService();
    },
    // 获取用户左侧勾选项
    getSiderChosed() {
      // 组合商品分类回显处理
      let combinationCategoryIdsList = this.userGoods.filter((item) => item.productCategoryIds).map((item) => item.productCategoryIds.split(','));
      let combinationCategoryIds = [];
      combinationCategoryIdsList.forEach((ids) => {
        combinationCategoryIds = combinationCategoryIds.concat(ids);
      });
      combinationCategoryIds = [...new Set(combinationCategoryIds)];

      // 普通商品分类回显处理
      let notCombinationCategoryIds = this.userGoods.map((item) => item.productCategoryId);

      let ids = [...new Set(combinationCategoryIds.concat(notCombinationCategoryIds))];
      let servicesIds = this.servicesList.map((item) => item.id).filter((id) => ids.includes(id));

      if (servicesIds.length) {
        this.checkedList = servicesIds;
        this.handleCheckedChange(servicesIds);
      } else {
        this.checkedList = this.sideAllList;
        this.checkAll = true;
      }
    },
    // 获取用户的商品
    getUserGoods(list) {
      return new Promise((resolve) => {
        if (this.id) {
          getuserGoods(this.id).then((res) => {
            if (res.code == 0) {
              if (res.data && res.data.length) {
                // 获取的用户商品
                this.userGoods = res.data;
                this.selectList = [];
                res.data.map((item) => {
                  this.formatList.map((it) => {
                    if ((this.isCombinationProduct(it.isCombinationProduct) && it.id === item.productId) || (!this.isCombinationProduct(it.isCombinationProduct) && it.productSkuId === item.productSkuId)) {
                      it.userDataId = item.id;
                      this.$set(it, 'editPrice', item.editPrice);
                      this.$nextTick(() => {
                        this.$refs.table.toggleRowSelection(it, true);
                      });
                    }
                  });
                });
              } else {
                this.formatList.map((it) => {
                  this.$refs.table.toggleRowSelection(it, true);
                });
              }
            }
            this.formatSelect();
            resolve();
          });
        }
        resolve();
      });
    },
    formatSelect() {
      this.$nextTick(() => {
        let selection = this.$refs.table.selection;
        let ids = selection.map((item) => item.id);
        this.formatList.forEach((item) => {
          if (ids.includes(item.id) && !selection.includes(item)) {
            this.$refs.table.toggleRowSelection(item, true);
          }
        });
      });
    },
    formatListData() {
      let formatList = [];
      this.productList.forEach((item) => {
        if (this.isCombinationProduct(item.isCombinationProduct)) {
          let productCategoryIds = [];
          item.productInfoDTOList.forEach((productInfo) => {
            productCategoryIds = productCategoryIds.concat(productInfo.productSpecsDTOList.map((spec) => spec.productCategoryId));
          });
          productCategoryIds = [...new Set(productCategoryIds)].join(',');
          item.productSpecsDTOList = [
            {
              specsName: '组合商品',
              servicePrice: item.servicePrice,
              productCategoryIds,
            },
          ];
        } else if (!item.productSpecsDTOList.length) {
          item.productSpecsDTOList = [
            {
              specsName: item.productName,
              servicePrice: item.servicePrice,
            },
          ];
        }

        item.productSpecsDTOList.forEach((spec, i, arr) => {
          formatList.push({
            ...item,
            rowspan: arr.length,
            index: i,
            productSkuId: spec.id,
            specsCategoryId: spec.productCategoryId,
            productCategoryIds: spec.productCategoryIds,
            specsName: spec.specsName,
            servicePrice: spec.servicePrice,
          });
        });
      });
      this.formatList = formatList;
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      let combineList = ['selection', 'productImagePc', 'productName'];
      if (combineList.includes(column.property)) {
        if (row.index === 0) {
          return [row.rowspan, 1];
        } else {
          return [0, 0];
        }
      }
    },
    // 获取左侧选项栏
    getService() {
      categoryList({
        size: -1,
        status: 'ENABLE',
      }).then((res) => {
        if (res.code == 0) {
          let list = res.data.records;
          // 筛选合规的分类
          let sider = list.find((item) => item.id === '1588492024187269121');
          if (sider) {
            this.categoryName = sider.categoryName;
            if (sider.childrenProductCategory.length) {
              this.servicesList = sider.childrenProductCategory;
            }
          }
        }
        this.sideAllList = this.serviceOptions = this.servicesList.map((item) => item.id);
        this.getSiderChosed();
      });
    },
    // 获取商品列表
    getProductInfoList() {
      this.listLoading = true;
      if (!this.listParams.subProductCategoryIds.length) {
        return false;
      }
      getproductInfoList(this.listParams)
        .then((res) => {
          this.listLoading = false;
          let list = res.data.records;
          this.productList = res.data.records;
          list.forEach((item) => {
            item.editPrice = '';
          });
          this.formatListData();
          this.list = this.formatList;
          this.list2 = this.formatList;
          if (res.data.records && res.data.records.length) {
            this.getUserGoods(list);
          }
        })
        .catch((err) => {
          this.listLoading = false;
        });
    },
    goBack() {
      this.$router.push('/serviceMerchant/channelGoods/index');
    },
    /**
     * 分页
     */
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      // this.queryData();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      // this.queryData();
    },
    handleCheckAllChange(val) {
      this.checkedList = val ? this.serviceOptions : [];
      this.isIndeterminate = false;
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.servicesList.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.servicesList.length;
    },
    //选择table数据
    handleSelectionChange(val) {
      this.selectList = this.$refs.table.selection;
    },
    select(selection, row) {
      let selected = selection.length && selection.indexOf(row) !== -1;
      let list = this.formatList.filter((item) => item.id === row.id);
      list.forEach((item) => {
        this.$refs.table.toggleRowSelection(item, selected);
      });
    },
    // 方式变动，价格复位
    methodChange() {
      const { list2 } = this;
      this.list = list2;
    },
    // 价格操作
    preview() {
      const { selectList, methodsForm, list } = this;
      // debugger
      if (selectList.length && list.length) {
        // 方式一
        if (methodsForm.methods == 1) {
          selectList.map((item) => {
            // debugger
            let initPrice;
            // if( item.editPrice ) {
            //     initPrice = item.editPrice
            // } else {
            initPrice = item.servicePrice;
            // }
            // 百分比
            if (methodsForm.sealPricePersent) {
              initPrice = initPrice * (methodsForm.sealPricePersent / 100);
            }
            // 四舍五入
            if (methodsForm.adjust == 1) {
              initPrice = Math.round(initPrice);
            }
            // 向上取整
            if (methodsForm.adjust == 2) {
              initPrice = Math.ceil(initPrice);
            }
            // 向下取整
            if (methodsForm.adjust == 3) {
              initPrice = Math.floor(initPrice);
            }
            // 价格尾数
            if (methodsForm.mantissa && Number(methodsForm.mantissa) > -1) {
              let mantissa = methodsForm.mantissa;
              let price = initPrice.toString();
              // 尾数位和价格位数相同
              if (price.length == mantissa.toString().length) {
                mantissa = mantissa.toString().split('').slice(1).join('');
              }
              let length = mantissa.toString().length;
              initPrice = price.split('').slice(0, -length).concat(mantissa.toString().split('')).join('');
            }
            item.editPrice = initPrice;
            this.reviewd = true;
          });
        }
        // 方式二
        else {
          selectList.map((item) => {
            if (methodsForm.newPrice) {
              item.editPrice = methodsForm.newPrice;
            }
          });
        }
        this.selectList = selectList;
      } else {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据',
        });
      }
    },
    submit() {
      let allowSubmit = true;
      if (!this.selectList.length) {
        this.$message({
          type: 'error',
          message: '请选择需要操作的数据',
        });
      } else {
        // 处理数据
        let list = [];
        for (let item of this.selectList) {
          if (item.editPrice === '') {
            this.$message.error('请填写配置价格再提交！');
            allowSubmit = false;
            break;
          }
          if (item.editPrice == 0) {
            this.$message.error('配置价格不能为0！');
            allowSubmit = false;
            break;
          }
          let obj = {
            editPrice: item.editPrice,
            id: item.userDataId || '',
            price: item.servicePrice,
            productId: item.id,
            userId: this.id,
          };
          if (!this.isCombinationProduct(item.isCombinationProduct)) {
            obj.productCategoryId = item.specsCategoryId;
            obj.productSkuId = item.productSkuId;
          } else {
            obj.productCategoryIds = item.productCategoryIds;
          }
          list.push(obj);
        }
        if (allowSubmit) {
          addEditorUser({ productList: list }).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: 'success',
                message: '操作成功',
              });
              this.goBack();
            }
          });
        }
      }
    },
    isCombinationProduct(value) {
      return value === 'IS_COMBINATION_PRODUCT';
    },
  },
};
</script>

<style lang="less" scoped>
#merchantDetailContent {
  background: #f7f7f7;
  min-height: calc(100vh - 120px);
  .header {
    height: 40px;
    background: #ffffff;
    .type {
      line-height: 40px;
    }
  }
  .content-container {
    width: 100%;
    height: 100%;
    background: #f7f7f7;
    display: flex;
    .sider {
      display: inline-block;
      min-width: 200px;
      width: 200px;
      height: calc(100vh - 190px);
      margin-top: 20px;
      box-sizing: border-box;
      padding-left: 30px;
      overflow: auto;
    }
    .content {
      height: calc(100vh - 150px);
      width: calc(100% - 200px);
      background: #fff;
      overflow: auto;
      margin-top: -10px !important;
      .operation {
        border-top: 1px solid #f7f7f7;
        border-bottom: 1px solid #f7f7f7;
        width: 100%;
        height: 187px;
        display: flex;
        .title {
          font-size: 17px;
          margin: 10px 20px 0px 20px;
        }
        .methodsBox {
          margin: 10px 50px;
          padding: 5px 15px;
          background: #fafafa;
          .methods {
            width: 500px;
            height: 200px;
            display: flex;
            .left {
              width: 100px;
              height: 100%;
              .radioww {
                width: 100px;
                height: 200px;
                display: flex;
                flex-direction: column;
                align-content: space-between;
              }
            }
            .right {
              width: 700px;
            }
          }
        }
      }
      .btns {
        padding: 10px;
        display: flex;
        justify-content: flex-end;
      }
    }
    ::v-deep .el-checkbox {
      margin-bottom: 10px;
    }
    ::v-deep .raidn {
      margin: 10px 0 105px;
    }
    ::v-deep .el-button {
      width: 80px;
    }
    ::v-deep .el-table__header-wrapper,
    .el-table__footer-wrapper {
      height: 40px;
      display: flex;
      align-items: center;
    }
    ::v-deep .el-form .el-form-item.el-form-item--small {
      margin-bottom: 10px;
    }
    ::v-deep .el-form .el-form-item.el-form-item--small {
      margin-bottom: 9px !important;
    }
  }
}
// ::v-deep .el-table{
//         height: 525px;
//         overflow: auto;
//     }
// @media screen and (max-width: 1440px) {
//     ::v-deep .el-table{
//         height: 414px;
//         overflow: auto;
//     }
// }
</style>
