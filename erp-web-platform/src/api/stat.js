import { post, get } from '@/util/request'

const Stat = {
  // getNoticeDataDetailById: (p) => get('/message/notice/query', p), //获取消息详情

  getStoreStat: (p) =>
    post('/statistics/statistics-store-snapshot/queryStoreStatisticsData', p), // 获取店铺统计数据

  getNewStoreStat: (p) =>
    post('/statistics/statistics-store-snapshot/executeStoreStatistics', p), // 店铺数据刷新

  getStoreRanking: (p) =>
    post('/statistics/statistics-store-snapshot/queryStoreRanking', p), // 获取店铺销量排行

  getProductRanking: (p) =>
    post('/statistics/statistics-store-snapshot/queryProductPurchasedInfo', p), // 获取店铺商品销量排行

  getSalesData: (p) =>
    post('/statistics/statisticsSalesSnapshot/sales/statistics', p), // 销售数据-数据统计

  getNewSalesData: (p) =>
    post('/statistics/statisticsSalesSnapshot/refresh', p), // 销售数据-数据统计

  getStatisticsFinance: (p) =>
    post('/statistics/statistics-finance-snapshot/queryStatisticsFinance', p), // 财务统计-数据统计

  getStatisticsFinanceByDate: (p) =>
    post(
      '/statistics/statistics-finance-snapshot/queryStatisticsFinanceByDate', // 财务统计-表格数据
      p
    ),

  getProductData: (p) =>
    post('/statistics/statisticsProductSnapshot/product/statistics', p), // 产品数据-数据统计

  getNewProductData: (p) =>
    post('/statistics/statisticsProductSnapshot/refresh', p) // 产品数据-刷新
}

export default Stat
