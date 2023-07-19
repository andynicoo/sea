let baseURL = '/api'
let type = 0
if (process.env.NODE_ENV == 'development') {
  type = 9
  switch (type) {
    case 1:
      baseURL = 'https://erp-sit1.emalacca.com/api' //测试环境 sit1
      break
    case 2:
      baseURL = 'https://erp-sit2.emalacca.com/api' //测试环境 sit2
      break
    case 8:
      baseURL = 'https://newstarting-erp.emalacca.com/api' // 预生产 uat1
      break
    case 9:
      baseURL = 'https://erp.emalacca.com/api' // 生产
      break

    case 10:
      baseURL = 'http://192.168.32.9:9001' // xx
      break
    case 11:
      baseURL = 'http://192.168.32.170:5551' // 黄暑波
      break
    case 12:
      baseURL = 'http://192.168.32.158:6658' // 阳杰
      break
    default:
      baseURL = '/api'
      break
  }
}

export default baseURL
