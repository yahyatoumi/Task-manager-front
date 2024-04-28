import { postAPI, getAPI } from "./APIServices";

export const getGoogleAuthLink = async () => {
    return getAPI("auth").then((res: any) => {
        console.log("resss", res)
        return res;
    }).catch((e: any) => {
        console.error("request error", e)
        return e;
    })
}

export const authWithGoogle = async () => {
    const code = new URLSearchParams(window.location.search).get('code')
    const postData = {
        code: code
    }

    return postAPI("google/auth", postData).then((res: any) => {
        console.log("resss", res)
        return res;
    }).catch((e: any) => {
        console.error("request error", e)
        return e;
    })
}