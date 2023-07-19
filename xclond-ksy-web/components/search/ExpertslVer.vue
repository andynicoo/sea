<template>
  <div>
    <a-modal
      okText="开始取名"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      destroyOnClose
      :centered="true"
      :width="847"
    >
      <div slot="title" class="modaltit">
        专家取名<span> <a-icon type="question-circle" />AI智能取名，简单3步，马上取到好名字</span>
      </div>
      <div class="expertsver">
        <div class="left">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="vertical">
            <a-form-model-item label="主营产品" prop="mainProduct">
              <a-input
                v-model="form.mainProduct"
                type="textarea"
                placeholder="请输入主营产品中英文名"
                :maxLength="300"
              />
            </a-form-model-item>
            <a-form-model-item label="意向国家" prop="country">
              <a-checkbox-group v-model="form.country">
                <a-checkbox value="US" name="type"> 美国 </a-checkbox>
                <a-checkbox value="EU" name="type"> 欧盟 </a-checkbox>
                <a-checkbox value="GB" name="type"> 英国 </a-checkbox>
                <a-checkbox value="JP" name="type"> 日本 </a-checkbox>
              </a-checkbox-group>
            </a-form-model-item>
            <a-form-model-item label="意向大类" prop="class">
              <a-select v-model="form.class" placeholder="请选择，最多选择5个" mode="multiple">
                <a-select-option
                  :value="item.id"
                  v-for="item in bigClassData"
                  :key="item.id"
                  :disabled="form.class.length > 4 && !form.class.includes(item.id)"
                >
                  {{ item.categorySort }} {{ item.categoryName }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
            <a-form-model-item label="取名偏好" prop="preference">
              <a-input
                v-model="form.preference"
                type="textarea"
                placeholder="请输入商标名取名偏好（如长度、喜欢字母、 及其他名字要求或偏好等）"
              />
            </a-form-model-item>
            <div v-show="showMore">
              <a-form-model-item label="公司名称" prop="companyName">
                <a-input v-model="form.companyName" placeholder="请输入" />
              </a-form-model-item>
              <a-form-model-item label="官网链接" prop="webUrl">
                <a-input v-model="form.webUrl" placeholder="请输入（用于结合公司名或者公司企业文化等元素取商标名））" />
              </a-form-model-item>
              <a-form-model-item label="已注册商标名" prop="logonName">
                <a-input v-model="form.logonName" placeholder="请输入" />
              </a-form-model-item>
              <a-form-model-item label="竞品商标名" prop="competingName">
                <a-input v-model="form.competingName" placeholder="请输入" />
              </a-form-model-item>
            </div>
            <p class="more" @click="showMore = true" v-show="showMore === false">
              补充更多需求，让我们更了解您，以取更好的名字
              <span><a-icon type="down" /></span>
            </p>
          </a-form-model>
        </div>
        <!-- 图像信息 -->
        <AlertInfo />
      </div>
    </a-modal>
    <ModalSuccess ref="suc">
      <template #title>恭喜您！提交专家取名成功！</template>
      <template #text>取名专家将尽快联系您并进行专业解决方案分析~</template>
    </ModalSuccess>
  </div>
</template>

<script>
import trademark from "@/apis/trademark";
import { mapState } from "vuex";
import ModalSuccess from "../common/ModalSuccess.vue";

export default {
  computed: {
    ...mapState({
      auth: (state) => state.auth,
    }),
  },
  data() {
    return {
      visible: false,
      confirmLoading: false,
      bigClassData: [],
      form: {
        mainProduct: "",
        country: [],
        class: [],
        preference: "",
        companyName: "",
        webUrl: "",
        logonName: "",
        competingName: "", // 竞品商标名
      },
      rules: {
        country: [
          {
            type: "array",
            required: true,
            message: "请选择国家",
            trigger: "change",
          },
        ],
        mainProduct: [{ required: true, message: "请输入主营产品", trigger: "blur" }],
        class: [{ required: true, message: "请选择意向大类", trigger: "change" }],
      },
      showMore: false,
    };
  },
  mounted() {
    this.$bus.$on("changeExpertslVer", (data) => {
      let { show } = data;
      this.visible = show;
    });
    this.getBigClass();
  },
  destroyed() {
    this.$bus.$off("changeExpertslVer");
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleOk(e) {
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
          let params = {
            mobile: this.auth.userMobile,
            platform: "30",
            extTableInfo: JSON.stringify(this.form),
            type: 2,
          };
          console.log(params);
          let res = await this.$axiosApi(trademark.sendManualData.url, trademark.sendManualData.methods, params);
          if (res.code === 0) {
            this.resetForm();
            this.confirmLoading = false;
            this.visible = false;
            this.$refs["suc"]._data.show = true;
          } else {
            this.confirmLoading = false;
            this.$message.error(res.message);
          }
        } else {
          console.log("error submit!!");
          this.confirmLoading = false;
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
      this.showMore = false;
    },
    // 获取大类
    async getBigClass() {
      let params = {
        limit: 50,
        page: 1,
        countryCode: "US",
      };
      let bigClass = await this.$axiosApi(trademark.categoryOneList.url, trademark.categoryOneList.methods, params);
      let { code, data } = bigClass;
      if (code === 0) {
        this.bigClassData = data;
      } else {
        this.$message.error("商标大类错误!");
      }
    },
  },
  components: { ModalSuccess },
};
</script>

<style lang="less">
.expertsver {
  display: flex;
  .left {
    flex: 1;
    margin-right: 32px;
    .more {
      height: 22px;
      font-size: 14px;
      font-weight: 400;
      color: #3370ff;
      cursor: pointer;
      span {
        margin-left: 25px;
      }
    }
    .iconss {
      width: 25px;
    }
  }

  .ant-form-item {
    margin-bottom: 15px;
  }
}
.mansurebox {
  h2 {
    height: 28px;
    font-size: 20px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.9);
    line-height: 28px;
    margin-top: 10px;
  }
  p {
    height: 22px;
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.4);
    line-height: 22px;
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
