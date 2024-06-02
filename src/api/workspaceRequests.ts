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