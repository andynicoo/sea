<!--  -->
<template>
  <div>
    <div class="app-container">
      <ELTabPane
        class="header-container"
        style="margin-bottom: 0px"
        :tabData="[
          { key: 1, label: '链接管理', name: 'line' },
          { key: 2, label: '员工推广管理', name: 'staff' },
        ]"
        :value="tab"
        @change="(val) => (tab = val)"
      />
    </div>
    
    <MyStaff v-if="tab == 'line'" />
    <MyLineIndex v-else />
  </div>
</template>

<script>
import ELTabPane from '@/components/WorkOrderComponents/tabPane';
import MyLineIndex from './line/line';
import MyStaff from './staff/staff';
export default {
  data() {
    return {
      tab: 'line',
    };
  },

  components: {
    ELTabPane,
    MyLineIndex,
    MyStaff,
  },
};
</script>
<style lang="scss" scoped></style>
