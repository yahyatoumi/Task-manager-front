import { toast } from "react-toastify";
import { getAPI, postAPI, putAPI } from "./APIServices";


export const createNewTask = async (data) => {
    console.log("dddata", data)
    return postAPI("createTask", data).then((res: any) => {
        console.log("task created", res);
        toast.success("task creatd successfully")
        return res
    }).catch((e: any) => {
        console.error("task fetch error", e)
        toast.error("Oops, error creating task!")
        throw e
    })
}