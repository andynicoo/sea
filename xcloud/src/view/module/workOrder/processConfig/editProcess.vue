<template>
  <div class="app-container">
    <header class="previewBack">
      <div cclass="el-page-header">
        <div class="el-page-header__left" @click="goback">
          <i class="el-icon-arrow-left"></i>
          <div class="el-page-header__title">返回列表</div>
        </div>
      </div>

      <el-alert class="tips" :closable="false">
        <template slot="title">
          <div>1.选择你想配置的服务</div>
          <div>2.选择该服务整个流程中所需的节点，选择了的节点可移除</div>
          <div>3.若有需要，按住服务流程序号前的点点，上下拖动调整节点顺序</div>
          <div>
            4.若某个节点有驳回的需求，在该节点选择一个驳回节点。那么实际在此节点操作驳回时，即驳回到所设置的驳回节点
          </div>
          <div>5.配置好所有流程节点后，为每个节点配置相应的资料</div>
          <div>6.所有资料都配置完成后，此条服务流程即可被审核。若审核通过，此服务便可发布上线为相应的工单流程</div>
          <div>
            7.已发布的流程可更新。在列表点击更新进行编辑流程节点或资料，保存后，所作编辑将被另存为一条新的待审核流程，新流程审核通过后，将自动发布上线，其对应的旧流程则被停用。
          </div>
        </template>
      </el-alert>
    </header>
    <!-- 表单 -->
    <div class="form-container">
      <!-- 表单 -->
      <el-form label-width="120px" ref="processFormRef" :model="processForm" :rules="processFormRules">
        <Title class="t-class" titieName="选择服务"></Title>
        <div class="serverUL">
          <el-form-item label="流程名称" prop="flowName">
            <el-input v-model="processForm.flowName" placeholder="请输入流程名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="业务分类" prop="functionCode">
            <el-select
              v-model="processForm.functionCode"
              placeholder="选择业务分类"
              clearable
              filterable
              default-first-option
              :disabled="processForm.flowId != ''"
              @change="changeFunctionCode"
            >
              <el-option :value="item.code" :label="item.name" v-for="item in productList" :key="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="国家" prop="countryCode">
            <el-select
              v-model="processForm.countryCode"
              placeholder="选择国家"
              clearable
              filterable
              default-first-option
              @change="changeCountryCode"
              :disabled="processForm.flowId != ''"
            >
              <el-option
                :value="item.countryCode"
                :label="item.countryNameZh"
                v-for="item in countryList"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务商" prop="supplierId">
            <el-select
              v-model="processForm.supplierId"
              placeholder="选择服务商"
              clearable
              filterable
              default-first-option
              popper-class="supplier-table"
              :disabled="processForm.flowId != ''"
            >
              <el-option value disabled class="supplier-table-head">
                <el-row>
                  <el-col :span="12">简称</el-col>
                  <el-col :span="12">服务商编码</el-col>
                </el-row>
              </el-option>
              <div class="el-select-dropdown__empty" v-if="supplierList.length == 0">暂无数据</div>
              <el-option
                class="supplier-table-td"
                :value="item.supplierId"
                :label="item.shortName"
                v-for="(item, index) in supplierList"
                :key="item.supplierId"
              >
                <el-row>
                  <el-col :span="12">{{ item.shortName }}</el-col>
                  <el-col :span="12">
                    {{ item.supplierCode }}
                  </el-col>
                </el-row>
              </el-option>
            </el-select>
          </el-form-item>
        </div>

        <!-- 配置流程 -->

        <el-form-item label-width="0px">
          <el-row :gutter="24">
            <el-col :span="10">
              <div>
                <div style="display:flex;align-items: center;">
                  <Title class="t-class" titieName="配置流程"></Title>
                  <div style="margin-left: 390px;">
                    <el-button size="small" @click="showReuseDialog" v-if="processForm.flowId == ''" v-show="hasAuthority('G1_5')">
                      复用配置
                    </el-button>
                  </div>
                </div>
                <el-table :data="nodeList" max-height="350" class="node-table" size="mini">
                  <el-table-column label="序号" width="68" align="center">
                    <template slot-scope="{ row, $index }">{{ $index + 1 }}</template>
                  </el-table-column>
                  <el-table-column label="节点名称" align="center">
                    <template slot-scope="{ row }">{{ row.nodeName }}</template>
                  </el-table-column>
                  <el-table-column label="添加至服务流程" align="center">
                    <template slot-scope="{ row, $index }">
                      <el-link type="success" :underline="false" @click="handleAddProcess(row, $index)">添加</el-link>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </el-col>
            <el-col :span="14">
              <!-- <div class="text-bold">业务流程</div> -->
              <Title class="t-class" titieName="业务流程"></Title>
              <el-table row-key="nodeId" max-height="350" :data="processNodeList" class="process-table">
                <el-table-column width="50" align="center">
                  <template slot-scope="{ row }">
                    <i class="el-icon-sort" style="cursor: move" />
                  </template>
                </el-table-column>
                <el-table-column label="序号" width="70" align="center">
                  <template slot-scope="{ row, $index }">
                    {{ $index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column label="节点名称" align="center">
                  <template slot-scope="{ row }">{{ row.nodeName }}</template>
                </el-table-column>
                <el-table-column label="驳回节点" align="center">
                  <template slot-scope="{ row, $index }">
                    <el-select v-if="$index > 0" v-model="row.rejectNodeId" clearable filterable placeholder="无">
                      <el-option
                        :label="item.nodeName"
                        :value="item.nodeId"
                        v-for="item in getRejectNodeList($index)"
                        :key="item.nodeId"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                  <template slot-scope="{ row }">
                    {{ row.configColumn ? "已配置资料" : "待配置" }}
                  </template>
                </el-table-column>
                <el-table-column label="操作" width="120" align="center">
                  <template slot-scope="{ row, $index }">
                    <span v-if="processForm.flowId">
                      <el-link v-if="row.configColumn" type="primary" :underline="false" @click="toEditTemplate(row)">
                        编辑资料
                      </el-link>
                      <el-link v-else type="primary" :underline="false" @click="toEditTemplate(row)">添加资料</el-link>
                    </span>
                    <el-link type="danger" :underline="false" @click="handleRemoveProcess(row, $index)">移除</el-link>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div class="text-align-center">
        <el-button type="primary" @click="handleSubmit">{{ processDetail.status == 4 ? "更新" : "确认" }}</el-button>
        <el-button @click="goback()">取消</el-button>
      </div>
    </div>

    <!-- 复用配置弹框 -->
    <el-dialog title="复用配置" :visible.sync="reuseDialog" :close-on-click-modal="false" width="520px">
      <el-form label-width="120px" ref="reuseFormRef" :model="reuseForm" :rules="processFormRules">
        <el-form-item label="企业主体" prop="enterpriseId">
          <el-select
            v-model="reuseForm.enterpriseId"
            placeholder="选择企业主体"
            clearable
            filterable
            default-first-option
            style="width:300px"
            @change="changeEnterprise('reuseForm')"
          >
            <el-option :value="item.id" :label="item.name" v-for="item in firmList" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务分类" prop="functionCode">
          <el-select
            v-model="reuseForm.functionCode"
            placeholder="选择业务分类"
            clearable
            filterable
            default-first-option
            style="width:300px"
            :disabled="true"
          >
            <el-option :value="item.code" :label="item.name" v-for="item in productList" :key="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="国家" prop="countryCode">
          <el-select
            v-model="reuseForm.countryCode"
            placeholder="选择国家"
            clearable
            filterable
            default-first-option
            @change="changeCountryCode('reuseForm')"
            style="width:300px"
          >
            <el-option
              :value="item.countryCode"
              :label="item.countryNameZh"
              v-for="item in countryList"
              :key="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务商" prop="supplierId">
          <el-select
            v-model="reuseForm.supplierId"
            placeholder="选择服务商"
            clearable
            filterable
            default-first-option
            style="width:300px"
            popper-class="supplier-table"
          >
            <el-option value disabled class="supplier-table-head">
              <el-row>
                <el-col :span="12">简称</el-col>
                <el-col :span="12">服务商编码</el-col>
              </el-row>
            </el-option>
            <div class="el-select-dropdown__empty" v-if="reuseSupplierList.length == 0">暂无数据</div>
            <el-option
              class="supplier-table-td"
              :value="item.supplierId"
              :label="item.shortName"
              v-for="(item, index) in reuseSupplierList"
              :key="item.supplierId"
            >
              <el-row>
                <el-col :span="12">{{ item.shortName }}</el-col>
                <el-col :span="12">
                  {{ item.supplierCode }}
                </el-col>
              </el-row>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-align-center">
        <el-button @click="reuseDialog = false">取消</el-button>
        <el-button type="primary" @click="reuseConfig">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sortable from "sortablejs";
import title from "@/components/title/index";
import { getFirm } from "@/api/newApi/common.js";

import {
  findProducts,
  findCountrys,
  findSuppliers,
  findNodes,
  getProcessDetail,
  addProcess,
  updateProcess,
  publishProcess,
  getActivatedApi,
  copyWorkFlowApi
} from "@/api/newApi/processFields/processConfig";
export default {
  components: {
    Title: title
  },
  data() {
    return {
      // 商品，国家，服务商
      productList: [],
      countryList: [],
      supplierList: [],
      firmList: [],
      reuseSupplierList: [],
      reuseDialog: false,
      status: "", //当前流程状态

      // 所有流程节点
      nodeList: [],
      // 已经配置过的流程节点
      processNodeList: [],
      enterpriseId: window.localStorage.getItem("enterpriseId"),
      // 流程信息详情
      processDetail: {},

      // 表单
      processForm: {
        flowId: "",
        flowName: "",
        functionCode: "",
        countryCode: "",
        supplierId: ""
      },
      // 复用配置表单
      reuseForm: {
        enterpriseId: "",
        functionCode: "",
        countryCode: "",
        supplierId: ""
      },
      processFormRules: {
        enterpriseId: [{ required: true, message: "请选择企业主体", trigger: "change" }],
        flowName: [{ required: true, message: "请输入流程名称", trigger: "blur" }],
        functionCode: [{ required: true, message: "请选择业务分类", trigger: "change" }],
        countryCode: [{ required: true, message: "请选择国家", trigger: "change" }],
        supplierId: [{ required: true, message: "请选择服务商", trigger: "change" }]
      }
    };
  },
  computed: {},
  created() {
    // 查询详情
    if (this.$route.query && this.$route.query.flowId) {
      this.processForm.flowId = this.$route.query.flowId;
      this.queryProcessDetail();
    }

    this.queryProductList();
    this.queryCountryList();
  },
  mounted() {
    this.drawProcessRow();
  },
  methods: {
    // 打开复用弹窗
    showReuseDialog() {
      if (
        this.processForm.functionCode == "" ||
        this.processForm.countryCode == "" ||
        this.processForm.supplierId == ""
      ) {
        this.$message.error("请先选择业务分类、国家、服务商！");
        return;
      }
      this.reuseForm.functionCode = this.processForm.functionCode;
      this.reuseDialog = true;
      // 获取企业主体
      this.getfirmList();
    },
    // 复用配置
    reuseConfig() {
      this.$refs.reuseFormRef.validate(valid => {
        if (valid) {
          let supplierName = this.getSupplierName(this.processForm.supplierId);
          let data = {
            source: { ...this.reuseForm, status: 4, page: 1, limit: 20 },
            target: { ...this.processForm, status: 0, enterpriseId: this.enterpriseId, supplierName: supplierName }
          };
          copyWorkFlowApi(data).then(res => {
            if (res.code == 0) {
              this.processForm.flowId = res.data.flowId;
              this.queryProcessDetail();
              this.$message.success("复用成功！");
              this.reuseDialog = false;
            } else {
              this.$message.error(res.message);
            }
          });
        }
      });
    },
    // 根据supplierId返回对应的supplierName
    getSupplierName(supplierId) {
      let supplierName = "";
      this.reuseSupplierList.forEach(item => {
        if (item.supplierId == supplierId) {
          supplierName = item.supplierName;
        }
      });
      return supplierName;
    },
    /**
     * 获取企业列表
     */
    getfirmList() {
      getFirm().then(res => {
        if (res.code == 0) {
          this.firmList = res.data;
        } else {
          this.$message({
            type: "error",
            message: res.message
          });
        }
      });
    },
    /**
     * 查询商品列表
     */
    queryProductList() {
      findProducts().then(res => {
        if (res.code == 0) {
          this.productList = res.data;
        }
      });
    },
    /**
     * 查询国家列表
     */
    queryCountryList() {
      findCountrys().then(res => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    /**
     * 改变国家code，查询服务商
     */
    changeCountryCode(key) {
      if (key == "reuseForm") {
        this.reuseForm.supplierId = "";
        this.reuseSupplierList = [];
        this.querySupplierList(key);
      } else {
        this.processForm.supplierId = "";
        this.supplierList = [];
        this.querySupplierList();
      }
    },
    /**
     * 改变企业
     */
    changeEnterprise() {
      this.reuseForm.countryCode = "";
      this.reuseForm.supplierId = "";
    },
    /**
     * 查询服务商列表-根据国家code
     */
    querySupplierList(key) {
      if (key == "reuseForm") {
        getActivatedApi({
          enterpriseId: this.reuseForm.enterpriseId,
          functionCode: this.reuseForm.functionCode,
          countryCode: this.reuseForm.countryCode,
          page: 1,
          limit: 9999
        }).then(res => {
          if (res.code == 0) {
            this.reuseSupplierList = res.data;
          }
        });
      } else {
        findSuppliers({
          functionCode: this.processForm.functionCode,
          countryCode: this.processForm.countryCode,
          page: 1,
          limit: 9999
        }).then(res => {
          if (res.code == 0) {
            this.supplierList = res.data.records;
          }
        });
      }
    },

    /**
     * 查询流程详情
     */

    queryProcessDetail() {
      getProcessDetail({ flowId: this.processForm.flowId }).then(res => {
        if (res.code == 0) {
          this.processDetail = res.data;
          this.processForm.flowName = res.data.flowName;
          this.processForm.countryCode = res.data.countryCode;
          this.processForm.functionCode = res.data.functionCode;
          this.processForm.supplierId = res.data.serviceProviderId;
          this.processNodeList = res.data.forwardNodes;
          this.status = res.data.status;
          // 组装一下数据
          this.processNodeList.forEach(v => {
            if (v.rejectNode && v.rejectNode.nodeId) {
              v.rejectNodeId = v.rejectNode.nodeId;
            }
          });
          // 查询服务商列表
          this.querySupplierList();
          // 查询对应的节点
          this.queryNodeList();
        }
      });
    },
    /**
     * 查询所有可添加流程节点列表
     */
    queryNodeList() {
      findNodes({
        flowId: this.processForm.flowId,
        functionCode: this.processForm.functionCode,
        status: 1
      }).then(res => {
        if (res.code == 0) {
          this.nodeList = res.data;
        }
      });
    },

    /**
     * 新增的情况下，切换商品分类，则会清空已经配置的服务流程列表，以及流程节点
     */
    changeFunctionCode(key) {
      if (key == "reuseForm") {
        this.querySupplierList(key);
        this.reuseForm.supplierId = "";
      } else {
        // 查询服务商
        this.processForm.supplierId = "";
        this.querySupplierList();

        // 查询全部节点列表
        this.nodeList = [];
        this.processNodeList = [];
        this.queryNodeList();
      }
    },

    /**
     * 已经配置的节点，获取驳回节点列表
     * 计算方法：第0个节点到当前节点之间的数据
     */
    getRejectNodeList(index) {
      return this.processNodeList.slice(0, index);
    },

    /**
     * 添加节点到服务流程中
     */
    handleAddProcess(row, index) {
      this.processNodeList.push(row);
      this.nodeList.splice(index, 1);
    },
    /**
     * 从服务流程中移除，到全部节点中
     */
    handleRemoveProcess(row, index) {
      delete row.rejectNodeId;
      delete row.rejectNode;
      this.nodeList.push(row);
      this.processNodeList.splice(index, 1);
    },

    /**
     * 拖拽排序服务流程
     */
    drawProcessRow() {
      const tbody = document.querySelector(".process-table .el-table__body-wrapper tbody");
      Sortable.create(tbody, {
        animation: 120,
        delay: 0,
        onEnd: ({ oldIndex, newIndex }) => {
          // console.log("原下标：", oldIndex, "新下标：", newIndex);
          // 重新调整排序位置后，清空已经选择的驳回节点
          this.processNodeList[oldIndex].rejectNodeId = "";
          this.processNodeList[newIndex].rejectNodeId = "";
          const currRow = this.processNodeList.splice(oldIndex, 1)[0];
          this.processNodeList.splice(newIndex, 0, currRow);
          this.processNodeList.forEach((v, index) => (v.sort = index));
          console.log("最终的排序：", this.processNodeList);
        }
      });
    },

    /**
     * 跳转到模板配置页面
     */
    toEditTemplate(row) {
      // 保存提示
      this.$confirm("如有填写业务流程信息，请先点击底部保存按钮后再跳转资料配置页面。", "温馨提示", {
        type: "warning",
        confirmButtonText: "我已保存",
        cancelButtonText: "还没保存"
      })
        .then(() => {
          this.$router.push({
            path: "/workOrder/processConfig/editTemplate",
            query: {
              flowId: this.processForm.flowId,
              nodeId: row.nodeId
            }
          });
        })
        .catch(() => {});
    },

    /**
     * 提交
     */
    handleSubmit() {
      this.$refs.processFormRef.validate(valid => {
        if (valid) {
          // 已发布的流程，编辑的时候是调用新增的接口加一条流程
          if (this.processDetail.status == 4) {
            this.handlePublish();
          }
          // 其他状态下的操作
          else {
            if (this.processForm.flowId) {
              this.handleUpdate();
            } else {
              this.handleAdd();
            }
          }
        }
      });
    },
    // 新增
    handleAdd() {
      // 获取服务流程中的节点数据
      if (this.processNodeList.length == 0) {
        this.$message({
          type: "warning",
          message: "至少存在一个业务流程节点！"
        });
        return;
      }
      this.processNodeList.forEach((v, i) => {
        v.sort = i;
        v.rejectNode = this.processNodeList.filter(item => item.nodeId == v.rejectNodeId)[0];
      });

      // 组装数据
      let params = {
        flowName: this.processForm.flowName,
        functionCode: this.processForm.functionCode,
        countryCode: this.processForm.countryCode,
        serviceProviderId: this.processForm.supplierId,
        forwardNodes: this.processNodeList
      };
      addProcess(params).then(res => {
        if (res.code == 0) {
          this.$confirm("添加成功，是否现在配置业务流程的节点资料？", "提示", {
            type: "success"
          })
            .then(() => {
              this.processForm.flowId = res.data;
              this.queryProcessDetail();
            })
            .catch(() => {
              this.goback();
            });
        }
      });
    },
    // 修改
    handleUpdate() {
      // 获取流程中的节点数据
      this.processNodeList.forEach((v, i) => {
        v.sort = i;
        v.rejectNode = this.processNodeList.filter(item => item.nodeId == v.rejectNodeId)[0];
      });

      // 组装数据
      let params = {
        flowId: this.processForm.flowId,
        flowName: this.processForm.flowName,
        functionCode: this.processForm.functionCode,
        countryCode: this.processForm.countryCode,
        serviceProviderId: this.processForm.supplierId,
        forwardNodes: this.processNodeList
      };
      updateProcess(params).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.goback();
        }
      });
    },
    // 更新已发布的流程
    handlePublish() {
      console.log("流程信息更新");
      // 获取流程中的节点数据
      this.processNodeList.forEach((v, i) => {
        v.sort = i;
        v.rejectNode = this.processNodeList.filter(item => item.nodeId == v.rejectNodeId)[0];
      });

      // 组装数据
      let params = {
        oldFlowId: this.processForm.flowId,
        flowName: this.processForm.flowName,
        functionCode: this.processForm.functionCode,
        countryCode: this.processForm.countryCode,
        serviceProviderId: this.processForm.supplierId,
        forwardNodes: this.processNodeList
      };
      publishProcess(params).then(res => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "更新成功"
          });
          this.goback();
        }
      });
    },

    /**
     * 返回列表
     */
    goback() {
      this.$router.push({
        path: "/workOrder/processConfig/index"
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.app-container {
  background: #fff;
  height: 100%;
  position: relative;
  .page-header {
    background: #fff;
    padding: 16px;
    border-radius: 4px;
  }
  .tips {
    background: rgba(255, 128, 0, 0.07);
    height: 100%;
    span {
      > div {
        font-size: 12px;
        height: 25px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 25px;
      }
    }
  }
  .form-container {
    margin-top: 16px;
    background: #fff;
    padding: 16px;
    border-radius: 4px;
    width: 100%;
    min-width: 1450px;
  }
  .node-tips {
    background: #f5f5f5;
    padding: 8px 10px;
    margin: 10px 0px;
    li {
      list-style: none;
    }
  }
  /deep/.el-form-item__content {
    line-height: 40px;
  }
  .text-align-center {
    height: 96px;
    width: 100%;
    border-top: 2px solid #f0f1f3;
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;

    button {
      width: 100px;
    }
  }
  .node-table {
    width: 531px;
    height: 360px;
    border: 1px solid #f3f8fd;
  }
  .node-item {
    display: inline-block;
    border: solid 1px #eee;
    border-radius: 4px;
    font-size: 14px;
    margin: 0px 10px 10px 10px;
    padding: 0px 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
    .el-link {
      position: relative;
      top: -2px;
    }
  }
}
</style>
<style lang="less" scope>
.page-header {
  .el-page-header__left::after {
    background: none;
  }
}
.previewBack {
  padding: 30px;
  background: #fff;
  border-radius: 4px;
  margin-bottom: 30px;
  height: 280px;
  .el-page-header__left {
    align-items: baseline;
    padding-bottom: 30px;
  }
}
.t-class {
  margin-top: 30px;
  margin-bottom: 30px;
}
.serverUL {
  display: flex;
  width: 100%;
  min-width: 1450px;
  .el-form-item {
    display: flex;

    .el-form-item__label {
      // text-align: left;
      width: auto !important;
    }
    .el-form-item__content {
      margin-left: 0px !important;
      margin-right: 30px;
      input {
        width: 250px;
      }
    }
  }
}
// 服务商下拉table
.supplier-table {
  &-head {
    background: #f5f5f5 !important;
    color: #333333 !important;
    font-size: 14px !important;
    font-weight: bold !important;
    border-bottom: 1px solid #ebeef5 !important;
    cursor: default !important;
  }
  &-td {
    border-bottom: solid 1px #ebeef5;
  }
}
.process-table {
  width: auto;
  height: 360px;
  border: 1px solid #f3f8fd;
  .el-table__header th {
    height: 40px !important;
  }
  .el-table__body td {
    padding: 8px 0px !important;
  }
}
</style>
