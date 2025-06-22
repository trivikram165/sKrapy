import axios from "axios";
import Router from "next/router";
import { useRecoilState } from "recoil";
import { useMemo, useCallback } from "react"; 
import { authAtom } from "src/_state/auth";
import { AppConfig } from "src/config/AppConfig";
import { notification } from "antd";

export { useFetchWrapper };

function useFetchWrapper() {
    const [auth, setAuth] = useRecoilState(authAtom);

    const axiosInstance = useMemo(() => {
        const instance = axios.create({
            baseURL: AppConfig.API_URL,
            headers: { "Content-Type": "application/json" },
        });

        instance.interceptors.request.use(config => {
            if (auth?.token && config.headers) {
                config.headers.Authorization = `Bearer ${auth.token}`;
            }
            return config;
        });

        instance.interceptors.response.use(
            response => response,
            error => {
                const { response } = error;
                if (response && [401, 403].includes(response.status)) {
                    notification.error({ key: "session_expired", message: "Session expired. Please log in again.", duration: 3 });
                    setAuth(null);
                    localStorage.removeItem('auth-storage');
                    Router.push('/login');
                }
                const errorMessage = response?.data?.message || error.message;
                return Promise.reject(new Error(errorMessage));
            }
        );
        return instance;
    }, [auth, setAuth]);

    const get = useCallback(<T,>(url: string, params?: object) => axiosInstance.get<T>(url, { params }).then(res => res.data), [axiosInstance]);
    const post = useCallback(<T,>(url: string, body?: object) => axiosInstance.post<T>(url, body).then(res => res.data), [axiosInstance]);
    const put = useCallback(<T,>(url: string, body?: object) => axiosInstance.put<T>(url, body).then(res => res.data), [axiosInstance]);
    const del = useCallback(<T,>(url: string) => axiosInstance.delete<T>(url).then(res => res.data), [axiosInstance]);

    return useMemo(() => ({
        get,
        post,
        put,
        delete: del
    }), [get, post, put, del]);
}