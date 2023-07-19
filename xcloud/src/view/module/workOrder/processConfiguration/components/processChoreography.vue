<template>
  <div class="process-processArrangement">
    <div class="process-handle-btn">
      <el-button type="primary" @click="handlePrev()">上一步</el-button>
      <el-button v-show="hasAuthority('G1_6')" v-if="flowId" type="primary" @click="handlePreview()">预览</el-button>
      <el-button v-show="hasAuthority('G1_13')" v-if="[0, 3].includes(processDetail.status) || !processDetail.status"
        type="primary" @click="handleSave()">保存</el-button>
      <el-button v-show="hasAuthority('G1_14')" v-if="[0, 3].includes(processDetail.status)" type="primary"
        @click="handleAudit(1)">提交审核 </el-button>
      <el-button v-show="hasAuthority('G1_15')" v-if="processDetail.status == 1" type="primary"
        @click="handleAudit(2)">审核通过</el-button>
      <el-button v-show="hasAuthority('G1_16')" v-if="processDetail.status == 1" type="primary"
        @click="handleAudit(3)">驳回</el-button>
      <el-button v-show="hasAuthority('G1_10')" v-if="processDetail.status == 2" type="primary"
        @click="showRelease = true">发布</el-button>
      <el-button v-show="hasAuthority('G1_8')" v-if="processDetail.status == 4" type="primary"
        @click="handleAudit(5)">停用</el-button>
      <el-button v-show="hasAuthority('G1_12')" v-if="processDetail.status == 4" type="primary"
        @click="handleSave(1)">更新</el-button>
    </div>
    <dl class="process-processArrangement-dl process-processArrangement-database">
      <dt>
        <div class="process-database-title">节点库</div>
      </dt>
      <dd class="process-database">
        <span v-for="item in nodeList" :key="item.nodeId" @click="handleSelectTag(item)"
          :class="{ selected: item.selected }">{{ item.nodeName }}</span>
      </dd>
    </dl>
    <dl v-if="currentNodeEdit && nodeListCurrent.length"
      class="process-processArrangement-dl process-processArrangement-attr">
      <dt>
        <span v-if="!isEditTitle">
          {{ currentNodeEdit.nodeName }}
          <!-- <i v-if="!isEditTitle" @click="editTitle" class="el-icon-edit"></i>  -->
        </span>
        <el-input v-else ref="inputref" v-model="currentNodeEdit.nodeName" placeholder="请输入内容"
          @blur="blurTitle"></el-input>
      </dt>
      <dd>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="基础属性" name="first">
            <ul class="node-basic-attributes">
              <li>节点进度：<el-input-number v-model="currentNodeEdit.progress" controls-position="right" :min="0" :max="100"
                  :controls="false"></el-input-number> %</li>
              <li>
                驳回节点：<el-select v-model="currentNodeEdit.rejectNode" placeholder="请选择" clearable>
                  <el-option v-for="item in currentNodeEdit.rejectNodeList" :key="item.value" :label="item.label"
                    :value="item.value"> </el-option>
                </el-select>
              </li>
              <!-- <li class="operation-button-set">
                <div class="operation-button-title">
                  <div class="operation-button-name">按钮名称</div>
                  <div>启用</div>
                </div>
                <div v-for="(btn, index) in currentNodeEdit.btnList" :key="index">
                  <div>{{ btn.functionName }}</div>
                  <el-switch v-model="btn.flag"></el-switch>
                </div>
              </li> -->
              <li>节点说明：<el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" placeholder="请输入内容"
                  v-model="currentNodeEdit.remarks"> </el-input></li>
            </ul>
            <div v-if="![1, 2, 4, 5].includes(processDetail.status)" class="currentNodeEdit-btn">
              <el-button type="primary" @click="currentNodeEditSave">保存</el-button>
              <el-button @click="currentNodeEditCancel">重置</el-button>
            </div>
          </el-tab-pane>
          <el-tab-pane label="表单显示" name="second">
            <div class="node-form-fields">
              <span>表单信息</span>
              <div class="node-form-fields-btn" v-if="![1, 2, 4, 5].includes(processDetail.status)">
                <el-button type="primary" size="mini" @click="formInformationDrawerShow">配置资料 </el-button>
                <el-button type="primary" size="mini" @click="
                  modifyFieldsHandle();
                fieldFlag = 'add';
                                    ">
                  添加字段</el-button>
                <el-button type="primary" size="mini" @click="showCopyNodeModal">复用其它节点</el-button>
              </div>
            </div>
            <div class="template-data-selected">
              <el-table :data="templateDataSelected" style="width: 100%" height="calc(100vh - 289px)">
                <el-table-column prop="date" label="序号">
                  <template slot-scope="scope">
                    {{ scope.$index + 1 }}
                  </template>
                </el-table-column>
                <el-table-column prop="moduleName" label="信息分类">
                  <template slot-scope="scope">
                    {{ getModuleName(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column prop="keyLabel" label="资料名称"> </el-table-column>
                <el-table-column prop="isNeed" label="是否必填">
                  <template slot-scope="scope">
                    {{ scope.row.isNeed ? '是' : '否' }}
                  </template>
                </el-table-column>
                <el-table-column prop="keyLabel" label="操作">
                  <template slot-scope="scope">
                    <el-button type="text" size="small" @click="modifyFieldsHandle(scope.row)"
                      v-if="![1, 2, 4, 5].includes(processDetail.status)">编辑 </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </dd>
    </dl>
    <dl class="process-processArrangement-dl process-processArrangement-view">
      <el-alert v-if="processDetail.status == 3" :title="'驳回原因：' + processDetail.reason" type="warning" show-icon
        :closable="false"></el-alert>
      <dt>请在左侧选择节点进行流程编排</dt>
      <dd class="submitted-information">
        <el-empty v-show="!nodeListCurrent.length" description="暂无数据"></el-empty>
        <draggable v-show="nodeListCurrent.length" :list="nodeListCurrent" animation="300" ghost-class="ghostClass"
          @end="dragEnd()" :disabled="[1, 2, 4, 5].includes(processDetail.status)">
          <div v-for="(item, index) in nodeListCurrent" :key="index">
            <div :class="{ selected: item.selectedView }" class="processArrangement-draggable"
              @click.stop="processArrangementHandle(item)">
              <span class="processArrangement-tag">{{ index + 1 }}</span>
              <span class="processArrangement-del" @click.stop="processArrangementDel(item, index)"
                v-if="![1, 2, 4, 5].includes(processDetail.status)">移除</span>
              <h3>{{ item.nodeName }}</h3>
              <ul class="currentNode-info" v-if="item.selectedView">
                <li>节点进度：{{ item.progress || 0 }}%</li>
                <li>驳回节点 : {{ getRejectNode(item) }}</li>
                <li>操作按钮： {{ getBtnTxt(item) }}</li>
                <li>节点备注：{{ item.remarks || '无' }}</li>
                <li>状态：{{ item.configColumn || templateDataSelected.length ? '已配置资料' : '待配置' }}</li>
              </ul>
            </div>
          </div>
        </draggable>
      </dd>
    </dl>
    <el-drawer destroy-on-close :wrapperClosable="false" size="80%" title="配置资料" :visible.sync="formInformationDrawer"
      class="form-Information-drawer">
      <FormInformation @drawerClose="drawerClose" @updateTemplateDataPreview="updateTemplateDataPreview"
        @updataTemplateDataSelected="updataTemplateDataSelected" @updateModuleSort="updateModuleSort"
        :templateData="templateData" :templateDataPreview="templateDataPreview" />
    </el-drawer>
    <el-drawer :wrapperClosable="false" size="80%" :title="drawerText" :visible.sync="modifyFieldsDrawer"
      class="form-Information-drawer">
      <div class="modify-fields-body">
        <el-alert v-if="fieldFlag == 'edit'" type="warning" :closable="false" show-icon style="margin-bottom: 16px">
          <template slot="title">
            <h4>说明</h4>
            <div>修改字段可以修改某个字段在此服务资料中的属性，但并不影响其基本属性。 若要修改字段的基本属性，请到字段配置页进行修改。</div>
          </template>
        </el-alert>
        <el-alert v-if="fieldFlag == 'add'" type="warning" :closable="false" show-icon style="margin-bottom: 16px">
          <template slot="title">
            <h4>说明</h4>
            <div>新增字段即在字段配置中添加了自定义字段，下次在配置其他服务资料时仍可直接选择。 此次保存的属性即为字段的基本属性。。</div>
          </template>
        </el-alert>
        <FieldConfig v-if="modifyFieldsDrawer" ref="editFieldRef" from="field-template" :id="selectedFieldId"
          :flow-id="flowId" :node-id="currentNodeEdit.nodeId" :selected-field="selectedField"
          @editTemplateField="editTemplateField" @addTemplateField="addTemplateField"
          @addFieldTitleSave="addFieldTitleSave" />
      </div>
      <div class="text-align-center">
        <el-button type="primary" @click="handleEditField">确定</el-button>
        <el-button @click="modifyFieldsDrawer = false">取消</el-button>
      </div>
    </el-drawer>
    <!-- 复用配置弹框 -->
    <el-dialog title="复用配置" :visible.sync="copyNodeModal" :close-on-click-modal="false" width="520px">
      <el-alert v-if="fieldFlag == 'edit'" type="warning" :closable="false" show-icon style="margin-bottom: 16px">
        <template slot="title">
          <h4>说明</h4>
          <div>即在此节点选择与其他节点相同的资料字段</div>
        </template>
      </el-alert>
      <div style="margin-bottom: 4px">请选择此节点要复用的节点配置：</div>
      <div>
        <el-select v-model="copyNodeId" clearable filterable placeholder="选择要复用的节点" style="width: 360px">
          <el-option :label="item.nodeName" :value="item.nodeId" v-for="(item, index) in copyNodeList"
            :key="index"></el-option>
        </el-select>
      </div>

      <div slot="footer" class="text-align-center">
        <el-button @click="copyNodeModal = false">取消</el-button>
        <el-button type="primary" @click="handleCopyNode">确定</el-button>
      </div>
    </el-dialog>
    <ReleaseProcessVue v-if="showRelease" :visible.sync="showRelease"
      :releaseData="{ ...releaseData, destination: '' }" />
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import FormInformation from './formInformation.vue';
import { findNodes, addProcess, updateProcess, getProcessDetail, auditProcess, publishProcess } from '@/api/newApi/processFields/processConfig';
import { supplierList, getServiceFunction, serviceWorkflowSubmitAudit, serviceWorkflowStopWorkFlow } from '@/api/newApi/workOrder/processConfiguration';
import { findModuleFields, findTemplateFields, getProcessInfo } from '@/api/newApi/processFields/templateConfig';
import ReleaseProcessVue from './../../processManagement/components/release/releaseProcess.vue';
import FieldConfig from '@/view/module/workOrder/fieldConfig/editField';
import { cloneDeep, sortBy } from 'lodash';
export default {
  components: { draggable, FormInformation, FieldConfig, ReleaseProcessVue },
  name: 'processChoreography',
  props: {
    processFormPrev: {
      type: Object,
    },
    releaseData: {
      type: Object,
    },
  },
  data() {
    return {
      processDetail: {},
      // processForm: {},
      // 对应的流程以及所属节点id
      flowId: '',
      nodeId: '',
      // 流程详情
      processInfo: {},
      // 复用配置操作
      copyNodeModal: false,
      copyNodeList: [],
      copyNodeId: '',
      //模板列表
      templateData: [], //资料库
      templateDataPreview: [], //已添加的资料
      templateDataSelected: [], //表单信息
      formInformationDrawer: false,
      modifyFieldsDrawer: false,
      modifyFieldsCurrent: {},
      fieldFlag: 'edit', // edit or add
      // 编辑对应的模块和字段id
      selectedModuleId: '',
      selectedField: {},
      selectedFieldId: '',
      addFieldTitle: '', //添加字段的标题
      //操作按钮列表
      handleBtnList: [],
      nodeList: [],
      isEditTitle: false,
      nodeListCurrent: [],
      currentNodeEdit: '',
      activeName: 'first',
      showRelease: false,
      drawerText: '添加字段'
      // releaseData: {},
    };
  },
  computed: {
    processForm() {
      return this.processFormPrev;
    },
  },
  watch: {
    templateDataSelected: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        this.updateFormInfo(newVal);
      },
    },
    nodeList: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) { },
    },
  },
  created() {
    if (localStorage.processConfigurationInfo) {
      this.processForm = JSON.parse(localStorage.processConfigurationInfo);
    }
    this.flowId = this.$route.query.fid || 0;
    document.body.ondrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
    };
  },
  mounted() {
    //编辑时获取详情
    if (this.flowId) {
      this.queryProcessDetail();
    } else {
      this.getNodeBtn();
    }
  },
  methods: {
    //预览
    handlePreview() {
      let routeUrl = this.$router.resolve({
        path: '/processPreview',
        query: { fid: this.flowId },
      });
      window.open(routeUrl.href, '_blank');
    },
    //提交审核
    handleAudit(type) {
      if (type == 1) {
        this.$confirm('请仔细核对流程信息', '确认提交审核吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          serviceWorkflowSubmitAudit({ flowId: this.flowId }).then((res) => {
            if (res.code == 0) {
              this.$message.success('操作成功！');
              this.queryProcessDetail();
            }
          });
        });
      } else if (type == 2) {
        this.$confirm('审核通过后无法修改', '确认审核通过吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          serviceWorkflowSubmitAudit({ flowId: this.flowId, operation: 1 }).then((res) => {
            if (res.code == 0) {
              this.$message.success('操作成功！');
              this.queryProcessDetail();
            }
          });
        });
      } else if (type == 4) {
        this.$confirm('发布后无法修改', '确认发布吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          auditProcess({ flowId: this.flowId, operation: 1 }).then((res) => {
            if (res.code == 0) {
              this.$message.success('操作成功！');
              this.queryProcessDetail();
            }
          });
        });
      } else if (type == 3) {
        this.$prompt('请填写驳回原因:', '确认驳回吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\S+/,
          inputErrorMessage: '请填写驳回原因',
        }).then(({ value }) => {
          serviceWorkflowSubmitAudit({ flowId: this.flowId, operation: 2, reason: value }).then((res) => {
            if (res.code == 0) {
              this.$message.success('操作成功！');
              this.queryProcessDetail();
            }
          });
        });
      } else if (type == 5) {
        this.$confirm('停用后无法修改，不影响历史工单流程', '确认停用吗?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          serviceWorkflowStopWorkFlow(this.flowId).then((res) => {
            if (res.code == 0) {
              this.$message.success('操作成功！');
              this.queryProcessDetail();
            }
          });
        });
      }
    },
    //保存提交
    handleSave(type) {
      let handleNodeListCurrent = cloneDeep(this.nodeListCurrent);
      handleNodeListCurrent.forEach((item, i) => {
        item.sort = i;
        if (item.rejectNode) {
          let rejectNodeHandle = cloneDeep(this.nodeListCurrent.filter((itemCurr) => itemCurr.nodeId == item.rejectNode)[0]);
          rejectNodeHandle.rejectNode = {};
          item.rejectNode = cloneDeep(rejectNodeHandle);
        } else {
          item.rejectNode = {};
        }
        item.functions = item.btnList
          .filter((item) => item.flag)
          .map((item) => {
            return { functionName: item.functionName, functionId: item.id };
          });
      });
      if (!handleNodeListCurrent.length) return this.$message.warning('请选择节点！');
      let flowNameHandle = `[${this.processForm.countryName}]${this.processForm.flowType}`;
      if (this.flowId) {
        if (type == 1) {
          console.log(this.$route.query);
          this.$confirm('更新前需要创建相同的流程，发布成功后会停用旧流程', '想要更新此流程吗?', {
            confirmButtonText: '立即创建',
            cancelButtonText: '取消',
            type: 'warning',
          }).then(() => {
            publishProcess({ ...this.processForm, forwardNodes: handleNodeListCurrent, flowName: flowNameHandle, flowId: this.flowId, oldFlowId: this.flowId }).then((res) => {
              if (res.code == 0) {
                let queryVal = this.$route.query;
                let routeUrl = this.$router.resolve({
                  path: this.$route.path,
                  query: {
                    bType: queryVal.bType,
                    code: queryVal.code,
                    wType: queryVal.wType,
                    fid: res.data,
                  },
                });
                window.open(routeUrl.href, '_blank');
              }
            });
          });
        } else {
          updateProcess({ ...this.processForm, forwardNodes: handleNodeListCurrent, flowName: flowNameHandle, flowId: this.flowId }).then((res) => {
            if (res.code == 0) {
              this.$message.success('修改成功！');
            }
          });
        }
      } else {
        addProcess({ ...this.processForm, forwardNodes: handleNodeListCurrent, flowName: flowNameHandle }).then((res) => {
          if (res.code == 0) {
            this.$message.success('添加成功！');
            this.flowId = res.data;
            this.processForm.flowId = res.data;
            this.queryProcessDetail();
          }
        });
      }
    },
    //获取节点和操作按钮
    getNodeBtn() {
      getServiceFunction().then((res) => {
        if (res.code == 0) {
          this.handleBtnList = res.data.map((item) => {
            item.flag = false;
            return item;
          });
          //查询节点库
          this.queryNodeList();
        }
      });
    },
    //查询所有可添加流程节点列表
    queryNodeList() {
      findNodes({
        functionCode: this.processForm.functionCode,
        // status: 1,
      }).then((res) => {
        if (res.code == 0) {
          this.nodeList = res.data.map((item) => {
            return {
              ...item,
              selected: false,
              // selectedView: false,
              sort: 0,
              remarks: '',
              rejectNode: '',
              rejectNodeList: [],
              btnList: cloneDeep(this.handleBtnList),
              progress: 0,
              configColumn: false,
              columnsRelations: [],
              moduleList: [],
            };
          });
          //详情回显
          if (this.processDetail.forwardNodes && this.processDetail.forwardNodes.length) {
            this.nodeListCurrent = [];
            this.processDetail.forwardNodes.forEach((item, index) => {
              this.nodeList.forEach((itemNode) => {
                if (itemNode.nodeId == item.nodeId) {
                  itemNode.selected = true;
                  // if (!index) itemNode.selectedView = true
                  let functionNames = item.functions.map((item) => item.functionName);
                  itemNode.btnList.forEach((btn) => {
                    if (functionNames.includes(btn.functionName)) {
                      btn.flag = true;
                    }
                  });
                  itemNode.moduleList = item.moduleList;
                  item.rejectNode = item.rejectNode.nodeId;
                  this.nodeListCurrent.push(cloneDeep(Object.assign(itemNode, item)));
                  this.currentNodeEdit = cloneDeep(this.nodeListCurrent[0]);
                  this.templateDataSelected = cloneDeep(this.nodeListCurrent[0].columnsRelations);
                  //表单信息templateDataSelected排序
                  this.sortTableInformation();
                  this.updateRejectionNode();
                }
              });
            });
          }
        }
      });
    },
    /**
     * 查询流程详情
     */
    queryProcessDetail() {
      getProcessDetail({ flowId: this.flowId }).then((res) => {
        if (res.code == 0) {
          this.processDetail = res.data;
          this.getNodeBtn();
          this.$emit('updataProcessDetail', res.data);
        }
      });
    },
    //上一步
    handlePrev() {
      this.$emit('handleNext', 'first');
    },

    /**
     * 复用配置操作
     */
    showCopyNodeModal() {
      // 过滤掉当前的节点
      this.copyNodeList = this.nodeListCurrent.filter((item) => item.nodeId != this.currentNodeEdit.nodeId);
      this.copyNodeModal = true;
    },
    // 根据选择的节点，查询对应的字段配置
    handleCopyNode() {
      findTemplateFields({
        nodeId: this.copyNodeId,
        workFlowId: this.flowId,
      }).then((res) => {
        if (res.code == 0) {
          this.copyNodeModal = false;
          // 将复制的节点下选中的字段，勾选到当前节点的字段里
          // 根据传递的 columnId ，获取到对应的selected值
          const findField = (columnId) => {
            for (let v of res.data) {
              for (let vv of v.columns) {
                if (vv.columnId == columnId) {
                  return vv;
                }
              }
            }
          };

          // 合并复制的字段selected
          this.templateData.forEach((v) => {
            v.columns.map((vv) => {
              vv.selected = 0;
              let field = findField(vv.columnId);
              if (field) {
                // vv.selected = 1;
                Object.assign(vv, field);
              }
            });
          });
          //更新表单信息table
          let copiedNode = this.nodeListCurrent.filter((item) => item.nodeId == this.copyNodeId)[0];
          this.updataTemplateDataSelected(copiedNode);
          //更新已选资料视图
          this.queryTemplateFields(this.copyNodeId);
        }
      });
    },
    //查询所有模块字段列表 isAdd新增字段更新标记
    queryFields(isAdd) {
      findModuleFields({
        nodeId: this.currentNodeEdit.nodeId,
        workFlowId: this.flowId,
      }).then((res) => {
        if (res.code == 0) {
          if (isAdd) {
            this.updataAllData(res.data);
          } else {
            this.templateData = cloneDeep(res.data);
            if (!this.currentNodeEdit.columnsRelations.length) {
              this.templateData.forEach((dataItem) => {
                dataItem.columns.forEach((ele) => {
                  if (ele.selected) {
                    this.templateDataSelected.push({ ...ele });
                  }
                });
              });
            } else {
              this.templateDataSelected = cloneDeep(this.currentNodeEdit.columnsRelations);
            }
            //表单信息templateDataSelected排序
            this.sortTableInformation();
          }
        }
      });
    },
    //新增字段更新资料库，已添加资料，表单信息
    updataAllData(resData) {
      let newNode = {};
      resData.forEach((dataItem) => {
        dataItem.columns.forEach((ele) => {
          if (this.addFieldTitle == ele.keyLabel) {
            newNode = { ...ele, selected: 1 };
          }
        });
      });
      //更新资料库
      this.templateData.forEach((dataItem) => {
        if (dataItem.moduleId == newNode.moduleId) {
          dataItem.columns.push(cloneDeep(newNode));
        }
      });
      //更新表单信息
      this.templateDataSelected.push(cloneDeep(newNode));
      //表单信息templateDataSelected排序
      this.sortTableInformation();
      //更新已添加资料
      let isAdd = false;
      this.templateDataPreview.forEach((group) => {
        if (group.moduleId == newNode.moduleId) {
          isAdd = true;
          group.columns.push(newNode);
        }
      });
      if (!isAdd) {
        this.templateData.filter((group) => group.moduleId == newNode.moduleId);
        let moduleHandle = cloneDeep(this.templateData.filter((group) => group.moduleId == newNode.moduleId));
        moduleHandle.columns = [newNode];
        this.templateDataPreview.push(moduleHandle);
      }
    },
    //更新表单信息table数据 copiedNode被复制的节点
    updataTemplateDataSelected(copiedNode) {
      this.templateDataSelected = [];
      this.templateData.forEach((dataItem) => {
        dataItem.columns.forEach((ele) => {
          if (ele.selected) {
            this.templateDataSelected.push({ ...ele });
          }
        });
      });
      //保存排序信息
      this.nodeListCurrent.forEach((item, index) => {
        if (item.nodeId == this.currentNodeEdit.nodeId) {
          let moduleListArr = [];
          this.templateDataPreview.forEach((ele, index) => {
            moduleListArr.push({ moduleId: ele.moduleId, sort: index });
          });
          item.moduleList = moduleListArr;
          this.currentNodeEdit.moduleList = moduleListArr;
        }
      });
      if (copiedNode) {
        //取被复制的节点排序
        this.currentNodeEdit.moduleList = copiedNode.moduleList;
        this.nodeListCurrent.forEach((item) => {
          if (item.nodeId == this.currentNodeEdit.nodeId) {
            item.moduleList = copiedNode.moduleList;
          }
        });
      }
      //表单信息templateDataSelected排序
      this.sortTableInformation();
    },
    //查询流程节点对应的字段模板 copeNodeId取复制节点的数据
    queryTemplateFields(copeNodeId) {
      findTemplateFields({
        nodeId: copeNodeId || this.nodeId,
        workFlowId: this.flowId,
      }).then((res) => {
        if (res.code == 0) {
          this.templateDataPreview = res.data;
        }
      });
    },
    //打开资料配置
    formInformationDrawerShow() {
      this.templateData.forEach((dataItem) => {
        dataItem.columns.forEach((ele, index) => {
          ele.selected = false;
          this.templateDataSelected.forEach((itemSelected) => {
            if (ele.columnId == itemSelected.columnId) {
              itemSelected.selected = true;
              dataItem.columns.splice(index, 1, itemSelected);
            }
          });
        });
      });
      this.templateDataPreview = [];
      this.templateData.forEach((dataItem) => {
        let currentDataItem = cloneDeep(dataItem);
        currentDataItem.columns = [];
        dataItem.columns.forEach((ele) => {
          if (ele.selected) {
            ele.inputType = Number(ele.inputType);
            currentDataItem.columns.push(ele);
          }
        });
        if (currentDataItem.columns.length) {
          this.currentNodeEdit.moduleList.forEach((item) => {
            if (item.moduleId == currentDataItem.moduleId) {
              this.$set(currentDataItem, 'sort', item.sort);
            }
          });
          if (!currentDataItem.sort == undefined) {
            this.$set(currentDataItem, 'sort', 99);
          }
          this.templateDataPreview.push(currentDataItem);
        }
      });
      this.templateDataPreview = sortBy(this.templateDataPreview, 'sort');
      this.templateDataPreview.forEach((item, index) => {
        item.sort = index;
      });
      this.formInformationDrawer = true;
    },
    //更新预览数据
    updateTemplateDataPreview() {
      this.templateDataPreview = this.templateDataPreview.filter((temp) => temp.columns.length);
    },
    //更新模块排序
    updateModuleSort(index, type) {
      this.templateDataPreview.forEach((item, key) => {
        if (index == key) {
          if (type == 'up' && key > 0) {
            item.sort = key - 1;
            this.templateDataPreview[key - 1].sort = key;
          } else if (type == 'down' && key < this.templateDataPreview.length - 1) {
            item.sort = key + 1;
            this.templateDataPreview[key + 1].sort = key;
          }
        }
      });
      this.templateDataPreview = sortBy(this.templateDataPreview, 'sort');
    },
    //关闭配置资料抽屉
    drawerClose() {
      this.formInformationDrawer = false;
    },
    //关闭添加修改字段抽屉
    modifyFieldsDrawerClose() {
      this.modifyFieldsDrawer = false;
    },
    /**
     * 展示编辑字段弹框
     */
    modifyFieldsHandle(row) {
      this.drawerText = row ? '修改字段' : '添加字段';
      this.selectedModuleId = row ? row.moduleId : '';
      this.selectedFieldId = row ? row.id : '';
      this.selectedField = row ? row : {};
      this.modifyFieldsDrawer = true;
    },
    // 点击确定
    handleEditField() {
      this.$refs.editFieldRef.handleSubmit();
    },
    // 编辑字段后的回调信息
    editTemplateField(field) {
      this.templateDataSelected.forEach((item) => {
        if (item.id == field.id) {
          item = Object.assign(item, field);
        }
      });
      this.templateData.forEach((dataItem) => {
        dataItem.columns.forEach((ele) => {
          if (ele.id == field.id) {
            ele = Object.assign(ele, field);
          }
        });
      });
      this.templateDataPreview.forEach((dataItem) => {
        dataItem.columns.forEach((ele) => {
          if (ele.id == field.id) {
            field.inputType = Number(field.inputType);
            ele = Object.assign(ele, field);
          }
        });
      });
      this.$forceUpdate();
      this.$message({
        type: 'success',
        message: '修改成功',
      });
      this.modifyFieldsDrawer = false;
    },
    // 新增字段后的回调信息
    addTemplateField() {
      this.modifyFieldsDrawer = false;
      this.queryFields(true);
    },
    //保存添加字段标题
    addFieldTitleSave(val) {
      this.addFieldTitle = val;
    },
    //获取分类信息
    getModuleName(row) {
      let currModule = this.templateData.filter((item) => item.moduleId == row.moduleId)[0];
      if (currModule) {
        return currModule.moduleName;
      }
    },
    //更新节点中的表单信息
    updateFormInfo(newVal) {
      this.nodeListCurrent.forEach((item, index) => {
        if (item.nodeId == this.currentNodeEdit.nodeId) {
          newVal.forEach((itemVal) => {
            itemVal.nodeId = this.currentNodeEdit.nodeId;
          });
          item.columnsRelations = cloneDeep(newVal);
          this.currentNodeEdit.columnsRelations = cloneDeep(newVal);
        }
      });
    },
    //切换TAB
    handleClick() { },
    //获取选中节点的驳回节点的文本
    getRejectNode(item) {
      let txt = '无';
      if (item.rejectNode) {
        return item.rejectNodeList.filter((node) => node.value == item.rejectNode)[0].label;
      }
      return txt;
    },
    getBtnTxt(item) {
      let txt = '无';
      let btnHandle = item.btnList.filter((btn) => btn.flag);
      if (btnHandle.length) {
        return btnHandle.map((btn) => btn.functionName).join();
      }
      return txt;
    },
    //保存节点信息
    currentNodeEditSave() {
      this.nodeListCurrent.forEach((item, index) => {
        if (item.nodeId == this.currentNodeEdit.nodeId) {
          this.nodeListCurrent.splice(index, 1, cloneDeep(this.currentNodeEdit));
        }
      });
      this.updateRejectionNode();
    },
    //重置节点信息
    currentNodeEditCancel() {
      this.nodeList.forEach((item) => {
        if (item.nodeId == this.currentNodeEdit.nodeId) {
          this.currentNodeEdit = cloneDeep(item);
        }
        this.nodeListCurrent.forEach((itemCurr, index) => {
          if (item.nodeId == itemCurr.nodeId) {
            this.nodeListCurrent.splice(index, 1, cloneDeep(item));
          }
        });
      });
    },
    //编辑节点标题
    editTitle() {
      this.isEditTitle = true;
      this.$nextTick(() => {
        this.$refs.inputref.focus();
      });
    },
    blurTitle() {
      this.isEditTitle = false;
    },
    //表单显示中的表单信息排序
    sortTableInformation() {
      if (this.currentNodeEdit.moduleList && this.currentNodeEdit.moduleList.length) {
        this.templateDataSelected = sortBy(this.templateDataSelected, 'sort');
        let templateDataSelectedHandle = [];
        this.currentNodeEdit.moduleList.forEach((item) => {
          this.templateDataSelected.forEach((col) => {
            if (col.moduleId == item.moduleId) {
              templateDataSelectedHandle.push(col);
            }
          });
        });
        this.templateDataSelected = templateDataSelectedHandle;
      }
    },
    //排序
    dragEnd() {
      this.$forceUpdate();
      this.updateRejectionNode('drag');
    },
    //更新节点
    updateRejectionNode(flag) {
      if (!this.nodeListCurrent.filter((item) => item.selectedView).length) {
        this.nodeListCurrent.forEach((item, index) => {
          if (!index) {
            item.selectedView = true;
            // this.nodeList.forEach(node => {
            //     if (node.nodeId == item.nodeId) {
            //         item.selectedView = true
            //     } else {
            //         item.selectedView = false
            //     }
            // })
          }
        });
      }
      for (let i = 0; i < this.nodeListCurrent.length; i++) {
        this.nodeListCurrent[i].rejectNodeList = [];
        for (let x = 0; x < i; x++) {
          this.nodeListCurrent[i].rejectNodeList.push({ label: this.nodeListCurrent[x].nodeName, value: this.nodeListCurrent[x].nodeId });
        }
        let rejectNodeflag = true;
        this.nodeListCurrent[i].rejectNodeList.forEach((item) => {
          if (item.value == this.nodeListCurrent[i].rejectNode) {
            rejectNodeflag = false;
          }
        });
        if (flag == 'drag' && rejectNodeflag) {
          this.nodeListCurrent[i].rejectNode = '';
        }
      }
      this.nodeListCurrent.forEach((item) => {
        if (item.selectedView) {
          this.currentNodeEdit = cloneDeep(item);
          //资料库
          this.queryFields();
        }
      });
    },
    //选中节点
    handleSelectTag(node) {
      if ([1, 2, 4, 5].includes(this.processDetail.status)) {
        return false
      }
      node.selected = !node.selected;
      if (node.selected) {
        this.nodeListCurrent.push(cloneDeep(node));
      } else {
        this.nodeListCurrent.forEach((itemCurr, index) => {
          if (node.nodeId == itemCurr.nodeId) {
            this.nodeListCurrent.splice(index, 1);
          }
        });
      }
      // this.nodeListCurrent = cloneDeep(this.nodeList.filter(item => item.selected))
      this.updateRejectionNode('drag');
    },
    //选中中间编排
    processArrangementHandle(node) {
      console.log(4549)
      this.nodeListCurrent.forEach((item) => (item.selectedView = false));
      node.selectedView = !node.selectedView;
      // this.nodeList.forEach(item => {
      //     if (node.nodeId == item.nodeId) {
      //         item.selectedView = true
      //     } else {
      //         item.selectedView = false
      //     }
      // })

      this.currentNodeEdit = cloneDeep(node);
      this.templateDataSelected = cloneDeep(this.currentNodeEdit.columnsRelations);
      //资料库
      this.queryFields();
    },
    //删除选中节点
    processArrangementDel(node, index) {
      this.nodeList.forEach((item) => {
        if (item.nodeId == node.nodeId) {
          item.selected = false;
          // item.selectedView = false
        }
      });
      this.nodeListCurrent.splice(index, 1);
      this.updateRejectionNode('drag');
    },
  },
};
</script>
<style lang="scss" scoped>
.process-handle-btn {
  position: absolute;
  top: 16px;
  right: 32px;
}

.process-processArrangement {
  min-width: 1100px;
  margin: 20px;
  height: calc(100% - 110px);
}

.process-processArrangement-database {
  width: 250px;
  float: left;

  .process-database {
    padding: 20px;

    span {
      width: 165px;
      height: 32px;
      line-height: 32px;
      border: 1px solid #dcdfe6;
      display: block;
      margin-bottom: 20px;
      padding-left: 16px;
      cursor: pointer;
    }
  }

  .selected {
    border: solid 1px #ebf5ff !important;
    background: #ebf5ff;
    color: #333;
  }
}

.processArrangement-draggable {
  cursor: pointer;
  margin-bottom: 30px;
  min-height: 70px;
  border: 1px solid #dcdfe6;
  position: relative;
  padding-left: 45px;
  padding-top: 1px;

  &:hover {
    background: #f6fbff;
    border: solid 1px #f6fbff !important;
  }

  &.selected {
    background: #ebf5ff;
    border: solid 1px #ebf5ff !important;
  }

  h3 {
    color: #333;
    font-weight: 500;
    margin-top: 23px;
  }

  .processArrangement-del {
    position: absolute;
    right: 10px;
    top: 50%;
    margin-top: -6px;
    color: #1890ff;
    cursor: pointer;
  }
}

.process-processArrangement-attr {
  width: 500px;
  float: right;

  dt {
    i {
      color: #1890ff;
      cursor: pointer;
    }
  }
}

.node-basic-attributes {
  li {
    margin-bottom: 20px;
  }

  ::v-deep .el-input,
  ::v-deep .el-textarea {
    width: 200px;
    vertical-align: middle;
  }

  ::v-deep .el-input-number {
    width: 200px;

    .el-input__inner {
      text-align: left;
    }
  }
}

.process-processArrangement-view {
  margin: 0 515px 0 265px;
}

.process-processArrangement-dl {
  height: 100%;
  background-color: #fff;
  border-radius: 2px;

  dt {
    padding: 20px 20px 0;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  dd {
    padding: 20px;
  }
}

.operation-button-title {
  font-weight: bold;
}

.operation-button-set {
  background: #f8f8f8;
  padding: 10px 0;

  >div {
    display: flex;
    align-items: center;
    width: 100%;
    margin: 10px;

    >div {
      width: 100px;
      flex-grow: 2;
    }

    /* .operation-button-name {
            width: 200px;
            margin-right: 10px;
        } */
  }
}

.currentNode-info {
  margin-top: 10px;
  margin-bottom: 24px;
  list-style: none;
}

.node-form-fields {
  overflow: hidden;
  margin-bottom: 15px;

  >span {
    font-size: 14px;
    position: relative;
    top: 5px;
  }
}

.node-form-fields-btn {
  float: right;
}

.form-Information-drawer {
  ::v-deep .el-drawer__header {
    margin-bottom: 0px;

    span {
      font-size: 18px;
    }
  }
}

.template-data-selected {
  height: 100%;
  overflow-y: auto;
}

.modify-fields-body {
  padding: 20px;
  height: calc(100vh - 100px);
  overflow-y: auto;
}

.currentNodeEdit-btn {
  margin-top: 60px;
  text-align: right;
}

.processArrangement-tag {
  position: absolute;
  top: -1px;
  left: -1px;
  width: 16px;
  height: 20px;
  background: #55adff;
  color: #fff;
  text-align: center;
  line-height: 16px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    border: 8px solid #55adff;
    border-top-width: 3px;
    border-bottom-width: 3px;
    border-bottom-color: #fff;
  }
}</style>
