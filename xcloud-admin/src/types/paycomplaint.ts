export type searchTime = undefined | string[];

// 支付客诉 搜索
export interface SearchType {
  startTime: string;
  endTime: string;
  searchTime?: searchTime;
}
