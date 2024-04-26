import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import jwt from "jsonwebtoken";
import { toast } from 'react-toastify';

// ------------------------------- Params Global ----------------------- //

const config: AxiosRequestConfig = {
    baseURL: "http://127.0.0.1:8000",
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
};

// --------------------------- POST request ------------------------------ //

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000', // Replace with your API base URL
});

axios.interceptors.request.use(
    async config => {
        const accessToken = localStorage.getItem('user_token');
        if (!accessToken) {
            return config;
        }
        const tokenExpiration = localStorage.getItem('token_expiration');
        if (tokenExpiration && new Date(Number(tokenExpiration) * 1000) < new Date()) {
            try {
                const response = await axiosInstance.post('api/token/refresh', {
                    refresh: localStorage.getItem('refresh_token')
                });
                const newAccessToken = response.data.access;
                const decodedToken: any = jwt.decode(newAccessToken);
                localStorage.setItem("token_expiration", decodedToken.exp);
                localStorage.setItem('user_token', newAccessToken);
                localStorage.setItem("refresh_token", response.data.refresh);
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (error) {
                console.error('Error refreshing token:', error);
                localStorage.clear()
            }
        } else {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
);


export const postAPI = async (url: string, data: unknown): Promise<unknown> => {
    console.log(`${config.baseURL}/${url}`);
    return await axios({
        ...config,
        method: 'post',
        url: `${config.baseURL}/${url}`,
        data,
    })
        .then((response: AxiosResponse) => {
            console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log("errrrrr", error)
            if (error.response.status === 401)
            {
                console.log("RRRRRR")
                toast.error("You are unauthrized");
            }
            return {
                status: error.response.status,
                data: error.response,
            };
        });
};

// --------------------------- POST request ------------------------------ //

export const postDownloadAPI = async (url: string, data: unknown): Promise<unknown> => {
    return await axios({
        ...config,
        method: 'post',
        url: `${config.baseURL}/${url}`,
        responseType: 'blob',
        data,
    })
        .then((response: AxiosResponse) => {
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log(error);
            return {
                status: error.status,
                data: error.response,
            };
        });
};

// --------------------------- GET request ------------------------------ //

export const getAPI = async (url: string, data?: unknown): Promise<unknown> => {
    let new_url = `${config.baseURL}/${url}`;
    if (data !== undefined) {
        const params = new URLSearchParams(data as Record<string, string>);
        new_url += `?${params.toString()}`;
    }

    return await axios({
        ...config,
        method: 'get',
        url: new_url,
    })
        .then((response) => {
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log(error);
            console.log("ERRRRRRRRRR");
            if (error.response.status === 401)
            {
                console.log("RRRRRR")
                toast.error("You are unauthrized");
                localStorage.clear();
            }
            return {
                status: error.response.status,
                data: error.response,
            };
        });
};


// --------------------------- HEAD request ------------------------------ //
// empty response (to ask for metadata ex:size_file ...)

export const headAPI = async (url: string, data: unknown): Promise<unknown> => {
    return await axios({
        ...config,
        method: 'head',
        url: `${config.baseURL}/${url}/${data}`,
    })
        .then((response) => {
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log(error);
            return {
                status: error.status,
                data: error.response,
            };
        });
};

//  -------------------------- PUT request ------------------------------ //
// Update with new version

export const putAPI = async (url: string, data: unknown, id?: number): Promise<unknown> => {
    return await axios({
        ...config,
        method: 'put',
        url: `${config.baseURL}/${url}${id ? "/" + id : ''}`,
        data,
    })
        .then((response) => {
            console.log("url", url)
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log(error);
            console.log("errrrrrrorrrr");
            return {
                status: error.response.status,
                data: error.response.data,
            };
        });
};

//  -------------------------- PATCH request ------------------------------ //
//  Are used to partially modify an existing resource

export const patchAPI = async (url: string, data: unknown, id: number): Promise<unknown> => {
    return await axios({
        ...config,
        method: 'patch',
        url: `${config.baseURL}/${url}/${id}`,
        data,
    })
        .then((response) => {
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log(error);
            return {
                status: error.status,
                data: error.response,
            };
        });
};

//  -------------------------- DELETE request ------------------------------ //
//  Are used to partially modify an existing resource

export const deleteAPI = async (url: string, data?: unknown): Promise<unknown> => {
    return await axios({
        ...config,
        method: 'delete',
        url: `${config.baseURL}/${url}`,
        data,
    })
        .then((response) => {
            if ((process.env.APP_ENV as string) === 'development') console.log(response);
            return {
                status: response.status,
                data: response.data,
            };
        })
        .catch((error) => {
            console.log(error);
            return {
                status: error.status,
                data: error.response,
            };
        });
};