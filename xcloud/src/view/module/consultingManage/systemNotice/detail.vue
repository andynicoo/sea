<template>
  <div>
    <AddOrEdit v-show="flag === ADD_OR_EDIT" :formData="formData" @preview="preview" @publish="publish" @back="back" />
    <Preview
      v-show="flag === PREVIEW"
      :formData="formData"
      :showBtn="showBtn"
      @addOrEdit="addOrEdit"
      @publish="publish"
      @back="back"
    />
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import AddOrEdit from "./components/addOrEdit.vue";
import Preview from "./components/preview.vue";
import { getAnnouncementInfo } from "@/api/newApi/messageCenter/noticeManage.js";
import { insertSys } from "@/api/newApi/consultingCenter/systemNotice";
import { formatEditorContent } from "@/components/quillEditor/formatEditorContent";
const ADD_OR_EDIT = "addOrEdit";
const PREVIEW = "preview";
export default {
  components: {
    AddOrEdit,
    Preview,
  },
  data() {
    return {
      id: this.$route.query.id || 0,
      flag: this.$route.query.flag || ADD_OR_EDIT,
      ADD_OR_EDIT,
      PREVIEW,
      formData: null,
      showBtn: false,
    };
  },
  created() {
    if (this.id) {
      this.getInfo();
    }
  },
  methods: {
    getInfo() {
      getAnnouncementInfo(this.id).then((res) => {
        res.data.content = this.$Base64.decode(res.data.content);
        this.formData = res.data;
      });
    },
    preview(form) {
      this.formData = form;
      this.flag = this.PREVIEW;
      this.showBtn = true;
    },
    addOrEdit() {
      this.flag = this.ADD_OR_EDIT;
    },
    publish(form) {
      insertSys({
        title: form.title,
        content: formatEditorContent(form.content),
      }).then((res) => {
        if (res.code === 0) {
          this.$message.success("发布成功");
          this.back();
        }
      });
    },
    ...mapMutations(["closeTag"]),
    back() {
      this.closeTag(this.$route);
      this.$router.push({
        path: "/consultingManage/systemNotice/index",
      });
    },
  },
};
</script>

<style></style>
