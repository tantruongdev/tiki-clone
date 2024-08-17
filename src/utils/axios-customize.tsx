import axios from "axios";
const baseURL = import.meta.env.VITE_BACKEND_URL;
const token = localStorage.getItem('access_token');
const instance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  withCredentials: true
});

instance.defaults.headers.common = { 'Authorization': `Bearer ${token}` }

// Add a request interceptor
instance.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

const NO_RETRY_HEADER = 'x-no-retry';
const handleRefreshToken = async () => {
  const res = await instance.get(
    '/auth/refresh'
  )
  if (res && res.data) return res.data.access_token;
  return null;
}
// Add a response interceptor
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  // console.log(response);
  return response && response.data ? response.data : response;
}, async function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  if (error.config && error.response
    && +error.response.status === 401
    && !error.config.headers[NO_RETRY_HEADER]
  ) {
    const access_token = await handleRefreshToken();
    error.config.headers[NO_RETRY_HEADER] = 'true';
    if (access_token) {
      error.config.headers['Authorization'] = `Bearer ${access_token}`;
      localStorage.setItem('access_token', access_token);
      return instance.request(error.config);
    }
  }

  if (error.config && error.response
    && +error.response.status === 400
    && error.config.url === '/auth/refresh'
  ) {

    if (
      window.location.pathname !== '/'
      && !window.location.pathname.startsWith('/book')
    ) {
      window.location.href = '/login';
    }

  }
  return error?.response.data ?? Promise.reject(error);
});

export default instance;