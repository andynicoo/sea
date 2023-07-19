<template>
  <!-- 绑定货代商弹窗 -->
  <a-modal v-model="dialogBinding" persistent max-width="600px">
    <v-card class="syncshop">
      <v-card-title>
        <span class="headline head-text">{{ $t('packages.buning') }}</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" v-show="!isBinding">
            <div class="info-item">
              <div class="item-text">{{ $t('packages.huodaiMiyao') }}:</div>
              <div class="item-input">
                <v-text-field
                  label=""
                  v-model="binding"
                  outlined
                  dense
                  clearable
                ></v-text-field>
              </div>
            </div>
          </v-col>
          <v-col cols="12" v-show="isBinding">
            <div class="info-item">
              <div class="item-text">{{ $t('packages.yibangding') }}:</div>
              <div class="item-input">
                <v-text-field
                  label=""
                  disabled
                  outlined
                  dense
                  v-model="forwarderName"
                ></v-text-field>
              </div>
            </div>
          </v-col>
        </v-row>
        <div class="content-box">
          <div v-show="!isBinding">{{ $t('packages.string5') }}</div>
          <div v-show="isBinding">{{ $t('packages.string6') }}</div>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn depressed color="primary" text @click="cancle">
          {{ $t('common.cancel') }}
        </v-btn>
        <v-btn
          depressed
          color="primary"
          @click="setBinding"
          v-show="!isBinding"
        >
          {{ $t('packages.bangding') }}
        </v-btn>
        <v-btn depressed color="primary" @click="unBinding" v-show="isBinding">
          {{ $t('packages.jiebang') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </a-modal>
</template>

<script>
export default {
  props: {
    dialogBinding: {
      default: false
    },
    isBinding: {
      default: false
    },
    forwarderName: {
      default: ''
    },
    forwarderKey: {
      default: ''
    }
  },
  data() {
    return {
      binding: this.forwarderKey,
      isbind: ''
    }
  },
  methods: {
    cancle() {
      this.$emit('cancle')
    },
    setBinding() {
      this.$emit('setBinding', this.binding)
    },
    unBinding() {
      this.$emit('unBinding', this.binding)
    }
  }
}
</script>

<style lang="scss" scoped>
.info-item {
  display: flex;
  .item-text {
    width: 110px;
    text-align: right;
    padding-top: 5px;
    padding-right: 10px;
    font-size: 16px;
  }
  .item-input {
    flex: 1;
  }
}
.content-box {
  padding-left: 20px;
  div {
    font-size: 16px;
    line-height: 40px;
  }
}
</style>
