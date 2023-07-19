<template>
  <div style="display: inline-block">
    <a-button
      :id="id ? id : 'trademarksearchresult_button002'"
      type="primary"
      class="btn"
      v-if="type === 'btn'"
      @click="goManualVal"
    >
      <span v-if="level === 1">免费人工核名</span>
      <span v-if="level === 2">申请人工复核</span>
      <span v-if="level === 3">申请专家核名</span>
    </a-button>
    <span @click="goManualVal" v-else data-sensors-click :id="id ? id : 'trademarksearchresult_button002'">
      免费人工核名
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {};
  },
  props: {
    id: String,
    type: {
      type: String,
      default: "btn",
    },
    level: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    ...mapState({
      auth: (state) => state.auth,
    }),
  },
  mounted() {},
  methods: {
    goManualVal() {
      if (this.auth.userId) {
        this.$bus.$emit("changeManualVer", { show: true });
      } else {
        this.$store.commit("setLoginPopData", { show: true });
        this.$nextTick(() => {
          this.$bus.$emit("loginVisiable", { type: 4 });
        });
      }
    },
  },
};
</script>
