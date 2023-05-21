import type {Code, LoginUser, RegisterInfo, Result} from "@/types";
import axiosRequest from "@/service/axiosRequest";

//请求验证码api
export async function LoadingCode(): Promise<Result<Code>> {
	return await axiosRequest.get<Code>("/users/captcha", {})
}

//用户登陆api
export async function UserLogin(data: LoginUser): Promise<Result<string>> {
	return await axiosRequest.post<string>("/users/login", data, {})
}

//用户发送邮箱验证码api
export async function RegisterCode(email: string): Promise<Result<string>> {
	return await axiosRequest.post<string>("/users/code", {email: email}, {})
}

//用户注册api
export async function Register(userInfo: RegisterInfo): Promise<Result<string>> {
	return await axiosRequest.post<string>("/users/register", userInfo, {})
}