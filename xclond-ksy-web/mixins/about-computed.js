export default {
  data: function () {
    return {
      xx: "xxx",
      defaultFileList: [], // 销售额文件list
      uplodPath: process.env.SERVER_URL + "/api/file/oss/upload",
    };
  },

  mounted: function () {},
  methods: {
    // val：指定提交的文件路径, 如销售额文件
    // showList: 文件的已经上传文件列表
    handleChange({ file, fileList },form, val, showList) {
      console.log(file, fileList);

      let fileListCopy = fileList;
      fileListCopy = fileListCopy.slice(-1);

      fileListCopy = fileListCopy.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });

      this.$data[showList] = fileListCopy;

      if (file.status === "done") {
        let { response } = file;
        if (response && response.code === 0) {
          this.$set(this.$data[form], val, response.data.fileUrl);
          // this.form[val]=response.data.fileUrl
        } else {
          this.$message.warning('系统繁忙请重试');
        }
      } else if (file.status === "removed") {
        this.$set(this.$data[form], val, "");
      }
    },
    // 可多张上传
    handleChange2({ file, fileList }, showList) {
      let fileListCopy = fileList;

      fileListCopy = fileListCopy.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      this.$data[showList] = fileListCopy;
    },
  },
};
