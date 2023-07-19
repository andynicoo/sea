<template>
  <div class="login">
    <a-spin :spinning="spinning">
      <a-form
        ref="ruleFormRef"
        :model="formModal"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
      >
        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formModal.username" />
        </a-form-item>

        <a-form-item label="密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
          <a-input-password v-model:value="formModal.password" />
        </a-form-item>

        <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
          <a-button type="primary" @click="submitForm()">登录</a-button>
          <a-button style="margin-left: 10px" @click="resetForm()"> 重置 </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import router from '@/router';
import { useStore } from '@/stores/store';
import type { FormInstance } from 'ant-design-vue';
import { message } from 'ant-design-vue';
import { login } from '@/api/user/user';

const ruleFormRef = ref<FormInstance>();
const spinning = ref<boolean>(false);
const formModal = reactive({
  username: 'admin',
  password: '123456',
});

//提交表单验证
const submitForm = () => {
  ruleFormRef.value?.validate().then(() => {
    spinning.value = true;
    login(formModal)
      .then((res: object) => {
        useStore().setLoginInfo(res);
        spinning.value = false;
        message.success('登录成功');
        router.push('/home');
      })
      .catch(() => {
        spinning.value = false;
        console.log('error');
      });
  });
};

//重置
const resetForm = () => {
  ruleFormRef.value?.resetFields();
};
</script>

<style lang="less" scoped>
.login {
  width: 500px;
  height: 400px;
  margin: 150px auto;
}
</style>
