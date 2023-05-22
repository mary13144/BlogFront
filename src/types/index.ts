//axios返回数据类型接口
export interface Result<T> {
	code: number
	data: T
	msg: string
}

//axios发送请求方式枚举
export enum MethodType {
	get = 'get',
	post = 'post',
	put = 'put',
	delete = 'delete',
}

//登陆---------------------------------------------------------------------------------------------
//token解析后的用户数据格式接口
export interface UserToken {
	user_id: number
	nick_name: string
	avatar: string
	role: number
}

//token解析后的完整数据格式接口
export interface Token {
	user: UserToken
	exp: number
	iss: string
}

//验证码请求返回数据格式接口
export interface Code {
	captcha: string
	id: string
}

//用户登陆数据接口
export interface LoginUser {
	user_name: string
	pass_word: string
	captcha_id: string
	captcha: string
}

//用户注册信息格式接口
export interface RegisterInfo {
	username: string
	email: string
	password: string
	confirm_password: string
	code: string
}

//首页或后台公用组件---------------------------------------------------------------------------------------------
//首页汇总数据接口
export interface Home_dataSum {
	title: string
	data: number
}

//侧边栏渲染数据接口
export interface Admin_aside {
	id: string
	icon: string
	title: string
	router?: string
	children?: Admin_aside[]
}

//表格数据接口
export interface TableColumn {
	title: string
	prop: string
	avatar?: boolean
	img?: boolean
	option?: boolean
	date?: boolean
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

//tabItem数据接类型接口
export interface Tab {
	title: string
	name: string
}

//用户列表---------------------------------------------------------------------------------------------
//用户信息数据接口
export interface UserInfo {
	ID: number
	nick_name: string
	avatar: string
	email: string
	role: string
	sign_status: string
	ip: string
	addr: string
	CreatedAt: string
}

//用户权限枚举
export enum UserPower {
	PermissionAdmin = 1,
	PermissionUser = 2,
	PermissionVisitor = 3,
	PermissionDisableUser = 4,
}

//修改用户信息数据接口
export interface Userupdate {
	user_id: number
	nick_name: string
	role: number | string
}

//图片列表---------------------------------------------------------------------------------------------
//图片数据接口
export interface Image {
	ID: number
	name: string
	path: string
	image_type: string
	CreateAt: string
}

//图片类型枚举
export enum ImageType {
	Local = 1,
	QiNiu = 2,
}

//修改图片信息数据接口
export interface PictureUpdate {
	id: number,
	name: string,
	path: string,
}
