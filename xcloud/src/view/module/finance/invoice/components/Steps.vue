<template>
  <div v-if="status == 1">
    <el-steps :active="0" process-status="success" align-center>
      <el-step title="待开票"></el-step>
      <el-step title="已开票"></el-step>
      <el-step title="退票中"></el-step>
      <el-step title="已退款"></el-step>
      <el-step title="已取消"></el-step>
    </el-steps>
  </div>
  <div v-else-if="status == 2">
    <el-steps :active="1" process-status="success" align-center>
      <el-step title="待开票"></el-step>
      <el-step title="已开票"></el-step>
      <el-step title="退票中"></el-step>
      <el-step title="已退款"></el-step>
      <el-step title="已取消"></el-step>
    </el-steps>
  </div>
  <div v-else-if="status == 5">
    <el-steps :active="2" process-status="success" align-center>
      <el-step title="待开票"></el-step>
      <el-step title="已开票"></el-step>
      <el-step title="退票中"></el-step>
      <el-step title="已退款"></el-step>
      <el-step title="已取消"></el-step>
    </el-steps>
  </div>
  <div v-else-if="status == 3">
    <el-steps :active="3" process-status="success" align-center>
      <el-step title="待开票"></el-step>
      <el-step title="已开票"></el-step>
      <el-step title="退票中"></el-step>
      <el-step title="已退款"></el-step>
      <el-step title="已取消"></el-step>
    </el-steps>
  </div>
  <div v-else-if="status == 4">
    <el-steps :active="4" process-status="success" align-center>
      <el-step title="待开票"></el-step>
      <el-step title="已开票"></el-step>
      <el-step title="退票中"></el-step>
      <el-step title="已退款"></el-step>
      <el-step title="已取消"></el-step>
    </el-steps>
  </div>
</template>
<script>
export default {
  props: {
    status: { type: Number },
  },
  data() {
    return {};
  },
};
</script>