<template>
  <div>
    <Upload
      :before-upload="beforeUploadHandler"
      :on-exceeded-size="onExceed"
      :limit="info.limit"
      :action="ImgUrl"
      :data="{ prefix: '' }"
      :format="['jpg', 'jpeg', 'png', 'gif', 'pdf']"
      :on-success="onChange"
      :name="value.keyLabel"
      style="margin-right: 30px"
    >
    <!--  :default-file-list="newFileList" -->
      <div class="inner">
        <span class="uplad-word">
          <Icon type="ios-cloud-upload-outline" style="font-size: 18px" />
          点击上传
        </span>
      </div>
    </Upload>
    <div class="out-img-box">
      <div class="inner img-box" v-for="(item,index) in newFileList" :key="index">
        <a :href="item.url" target="_blank" class="show-pdf">{{ value.keyLabel }}</a>
      </div>
    </div>
    <p class="upload-tip">注：支持JPG、JPEG、PNG、PDF格式上传</p>
    <p>
      <a :href="link" target="_black" style="color: #16ade9">
        <img src="@/assets/images/common/serch.png" style="position: relative; top: 4px" />
        查看示例
      </a>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    value: Object,
    link: String,
  },
  data() {
    return {
      limit: "",
      info: {},
      newFileList: [],
    };
  },
  // computed: {
  //   newFileList: {
  //     get() {
  //       return this.fileList;
  //     },
  //     set(val) {
  //       this.$emit("update:fileList", val);
  //     },
  //   },
  // },
  created() {
    this.info = value.info ? JSON.parse(value.info.replace(/\'/g, '"')) : {};
  },
  methods: {
    beforeUploadHandler(file) {
    },
    onChange(file, fileList) {
      if (file.message !== "success") {
        return;
      }
      this.$nextTick(() => {
        this.newFileList = fileList.map((item) => ({
          name: this.value.keyLabel,
          url: item.response ? item.response.data.fileUrl : item.url,
        }));
      });
    },
    onExceed() {
      this.$Message.error(`最多上传${this.limit}个文件`);
    },
  },
};
</script>

<style lang="less" scoped>
.ivu-upload {
  .inner {
    width: 300px;
    text-align: center;
    height: 32px;
    background: #16ade9;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    cursor: pointer;
  }
}
.upload-tip {
  color: rgb(251, 183, 60);
}
p {
  line-height: normal;
}
</style>
