//用户列表---------------------------------------------------------------------------------------------
//用户信息数据接口
export interface UserInfo {
	id: number
	nick_name: string
	avatar: string
	email: string
	role: string
	sign_status: string
	ip: string
	addr: string
	created_at: string
}

//用户权限枚举
export enum UserPower {
	PermissionAdmin = 1,
	PermissionUser = 2,
	PermissionVisitor = 3,
	PermissionDisableUser = 4,
}

//修改用户信息数据接口
export interface UserUpdateDate {
	user_id: number
	nick_name: string
	role: number | string
}

//用户消息---------------------------------------------------------------------------------------------
export interface News {
	send_user_id: number
	send_user_nick_name: string
	send_user_avatar: string
	rev_user_id: number
	rev_user_nick_name: string
	rev_user_avatar: string
	is_read?: boolean
	is_me?: boolean
	content: string
}