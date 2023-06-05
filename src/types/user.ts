export interface UserPersonalInfo {
	nick_name: string
	avatar: string
	email: string
	addr: string
	role: string
	sign_status: string
	sign: string
	link: string
}

export interface UserUpdateInfo {
	nick_name: string
	sign: string
	link: string
}

export interface EmailUpdate {
	old_email: string
	code: string
	new_email: string
	confirm_email: string
}

export interface PwdUpdate {
	old_pwd: string
	new_pwd: string
	confirm_pwd: string
}

export interface UserMessage {
	user_id: number
	nick_name: string
	avatar: string
	content: string
	created_at: string
	message_count: string
}
