<template>
  <div class="toast-main" :id="uuid">
    <div class="toast-container" :data-show="show">
      <div class="toast-card v-card v-sheet theme--light">
        <div class="v-card__title headline grey lighten-2">{{ title }}</div>
        <div class="v-card__text">
          <div ref="confirm-form" class="confirm-form">
            <div class="field" v-for="(item, index) in field" :key="index">
              <p>{{ item.text }}</p>
              <input
                :type="item.type"
                :placeholder="item.placeholder"
                v-model="formValue[item.value]"
              />
            </div>
          </div>

          <template v-if="errorMessage">
            <p class="error">{{ errorMessage }}</p>
          </template>
        </div>
        <div class="v-card__actions">
          <div class="spacer"></div>

          <template v-for="btn in btns">
            <button
              v-if="btn === 'ok'"
              :key="btn"
              type="button"
              class="v-btn v-btn--flat v-btn--text theme--light v-size--default primary--text primary"
              :class="{ 'v-btn--loading': loading }"
              @click="_onOk"
            >
              <span class="v-btn__loader" v-if="loading">
                <div
                  role="progressbar"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  class="v-progress-circular v-progress-circular--indeterminate"
                  style="height: 23px; width: 23px"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="21.904761904761905 21.904761904761905 43.80952380952381 43.80952380952381"
                    style="transform: rotate(0deg)"
                  >
                    <circle
                      fill="transparent"
                      cx="43.80952380952381"
                      cy="43.80952380952381"
                      r="20"
                      stroke-width="3.8095238095238093"
                      stroke-dasharray="125.664"
                      stroke-dashoffset="125.66370614359172px"
                      class="v-progress-circular__overlay"
                    ></circle>
                  </svg>
                  <div class="v-progress-circular__info"></div>
                </div>
              </span>
              <span v-else class="v-btn__content">确定</span>
            </button>

            <button
              v-if="btn === 'cancel'"
              :key="btn"
              type="button"
              class="v-btn v-btn--flat v-btn--text theme--light v-size--default primary--text"
              @click="_onCancel"
            >
              <span class="v-btn__content">取消</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
export default {
  data() {
    return {
      uuid: '',
      show: false,
      loading: false,
      errorMessage: '',
      formValue: {}
    }
  },
  created() {
    this.$data.uuid = uuidv4()
    setTimeout(() => {
      this.$data.show = true
    }, 100)
  },
  methods: {
    _onCancel() {
      this.remove()
      this.onCancel()
    },
    async _onOk() {
      this.$data.loading = true
      try {
        await this.onOk(this.$data.formValue)
        this.$data.errorMessage = null
        this.remove()
      } catch (error) {
        this.$data.errorMessage = error.message
      } finally {
        this.$data.loading = false
      }
    },
    remove() {
      this.$data.show = false
      setTimeout(() => {
        document.body.removeChild(document.getElementById(this.$data.uuid))
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.toast-main {
  .toast-container {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 250;
    background-color: rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: all 0.3s;

    .toast-card {
      position: fixed;
      left: 50%;
      top: 45%;
      transform: translate(-50%, -50%);
      max-width: 800px;
      min-width: 400px;
      transition: all 0.3s;

      .v-btn {
        margin: 0 5px;
      }
    }

    &[data-show='true'] {
      opacity: 1;

      .toast-card {
        top: 50%;
      }
    }
  }
}

.error {
  color: red;
}

.confirm-form {
  & > .field {
    width: 100%;

    & > input {
      width: 100%;
      background-color: #fcfcfc;
      border: 1px solid #eeeeee;
      border-radius: 3px;
      padding: 3px 5px;
    }
  }
}

.primary {
  background-color: var(--v-primary-base) !important;
  border-color: var(--v-primary-base) !important;
  color: #FFFFFF;
}
</style>
