import Axios from "axios";
import { StorageHelper } from "./storage-helper";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { RouterHelper } from "./router-helper";
// axios.defaults.baseURL = "http://127.0.0.1:4000";
const axios = Axios.create();
axios.defaults.baseURL="/api";

Axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

// // 添加请求拦截器
axios.interceptors.request.use(
  config => {
    config.headers.common["Authorization"] = `Bearer ${
      StorageHelper.getToken().access_token
    }`;
    return config;
  },
  error => Promise.reject(error)
);

axios.interceptors.response.use(
  response => {
    if (response.data.code === 200) {
      return response.data.data;
    }
    return Promise.reject(response.data);
  },
  error => {
    // 这里判断是否是 上面 onFulfilled 抛出的错误
    // 这里要判断是否refresh token
    if (error?.response?.status === 401) {
      return Promise.reject(error);
    }
    if (error.response) {
      return Promise.reject(error.response.data);
    }
    return Promise.reject(error);
  }
);

const refreshAuthLogic = failedRequest => {
  const refreshOptions = {
    access_token: StorageHelper.getToken().access_token
  };
  return axios
    .post("/pub/refreshToken", refreshOptions)
    .then(tokenRefreshResponse => {
      const { access_token, refresh_token } = tokenRefreshResponse;
      failedRequest.response.headers.Authorization = `Bearer ` + access_token;
      failedRequest.response.baseURL = "";
      StorageHelper.setToken(access_token, refresh_token);
      return Promise.resolve();
    })
    .catch(err => {
      StorageHelper.deleteToken();
      RouterHelper.to("/login").catch(console.log);
      return Promise.reject(err);
    });
};

createAuthRefreshInterceptor(axios, refreshAuthLogic);

// let isRefreshing = false;
// // 重试队列，每一项将是一个待执行的函数形式
// let requests = [];
// // 添加响应拦截器
// axios.interceptors.response.use(
//   response => {
//     if ( response.data.code === 0 ) {
//       return response.data.data;
//     }
//     return Promise.reject( response.data );
//   },
//   error => {
//     if ( error.response.status === 401 ) {
//       const config = error.config;
//       if ( !isRefreshing ) {
//         isRefreshing = true;
//         return axios.post( "/refreshToken", { access_token: store.state.access_token } )
//           .then( data => {
//             config.headers.Authorization = `Bearer ` + data.access_token;
//             config.baseURL = "";
//             // 已经刷新了token，将所有队列中的请求进行重试
//             requests.forEach( cb => cb( data.access_token ) );
//             requests = [];
//             store.commit( CHANGE_ACCESS_TOKEN, {
//               access_token: data.access_token
//             } );
//             return axios( config );
//           } )
//           .catch( err => {
//             router.push( { path: "/login" } );
//             return Promise.reject( err );
//           } )
//           .finally( () => isRefreshing = false );
//       }
//       // 正在刷新token，返回一个未执行resolve的promise
//       return new Promise( ( resolve ) => {
//         // 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
//         requests.push( ( token ) => {
//           config.headers.Authorization = `Bearer ` + token;
//           config.baseURL = "";
//           resolve( axios( config ) );
//         } );
//       } );
//     }
//     // 对响应错误做点什么
//     return Promise.reject( error );
//   }
// );

export { axios };
