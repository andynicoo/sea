import Axios, { Response } from "@/apis";
import { Demand, DemandType } from "@/vo/Demand";
import { PageParams, PageSource } from "@/vo/PageParams";
import { Key } from "react";

/**海外需求列表 */
export const getDemandPage = (params: PageParams): Promise<Response<PageSource<Demand>>> => Axios.post("/console/kjzdOverseasDemand/getPage", {
    ...params, auditStatus: "YSH"
});

/**海外需求详情 */
export const getDemand = (id: Key): Promise<Response<Demand>> => Axios.post("/console/kjzdOverseasDemand/detail", { id });

/**海外需求类型 */
export const getDemandType = (): Promise<Response<DemandType[]>> => Axios.get("/console/kjzdOverseasDemand/type");

/**新增海外需求 */
export const saveDemand = (data: any): Promise<Response> => Axios.post("/console/kjzdOverseasDemand/save", data);