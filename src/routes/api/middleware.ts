import axios from "axios";


export const API = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 300000,
    headers: {
      "Content-Type": "multipart/form-data" ,
      // "Access-Control-Allow-Origin": "*",
      // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    },
  });

  API.interceptors.response.use(
    (response) => {
      const { status, config } = response;
      //check expired event
      //clearLocalStorage()
      return response;
    },
    (error) => {
      // console.warn("Error status", error.response);
      // console.log(error.response)
      if (error.response) {
        return error.response
      } else {
        return Promise.reject(error);
      }
    }
  );

  
  API.interceptors.request.use((request) => {
    // console.log("interceptor req bus:", request);
    // console.log(request.data);
    
    return request;
  });
  
  export function standardResponse(success:any, message:any) {
    return {
      success,
      message,
    };
  }
  