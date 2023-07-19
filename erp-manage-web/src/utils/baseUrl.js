// eslint-disable-next-line prefer-const
let baseURL = '/api'
let type = 1
if (process.env.NODE_ENV === 'development') {
  type = 9
    switch (type) {
      case 1:
        baseURL = 'https://mg-sit1.emalacca.com/api' // 测试环境 sit1
        break
      case 2:
        baseURL = 'https://mg-sit1.emalacca.com/api' // 测试环境 sit2
        break

    case 8:
      baseURL = 'https://mg-uat1.emalacca.com/api' // 预生产
      break
    case 9:
      baseURL = 'https://mg-erp.emalacca.com/api' // 生产
      break
    case 10:
      baseURL = 'http://192.168.32.119:5551' // 李佐兰
      break
    case 11:
      baseURL = 'http://192.168.32.158:6658' // 阳杰
      break
    default:
      baseURL = '/api'
      break
  }
}
export default baseURL
