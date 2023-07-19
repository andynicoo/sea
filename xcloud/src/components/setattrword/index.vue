<template>
  <div v-if="dialogVisible">
    <el-dialog :title="types === 'attr' ? '设置属性词' : '编辑标签'" :visible.sync="dialogVisible" width="550px"
      :destroy-on-close="true" :before-close="handleClose">
      <div>
        <el-input v-model="form.attributeWordName" placeholder="请输入内容" class="wd250 zt-mr-3" clearable></el-input>
        <el-button type="primary" @click="search()">搜索</el-button>

        <el-button type="primary" class="fr" @click="addNew()" v-if="types === 'attr'">新增属性词</el-button>
        <!-- <el-button type="primary" class="fr" @click="updateTags()" v-if="types === 'tag'">上传标签</el-button> -->

        <el-upload class="fr tagup" v-if="types === 'tag'" :action="baseUrl + '/information/label/upload'"
          :multiple="false" accept=".xls" :show-file-list="false" :limit="1" :on-success="updateSucess"
          :on-error="updateError" :on-progress="updateProgress"
          :headers="uploadHeaders">
          <el-button size="small" type="primary" :loading="tagUploading">上传标签</el-button>
        </el-upload>
        <el-button class="fr zt-mr-2" v-if="types === 'tag'" @click="downloadTemp()">
          下载模板
        </el-button>

        <div class="zt-mt-3 zt-mb-3">
          <!-- 表格 -->
          <div class="table-container">
            <el-table border :data="list" v-loading="tableLoading" element-loading-spinner="icon loading"
              element-loading-text="拼命加载中" row-key="id" @select="selectItem" @selection-change="handleSelectionChange"
              class="newwordtable" ref="dataList">
              <Empty slot="empty" class="tagkongbox" />
              <el-table-column type="selection" align="center" width="55" :reserve-selection="true"
                :selectable="selectable">
              </el-table-column>

              <el-table-column align="center" label="属性词" show-overflow-tooltip prop="attributeWordName"
                v-if="types === 'attr'">
                <template slot-scope="scope">
                  {{ scope.row.attributeWordName | stringSlice(20) }}
                </template>
              </el-table-column>

              <el-table-column align="center" label="标签" show-overflow-tooltip prop="labelName" v-if="types === 'tag'">
                <template slot-scope="scope">
                  {{ scope.row.labelName | stringSlice(20) }}
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- 分页 -->
          <div class="pagination-container">
            <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
              :current-page.sync="form.current" :page-sizes="[10, 20, 30, 50]" :page-size="form.size"
              layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
          已选择：{{ multipleSelection | getSelectWord(multipleSelection) }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitWord()">确 定</el-button>
      </span>
    </el-dialog>
    <AddNewWord ref="addnewword" :method="getList" v-if="types === 'attr'" />
  </div>
</template>

<script>
import {
  getAttrWordList, getTagsPage
} from '@/api/newApi/consultingCenter/consultingManage';
import AddNewWord from '@/components/setattrword/AddNewWord.vue';
import UploadFileUrl from '@/components/UploadFileUrl/index';
import { getToken } from "@/libs/util";

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        current: 1,
        size: 10,
        attributeWordName: '',
        url: ''
      },
      total: 0,
      tableLoading: false,
      multipleSelection: [],
      list: [],
      tagUploading: false,
      uploadHeaders: {
        Authorization: "Bearer " + getToken(),
        enterpriseId: localStorage.getItem("enterpriseId")
      },
    }
  },
  components: {
    AddNewWord,
    UploadFileUrl
  },
  props: {
    types: {
      default: 'attr',
      type: String
    },
    giveValue: {
      default: () => [],
      type: Array
    },
  },
  filters: {
    getSelectWord(val) {
      let selectWord = []
      val.map(ele => {
        if (ele.attributeWordName) {
          selectWord.push(ele.attributeWordName)
        } else {
          selectWord.push(ele.labelName)
        }
      })
      return selectWord.join(',')
    }
  },
  watch: {
    dialogVisible(val) {
      if (!val) this.multipleSelection = []
      // 作为标签弹窗时，是单篇的标签，需要回显
      if (this.giveValue.length) {
        this.multipleSelection = this.giveValue

        this.list.forEach((row) => {
          // 标签回显，传入的giveValue和标签列表list数据id对得上就勾选
          const multipleSelectionInclouderRow= this.multipleSelection.filter((sel)=>sel.id===row.id)
          if (multipleSelectionInclouderRow.length) {
            this.$nextTick(() => {
              if (this.$refs.dataList) this.$refs.dataList.toggleRowSelection(row, true)
            })
          }
        })
      }
    }
  },
  async mounted() {
    await this.getList()
  },
  methods: {
    getList() {
      let { types } = this.$props;
      this.tableLoading = true;
      // 属性词 或 标签
      if (types === 'attr') {
        getAttrWordList(this.form)
          .then((res) => {
            if (res.code == 0) {
              this.list = res.data.records
              this.total = parseInt(res.data.total);
            }
            this.tableLoading = false
          })
          .catch((err) => {
            this.tableLoading = false
          });
      } else {
        this.form.labelName = this.form.attributeWordName
        getTagsPage(this.form)
          .then((res) => {
            if (res.code == 0) {
              this.list = res.data.records
              this.total = parseInt(res.data.total);
            }
            this.tableLoading = false
          })
          .catch((err) => {
            this.tableLoading = false
          });
      }

    },
    addNew() {
      this.$refs.addnewword.dialogVisible = true;
    },
    handleClose(done) {
      this.dialogVisible = false
    },
    search() {
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    selectItem(selection, row) {
      console.log(selection, row)
    },
    handleSizeChange(val) {
      this.form.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.form.page = val;
      this.getList();
    },
    submitWord() {
      let { multipleSelection } = this.$data
      let selectLength = multipleSelection.length
      if (selectLength) {
        let attributeWordIds = [];
        multipleSelection.map(ele => {
          attributeWordIds.push(ele.id)
        })
        // 弹出框做属性词设置时,或做标签编辑时
        if (this.types === 'attr') {
          this.$emit('returnWords', attributeWordIds)
        } else {
          this.$emit('returnWords', multipleSelection)
        }
        this.dialogVisible = false
      } else {
        // 弹出框做属性词设置时,或做标签编辑时, 属性词必选才能提交，标签可不选提交
        if (this.types === 'attr') {
          this.$message('请选择相关选项');
        } else {
          this.$emit('returnWords', multipleSelection)
          this.dialogVisible = false
        }
      }
    },
    selectable(row, index) {
      if (this.multipleSelection.length > 4) {
        if (this.multipleSelection.includes(row)) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    },
    updateSucess(response, file, fileList) {
      console.log(response, file, fileList)
      let { code } = response;
      if (code === 0) {
        this.$message.success('上传成功!');
      }
      setTimeout(() => {
        this.tagUploading = false
      }, 1000);
    },
    updateError(err, file, fileList) {
      console.log(err, file, fileList)
      this.$message.error('请检查文件后重试！');
      setTimeout(() => {
        this.tagUploading = false
      }, 1000);
    },
    updateProgress(file) {
      console.log(file)
      this.tagUploading = true
    },
    downloadTemp() {
      window.open('/标签上传模版.xls')
    }
  }
}
</script>

<style lang="less">
.wd250 {
  width: 250px;
}

.newwordtable {
  th {
    .el-checkbox {
      display: none;
    }
  }
}

.tagup {
  display: inline-block;
}
.tagkongbox{
  width: 450px;
  margin-left: -376px;
  i {
    display: none;
  }
}
</style>
