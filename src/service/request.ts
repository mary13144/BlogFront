import axiosRequest from "@/service/axiosRequest";
import type {AxiosRequestConfig} from "axios";
import type {Result} from "@/types";


// 职责链模式的缓存接口数据，防止重复请求
// let cacheRequest = (function (): Function {
// 	let cacheList: Set<string> = new Set()
// 	let cacheMemory: Map<string, AxiosResponse> = new Map()
// 	return function (config: AxiosRequestConfig): Promise<any> {
// 		//data-搭载的数据
// 		//go-是否继续执行下一个函数
// 		//type-最后进入promise的then还是reject
// 		let url = config.url as string
// 		let method = config.method as string
// 		let key = url + method
// 		let nextInfo: ResInfo = {go: true}
// 		let promise: Promise<ResInfo> = Promise.resolve(nextInfo)
//
// 		function isCacheMemory() {
// 			let nextInfo: ResInfo
// 			if (cacheMemory.has(key)) {
// 				nextInfo = {go: false, type: InfoType.then, data: cacheMemory.get(key)}
// 			} else {
// 				nextInfo = {go: true}
// 			}
// 			return Promise.resolve(nextInfo)
// 		}
//
// 		function isAlreadySend() {
// 			let nextInfo: ResInfo
// 			if (cacheList.has(key)) {
// 				nextInfo = {go: false, type: InfoType.reject, data: "请求以提交,请稍后"}
// 			} else {
// 				nextInfo = {go: true}
// 				cacheList.add(key)
// 			}
// 			return Promise.resolve(nextInfo)
// 		}
//
// 		async function finalRequest() {
// 			let resData: Result<any> = await axiosRequest.request({...config})
// 			let nextInfo: ResInfo = {go: true, type: InfoType.then, data: resData}
// 			return Promise.resolve(nextInfo)
// 		}
//
// 		function finalHandler(info: ResInfo) {
// 			if (info.type == InfoType.reject) {
// 				return Promise.reject(info.data)
// 			}
// 			cacheMemory.set(key, info.data)
// 			cacheList.delete(key)
// 			return Promise.resolve(info.data)
// 		}
//
// 		let taskArr: Function[] = [isCacheMemory, isAlreadySend, finalRequest, finalHandler]
// 		while (taskArr.length !== 0) {
// 			let task = taskArr.shift() as Function;
//
// 			function next(this: any, info: ResInfo) {
// 				console.log(info)
// 				if (!info.go) {
// 					return Promise.resolve(info)
// 				}
// 				return task.call(this, info)
// 			}
//
// 			promise = promise.then(next)
// 		}
// 		return promise
// 	}
// })()

let cacheRequest = (function () {
	let cacheList: Set<string> = new Set()
	let cacheMemory: Map<string, Result<any>> = new Map()
	return function <T>(config: AxiosRequestConfig): Promise<Result<T>> {
		let url = config.url as string
		let method = config.method as string
		let key = url + method
		if (cacheMemory.has(key)) {
			return Promise.resolve(cacheMemory.get(key)!);
		} else {
			if (cacheList.has(key)) {
				return Promise.reject({mes: "请求已经提交"})
			}
			cacheList.add(key);
			return axiosRequest.request({
				...config
			}).then((res) => {
				cacheList.delete(key)
				cacheMemory.set(key, res)
				return res
			})
		}

	}
})()

export default cacheRequest


