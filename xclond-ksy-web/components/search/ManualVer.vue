<template>
  <div>
    <a-modal
      title="人工核名"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
      destroyOnClose
      :centered="true"
      :width="847"
    >
      <div class="manboxver">
        <div class="left">
          <a-form-model ref="ruleForm" :model="form" :rules="rules" layout="vertical">
            <a-form-model-item label="输入商标名称" prop="tradeName">
              <a-input
                v-model="form.tradeName"
                type="textarea"
                placeholder="请输入想要核名的商标名称，批量商标可按“ ；” 分隔开"
              />
            </a-form-model-item>
            <a-form-model-item label="选择国家" prop="country">
              <a-checkbox-group v-model="form.country">
                <a-checkbox value="US" name="type"> 美国 </a-checkbox>
                <a-checkbox value="EU" name="type"> 欧盟 </a-checkbox>
                <a-checkbox value="GB" name="type"> 英国 </a-checkbox>
                <a-checkbox value="JP" name="type"> 日本 </a-checkbox>
              </a-checkbox-group>
            </a-form-model-item>
            <a-form-model-item label="选择大类" prop="class">
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
            <div v-show="showMore">
              <a-form-model-item ref="productName" label="经营的商品" prop="productName">
                <a-input v-model="form.productName" placeholder="请输入您经营的商品关键词" />
              </a-form-model-item>
              <a-form-model-item ref="compeProduct" label="可以输入竞品信息，可以帮您提高通过率" prop="compeProduct">
                <a-space v-for="(item, index) in form.compeProduct" :key="index" class="ksy-mb-3">
                  <a-input
                    v-model="form.compeProduct[index].name"
                    style="width: 250px"
                    placeholder="请输入竞品商标名称"
                  />
                  <a-input
                    v-model="form.compeProduct[index].url"
                    style="width: 250px"
                    placeholder="请输入竞品商标链接"
                  />
                  <img src="~/assets/images/com-jia.svg" class="hand iconss" v-if="index === 0" @click="addComPro" />
                  <img src="~/assets/images/com-shan.svg" class="hand iconss" v-else @click="reduceComPro(index)" />
                </a-space>
                <div><a-checkbox @change="onChange" class="ksy-fr"> 注册竞品全部小类 </a-checkbox></div>
              </a-form-model-item>
            </div>
            <p class="more" @click="showMore = true" v-show="showMore === false">
              输入更多信息，提升机核名准确率
              <span><a-icon type="down" /></span>
            </p>
          </a-form-model>
        </div>
        <div class="right">
          <h3>专属顾问 品质服务</h3>
          <div class="list">
            <p>
              <img src="~/assets/images/zaixian.svg" />
              在线解疑，提供数据监测
            </p>
            <p>
              <img src="~/assets/images/liangshen.svg" />
              量身定制解决方案
            </p>
            <p>
              <img src="~/assets/images/tigong.svg" />
              提供全面知识产权布局方案
            </p>
            <p>
              <img src="~/assets/images/zhuanye.svg" />
              专业管家1对1服务
            </p>
          </div>
        </div>
      </div>
    </a-modal>

    <a-modal
      :title="null"
      :visible="okVisible"
      :closable="false"
      :footer="null"
      :centered="true"
      @ok="okVisible = false"
      @cancel="okVisible = false"
    >
      <div class="mansurebox center ksy-text-center">
        <img src="~/assets/images/check-ok.svg" />
        <h2>恭喜您！提交人工核名申请成功！</h2>
        <p>核名专家将尽快联系您并进行详细核名分析~</p>
        <a-button type="primary" @click="okVisible = false">确认</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import trademark from "@/apis/trademark";
import { mapState } from "vuex";

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
        tradeName: "", // 商标名称
        class: [], // 选择大类
        country: [], // 选择国家
        productName: "", // 经营的商标
        compeProduct: [
          // 竞品信息
          {
            name: "",
            url: "",
          },
        ],
        more: false, // 注册竞品全部小类
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
        tradeName: [{ required: true, message: "请输入商标名称", trigger: "blur" }],
      },
      showMore: false,
      okVisible: false,
    };
  },
  mounted() {
    this.$bus.$on("changeManualVer", (data) => {
      let { show } = data;
      this.visible = show;
    });

    this.getBigClass();
  },
  destroyed() {
    this.$bus.$off("changeManualVer");
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
            type: 1,
          };
          let res = await this.$axiosApi(trademark.sendManualData.url, trademark.sendManualData.methods, params);
          if (res.code === 0) {
            // this.$message.success("提交成功!");
            this.resetForm();
            this.confirmLoading = false;
            this.visible = false;
            this.okVisible = true;
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
    addComPro() {
      this.form.compeProduct.push({ name: "", url: "" });
    },
    reduceComPro(index) {
      this.form.compeProduct.splice(index, 1);
    },
    onChange(e) {
      this.form.more = e.target.checked;
    },
  },
};
</script>

<style lang="less">
.manboxver {
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
  .right {
    width: 235px;
    height: 330px;
    // .bg-image-png("rengongshenhe");
    background: url("@/assets/images/rengongshenhe.png") no-repeat;
    background-size: 235px 330px;
    padding: 24px 16px;
    h3 {
      height: 22px;
      font-size: 14px;
      font-weight: 500;
      color: #886239;
      line-height: 22px;
    }
    .list {
      margin-top: 24px;
      p {
        height: 20px;
        font-size: 12px;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.6);
        line-height: 20px;
        margin-bottom: 15px;
        img {
          margin-right: 8px;
        }
      }
    }
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
</style>
