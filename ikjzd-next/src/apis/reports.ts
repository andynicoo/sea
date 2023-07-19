import Axios, { Response } from "@/apis";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Report } from "@/vo/Reports";

/**查询行业报告(分页) */
export const getReportPage = (params: PageParams): Promise<Response<PageSource<Report>>> => Axios.post("/console/kjzd/report/igonre/kjzdIndustryReport/list", params);

/**下载报告 */
export const getReprotUrl = (params: PageParams): Promise<Response<any>> => Axios.post("/console/kjzdIndustryReport/get/reprotUrl", params);


