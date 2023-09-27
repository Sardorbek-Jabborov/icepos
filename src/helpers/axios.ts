import axios, {AxiosRequestConfig, AxiosResponse, AxiosError} from 'axios';
import {getItem} from "@/service/localstorage";
import {useRouter} from "vue-router";

const router = useRouter()

axios.defaults.baseURL = 'http://devserver.uz/api';

const accessToken = getItem('access_token');
axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

const requestConfig: AxiosRequestConfig = {
    headers: {
        'Content-Type': 'application/json',
    },
};

axios.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response) {
            const {status} = error.response;
            if (status === 401) {
                router.push('/');
            }
        }

        return Promise.reject(error);
    }
);

export const useApi = {
    get: <T>(url: string): Promise<T> =>
        axios.get(url, requestConfig).then((response) => response.data),
    post: <T>(url: string, data: any): Promise<T> =>
        axios.post(url, data, requestConfig).then((response) => response.data),
    put: <T>(url: string, data: any): Promise<T> =>
        axios.put(url, data, requestConfig).then((response) => response.data),
    delete: <T>(url: string): Promise<T> =>
        axios.delete(url, requestConfig).then((response) => response.data),
    patch: <T>(url: string, data: any): Promise<T> =>
        axios.patch(url, data, requestConfig).then((response) => response.data),
};

export default {useApi};
