<template>
  <div class="namepreferbox" ref="nameBox">
    <a-modal
      okText="获取取名方案"
      :visible="visible"
      destroyOnClose
      :maskClosable="false"
      :centered="true"
      :width="635"
      :zIndex="10"
      :getContainer="() => $refs.nameBox"
      title="名字偏好"
    >
      <div class="namepre">
        <a-form-model ref="ruleForm" :model="form" layout="vertical">
          <a-form-model-item required label="1、确认名称样式" prop="styleType">
            <a-radio-group v-model="form.styleType">
              <a-radio value="auto" class="radio"> 不限 </a-radio>
              <a-radio value="brandableNames" class="radio">
                品牌名称 <span class="desc">（如谷歌 / 劳力士）</span>
              </a-radio>
              <a-radio value="alternateSpelling" class="radio">
                替代拼写 <span class="desc">（如Lyft / Fiverr）</span>
              </a-radio>
              <a-radio value="nonEnglishWords " class="radio">
                非英语单词 <span class="desc">（如丰田 / 奥迪）</span>
              </a-radio>
              <a-radio value="compoundWords " class="radio">
                复合词 <span class="desc">（如联邦快递 / 微软）</span>
              </a-radio>
              <a-radio value="realWords " class="radio"> 实词 <span class="desc">（如苹果 / 亚马逊）</span> </a-radio>
              <a-radio value="twoWords " class="radio"> 两个字 <span class="desc">（如脸书 / 比特币）</span> </a-radio>
              <a-radio value="shortPhrase " class="radio"> 短语 <span class="desc">（如某某俱乐部）</span> </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item required label="2、确认随机性" prop="randomLevel">
            <a-radio-group v-model="form.randomLevel">
              <a-radio value="low" class="radio2"> 低 <span class="desc">（最直接的名字创意）</span> </a-radio>
              <a-radio value="mid" class="radio2"> 中 <span class="desc">（更多创意成果）</span> </a-radio>
              <a-radio value="high " class="radio2"> 高 <span class="desc">（更多样化的结果）</span> </a-radio>
            </a-radio-group>
          </a-form-model-item>
          <a-form-model-item label="3、业务描述" prop="description">
            <a-input v-model="form.description" type="textarea" placeholder="一句话描述下业务，输入更多产品元素词" />
          </a-form-model-item>
        </a-form-model>
      </div>
      <template #footer>
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleOk" id="trademarkname_button002">获取取名方案</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script>
import trademark from "@/apis/trademark";
import { mapState, mapMutations, mapGetters } from "vuex";
import IndexMixins from "@/mixins";

export default {
  mixins: [IndexMixins],
  computed: {
    ...mapState({
      auth: (state) => state.auth,
    }),
    ...mapGetters(["isLogin"]),
    radioDisabled() {
      const regex = /^[^\u4e00-\u9fa5a-zA-Z0-9]+$/g;
      const myString = "这是一个只包含中文和符号的字符串。！@#¥%……&*（）——+";
      if (regex.test(myString)) {
        return "符合要求！";
      } else {
        return "不符合要求！";
      }
    },
  },
  data() {
    return {
      visible: false,
      form: {
        inputName: "", // 输入名称
        styleType: "auto", // 名称样式
        randomLevel: "low", // 随机性
        description: "",
      },
    };
  },
  mounted() {
    this.$bus.$on("changeNamePre", (data) => {
      console.log("出来了", data);
      let { show, name } = data;
      this.visible = show;
      this.form.inputName = name;
    });
  },
  destroyed() {
    //this.$bus.$off("changeNamePre");
  },
  methods: {
    ...mapMutations("common", ["setSearching"]),
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
      this.visible = false;
      this.confirmLoading = true;
      this.onSubmit();
    },
    handleCancel(e) {
      this.resetForm();
      this.visible = false;
    },

    onSubmit() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.visible = false;
          await this.handleSearchFree();
          this.setSearching({ show: true });
          let res = await this.$axiosApi(trademark.getAiName.url, trademark.getAiName.methods, this.form);
          this.setSearching({ show: false });
          if (res.code === 0) {
            sessionStorage.setItem("nameJson", JSON.stringify(res.data.nameJson));
            sessionStorage.setItem("trademarkAiName", JSON.stringify(res.data.trademarkAiName));
            sessionStorage.setItem("namePreferForm", JSON.stringify(this.form));
            this.$router.push("/namescheme");
          } else {
            this.$message.error(res.message);
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      (this.form.styleType = "auto"), (this.form.randomLevel = "low"), (this.form.description = "");
      this.showMore = false;
    },
    showLoading(status) {
      this.$emit("showLoading", {
        show: status,
      });
    },
  },
};
</script>

<style lang="less">
.namepre {
  .ant-form-item {
    padding-bottom: 0 !important;
    margin-bottom: 9px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .ant-form-item-label {
    margin-bottom: 8px !important;
  }
  .ant-form-item-label > label {
    font-size: 14px;
    font-weight: 500;
    color: @textColor !important;
  }
  .radio,
  .radio2 {
    color: @textColor !important;
    width: 48%;
    margin-bottom: 15px;
    .desc {
      color: @textColor6 !important;
    }
  }
  .radio2 {
    width: 90%;
  }
}
.namepreferbox {
  .ant-modal-body {
    padding-bottom: 17px !important;
  }
}
</style>
