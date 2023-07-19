<template>
  <div>
    <Modal v-model="showModal" title="关联税号" :mask-closable="false">
      <Form ref="formInfo" :label-width="100">
        <FormItem label="店铺别名:">
          <p>{{ record.shopNickName || '-' }}</p>
        </FormItem>
        <FormItem label="关联税号:">
          <div class="tax-no-list" v-for="(li, index) of taxNoList" :key="index">
            <span>{{ li || '-' }}</span>
            <span class="btn" @click="deleteTaxNo(index)">删除</span>
          </div>
          <p v-if="taxNoList.length === 0">-</p>
        </FormItem>
        <FormItem label="关联税号:">
          <Select v-model="taxNoList" multiple :max-tag-count="2">
            <Option
              :value="li.relateTaxNo"
              :disabled="li.selectFlag === 1"
              v-for="(li, index) of taxNoListSelect"
              :key="index"
            >
              {{ li.relateTaxNo }}
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="showModal = false">取消</Button>
        <Button type="primary" @click="submit()">确认</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import { bindTaxNoSelectList, bindStoreTaxNo } from '@/api/store';
export default {
  name: 'sfdsf',
  data() {
    return {
      showModal: false,
      taxNoList: [],
      taxNoListSelect: [],
    };
  },
  props: {
    record: {
      default: {},
    },
  },
  watch: {
    showModal(val) {
      if (val) {
        this.getBindTaxNoSelectList();
        this.$nextTick(() => {
          this.taxNoList = this.record.relateTaxNoList || [];
        });
      }
    },
  },
  mounted() {},
  methods: {
    submit() {
      bindStoreTaxNo({
        id: this.record.id,
        platformEnum: this.record.platform,
        taxNoList: this.taxNoList,
      })
        .then((res) => {
          if (res.code === 0) {
            this.$Message.success('操作成功');
            this.showModal = false;
            this.record.relateTaxNoList = this.taxNoList;
          }
        })
        .catch((err) => console.log(err));
    },
    deleteTaxNo(index) {
      this.taxNoList.splice(index, 1);
    },
    //关联税号下拉框选项
    getBindTaxNoSelectList() {
      bindTaxNoSelectList({
        id: this.record.id,
        platformEnum: this.record.platform,
      }).then((res) => {
        if (res.code === 0) {
          this.taxNoListSelect = res.data || [];
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.tax-no-list {
  .btn {
    color: red;
    cursor: pointer;
  }
}
</style>
