import { toast } from "react-toastify";
import { getAPI, postAPI, putAPI } from "./APIServices";


export const getProjectInWorkspace = async (id: string) => {
    return getAPI(`workspace/${id}/projects`).then((res: any) => {
        console.log("Projects fetched", res);
        return res
    }).catch((e: any) => {
        console.error("Projects fetch error", e)
        throw e
    })
}

export const creatProject = async (data: CreateProjectDataType) => {
    return postAPI(`createProject`, data).then((res: any) => {
        console.log("Projects fetched", res);
        return res
    }).catch((e: any) => {
        console.error("Projects fetch error", e)
        throw e
    })
}