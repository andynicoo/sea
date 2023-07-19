<template>
  <div class="app-container">
    <!-- header -->
    <div class="header-container" ref="searchBox">
      <div class="search-box">
        <div class="left">
          <el-form ref="searchForm" inline>
            <el-form-item label="字段标题/系统key值">
              <el-input v-model="listQuery.fieldLabel" placeholder="请输入字段标题/系统key值" style="width: 250px"></el-input>
            </el-form-item>
            <el-form-item label="是否必填">
              <el-select v-model="listQuery.isNeed" placeholder="请选择" clearable filterable style="width: 100px">
                <el-option :value="true" label="是"></el-option>
                <el-option :value="false" label="否"></el-option>
              </el-select>
            </el-form-item>

            <!-- <el-input v-model="listQuery.fieldLabel" clearable placeholder="请输入" style="width: 300px" /> -->
            <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            <el-button type="default" icon="el-icon-refresh-left" @click="handleReset">重置</el-button>
          </el-form>
        </div>

        <div class="right">
          <el-button type="success" @click="toAddFieldsPage(true)" v-show="hasAuthority('F1_1')">
            <div class="btn">
              <img src="@/assets/images/zt-upgrade-1/add.svg" alt="" />
              新增系统字段
            </div>
          </el-button>
          <el-button type="success" @click="toAddFieldsPage(false)" v-show="hasAuthority('F1_2')">
            <div class="btn">
              <img src="@/assets/images/zt-upgrade-1/add.svg" alt="" />
              新增自定义字段
            </div>
          </el-button>
        </div>
      </div>
    </div>
    <div class="main">
      <div class="table-container">
        <!-- tab切换 -->
        <el-row :gutter="20">
          <el-col :span="18">
            <el-tabs ref="table" v-model="listQuery.moduleId" @tab-click="changeTabs">
              <el-tab-pane name="-1">
                <span slot="label">全部（{{ moduleTotal }})</span>
              </el-tab-pane>
              <el-tab-pane :name="item.moduleId" v-for="(item, index) in moduleList" :key="item.moduleId">
                <span slot="label">{{ item.moduleName }}（{{ item.count }}）</span>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="6" class="sortBtn">
            <el-button @click="showFieldSortModal" type="default" style="margin-left: 12px">
              字段排序
            </el-button>
          </el-col>
        </el-row>
        <!-- 列表 -->
        <el-table border :data="list" highlight-current-row v-loading="listLoading" max-height="630" ref="table" :height="tableHeight" element-loading-spinner="icon loading" element-loading-text="拼命加载中">
          <Empty slot="empty" />
          <el-table-column label="序号" width="80" align="center">
            <template slot-scope="{ row, $index }">
              {{ listQuery.pageSize * (listQuery.pageNo - 1) + $index + 1 }}
            </template>
          </el-table-column>
          <el-table-column label="字段标题" width="120" align="center">
            <template slot-scope="{ row }">{{ row.keyLabel }}</template>
          </el-table-column>
          <el-table-column label="系统Key值" width="120" align="center">
            <template slot-scope="{ row }">{{ row.keyName }}</template>
          </el-table-column>
          <el-table-column label="所属模块" width="120" align="center">
            <template slot-scope="{ row }">{{ row.moduleName }}</template>
          </el-table-column>
          <el-table-column label="是否是系统字段" width="120" align="center">
            <template slot-scope="{ row }">{{ row.isSys == 1 ? "是" : "否" }}</template>
          </el-table-column>
          <el-table-column label="是否必填" width="120" align="center">
            <template slot-scope="{ row }">{{ row.isNeed ? "是" : "否" }}</template>
          </el-table-column>
          <el-table-column label="控件类型" width="120" align="center">
            <template slot-scope="{ row }">
              {{
                row.inputType == 1
                  ? "文本框"
                  : row.inputType == 2
                  ? "单选框"
                  : row.inputType == 3
                  ? "复选框"
                  : row.inputType == 4
                  ? "上传框"
                  : row.inputType == 5
                  ? "下拉框"
                  : row.inputType == 6
                  ? "文本域"
                  : row.inputType == 8
                  ? "日期选择"
                  : row.inputType == 9
                  ? "日期范围选择"
                  : row.inputType == 10
                  ? "无类型"
                  : ""
              }}
            </template>
          </el-table-column>
          <el-table-column label="控件提示文案" width="120" align="center">
            <template slot-scope="{ row }">{{ row.placeHolder }}</template>
          </el-table-column>
          <el-table-column label="控件注释文案" width="120" align="center">
            <template slot-scope="{ row }">{{ row.remindMessage }}</template>
          </el-table-column>
          <el-table-column label="示例文件" width="120" align="center">
            <template slot-scope="{ row }">
              <el-link v-if="row.fileModelUrl" type="primary" :href="row.fileModelUrl.replace('http://', 'https://')" target="_blank">
                查看
              </el-link>
            </template>
          </el-table-column>
          <!-- <el-table-column label="模板文件" width="120" align="center">
            <template slot-scope="{ row }">
              <el-link v-if="row.sourceFileUrl" type="primary" :href="row.sourceFileUrl.replace('http://', 'https://')" target="_blank">
                查看
              </el-link>
            </template>
          </el-table-column> -->
          <el-table-column label="创建时间" width="150" align="center">
            <template slot-scope="{ row }">{{ row.createTime }}</template>
          </el-table-column>
          <el-table-column label="创建人" width="120" align="center">
            <template slot-scope="{ row }">{{ row.createName }}</template>
          </el-table-column>
          <el-table-column label="修改人" width="120" align="center">
            <template slot-scope="{ row }">{{ row.modifyName }}</template>
          </el-table-column>
          <el-table-column label="修改时间" width="150" align="center">
            <template slot-scope="{ row }">{{ row.updateTime }}</template>
          </el-table-column>
          <el-table-column label="操作" min-width="120" fixed="right" align="center">
            <template slot-scope="{ row }">
              <el-tooltip content="编辑" placement="top" v-show="hasAuthority('F1_3')">
                <el-link type="primary" :underline="false" @click="toEditFieldsPage(row)">
                  <img src="@/assets/images/zt-upgrade-1/edit.svg" alt="" />
                </el-link>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background @size-change="changePageSize" @current-change="changePageNo" :current-page.sync="listQuery.pageNo" :page-sizes="$constant.WORKER_SERVER_PAGELIST" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="listTotal"></el-pagination>
      </div>
    </div>

    <!-- 模块下字段排序 -->
    <el-dialog title="字段排序" :visible.sync="fieldSortModal" :close-on-click-modal="false" z-index="1000">
      <el-table row-key="id" :data="fieldSortList" class="field-sort-table" max-height="500">
        <el-table-column width="50" align="center">
          <template slot-scope="{ row }">
            <i class="el-icon-sort" style="cursor: move" />
          </template>
        </el-table-column>
        <el-table-column label="序号" width="70" align="center">
          <template slot-scope="{ row, $index }">{{ $index + 1 }}</template>
        </el-table-column>
        <el-table-column label="字段名称" align="center">
          <template slot-scope="{ row }">{{ row.keyLabel }}</template>
        </el-table-column>
        <el-table-column label="所属模块" align="center">
          <template slot-scope="{ row }">{{ row.moduleName }}</template>
        </el-table-column>
        <el-table-column label="是否是系统字段" width="120" align="center">
          <template slot-scope="{ row }">{{ row.isSys == 1 ? "是" : "否" }}</template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="text-align-center">
        <el-button @click="fieldSortModal = false">取消</el-button>
        <el-button type="primary" @click="handleSort">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import {
  findFields,
  findAllFileds,
  findFieldsByModuleId,
  updateFieldsSort,
} from "@/api/newApi/processFields/fieldsConfig";
import cacheQuery from "@/mixins/cacheQuery";
export default {
  data() {
    return {
      // 分页查询
      list: [],
      listLoading: false,
      listTotal: 0,
      listQuery: {
        fieldLabel: "",
        moduleId: "-1",
        isNeed: "",
        pageNo: 1,
        pageSize: 10,
      },
      cacheKey: "listQuery",
      copyListQuery: {},
      // 所属模块列表
      moduleList: [],
      moduleTotal: 0,

      // 模块下字段拖动排序
      fieldSortModal: false,
      fieldSortList: [],
    };
  },
  mixins: [cacheQuery],
  created() {
    if (this.$route.params && this.$route.params.moduleId) {
      this.listQuery.moduleId = this.$route.params.moduleId;
    }
    this.copyListQuery = { ...this.listQuery };
    this.getPageCache();
    this.queryList();
  },
  mounted() {},
  methods: {
    /**
     * 切换tab
     */
    changeTabs(tab, event) {
      this.queryList();
    },

    /**
     * 查询字段列表
     */
    queryList() {
      this.listLoading = true;
      this.setPageCache();
      findFields({
        keyLabel: this.listQuery.fieldLabel,
        moduleId: this.listQuery.moduleId == "-1" ? "" : this.listQuery.moduleId,
        isNeed: this.listQuery.isNeed,
        page: this.listQuery.pageNo,
        limit: this.listQuery.pageSize,
      })
        .then((res) => {
          setTimeout(() => {
            this.listLoading = false;
          }, 300);
          if (res.code == 0) {
            // 字段分页列表
            this.list = res.data.pageData.records;
            this.listTotal = Number(res.data.pageData.total);

            // 模块tab切换和统计
            this.moduleList = res.data.statistics;
            this.moduleTotal = 0;
            res.data.statistics.forEach((item) => {
              this.moduleTotal += item.count;
            });
          }
        })
        .catch((error) => {
          this.listLoading = false;
        });
    },
    search() {
      this.listQuery.pageNo = 1;
      this.queryList();
    },
    // 重置
    handleReset() {
      this.listQuery = { ...this.copyListQuery };
      this.removePageCache();
      this.queryList();
    },
    // 分页
    changePageNo(val) {
      this.listQuery.pageNo = val;
      this.queryList();
    },
    changePageSize(val) {
      this.listQuery.pageSize = val;
      this.queryList();
    },

    /**
     * 拖拽字段排序
     */
    showFieldSortModal() {
      findFieldsByModuleId({ moduleId: this.listQuery.moduleId }).then((res) => {
        if (res.code == 0) {
          this.fieldSortList = res.data;
          if (this.fieldSortList.length == 0) {
            this.$message({
              type: "warning",
              message: "当前模块下没有可以排序的字段",
            });
            return;
          }
          // 展示弹框，排序
          this.fieldSortModal = true;
          this.$nextTick(() => {
            this.drawFieldRow();
          });
        }
      });
    },
    // 拖拽排序
    drawFieldRow() {
      const tbody = document.querySelector(".field-sort-table .el-table__body-wrapper tbody");
      Sortable.create(tbody, {
        animation: 120,
        delay: 0,
        onEnd: ({ oldIndex, newIndex }) => {
          // console.log("原下标：", oldIndex, "新下标：", newIndex);
          const currRow = this.fieldSortList.splice(oldIndex, 1)[0];
          this.fieldSortList.splice(newIndex, 0, currRow);
          this.fieldSortList.forEach((v, index) => (v.sort = index));
          console.log("最终的排序：", this.fieldSortList);
        },
      });
    },
    // 确定排序
    handleSort() {
      // 组装数据
      let sortList = [];
      this.fieldSortList.forEach((v) => {
        sortList.push({
          id: v.id,
          sort: v.sort,
        });
      });
      updateFieldsSort({ items: sortList }).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "操作成功",
          });
          this.fieldSortModal = false;
          this.queryList();
        }
      });
    },

    /**
     * 添加字段配置
     */
    toAddFieldsPage(flag) {
      this.$router.push({
        path: "/workOrder/fieldConfig/editField",
        query: {
          from: "add",
          isSystem: flag,
          moduleId: this.listQuery.moduleId == "-1" ? "" : this.listQuery.moduleId,
        },
      });
    },
    /**
     * 添加字段配置
     */
    toEditFieldsPage(row) {
      this.$router.push({
        path: "/workOrder/fieldConfig/editField",
        query: {
          from: "edit",
          id: row.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  height: 100%;
  position: relative;
  width: 100;
  .header-container {
    border: 0;

    .search-box {
      display: flex;
      width: 100%;
      justify-content: space-between;
      justify-items: center;
      .btn {
        display: flex;
        align-items: center;
      }
    }
    // padding-bottom: 10px;
    height: 72px;
    display: flex;

    // justify-items: center;
    // align-items: center;
  }
  .main {
    margin: 10px 10px 0px 10px;
    background-color: #fff;

    .heard {
      display: flex;
      justify-content: space-between;
      padding: 0px 30px 0px 30px;
      height: 60px;
      align-items: center;
      .left {
        font-size: 14px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #333333;
      }
      .right {
        .el-button {
          width: auto !important;
        }
      }
    }
    .table-container {
      padding: 0;
      .sortBtn {
        display: flex;
        align-items: center;
        justify-content: flex-end;
      }
    }
  }
}
</style>
