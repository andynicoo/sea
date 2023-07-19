<template>
  <div>
    <a-modal
      okText="开始取名"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      destroyOnClose
      :centered="true"
      :width="847"
      :zIndex="99999"
    >
      <div slot="title" class="modaltit">
        商标名调整方式确认<span> <a-icon type="question-circle" />AI智能取名，简单3步，马上取到好名字</span>
      </div>
      <div class="expertsver">
        <div class="left">
          <a-form-model ref="ruleForm" :model="form" layout="vertical">
            <a-form-model-item label="要调整的商标名" prop="mainProduct">
              <span class="mainname">
                {{ form.mainProduct }}
              </span>
            </a-form-model-item>
            <a-form-model-item label="希望要包含的字母" prop="inputName">
              <a-input v-model="form.inputName" />
              <p class="size12 color6 ksy-mt-1">可在原商标名基础上，增加或减少字母，系统将根据调整后的字母进行取名</p>
            </a-form-model-item>
          </a-form-model>
        </div>
        <!-- 图像信息 -->
        <AlertInfo />
      </div>
    </a-modal>
  </div>
</template>

<script>
import trademark from "@/apis/trademark";
import { mapState, mapMutations } from "vuex";
import IndexMixins from "@/mixins";

export default {
  mixins: [IndexMixins],
  computed: {
    ...mapState({
      auth: (state) => state.auth,
      userInfo: (state) => state.userInfo.userInfo,
    }),
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: {
        mainProduct: "", // 主营产品
        inputName: "",
      },
    };
  },
  mounted() {
    this.$bus.$on("changeAdjustStyle", (data) => {
      let { show, name } = data;
      this.visible = show;
      this.form.mainProduct = name;
      this.form.inputName = name;
    });
  },
  destroyed() {
    this.$bus.$off("changeAdjustStyle");
  },
  methods: {
    ...mapMutations("common", ["setSearching"]),
    async handleOk(e) {
      await this.searchTest(this.form.inputName);
      this.onSubmit();
    },
    handleCancel(e) {
      this.resetForm();
      this.visible = false;
    },

    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const { inputName } = this.form;
          let params = {
            // mobile: this.userInfo.userMobile,
            // platform: "30",
            // extTableInfo: JSON.stringify(this.form),
            // type: 4,
            inputName,
            styleType: "auto", // 名称样式
            randomLevel: "low", // 随机性
            description: "",
          };
          this.visible = false;
          await this.handleSearchFree();
          this.setSearching({ show: true });
          let res = await this.$axiosApi(trademark.getAiName.url, trademark.getAiName.methods, params);
          this.setSearching({ show: false });
          if (res.code === 0) {
            sessionStorage.setItem("nameJson", JSON.stringify(res.data.nameJson));
            sessionStorage.setItem("trademarkAiName", JSON.stringify(res.data.trademarkAiName));
            sessionStorage.setItem("namePreferForm", JSON.stringify(this.form));
            this.$message.success("操作成功!");
            this.resetForm();
            this.$router.push("/namescheme");
          } else {
            this.$message.error(res.message);
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm() {
      //this.$refs.ruleForm.resetFields();
      this.$bus.$on("changeAdjustStyle", (data) => {
        let { name } = data;
        this.form.mainProduct = name;
        this.form.inputName = name;
      });
      this.showMore = false;
    },
  },
};
</script>

<style lang="less">
.expertsver {
  display: flex;
  .left {
    flex: 1;
    margin-right: 32px;
    .mainname {
      color: #3370ff;
    }
  }

  .ant-form-item {
    margin-bottom: 15px;
  }
}
.modaltit {
  span {
    font-size: 12px;
    color: @textColor6;
    line-height: 20px;
    height: 20px;
    margin-left: 14px;
    i {
      color: @primaryColor;
      margin-right: 3px;
    }
  }
}
</style>
