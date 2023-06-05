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