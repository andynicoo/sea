<template>
  <!-- 绑定货代商账号的弹窗 -->
  <v-dialog v-model="dialogInfo" persistent max-width="500px">
    <v-card class="info-dialog">
      <v-card-title>
        <span class="headline head-text">货代商收货信息</span>
      </v-card-title>
      <v-card-text>
        <div class="item">
          <div class="input-box">
            <v-text-field
              outlined
              dense
              label="收货仓库"
              v-model="warehouse"
            ></v-text-field>
          </div>
          <div class="input-box">
            <v-text-field
              outlined
              dense
              label="收货人"
              v-model="receiver"
            ></v-text-field>
          </div>
          <div class="input-box">
            <v-text-field
              outlined
              dense
              label="联系方式"
              v-model="phone"
            ></v-text-field>
          </div>
          <div class="input-box">
            <v-textarea
              outlined
              name="input-7-4"
              label="收货地址"
              :value="address"
              v-model="address"
            ></v-textarea>
          </div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed color="primary" text @click="cancle">
          {{$t('common.cancel')}}
        </v-btn>
        <v-btn depressed color="primary" @click="sure">
          {{$t('common.save')}}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import Package from '@/api/package'
export default {
  props: {
    dialogInfo: {
      default: false
    }
  },
  data() {
    return {
      warehouse: '',
      receiver: '',
      phone: '',
      address: ''
    }
  },

  methods: {
    cancle() {
      this.$emit('cancle')
    },
    sure() {}
  }
}
</script>

<style lang="scss" scoped>
.account-dialog {
  .item-text {
    text-align: center;
    font-size: 16px;
    line-height: 24px;
    color: #000;
  }
}
</style>
