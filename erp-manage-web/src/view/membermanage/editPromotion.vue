<template>
  <div class="wrapper">
    <div class="editpromotion">
      <div class="bannerlist">
        <div class="tit">背景主图:</div>
        <div class="item mainimg">
          <UploadImg
            :files-list="[{ url: item.mainImage }]"
            tips="建议720*354px"
            @change="changeMain"
          />
          <span
            v-show="item.mainImage === ''"
            class="me-status-error"
          >
            请上传图片
          </span>
        </div>
      </div>
      <div class="me-clear" />
      <div class="bannerlist">
        <div class="tit">banner区:</div>
        <div>
          <div class="titlist">
            <div class="tit1">banner图</div>
            <div class="tit2">链接</div>
            <div class="tit3">排序</div>
          </div>
          <div
            v-for="(it, index) in item.bannerAOList"
            :key="it.banner + index"
            class="item"
          >
            <!-- {{ it }} -->
            <div class="tit1">
              <UploadImg
                :files-list="[{ url: it.banner }]"
                tips="建议720*354px"
                :index="index"
                @change="change"
              />
              <span
                v-show="it.banner === ''"
                class="me-status-error"
              >
                请上传图片
              </span>
            </div>
            <div class="tit2">
              <a-input
                v-model="it.bannerUrl"
                placeholder="请输入链接"
              />
            </div>
            <div class="tit3">
              <a-input-number
                v-model="it.sort"
                :min="1"
                style="width:70px"
              />
              <a-button
                v-show="item.bannerAOList.length > 1"
                type="link"
                @click="delItem(index)"
              >
                删除
              </a-button>
            </div>
          </div>
        </div>
        <div
          v-show="item.bannerAOList && item.bannerAOList.length < 5"
          class="g-tac me-clear"
        >
          <span
            class="g-cup"
            @click="addItem()"
          ><a-icon type="plus" />添加</span>
        </div>
      </div>
      <div class="me-clear" />
      <div class="bannerlist">
        <div class="tit">广告图配置:</div>
        <div>
          <div class="tit1">
            <UploadImg
              :files-list="[{ url: item.otherImage }]"
              tips="建议720*354px"
              @change="changeMid"
            />
            <span
              v-show="item.otherImage === ''"
              class="me-status-error"
            >
              请上传图片
            </span>
          </div>
          <div
            class="tit2"
            style="width:410px"
          >
            <a-input
              v-model="item.otherLink"
              placeholder="请输入链接"
            />
          </div>
          <div
            class="tit3"
            style="padding:0px"
          >
            <a-button
              type="link"
              @click="delMidItem()"
            >
              删除
            </a-button>
          </div>
        </div>
      </div>
      <div class="me-clear" />
      <div class="bannerlist">
        <div class="tit">开关:</div>
        <div class="item">
          <a-radio-group
            v-model="item.enableStatus"
            name="radioGroup"
          >
            <a-radio :value="true">
              开
            </a-radio>
            <a-radio :value="false">
              关
            </a-radio>
          </a-radio-group>
        </div>
      </div>
      <div class="me-clear" />
      <div class="buttonline">
        <a-space>
          <a-button @click="goList">取消</a-button>
          <a-button
            type="primary"
            style="width:100px"
            :loading="submiting"
            @click="submit"
          >确定</a-button>
        </a-space>
      </div>
    </div>
    <div class="contentview">
      <Mobile
        :member-info="item"
        :view-type="true"
      />
    </div>
  </div>
</template>

<script>
import { getPromotionContent, editPromotionItem } from '@/api/usermanage'
import UploadImg from '@/components/uploadImg'
import Mobile from './mobile'
import { cloneDeep, debounce } from 'lodash'
const initPagination = {
  current: 1,
  size: 20
}
export default {
  components: {
    UploadImg,
    Mobile
  },
  props: {
    currentObj: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      item: {
        bannerAOList: [],
        otherImage: '',
        otherLink: ''
      },
      submiting: false
    }
  },
  mounted() {
    window.addEventListener('resize', this.setTableHeight)
    this.getPromotion()
  },
  beforeDestroy() {
    // window.removeEventListener('resize', this.setTableHeight)
  },
  methods: {
    getPromotion() {
      getPromotionContent({ id: this.currentObj.id }).then((res) => {
        if (res.code === '0') {
          this.item = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    change(list = [], index = -1) {
      // this.formModel.imgs = list && list.map((item) => item.url).join()
      if (list && list.length) {
        // console.log(list, 'add')
        this.item.bannerAOList[list[0].index].banner = list[0].url
      } else {
        this.item.bannerAOList[index].banner = ''
        // console.log(list, index, 'remove')
      }
    },
    changeMain(list = []) {
      this.item.mainImage = list && list.map((item) => item.url).join()
    },
    changeMid(list = []) {
      this.item.otherImage = list && list.map((item) => item.url).join()
    },
    goList() {
      this.$emit('cancalContent')
    },
    submit() {
      if (!this.checkImg() && this.item.mainImage !== '') {
        this.submiting = true
        let params = this.item
        editPromotionItem(params)
          .then((res) => {
            if (res.code === '0') {
              this.goList()
            } else {
              this.$message.error(res.message)
            }
          })
          .finally(() => {
            this.submiting = false
          })
          .catch((err) => {
            this.$message.error(err.message)
          })
      }
    },
    checkImg() {
      let lackImg = false
      lackImg = this.item.bannerAOList.some((ele) => ele.banner === '')
      return lackImg
    },
    delItem(index) {
      this.item.bannerAOList.splice(index, 1)
    },
    delMidItem() {
        this.item.otherImage = ''
        this.item.otherLink = ''
    },
    addItem() {
      let formItem = cloneDeep(this.item.bannerAOList)
      formItem.push({
        bannerUrl: '',
        banner: '',
        sort: 1
      })
      this.$set(this.item, 'bannerAOList', formItem)
    }
  }
}
</script>
<style lang="less">
// .mainimg  .ant-upload-list-item{
//   width: 150px;
//   height: 150px;
// }
</style>
<style lang="less" scoped>
.wrapper {
  display: flex;
}
.editpromotion {
  // min-height: calc(100vh - 100px);
  // position: relative;
  float: 1;
}
.contentview {
  width: 350px;
}
.buttonline {
  // position: absolute;
  // bottom: 0px;
  border-top: 1px solid #dcdcdc;
  width: 100%;
  padding-top: 10px;
  margin-top: 15px;
}
.bannerlist {
  padding: 10px 15px;
  width: 1235px;
  .tit {
    float: left;
    width: 100px;
    font-size: 16px;
    font-weight: bold;
  }
  .item {
    width: 1100px;
    float: right;
  }
  .titlist {
    div {
      display: inline-block;
    }
  }
  .tit1 {
    width: 120px;
    float: left;
  }
  .tit2 {
    width: 320px;
    float: left;
  }
  .tit3 {
    width: 200px;
    float: left;
    padding: 0px 15px;
  }
}
</style>
