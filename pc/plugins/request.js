import axios from "axios";
import store from "@/store";
import { Message, Notification } from "element-ui"; // 这里使用了element-ui的消息提示方法，也可自行定义

axios.defaults.headers["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.headers.post["Content-Type"] = "text/plain;charset=UTF-8";
let service = axios.create({
  baseURL:
    process.env.NODE_ENV === "development"
      ? "http://api.culture-creative.com"
      : "https://ccapi.inlilive.com",
  timeout: 10000,
});

// 请求拦截 可在请求头中加入token等
service.interceptors.request.use(
  (config) => {
    // console.log($store.state.user);
    config.headers["Authorization"] = localStorage.getItem("user")?.token || "";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截 对响应消息作初步的处理
service.interceptors.response.use(
  (resp) => {
    if (resp.data) {
      if (resp.data.code !== 0) {
        Message({
          type: "error",
          message: resp.data.msg,
          duration: 5000,
        });
      }
      return {
        code: resp.data.code,
        data: resp.data.data,
        msg: resp.data.msg,
      };
    } else {
      return resp;
    }
  },
  (error) => {
    if (error.response) {
      switch (error.response.states) {
        case 400: {
          if (
            error.response &&
            error.response.data &&
            error.response.data.msg
          ) {
            Notification.error({
              title: "400错误",
              message: error.response.data.msg,
              duration: 5000,
              closable: true,
            });
          }
          break;
        }
      }
    }
  }
);

export default service;
