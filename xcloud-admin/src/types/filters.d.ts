import { ComponentCustomProperties } from "vue";

declare module 'vue' {
  interface ComponentCustomProperties {
    $filters: {
      /**通知方式 */
      filterSendModel: (value: string) => string,
      /**通知对象 */
      filterSendType: (value: string) => string,
      /**消息类型 */
      filterMessageType: (value: string) => string,
    }
  }
}

export default ComponentCustomProperties