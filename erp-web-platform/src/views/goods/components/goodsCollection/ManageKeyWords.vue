<template>
  <div class="manageKeyWords">
    <div class="manage-form manage-title">
      <strong>{{$t('goodsCollection.addKeywords')}}:</strong>
      <a-input v-model="keyWordsStr" :placeholder="$t('goodsCollection.placeholder2')" @pressEnter="addClick"/>
      <a-button type="primary" @click="addClick" size="small">{{$t('common.add')}}</a-button>
    </div>
    <div class="manage-form manage-search">
      <div>
        <strong>{{$t('goodsCollection.hasKeyWordAlready', { count: keyWordsArr.length })}}</strong>
        <a-button class="me-ml-2" type="primary" @click="clearClick" size="small">{{$t('goodsCollection.clear')}}</a-button>
      </div>
      <div>
        <a-input class="me-w300 me-mr-2" v-model="searchKey" :placeholder="$t('goodsCollection.placeholder3')" @pressEnter="searchClick"/>
        <a-button type="primary" @click="searchClick" size="small">{{$t('common.search')}}</a-button>
      </div>
    </div>
    <div class="manage-content">
      <template v-for="(tag) in keyWordsArr">
        <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
          <a-tag :key="tag" :color="searchResultArr.includes(tag) ? 'red' : '#ff8859'" closable @close="() => handleClose(tag)">
            {{ `${tag.slice(0, 20)}...` }}
          </a-tag>
        </a-tooltip>
        <a-tag v-else :color="searchResultArr.includes(tag) ? 'red' : '#ff8859'" :key="tag" closable @close="() => handleClose(tag)">
          {{ tag }}
        </a-tag>
      </template>
    </div>
  </div>
  
</template>

<script>

export default {
  props: {
    keyArr: {
      type: Array,
      defalut: []
    },
  },
  data() {
    return {
      keyWordsStr: '',
      keyWordsArr: [], 
      searchKey: '',
      searchResultArr: []
    }
  },
  mounted() {
    this.keyWordsArr = [...this.keyArr]
  },
  methods: {
    cancel() {
      let string = this.keyWordsArr.join(',')
      return {str: string, num: this.keyWordsArr.length }
    },
    addClick() {
      // 匹配中英文','
      let arr = this.keyWordsStr.split(/,|，/).filter((key) => !!key)
      if (arr.length > 0) {
        arr.forEach(item => {
          if (!this.keyWordsArr.includes(item)) {
            this.keyWordsArr.push(...arr)
          }
        })
      }
      this.keyWordsStr = ''
    },
    searchClick() {
      this.searchResultArr = this.keyWordsArr.filter(item => item.indexOf(this.searchKey)>-1)
      this.keyWordsArr.sort((a, b) => {
        return -(a.indexOf(this.searchKey) - b.indexOf(this.searchKey));
      })
    },
    clearClick() {
      this.$confirm({
        title: this.$t('common.warn'),
        content: this.$t('goodsCollection.warningContent5'),
        onOk: () => {
          this.keyWordsArr = []
          this.$message.success(this.$t('common.handlerSuccess'))
        }
      })
    },
    handleClose(removedTag) {
      const keyWordsArr = this.keyWordsArr.filter(tag => tag !== removedTag);
      this.keyWordsArr = keyWordsArr;
    }
  }
}
</script>

<style lang="scss" scoped>
.manageKeyWords{
  .manage-form{
    display: flex;
    align-items: center;
  }
  .manage-title{
    input{
      flex: 1;
      margin: 0 10px;
    }
  }
  .manage-search{
    -webkit-box-pack: justify;
    -ms-flex-pack: justify;
    justify-content: space-between;
    margin: 16px 0;
  }
  .manage-content{
    width: 100%;
    height: 400px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    padding: 5px;
    >span+span{
      margin-bottom: 10px;
    }
  }
}
::-webkit-scrollbar {
    width: 8px;
    height: 8px
}

::-webkit-scrollbar-track {
    background: inherit
}

::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #f0f0f0;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    box-shadow: inset 0 0 6px rgba(0,0,0,.3)
}
</style>
