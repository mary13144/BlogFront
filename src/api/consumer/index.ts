import type {Page, UserInfo, Userupdate} from "@/types";
import axiosRequest from "@/service/axiosRequest";

//查询用户列表api
export async function ConsumerQuery(params: Page, role: undefined | number) {
	return await axiosRequest.get<UserInfo[]>("/users", {
		params: {
			...params,
			role: role
		}
	})
}

//删除用户api
export async function DeleteConsumer(id: number) {
	return await axiosRequest.delete<string>("/users", {
		params: {
			id: id
		}
	})
}

//修改用户信息api
export async function UpdateConsumer(data: Userupdate) {
	return await axiosRequest.put<string>("/users/update", data, {})
}