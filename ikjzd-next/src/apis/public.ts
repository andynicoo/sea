import Axios, { Response } from "@/apis";
import { Key } from "react";

/**上传文件 */
export const uploadImage = (params: FormData): Promise<Response<string[]>> => Axios.post("/kjzdUser/kjzdTools/uploadImage", params, { headers: { "Content-Type": "multipart/form-data;" } });

/**点赞 */
export const operatePraise = (params: { type: Key, otherId: Key }): Promise<Response<string[]>> => Axios.post("/console/user/operate/praise", params);

/**取消点赞 */
export const operatePraiseCancel = (params: { type: Key, otherId: Key }): Promise<Response<string[]>> => Axios.post("/console/user/operate/praise/cancel", params);

/**收藏 */
export const operateCollect = (params: { type: Key, otherId: Key }): Promise<Response<string[]>> => Axios.post("/console/user/operate/collect", params);

/**取消收藏 */
export const operateCollectCancel = (params: { type: Key, otherId: Key }): Promise<Response<string[]>> => Axios.post("/console/user/operate/collect/cancel", params);