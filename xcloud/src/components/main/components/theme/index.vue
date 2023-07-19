<template>
  <div>
    <Dropdown trigger="click" @click="handleCommand">
      <a href="javascript:void(0)">
        <Icon size="16" type="ios-shirt-outline" /> 背景
      </a>
      <DropdownMenu slot="list" class="changeBg">
        <DropdownItem name="#DCE1ED" id="bgColor"></DropdownItem>
        <DropdownItem name="#DCE1ED" id="bgColor"></DropdownItem>
        <DropdownItem name="#DCE1ED" id="bgColor"></DropdownItem>
        <DropdownItem name="#DCE1ED" id="bgColor"></DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {
      albumpic_big: "#19be6b",
      color: "#19be6b",
      colors: ["#311B92", "#512DA8", "#673AB7", "#9575CD", "#D1C4E9"],
    };
  },
  methods: {
    handleCommand(command) {
      console.log(command);
      this.albumpic_big = command;
    },
  },
};
</script>
<style scoped lang="less">
.changeBg {
  display: flex;
  width: 100%;
  /deep/ .ivu-dropdown-item {
    width: 30px;
    height: 30px;
    padding: 0;
    margin: 10px;
    display: table-footer-group;
  }
  & #bgColor {
    background: #dce1ed;
  }
}
</style>
