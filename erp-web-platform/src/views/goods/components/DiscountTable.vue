<template>
  <v-card>
    <v-card-title> {{ $t('copy.choseAct') }} </v-card-title>
    <v-card-text>
      <v-data-table
        v-model="selected"
        :headers="discountHeaders"
        :items="discountList"
        item-key="discountId"
        :single-select="true"
        show-select
        class="elevation-1"
        disable-sort
        hide-default-footer
      >
      </v-data-table>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn @click="$emit('cancel')">{{ $t('common.cancel') }}</v-btn>
      <v-btn color="primary" @click="onSubmit">{{ $t('common.ok') }}</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import Goods from '@/api/goods'
export default {
  data() {
    return {
      selected: [],
      discountList: [],
      discountHeaders: [
        {
          text: this.$t('copy.actname'),
          value: 'discountName',
          align: 'center'
        },
        {
          text: this.$t('copy.status'),
          value: 'status',
          align: 'center'
        },
        {
          text: this.$t('copy.starttime'),
          value: 'startTime',
          align: 'center'
        },
        {
          text: this.$t('copy.endtime'),
          value: 'endTime',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    onSubmit() {
      this.$emit('ok', this.$data.selected)
    }
  },
  mounted() {
    const { storeId } = this.$route.query
    let params = {
      current: 1,
      status: 0,
      storeId: storeId
    }
    Goods.getDiscountList(params).then(({ data }) => {
      this.discountList = data
    })
  }
}
</script>