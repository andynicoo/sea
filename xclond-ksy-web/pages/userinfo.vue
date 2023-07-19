<template>
  <div>
    <h1>Named {{ auth || "" }} -- {{ isLogined || "" }}</h1>
    <el-button @click="logout">Logout</el-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import Cookies from "js-cookie";
export default {
  middleware: "auth",
  layout:"mount",
  computed: {
    ...mapState({
      auth: (state) => state.auth,
      isLogined: (state) => state.isLogined,
    }),
  },
  methods: {
    logout() {
      this.$store.commit("setUserData", {
        username: null,
        password: null,
      });

      this.$store.commit("setIsLogined", { isLogined: false });
      Cookies.remove("store");
      this.$router.push({ name: "index" });
    },
  },
};
</script>
