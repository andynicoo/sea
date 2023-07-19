<template>
  <div>
    <div>
      <input type="text" v-model="value" />
      <button @click="handleChange">change global value</button>
      <button @click="loginOut">login out</button>
      {{process}}--{{NODE_ENV}}
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      value: "",
      val: true,
      process: process.env.SERVER_URL,
      NODE_ENV:process.env.NODE_ENV
    };
  },
  methods: {
    handleChange() {
    },
    loginOut() {
      this.val = !this.val;
    },
  },
};
</script>
