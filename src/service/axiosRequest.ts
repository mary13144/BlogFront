import type {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import axios from "axios";
import globalConfig from "@/global.config";
import type {Result} from "@/types";
import {ElMessage} from "element-plus";

export class Request {
	instance: AxiosInstance
	baseConfig: AxiosRequestConfig = {
		baseURL: '/api',
		timeout: 3 * 1000,
	}
	is_cache: boolean
	cacheList: Set<string> = new Set()

	constructor(config: AxiosRequestConfig, is_cache: boolean) {
		this.is_cache = is_cache
		this.instance = axios.create(Object.assign(this.baseConfig, config))
		//请求拦截器
		this.instance.interceptors.request.use(
			//成功
			(config: InternalAxiosRequestConfig) => {
				let url = config.url as string
				if (this.is_cache) {
					let method = config.method as string
					let key = url + method
					if (this.cacheList.has(key)) {
						ElMessage.warning("请求已发送，请稍后再试")
						return Promise.reject("重复提交请求")
					}
					this.cacheList.add(key)
				}
				let whiteListApi: string[] = globalConfig.whiteListApi
				const token = localStorage.getItem("token")
				if (whiteListApi.indexOf(url) === -1 && token) {
					config.headers!.Authorization = 'Bearer ' + token
				}
				return config
			},
			//失败
			(err: any) => {
				return Promise.reject(err)
			},
		)

		//响应拦截器
		this.instance.interceptors.response.use((res: AxiosResponse) => {
			if (this.is_cache) {
				let url = res.config.url as string
				let method = res.config.method as string
				let key = url + method
				this.cacheList.delete(key)
			}
			//直接返回数据
			return res.data
		}, (err: AxiosError) => {
			// 这里用来处理http常见错误，进行全局提示
			// let message = "";
			// switch (err.response.status) {
			// 	case 400:
			// 		message = "请求错误(400)";
			// 		break;
			// 	case 401:
			// 		message = "未授权，请重新登录(401)";
			// 		// 这里可以做清空storage并跳转到登录页的操作
			// 		break;
			// 	case 403:
			// 		message = "拒绝访问(403)";
			// 		break;
			// 	case 404:
			// 		message = "请求出错(404)";
			// 		break;
			// 	case 408:
			// 		message = "请求超时(408)";
			// 		break;
			// 	case 500:
			// 		message = "服务器错误(500)";
			// 		break;
			// 	case 501:
			// 		message = "服务未实现(501)";
			// 		break;
			// 	case 502:
			// 		message = "网络错误(502)";
			// 		break;
			// 	case 503:
			// 		message = "服务不可用(503)";
			// 		break;
			// 	case 504:
			// 		message = "网络超时(504)";
			// 		break;
			// 	case 505:
			// 		message = "HTTP版本不受支持(505)";
			// 		break;
			// 	default:
			// 		message = `连接出错(${err.response.status})!`;
			// }
			// 这里错误消息可以使用全局弹框展示出来
			// 比如element plus 可以使用 ElMessage
			// ElMessage({
			//   showClose: true,
			//   message: `${message}，请检查网络或联系管理员！`,
			//   type: "error",
			// });
			// 这里是AxiosError类型，所以一般我们只reject我们需要的响应即可
			return Promise.reject(err)
		})
	}

	//默认请求
	public request<T = any>(config: AxiosRequestConfig): Promise<Result<T>> {
		return this.instance.request(config)
	}

	//get请求
	public get<T = any>(url: string, config: AxiosRequestConfig): Promise<Result<T>> {
		return this.instance.get(url, config);
	}

	//post请求
	public post<T = any>(url: string, data: any, config: AxiosRequestConfig): Promise<Result<T>> {
		return this.instance.post(url, data, config);
	}

	public put<T = any>(url: string, data: any, config: AxiosRequestConfig): Promise<Result<T>> {
		return this.instance.put(url, data, config);
	}

	public delete<T = any>(url: string, config: AxiosRequestConfig): Promise<Result<T>> {
		return this.instance.delete(url, config);
	}
}

const cacheRequest = new Request({}, true)
const axiosRequest = new Request({}, false)

export {cacheRequest, axiosRequest}

