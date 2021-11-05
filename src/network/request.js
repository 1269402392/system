import axios from 'axios'
import Nprogress from 'nprogress' //进度条插件
import 'nprogress/nprogress.css'
import Vue from "vue";
import { Message } from 'element-ui';


Vue.use(Nprogress)

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout: 0
})

instance.interceptors.request.use(config => {
  Nprogress.start()
  config.headers.Authorization = localStorage.token
  return config
})

instance.interceptors.response.use(config => {
  Nprogress.done()
  if (config.data.meta.status == 500 || config.data.meta.status == 401) {
    return Message.error(config.data.meta.msg)
  } else if(config.data.meta.status == 404) {
    return Message.error('请求资源不存在')
  }
  return config
})

export default instance