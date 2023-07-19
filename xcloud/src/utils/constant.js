export default {
  TAX_MANAGER: 'tax_manager', // 税务经理
  SUPPLY_COMMISSIONER: 'supply_commissioner', // 供应链专员
  HYCERTIFICATION_FUNCTION_CODE: '13', // 海牙认证节点
  AUTHORIZEDREPRESENT_FUNCTION_CODE: '16', // 英代欧代节点
  TAXINSPECTION_FUNCTION_CODE: '7', // 税务稽查节点
  LOGOUTTAXNUM_FUNCTION_CODE: '6', // 注销税号节点
  TAXREFUND_FUNCTION_CODE: '24', // VAT退税节点
  TAXRegAnd_FUNCTION_CODE: '5', // 税号注册
  TAXProxy_FUNCTION_CODE: '2', // 税号转代理
  EPR_FUNCTION_CODE: '31', // EPR注册
  ADD_CATEGORY_BRAND_FUNCTION_CODE: 106, // 加类加品牌
  ADD_BAT_CATEGORY_BRAND_FUNCTION_CODE: 107, // 加类加品牌
  EPR_TAX_SERVICES_FUNCTION_CODE: '32', // EPR转代理
  APPEARANCE_FUNCTION_CODE: '100', // 外观专利
  MODEL_FUNCTION_CODE: '101', // 仅建模
  DRAW_FUNCTION_CODE: '102', // 仅绘图
  MODEL_DRAW_FUNCTION_CODE: '103', // 建模绘图
  OA_APPEARANCE_FUNCTION_CODE: '104', // OA
  CERTIFICATE_FUNCTION_CODE: '105', // 授权书
  SIMPLE_WORK_ORDER: '20', // EPR注册SimpleWorkOrder
  VAT_CUSTOMER_SERVICE: 'SG_VAT_Customer_Service', //卖家VAT客服
  TRADEMARK_CUSTOMER_SERVICE: 'SG_Trademark_Customer_Service', //卖家商标客服
  DELIVERY_INTERMEDIATE: 'delivery_intermediate', //交付主管
  DELIVERY_ELEMENTARY: 'delivery_elementary', //交付专员
  /**工单管理 分页常量 */
  WORKER_SERVER_PAGELIST: [10, 20, 30, 50, 100],

  // 基础数据dataType
  dataType: {
    PAYMENT_CHANNEL_TYPE: 'PAYMENT_CHANNEL_TYPE', // 支付方式
    FUNCTION_CODE_RENEWAL: 'FUNCTION_CODE_RENEWAL', // 续费业务类型
    ORDER_STATUS_TYPE: 'ORDER_STATUS_TYPE', // 订单状态
    ORDER_TYPE: 'ORDER_TYPE', // 订单类型
  },
};

/** epr商品分类 */
export const productCategoryList = [
  { value: '温度交换设备' },
  { value: '显示屏' },
  { value: '非气体放电灯' },
  { value: '气体放电灯' },
  { value: '大型非光伏设备（收缩后的单边最大尺寸>50cm）' },
  { value: '小型非光伏设备（收缩后的单边最大尺寸≤50cm）' },
  { value: '小型IT和电信设备（收缩后的单边最大尺寸≤50cm）' },
  { value: '大型光伏设备（收缩后的单边最大尺寸>50cm）' },
  { value: '小型光伏设备（收缩后的单边最大尺寸≤50cm）' },
];
