import { mapState } from "vuex";
export default {
  data: function () {
    return {};
  },
  computed: {
    ...mapState({
      modules: (state) => state.modules, // 官网模块列表
    }),
  },
  mounted: function () {},
  methods: {
    getModulesStatus(key) {
      if (this.modules.length) {
        let keyValue = this.modules.filter((ele) => ele.moduleKey === key);
        return keyValue[0].status;
      } else {
        return true;
      }
    },
  },
};
