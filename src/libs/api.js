import axios from 'axios';

import env from '../env.js';

export const API_URL = `${env.API_URL}/`;

const successHandler = (response) => {
    return response
};

const errorHandler = (error) => {
  if (error.response) {
      const { status, data } = error.response;

      
  } else if (error.request) {
      // Handle network errors (e.g., the server is down or the request didn't reach the server).
      alert('Network error occurred. Please try again later.');
  } else {
      // Handle other errors (e.g., JavaScript errors).
      alert('An unexpected error occurred.');
  }

  return Promise.reject({ ...error });
};


const api = (security = true) => {

    let configs = {
        baseURL: API_URL,
        headers: { "Content-Type": "application/json" }
    };

    if (security) {
        configs.headers['Authorization'] = 'Bearer ' + localStorage.getItem('token');
        configs.headers['token'] = localStorage.getItem('token');
    }

    let axiosInstance = axios.create(configs);

    axiosInstance.interceptors.response.use(
        response => successHandler(response),
        error => errorHandler(error)
    )

    return axiosInstance;
}

export default api;