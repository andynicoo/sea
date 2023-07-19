<template>
  <a-modal title="用户详情" v-model:visible="visible" :maskClosable="false" :keyboard="false">
    <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" class="form-wrap">
      <a-form-item label="头像">
        <span>头像</span>
      </a-form-item>
      <a-form-item label="手机号码"> {{ userInfo.mobile || '-' }} </a-form-item>
      <a-form-item label="邮箱"> {{ userInfo.email || '-' }} </a-form-item>
      <a-form-item label="密码">
        <span>修改密码</span>
      </a-form-item>
      <a-form-item label="真实姓名"> {{ userInfo.nickName || '-' }} </a-form-item>
      <a-form-item label="性别"> {{ userInfo.sex ? '女' : '男' }} </a-form-item>
      <a-form-item label="企业名称"> {{ userInfo.companyName || '-' }} </a-form-item>
      <a-form-item label="部门名称"> {{ userInfo.departmentName || '-' }} </a-form-item>
      <a-form-item label="职能角色"> {{ userInfo.nickName || '-' }} </a-form-item>
    </a-form>

    <template #footer>
      <a-button type="primary" @click="visible = false">关闭</a-button>
    </template>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from '@/stores/store';
const visible = ref<boolean>(false);
const userInfo: any = computed(() => {
  return useStore().userInfo;
});

//暴露方法
defineExpose({ visible });
</script>

<style scoped lang="less">
.form-wrap {
  max-height: 50vh;
  overflow-y: auto;
}
</style>
