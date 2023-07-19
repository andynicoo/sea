<template>
  <el-card>
    <div slot="header" class="clearfix">
      <span>企业权限</span>
    </div>
    <div class="main-tree">
      <el-tree
        ref="menuTreeRef"
        show-checkbox
        :data="menuTreeData"
        :props="menuTreeProps"
        highlight-current
        :default-expand-all="true"
        disabled
        icon-class="el-icon-arrow-right"
      ></el-tree>
      <div class="footerBox">
        <el-button @click="goBack()" size="small">取消</el-button>
        <el-button type="primary" @click="handleSubmit" size="small"
          >确定</el-button
        >
      </div>
    </div>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      menuTreeProps: {
        children: "children",
        label: "title",
      },
      menuTreeData: [
        {
          title: "企业名称",
          expand: true,
          children: [
            {
              title: "跨税云",
              expand: true,
              children: [
                {
                  title: "企业1",
                },
                {
                  title: "企业2",
                },
              ],
            },
            {
              title: "必胜道",
              expand: true,
              children: [
                {
                  title: "企业3",
                },
                {
                  title: "企业4",
                },
              ],
            },
          ],
        },
      ],
      menuIds: "",
    };
  },
  methods: {
    /**
     * 复选框改变时候校验权限菜单是否为空
     */
    handleValidMenuIds() {
      // 获得树形菜单数据
      let treeIds = [
        ...this.$refs.menuTreeRef.getSelectedNodes(),
        ...this.$refs.menuTreeRef.getCheckedNodes(),
      ];
      this.menuIds = treeIds;
    },

    /**
     * 保存
     */
    handleSubmit() {
      // 获得树形菜单数据
      let treeIds = [
        ...this.$refs.menuTreeRef.getSelectedNodes(),
        ...this.$refs.menuTreeRef.getCheckedNodes(),
      ];
      this.menuIds = treeIds;
    },
    /**取消返回到列表 */
    goBack() {
      this.$router.push({
        path: "/operations/staffManagement/index",
      });
    },
  },
};
</script>
<style scoped lang='less'>
.main-tree {
  .footerBox {
    width: 400px;
    overflow: hidden;
    Button {
      margin: 10px;
      float: right;
    }
  }
}
</style>
