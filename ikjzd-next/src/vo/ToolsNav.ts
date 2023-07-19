import { Key } from "react";
export default interface ToolNavArry {
    id: number;
    name: string;
    pid: number;
    img: string;
    layout: number;
    desc: string;
    url: string;
    target: boolean;
    label: boolean;
    sort: number;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    otar: string;
    ttar: string;
    turl: string;
    navLevel:string;
    children:any[]
}