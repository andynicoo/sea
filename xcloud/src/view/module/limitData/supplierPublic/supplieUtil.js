import { supplyFunCodes, prescriptionDateList, countryArr, monitorEnum } from "./enum.js";

/** 过滤国家列表 */

export const filterCountry = (arr) => {
  let countryList = [];
  countryArr.forEach((item) => {
    let findItem = arr.find((count) => count.countryCode == item);
    findItem && countryList.push(findItem);
  });
  return countryList;
};

/**返回选择的工单列表 :number*/
export const rqWorkOrderType = (workOrderType) => {
  if (workOrderType && workOrderType.length == 2) workOrderType = workOrderType[1];
  return workOrderType || null;
};
