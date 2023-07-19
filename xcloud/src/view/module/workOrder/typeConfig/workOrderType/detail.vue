<template>
  <div>
    <div class="app-container">
      <div class="header-container">
        <div class="back" @click="back()">
          <Icon type="ios-arrow-back" />
          返回列表
        </div>
        <h3 style="margin: 10px 30px">关联工单类型</h3>
        <el-form ref="form" style="margin-left: 50px">
          <el-form-item label="业务分类：">{{ info.categoryName }}</el-form-item>
          <el-form-item label="工单类型：">{{ info.functionName }}</el-form-item>
          <el-form-item>
            <el-table :data="associationList" border :style="`width: ${isDetail ? '951' : '1141'}px`">
              <el-table-column label="关联的工单类型" width="300px">
                <template slot="header">
                  关联的工单类型
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">A 关联BC 意思是：A服务存在的情况下才能交付BC;若A不存在，BC不能独立服务</div>
                    <i class="el-icon-question text-warning"></i>
                  </el-tooltip>
                </template>
                <template slot-scope="{ row, $index }">
                  <el-cascader
                    :ref="'productCategory' + $index"
                    :disabled="isDetail"
                    style="width: 270px"
                    clearable
                    filterable
                    placeholder="请选择"
                    v-model="row.relationFunctionId"
                    :options="workCategoryCascader"
                    :props="{
                      children: 'workFunctionList',
                      value: 'id',
                      label: 'name',
                      emitPath: false,
                    }"
                  ></el-cascader>
                </template>
              </el-table-column>
              <el-table-column label="服务商关系" width="200px">
                <template slot="header">
                  服务商关系
                  <el-tooltip class="item" effect="dark" placement="top-start">
                    <div slot="content">
                      A关联B,服务商关系一致时，AB服务商一致，仅A需要配置服务商分配规则；<br />
                      A关联B,服务商关系不一致时，AB服务商不一致，A和B均需要配置服务商分配规则；
                    </div>
                    <i class="el-icon-question text-warning"></i>
                  </el-tooltip>
                </template>
                <template slot-scope="{ row }">
                  <el-radio-group :disabled="isDetail" v-model="row.uniformity">
                    <el-radio :label="true">一致</el-radio>
                    <el-radio :label="false">不一致</el-radio>
                  </el-radio-group>
                </template>
              </el-table-column>
              <el-table-column label="关联工单的触发条件" width="450px">
                <template slot-scope="{ row }">
                  <div class="condition-block">
                    <div class="condition-block-item">
                      <div>流程节点</div>
                      <el-select :disabled="isDetail" style="width: 200px" size="small" clearable filterable v-model="row.nodeCode">
                        <el-option v-for="item in serverNodeWithFunctionCodeList" :key="item.nodeId" :value="item.nodeCode" :label="item.nodeName"></el-option>
                      </el-select>
                    </div>
                    <div class="condition-block-item">
                      <div>操作动作</div>
                      <el-select :disabled="isDetail" style="width: 200px" size="small" clearable filterable v-model="row.serviceFunctionId">
                        <el-option v-for="item in serviceFunctionList" :key="item.id" :value="item.id" :label="item.functionName"></el-option>
                      </el-select>
                    </div>
                  </div>
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
import { getWorkflowRelationInfo, workflowRelationSaveOrUpdate, serviceFunction, serviceNodeWithFunctionCode, workCategoryList } from '@/api/newApi/workOrder/typeConfig.js';
import { getCountrySelectList } from '@/api/newApi/common.js';
import { mapMutations } from 'vuex';
export default {
  data() {
    return {
      functionId: this.$route.query.functionId || 0,
      categoryName: this.$route.query.categoryName,
      functionName: this.$route.query.functionName,
      functionCode: this.$route.query.functionCode,
      type: this.$route.query.type,
      tabNav: 0,
      info: {},
      workCategoryCascader: [],
      countrySelectList: [],
      associationList: [],
      serviceFunctionList: [],
      serverNodeWithFunctionCodeList: [],
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
      this._getCountrySelectList();
      this.getServiceFunctionList();
      this.getWorkCategoryList();
      this.getServiceNodeWithFunctionCodeList();
      if (this.functionId) {
        this.getInfo();
      } else {
        this.addAssociation();
      }
    },
    getInfo() {
      getWorkflowRelationInfo(this.functionId).then((res) => {
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
        this.associationList = res.data.map((item, index) => ({
          relationFunctionId: item.relationFunctionId,
          nodeCode: item.nodeCode,
          serviceFunctionId: item.serviceFunctionId == 0 ? '' : item.serviceFunctionId,
          uniformity: item.uniformity,
        }));
        if (!this.associationList.length) {
          this.addAssociation();
        }
      });
    },
    getWorkCategoryList() {
      workCategoryList().then((res) => {
        res.data.forEach((item) => {
          item.id = 'i' + item.id;
          item.workFunctionList.forEach((work) => {
            work.disabled = work.id + '' === this.functionId;
          });
        });
        this.workCategoryCascader = res.data;
      });
    },
    // 获取国家列表
    _getCountrySelectList() {
      getCountrySelectList().then((res) => {
        this.countrySelectList = res.data;
      });
    },
    /**
     * 获取流程节点列表
     */
    getServiceNodeWithFunctionCodeList() {
      serviceNodeWithFunctionCode({
        functionCode: this.functionCode,
      }).then((res) => {
        this.serverNodeWithFunctionCodeList = res.data;
      });
    },
    /**
     * 获取操作动作列表
     */
    getServiceFunctionList() {
      serviceFunction().then((res) => {
        this.serviceFunctionList = res.data;
      });
    },

    addAssociation(index) {
      this.associationList.splice(index + 1, 0, {
        relationFunctionId: '',
        uniformity: true,
        nodeCode: '',
        serviceFunctionId: '',
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
      for (let association of this.associationList) {
        if (Object.values(association).some((item) => item === null || item === '')) {
          this.$message.warning('请选择关联工单类型和触发条件');
          return;
        }
      }
      let ids = this.associationList.map((item) => item.relationFunctionId);
      if (ids.length !== [...new Set(ids)].length) {
        this.$message.warning('关联的工单类型重复，请勿重复配置');
        return;
      }
      let data = this.associationList.map((item) => ({
        ...item,
        functionId: this.functionId,
      }));
      workflowRelationSaveOrUpdate(data).then((res) => {
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
        path: '/workOrder/typeConfig/workOrderType/index',
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
.condition-block {
  display: flex;
  align-items: center;
  &-item:not(:last-child) {
    margin-right: 20px;
  }
}
</style>
