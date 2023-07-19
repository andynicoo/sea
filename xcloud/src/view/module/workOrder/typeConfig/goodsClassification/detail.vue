<template>
  <div>
    <div class="app-container">
      <div class="header-container">
        <div class="back" @click="back()">
          <Icon type="ios-arrow-back" />
          返回列表
        </div>
        <h3 style="margin: 10px 30px">关联商品分类</h3>
        <el-form ref="form" style="margin-left: 50px">
          <el-form-item label="业务分类：">{{ info.categoryName }}</el-form-item>
          <el-form-item label="工单类型：">{{ info.functionName }}</el-form-item>
          <el-form-item>
            <el-table :data="associationList" border :style="`width: ${isDetail ? '601' : '791'}px`">
              <el-table-column label="关联的商品分类" width="300px">
                <template slot-scope="{ row, $index }">
                  <el-cascader
                    :ref="'productCategory' + $index"
                    :disabled="isDetail"
                    style="width: 270px"
                    clearable
                    filterable
                    placeholder="请选择"
                    v-model="row.productCategoryId"
                    :options="serviceCascader"
                    :props="{
                      children: 'childrenProductCategory',
                      value: 'id',
                      label: 'categoryName',
                      emitPath: false,
                    }"
                  ></el-cascader>
                </template>
              </el-table-column>
              <el-table-column label="国家" width="300px">
                <template slot-scope="{ row }">
                  <el-select :disabled="isDetail" style="width: 270px" size="small" v-model="row.countryCode" clearable filterable multiple>
                    <el-option v-for="item in countrySelectList" :value="item.countryCode" :key="item.id" :label="item.countryNameZh"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="190px" v-if="isEdit">
                <template slot-scope="{ $index }">
                  <el-button size="small" icon="el-icon-circle-plus-outline" type="success" @click="addAssociation($index)"> 添加 </el-button>
                  <el-button size="small" icon="el-icon-delete" type="danger" @click="delAssociation($index)" v-if="associationList.length > 1"> 删除 </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <div class="btn-group" v-if="isEdit">
          <el-button size="small" @click="back">返回</el-button>
          <el-button type="primary" size="small" @click="submit">确认</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workFunctionSaveOrUpdate, getWorkFunctionInfo } from '@/api/newApi/workOrder/typeConfig.js';
import { getGoodsCategory } from '@/api/newApi/servicemerchant/goodsCenter.js';
import { getCountrySelectList } from '@/api/newApi/common.js';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      functionId: this.$route.query.functionId || 0,
      categoryName: this.$route.query.categoryName,
      functionName: this.$route.query.functionName,
      type: this.$route.query.type,
      tabNav: 0,
      info: {},
      serviceCascader: [],
      countrySelectList: [],
      associationList: [],
    };
  },
  computed: {
    isDetail() {
      return this.type === 'detail';
    },
    isEdit() {
      return this.type === 'edit';
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this._getallcategory();
      this._getCountrySelectList();
      if (this.functionId) {
        this.getInfo();
      } else {
        this.addAssociation();
      }
    },
    getInfo() {
      getWorkFunctionInfo(this.functionId).then((res) => {
        if (res.data && res.data.length) {
          this.info = {
            categoryName: res.data[0].categoryName,
            functionName: res.data[0].functionName,
          };
        } else {
          this.info = {
            categoryName: this.categoryName,
            functionName: this.functionName,
          };
        }
        this.associationList = res.data.map((item) => ({
          countryCode: item.countryCode.split(',').filter((item) => item),
          productCategoryId: item.productCategoryId,
        }));
        if (!this.associationList.length) {
          this.addAssociation();
        }
      });
    },
    /**
     * 获取所有商品类目和属性，级联选择器分类数据
     */
    _getallcategory() {
      getGoodsCategory({
        page: 1,
        size: -1,
      }).then((res) => {
        if (res.code == 0) {
          let data = res.data.records.filter((item) => item.childrenProductCategory && item.childrenProductCategory.length);
          this.formatCategory(data);
          this.serviceCascader = data;
        }
      });
    },
    formatCategory(data) {
      data.forEach((item) => {
        if (item.childrenProductCategory && item.childrenProductCategory.length) {
          this.formatCategory(item.childrenProductCategory);
        } else {
          item.childrenProductCategory = void 0;
        }
      });
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    addAssociation(index) {
      this.associationList.splice(index + 1, 0, {
        countryCode: [],
        productCategoryId: '',
      });
    },
    delAssociation(index) {
      if (this.associationList.length === 1) {
        this.$message.error('不能删除了！');
        return;
      }
      this.associationList.splice(index, 1);
    },
    // 提交
    submit() {
      if (!this.associationList.length || this.associationList.some((item) => !item.productCategoryId || !item.countryCode.length)) {
        this.$message.warning('请选择关联商品分类和国家');
        return;
      }
      let ids = this.associationList.map((item) => item.productCategoryId);
      if (ids.length !== [...new Set(ids)].length) {
        this.$message.warning('商品分类重复，请勿重复配置');
        return;
      }
      let data = this.associationList.map((item, index) => ({
        ...item,
        countryCode: item.countryCode.join(','),
        countryCodeName: this.countrySelectList
          .filter((c) => item.countryCode.includes(c.countryCode))
          .map((c) => c.countryNameZh)
          .join(','),
        productCategoryName: this.$refs['productCategory' + index]
          .getCheckedNodes()
          .map((c) => c.label)
          .join(','),
        functionId: this.functionId,
      }));

      workFunctionSaveOrUpdate(data).then((res) => {
        if (res.code === 0) {
          this.$message.success('操作成功');
          this.back();
        }
      });
    },
    //返回列表页
    ...mapMutations(['closeTag']),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: '/workOrder/typeConfig/goodsClassification/index',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.back {
  margin: 0 30px;
  cursor: pointer;
}
.btn-group {
  margin-left: 60px;
  padding: 50px;
}
.header-container {
  position: relative;
  min-height: calc(100vh - 120px);
  &::after {
    position: absolute;
    content: '';
    width: 300px;
    height: 60px;
    top: 0;
    left: 80px;
    z-index: 100;
  }
}
/deep/ .el-select .el-tag__close.el-icon-close {
  background-color: #e0e0e0 !important;
  margin-right: 5px;
}
</style>
