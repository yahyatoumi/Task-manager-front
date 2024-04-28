import { toast } from "react-toastify";
import { getAPI, postAPI } from "./APIServices";

export const getAllWorkspaces = async () => {
    return getAPI("getRooms").then((res: any) => {
        console.log("Workspaces fetched", res);
        return res
    }).catch((e:any) => {
        console.error("Workspaces fetch error", e)
    })
}