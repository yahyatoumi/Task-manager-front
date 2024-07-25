import { toast } from "react-toastify";
import { getAPI, postAPI, putAPI } from "./APIServices";

export const getAllWorkspaces = async () => {
    return getAPI("getRooms").then((res: any) => {
        console.log("Workspaces fetched", res);
        return res
    }).catch((e: any) => {
        console.error("Workspaces fetch error", e)
        throw e
    })
}


export const getSingleWorkspace = async (id: string) => {
    if (!id) return;
    return getAPI(`room/${id}/`).then((res: any) => {
        console.log("Single Workspace fetched", res)
        return res
    }).catch((e: any) => {
        console.error("Workspaces fetch error", e)
        toast.error("Oops, error geting single workspace!")
        throw e
    })
}

export const getSingleProject = async (id: string) => {
    return getAPI(`project/${id}/`).then((res: any) => {
        console.log("Single Project fetched", res)
        return res
    }).catch((e: any) => {
        console.error("project fetch error", e)
        toast.error("Oops, error geting single project!")
        throw e
    })
}

export const makeWorkspaceFavorite = async (workspaceId: number) => {
    console.log("makeWorkspaceFavorite")
    return putAPI("makeRoomFavorite", { room_id: workspaceId }).then((res: any) => {
        console.log("Workspaces fetched", res);
        return res
    }).catch((e: any) => {
        console.error("Workspaces fetch error", e)
        throw e
    })
}

export const makeWorkspaceNotFavorite = async (workspaceId: number) => {
    console.log("makeRoomNotFavorite noooootttt")
    return putAPI("makeRoomNotFavorite", { room_id: workspaceId }).then((res: any) => {
        console.log("Workspaces fetched", res);
        return res
    }).catch((e: any) => {
        console.error("Workspaces fetch error", e)
        throw e
    })
}

export const createWorkspace = async (name: string, description: string) => {
    return postAPI("createRoom", { name, description }).then((res: any) => {
        console.log("Workspaces created", res);
        toast.success("Workspace creatd successfully")
        return res
    }).catch((e: any) => {
        console.error("Workspaces fetch error", e)
        toast.error("Oops, error creating workspace!")
        throw e
    })
}
