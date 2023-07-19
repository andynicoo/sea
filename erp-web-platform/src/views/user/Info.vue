<template>
  <div class="me-pa-2 user-info">
    <a-page-header class="me-page-header" title="个人资料"></a-page-header>
    <form class="custom-form">
      <a-row class="form-item">
        <a-col span="4" align-self="center">
          <label for="basic_username" class="form-label">{{
            $t('member.touxiang')
          }}</label>
        </a-col>
        <a-col span="12">
          <div @click="changeAvatar" class="user-avatar">
            <template v-if="!getAvatar">
              <img src="@/assets/images/avatar.png" />
            </template>
            <template>
              <div
                class="img iconfont"
                :style="{ backgroundImage: `url(${getAvatar})` }"
              >
                <p class="iconfont iconshangchuan"></p>
                <p class="upimg">{{ $t('member.shangchuantouxiang') }}</p>
              </div>
            </template>
          </div>
        </a-col>
      </a-row>

      <a-row class="form-item">
        <a-col span="4" align-self="center">
          <label for="basic_username" class="form-label"
            >{{ $t('member.huiyuanid') }}:</label
          >
        </a-col>
        <a-col span="12">
          <input
            :value="userInfo.memberNO"
            disabled
            type="text"
            name="basic_username"
            class="form-input"
          />
        </a-col>
      </a-row>

      <a-row class="form-item">
        <a-col span="4" align-self="center">
          <label for="basic_username" class="form-label"
            >{{ $t('member.account') }}:</label
          >
        </a-col>
        <a-col span="12">
          <input
            :value="userInfo.maAccount"
            disabled
            type="text"
            name="basic_username"
            class="form-input"
          />
        </a-col>
      </a-row>

      <a-row class="form-item">
        <a-col span="4" align-self="center">
          <label for="basic_username" class="form-label"
            >{{ $t('member.password') }}:</label
          >
        </a-col>
        <a-col span="12">
          <input
            disabled
            type="text"
            name="basic_username"
            class="form-input"
          />
        </a-col>
        <a-col span="3" offset="1">
          <router-link to="/user/password">
            <a class="link-to">{{ $t('member.xiugaimima') }}</a>
          </router-link>
        </a-col>
      </a-row>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Basic from '@/api/basic'
export default {
  computed: {
    ...mapState({
      userInfo: (state) => state.auth.userInfo,
      getAvatar: (state) => state.auth.userInfo.headImgurl
    })
  },
  data() {
    return {
      items: [
        {
          text: this.$t('member.shouye'),
          disabled: true
        },
        {
          text: this.$t('member.geren'),
          disabled: false
        }
      ]
    }
  },
  methods: {
    changeAvatar() {
      let input = document.createElement('input')
      input.type = 'file'
      input.accept = 'image/*'
      input.addEventListener('change', async ({ path }) => {
        const file = path[0].files[0]
        const formData = new FormData()
        formData.append('file', file)
        var getImageRes = await Basic.handleUploadImages(formData)
        await Basic.changeAvatar({ headImgUrl: getImageRes.data[0] })
        this.$store.dispatch('setAvatar', getImageRes.data[0])
      })
      input.click()
    }
  }
}
</script>

<style lang="scss" scoped>
.user-info {
  background: #fff;
  height: calc(100vh - 80px);
  .breadcrumbs {
    display: flex;
    align-items: center;
  }
  .upimg {
    font-size: 12px;
    text-align: center;
  }
  .title {
    font-size: 20px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: bold;
    color: #262424;
  }

  .user-avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: relative;
    overflow: hidden;

    & > .img {
      width: 100%;
      height: 100%;
      position: absolute;
      background-position: center;
      background-size: cover;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      position: relative;
      color: #ffffff;

      &::before {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(0, 0, 0, 0.5);
        opacity: 0;
        transition: all 0.2s;
      }

      p {
        z-index: 9;
        opacity: 0;
        transition: all 0.2s;

        &:first-child {
          font-size: 30px;
        }
      }

      &:hover {
        p,
        &::before {
          opacity: 1;
        }
      }
    }

    & > img {
      width: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }

  .link-to {
    color: #3e90f1;
  }

  .custom-form {
    width: 100%;
    max-width: 500px;
  }
}
</style>
