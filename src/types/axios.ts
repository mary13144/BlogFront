//axios返回数据类型接口
export interface Result<T> {
	code: number
	data: T
	msg: string
}

//分页返回数据类型接口
export interface PageData<T> {
	count: number
	list: T[]
}

//分页传递数据类型接口
export interface Page {
	page_num: number
	page_size: number
	keyword?: string
	sort?: string
}

//axios发送请求方式枚举
export enum MethodType {
	get = 'get',
	post = 'post',
	put = 'put',
	delete = 'delete',
}