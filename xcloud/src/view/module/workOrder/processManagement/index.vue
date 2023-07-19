<template>
  <div class="main">
    <div class="left-tree">
      <div class="head">业务分类</div>
      <div><ClassifyMenu @change="(val) => ((businessMenu = val), (listQuery.functionCode = val.code), search())" /></div>
    </div>
    <div class="app-container">
      <div class="header-container" ref="searchBox">
        <el-form ref="searchForm" inline>
          <el-form-item label="流程名称" class="m-r-30" prop="flowName">
            <el-input v-model="listQuery.flowName" placeholder="请输入流程名称" clearable style="width: 140px" />
          </el-form-item>
          <el-form-item class="m-r-30" label="公司主体" prop="enterpriseName">
            <el-select style="width: 140px" v-model="listQuery.enterpriseId" clearable filterable default-first-option @change="querySupplierList" placeholder="选择企业">
              <el-option :value="item.id" :label="item.name" v-for="item in enterpriseList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="m-r-30" label="国家">
            <el-select style="width: 140px" v-model="listQuery.countryCode" clearable filterable default-first-option @change="querySupplierList" placeholder="选择国家">
              <el-option :value="item.countryCode" :label="item.countryNameZh" v-for="item in countryList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="m-r-30" label="供应商">
            <el-select style="width: 140px" v-model="listQuery.supplierId" placeholder="选择服务商" clearable filterable>
              <el-option :value="item.id" :label="item.shortName" v-for="item in supplierList" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="m-r-30" label="状态">
            <el-select style="width: 120px" v-model="listQuery.status" placeholder="选择状态" clearable>
              <el-option :value="0" label="草稿"></el-option>
              <el-option :value="1" label="待审核"></el-option>
              <el-option :value="2" label="已审核"></el-option>
              <el-option :value="3" label="已驳回"></el-option>
              <el-option :value="4" label="已发布"></el-option>
              <el-option :value="5" label="已停用"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="m-r-30">
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="default" icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
          </el-form-item>
          <el-form-item style="float: right">
            <router-link target="_blank" v-show="hasAuthority('G1_1')" :to="{ path: '/processConfiguration', query: { code: businessMenu.code, bType: businessMenu.fatherNode.name, wType: businessMenu.name } }">
              <el-button type="success">
                <i class="icon icon-square-add"></i>
                <span>新增</span>
              </el-button>
            </router-link>
          </el-form-item>
        </el-form>
      </div>

      <!-- 列表 -->
      <div class="table-container">
        <el-table :height="tableHeight" ref="table" :data="list" border v-loading="listLoading" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
          <Empty slot="empty" />
          <el-table-column align="center" label="序号" width="70">
            <template slot-scope="{ $index }">
              {{ listQuery.limit * (listQuery.page - 1) + $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="流程名称">
            <template slot-scope="{ row }">{{ row.flowName }}</template>
          </el-table-column>
          <el-table-column align="center" label="公司主体">
            <template slot-scope="{ row }">{{ row.enterpriseName }}</template>
          </el-table-column>
          <el-table-column align="center" label="服务国家">
            <template slot-scope="{ row }">{{ row.countryNameCH }}</template>
          </el-table-column>
          <el-table-column align="center" label="供应商">
            <template slot-scope="{ row }"> {{ row.serviceProviderName }}</template>
          </el-table-column>
          <el-table-column align="center" label="流程状态">
            <template slot-scope="{ row }">
              {{ row.status == 0 ? '草稿' : row.status == 1 ? '待审核' : row.status == 3 ? '已驳回' : row.status == 4 ? '已发布' : row.status == 5 ? '已停用' : '已审核' }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="预警状态" min-width="80">
            <template slot-scope="{ row }">
              <el-switch :width="50" v-model="row.tackStatus" active-color="#1890ff" active-text="上线" inactive-text="关闭" active-value="ENABLE" inactive-value="STOP" @change="switChange(row)" inactive-color="#E1E1E1"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column align="center" label="备注">
            <template slot-scope="{ row }"> {{ row.remarks }}</template>
          </el-table-column>
          <el-table-column align="center" label="审核人">
            <template slot-scope="{ row }">
              {{ row.modifyName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="审核时间" width="150">
            <template slot-scope="{ row }">{{ row.updateTime }}</template>
          </el-table-column>
          <el-table-column align="center" label="创建人">
            <template slot-scope="{ row }">
              {{ row.createName }}
            </template>
          </el-table-column>
          <el-table-column align="center" label="创建时间" width="150">
            <template slot-scope="{ row }">{{ row.createTime }}</template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="280" fixed="right">
            <template slot-scope="{ row }">
              <el-tooltip content="预览" placement="top" v-show="hasAuthority('G1_6')">
                <router-link target="_blank" :to="{ path: '/processPreview', query: { fid: row.flowId } }">
                  <el-link type="primary" class="icon icon_preview" :underline="false"> </el-link>
                </router-link>
              </el-tooltip>

              <el-tooltip content="配置" placement="top" v-show="hasAuthority('G1_7')">
                <router-link target="_blank" :to="{ path: '/processConfiguration', query: { fid: row.flowId, code: listQuery.functionCode, bType: businessMenu.fatherNode.name, wType: businessMenu.name } }">
                  <el-link type="primary" class="icon icon-configure" :underline="false"> </el-link>
                </router-link>
              </el-tooltip>
              <!-- test -->
              <el-tooltip v-if="row.status == 4" content="停用" placement="top" v-show="hasAuthority('G1_8')">
                <el-link type="primary" class="icon icon-disable" :underline="false" @click="useStop(row)"> </el-link>
              </el-tooltip>
              <!-- test -->
              <el-tooltip content="复制" placement="top" v-show="hasAuthority('G1_9') && row.status != 3">
                <el-link class="icon icon-copy" type="primary" :underline="false" @click="(copyFlowNode = true), (copyFolwInfo = row)"> </el-link>
              </el-tooltip>

              <el-tooltip content="发布" v-if="row.status == 2" placement="top" v-show="hasAuthority('G1_10')">
                <el-link type="primary" class="icon icon-publish" :underline="false" @click="(showRelease = true), (releaseData = row)"> </el-link>
              </el-tooltip>

              <el-tooltip content="删除" v-if="[0, 1, 2, 3].includes(row.status)" placement="top" v-show="hasAuthority('G1_11')">
                <el-link type="primary" class="icon icon-del" :underline="false" @click="delect(row)"> </el-link>
              </el-tooltip>

              <el-tooltip content="更新" v-if="row.status == 4" placement="top" v-show="hasAuthority('G1_12')">
                <el-link type="primary" class="icon el-icon-refresh" :underline="false" @click="updateFilow(row)"> </el-link>
              </el-tooltip>
              <el-tooltip content="取消" v-if="row.status == 1" placement="top" v-show="hasAuthority('G1_17')">
                <el-link type="primary" class="icon el-icon-circle-close" :underline="false" @click="changeFilow(row)"> </el-link>
              </el-tooltip>
              <el-tooltip content="预警配置" placement="top" v-show="hasAuthority('G1_18')">
                <el-link type="primary" class="icon icon-work-wing" :underline="false" @click="(showWaringFollow = true), (waringFollowItem = row)"> </el-link>
              </el-tooltip>
              <el-tooltip content="转入工单" v-if="row.status == 4 && isWorder" placement="top" v-show="hasAuthority('G1_19')">
                <router-link target="_blank" :to="{ path: '/transferWorkOrder', query: { fid: row.flowId, code: listQuery.functionCode, bType: businessMenu.fatherNode.name, wType: businessMenu.name, functionCode: row.functionCode, createTime: row.createTime, createName: row.createName } }">
                  <el-link type="primary" class="icon el-icon-document-checked" :underline="false"> </el-link>
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.page" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
      </div>
    </div>
    <CopyFolwNodeDialogVue v-if="copyFlowNode" :visible.sync="copyFlowNode" :processInfo="{ ...copyFolwInfo, functionCode: businessMenu.code, destination: `${businessMenu.fatherNode.name + '-' + businessMenu.name}` }" />
    <ReleaseProcessVue v-if="showRelease" :visible.sync="showRelease" :releaseData="{ ...releaseData, destination: `${businessMenu.fatherNode.name + '-' + businessMenu.name}` }" />
    <WaringFollowVue v-if="showWaringFollow" :visible.sync="showWaringFollow" :detail="waringFollowItem" />
  </div>
</template>
<script>
import { findProducts, findCountrys, newfindProcesses, publishProcess, findProcesses, stopWorkFlow, deleteWorkFlow, changeWorkFlowStatus, getToOnline } from '@/api/newApi/processFields/processConfig';
import cacheQuery from '@/mixins/cacheQuery';
import { MessageBox } from 'element-ui';
import ClassifyMenu from './components/classifyMenu.js';
import CopyFolwNodeDialogVue from './components/copyFlowNodeDialog/copyFolwNodeDialog.vue';
import ReleaseProcessVue from './components/release/releaseProcess.vue';
import { typeOf } from 'mathjs';
import { listEnableAll } from '@/api/newApi/common.js';
export default {
  data() {
    return {
      // 商品，国家，服务商，状态
      productList: [],
      countryList: [],
      supplierList: [],
      enterpriseList: [],
      // 分页查询
      list: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        flowName: '',
        countryCode: '',
        supplierId: '',
        page: 1,
        limit: 10,
      },
      cacheKey: 'listQuery',
      copyListQuery: {},
      copyFlowNode: false,
      copyFolwInfo: {},
      releaseData: {},
      businessMenu: {
        name: '',
        code: '',
        fatherNode: {
          name: '',
        },
      },
      showRelease: false,
      showWaringFollow: false,
      waringFollowItem: {},
      nameArry: [
        'VAT注册',
        'VAT转代理',
        '海牙认证',
        'VAT退税',
        '税务稽查',
        '税号注销',
        'IOSS注册',
        '授权代表',
        '国际商标注册',
        '外观专利',
        '意向注册',
        'EPR注册',
        'EPR转代理',
        '德国WEEE加类加品牌',
        '电池法_注册',
        '包装法_注册',
        '纺织法_注册',
        '家具法_注册',
        '印刷法_注册',
        '轮胎法_注册',
        '玩具法_注册',
        'WEEE_注册',
      ],
      isWorder: false,
    };
  },
  components: {
    ClassifyMenu,
    CopyFolwNodeDialogVue,
    ReleaseProcessVue,
    WaringFollowVue: () => import('./components/waringFollow/waringFollow.vue'),
  },
  mixins: [cacheQuery],
  computed: {
    getSupplierName() {
      return (supplieMuster) => {
        return supplieMuster
          ? supplieMuster
              .map((item) => {
                let supplierItem = this.supplierList.find((i) => i.supplierId == item);
                return (supplierItem && supplierItem.supplierName) || void 0;
              })
              .filter((item) => !!item)
              .toString()
          : '';
      };
    },
  },
  async created() {
    this.copyListQuery = { ...this.listQuery };
    // this.queryProductList();
    this.queryCountryList();
    this.querySupplierList();
    this.queryList();
    try {
      let { data } = await listEnableAll();
      this.enterpriseList = data;
    } catch (error) {
      this.enterpriseList = [];
    }
  },
  methods: {
    async switChange(row) {
      const { tackStatus, flowId } = row;
      let status = tackStatus;
      let { code, data } = await getToOnline({ status, flowId });
      if (code == 0) {
        this.$message.success('操作成功');
        this.queryList();
      } else {
        this.$message.error('操作失败');
      }
    },
    /**
     * 查询商品列表
     */
    queryProductList() {
      findProducts().then((res) => {
        if (res.code == 0) {
          this.productList = res.data;
        }
      });
    },

    delect(row) {
      alert({ message: '是否删除此流程节点', title: '提示' }, async () => {
        let { code } = await deleteWorkFlow({ flowId: row.flowId });
        code == 0 ? this.$message.success('操作成功') : this.$message.error('操作失败');
        this.search();
      });
    },

    updateFilow(row) {
      alert({ title: '想要更新此流程吗', message: '更新前需要创建相同的流程，发布成功后会停用旧流程', btn: { confirm: '立即创建', cancel: '取消' } }, async () => {
        let { flowId, enterpriseId, serviceProviderIds, countryCodes, flowName, forwardNodes } = row;
        if (typeOf(enterpriseId) == 'string') {
          enterpriseId = enterpriseId.includes(',') ? enterpriseId.split(',') : [enterpriseId];
        }
        let params = {
          oldFlowId: flowId,
          enterpriseId,
          functionCode: this.listQuery.functionCode,
          countryCode: countryCodes,
          serviceProviderId: serviceProviderIds,
          flowType: this.businessMenu.fatherNode.name + '-' + this.businessMenu.name,
          flowName,
          forwardNodes,
        };
        let { code } = await publishProcess(params);
        let result = code == 0;
        this.$message[result ? 'success' : 'error'](result ? '更新成功' : '更新失败');
        this.search();
      });
    },

    /**
     * 查询国家列表
     */
    queryCountryList() {
      findCountrys().then((res) => {
        if (res.code == 0) {
          this.countryList = res.data;
        }
      });
    },
    /**
     * 改变国家code，查询服务商
     */
    changeCountryCode() {
      this.listQuery.supplierId = '';
      this.supplierList = [];

      this.querySupplierList();
    },
    /**
     * 查询服务商列表-根据国家code
     */
    querySupplierList() {
      newfindProcesses({
        // productCategoryId: this.listQuery.functionId,
        // countryCode: this.listQuery.countryCode,
      }).then((res) => {
        if (res.code == 0) {
          this.supplierList = res.data;
        }
      });
    },

    useStop(row) {
      alert({ message: '停用后无法修改，不影响历史工单流程', title: '确认停用吗' }, async () => {
        let { code } = await stopWorkFlow({ flowId: row.flowId });
        code == 0 ? this.$message.success('操作成功') : this.$message.error('操作失败');
        this.search();
      });
    },

    changeFilow(row) {
      alert({ message: '是否确认取消流程', title: '确认取消吗' }, async () => {
        let { code } = await changeWorkFlowStatus({ flowId: row.flowId });
        code == 0 ? this.$message.success('操作成功') : this.$message.error('操作失败');
        this.search();
      });
    },
    /**
     * 查询分页列表
     */
    queryList() {
      this.listLoading = true;
      this.setPageCache();
      findProcesses({
        ...this.listQuery,
        functionCode: this.businessMenu.code,
      })
        .then((res) => {
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            // res.data.records.forEach(element => {
            //     element.tackStatus = Boolean(element.tackStatus)
            // });

            this.list = res.data.records;

            this.listTotal = Number(res.data.total);
          }
        })
        .catch((error) => {
          this.listLoading = false;
        });
    },

    search() {
      let name = this.businessMenu.name;
      if (this.nameArry.indexOf(name) > -1) {
        this.isWorder = true;
      } else {
        this.isWorder = false;
      }
      this.listQuery.page = 1;
      this.queryList();
    },
    handleReset() {
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
      this.queryList();
    },
    changePageNo(val) {
      this.listQuery.page = val;
      this.queryList();
    },
    changePageSize(val) {
      this.listQuery.limit = val;
      this.queryList();
    },
  },
};

function alert(content, res, req) {
  let confirmButtonText = '确定';
  let cancelButtonText = '取消';
  if (content.btn) {
    confirmButtonText = content.btn.confirm;
    cancelButtonText = content.btn.cancel;
  }
  const alertBts = { confirmButtonText, cancelButtonText };
  MessageBox.confirm(content.message, content.title, alertBts)
    .then(() => {
      typeof res == 'function' && res();
    })
    .catch(() => {
      typeof res == 'function' && req();
    });
}
</script>
<style scoped lang="less">
@import './index.less';
</style>
