import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { toast } from "sonner";
export const baseURL: string = process.env.NEXT_PUBLIC_API_URL!

function getCookie(name:string) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const apiGet = axios.create({
    baseURL: baseURL,
    timeout: 3000,
    headers: {
        "Content-Type": "application/json",
    }
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    failedQueue = [];
  };
  

apiGet.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; 
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

export const apiPost = axios.create({
    baseURL: baseURL,
    timeout: 3000,
});

apiPost.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem("token");
        const csrftoken = getCookie("csrftoken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        if (csrftoken) {
            config.headers["X-CSRFToken"] = csrftoken;
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

apiGet.interceptors.response.use(
    (response: AxiosResponse): AxiosResponse => response,
    async (error: AxiosError): Promise<any> => {
      const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
  
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
  
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
          .then((token) => {
            const accessToken = token as string;
            if (originalRequest.headers)
              originalRequest.headers['Authorization'] = 'Bearer ' + accessToken;
            return apiGet(originalRequest);
          })
            .catch(err => Promise.reject(err));
        }
  
        isRefreshing = true;
  
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) {
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/';
          toast.error('Session expired. Please log in again.');
          return Promise.reject(error);
        }
  
        try {
          const response = await axios.post(`${baseURL}/token/refresh/`, {
            refresh: refresh_token
          });
  
          const newAccessToken = response.data.access;
  
          localStorage.setItem('token', newAccessToken);
          processQueue(null, newAccessToken);
  
          if (originalRequest.headers)
            originalRequest.headers['Authorization'] = 'Bearer ' + newAccessToken;
  
          return apiGet(originalRequest);
        } catch (err) {
          processQueue(err, null);
          localStorage.removeItem('token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/';
          toast.error('Session expired. Please log in again.');
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
  
      return Promise.reject(error);
    }
  );