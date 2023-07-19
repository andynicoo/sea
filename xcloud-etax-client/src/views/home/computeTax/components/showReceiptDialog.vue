<template>
  <Modal title="回执" v-model="dialogvisible" width="400px">
    <div class="row-title">申报回执：</div>
    <Row type="flex">
      <Col :span="12" v-for="(item,index) in imglist" :key="index" style="text-align: center;margin-bottom: 5px">
        <a :href="item.replace('http://', 'https://')" target="_blank" type="primary" :underline="false">
          <Icon type="md-search" />查看回执
          </a>
      </Col>
    </Row>
  </Modal>
</template>

<script>
export default {
  props: {
    showReceiptImgModel:Boolean,
    imglist:Array
  },
  data(){
    return{

    }
  },
  computed: {
    dialogvisible: {
      get() {
        console.log('?')
        return this.showReceiptImgModel;
      },
      set(val) {
        this.$emit("update:showReceiptImgModel", val);
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="less" scoped>
.row-title {
  margin: 10px 0;
}
</style>