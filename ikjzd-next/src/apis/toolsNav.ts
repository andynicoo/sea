import Axios, { Response } from "@/apis";
import ToolNavArry  from "@/vo/ToolsNav";
/**获取导航 */
export const kjzdToolsNavListAll = (): Promise<Response<ToolNavArry[]>> => Axios.post("/console/kjzd/kjzdNav/igonre/list", {});