<template>
  <div class="attr-word-btn" :class="{ disabled: !disabled }">
    <label>
      <i class="icon icon-white-upload zx"></i>
      <span>批量上传/下载</span>
    </label>
    <ul>
      <li>
        <el-upload
          ref="upload"
          :action="api"
          :data="{ newsType: moduleName }"
          :show-file-list="false"
          :on-change="change"
          :auto-upload="false"
          :headers="{ Authorization, enterpriseCode: '1', enterpriseId: enterpriseId }"
          accept="xlsx"
        >
          <span>批量上传</span>
        </el-upload>
      </li>
      <li @click="download">批量下载</li>
      <li><a :href="moduleTemplate">模板下载</a></li>
    </ul>
  </div>
</template>

<script>
import { download } from "@/api/newApi/consultingCenter/consultingManage";
import { getToken } from "@/libs/util";
export default {
  name: "uploadAndDownload",
  props: {
    api: {
      type: String,
      require: true,
    },
    disabled: {
      type: Number | Boolean,
      default: false,
    },
    list: {
      type: Array,
      default() {
        return [];
      },
    },
    moduleName: {
      type: String,
      default: "INFORMATION",
    },
    method:{
      type:Function,
      default(){}
    }
  },
  computed: {
    moduleTemplate() {
      return this.moduleName === "INFORMATION"
        ? "/批量上传资讯.xlsx"
        : "/批量上传案例.xlsx";
    },
  },
  data() {
    return {
      Authorization: "Bearer " + getToken(),
      enterpriseId: localStorage.getItem("enterpriseId"),
      tips:{
        INFORMATION:'一次最多下载500篇资讯',
        CASE:'一次最多下载500篇案例'
      },
      fileName:{
        INFORMATION:'批量上传资讯.xlsx',
        CASE:'批量上传案例.xlsx'
      },
      enterpriseId:40
    };
  },
  mounted() {
    this.enterpriseId = localStorage.enterpriseId;
  },
  methods: {
    change(file) {
      if (!file.mark) {
        file.mark = true;
        this.$confirm(`当前主体为${localStorage.enterpriseName}，确定上传吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then((res) => {
          this.$refs.upload.submit();
        });
        return;
      }
      if (file.response) {
        if (file.response.code === 0) {
          this.$confirm("文件上传成功", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
          });
          this.method()
        } else {
          this.$confirm(file.response.message + ",请检查后重新上传", "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
          });
        }
      }
    },
    download() {
      let ids = [];
      this.list.forEach((item) => {
        ids.push(item.id);
      });

      if (ids.length > 500) {
        this.$message(this.tips[this.moduleName]);
        return;
      }
      if (ids.length) {
        this.downloadFile(ids);
      }
      if (!ids.length) {
        this.$confirm("当前未选中任何文章，是否直接下载当前列表中前500篇文章？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then((res) => {
          this.downloadFile(ids);
        });
      }
    },
    downloadFile(ids) {
      download({ newsType:this.moduleName, ids }).then((res) => {
        let a = document.createElement("a");
        const blob = new Blob([res], { type: "application/vnd.ms-excel" });
        a.href = URL.createObjectURL(blob);
        a.download = this.fileName[this.moduleName];
        a.click();
      });
    },
  },
};
</script>

<style scoped lang="scss">
.attr-word-btn {
  display: inline-block;
  font-size: 12px;
  color: #fff;
  background: #b8b8b8;
  position: relative;
  margin-right: 10px;
  border-radius: 2px;
  height: auto;
  padding: 0;
  z-index: 100;
  cursor: no-drop;
  &.disabled {
    background: #1890ff;
    cursor: pointer;
    &:hover {
      > ul {
        display: block;
      }
    }
    > label {
      cursor: pointer;
      > i,
      span {
        cursor: pointer;
      }
    }
  }
  label {
    display: block;
    height: 37px;
    padding: 0 15px;
    cursor: no-drop;
    > i {
      cursor: no-drop;
    }
    > span {
      line-height: 37px;
      cursor: no-drop;
    }
  }
  > ul {
    display: none;
    width: 134px;
    position: absolute;
    top: 37px;
    left: 0;
    background: #fff;
    text-align: center;
    border: 1px solid #d8d8d8;
    list-style: none;
    padding: 0;
    margin: 0;
    > li {
      line-height: 30px;
      border-bottom: 1px solid #d8d8d8;
      color: #333;
      cursor: pointer;
      margin: 0;
      padding: 0;
      &:hover {
        background: #d8d8d8;
      }
    }
    > li:last-child {
      border: none;
    }
  }
}
</style>
