//影视推荐---------------------------------------------------------------------------------------------
//影视推荐数据接口
export interface Video {
	id: number
	title: string
	path: string
	href: string
	is_show: boolean
	CreateAt: string
}

//修改影视信息数据接口
export interface VideoData {
	id: number
	title: string
	href: string
	path: string
	is_show: boolean
}

//menu---------------------------------------------------------------------------------------------
export interface Banner {
	banner_id: number
	path: string
}

export interface ImageSort {
	image_id: number
	sort: number
}

export interface Menu {
	id: number
	title: string
	path: string
	slogan: string
	abstract: string[]
	banners: Banner[]
	banner_time: number
	sort: number
	CreateAt: string
}

export interface MenuData {
	id: number
	title: string
	path: string
	slogan: string
	abstract: string[]
	image_list: ImageSort[]
	banner_time: number
	sort: number
}

export interface ImageBriefData {
	id: number
	path: string
	name: string
}

//log---------------------------------------------------------------------
export interface Log {
	id: number
	created_at: string
	ip: string
	addr: string
	level: string
	content: string
	user_id: number
}

export enum LogTypes {
	debug = 1,
	info = 2,
	warn = 3,
	error = 4,
}

//SetInfo---------------------------------------------------------------------
export interface SetInfo {
	bei_an: string
	qq_image: string
	wechat_image: string
	slogan: string
	slogan_en: string
	github_url: string
}

//email---------------------------------------------------------------------
export interface Email {
	host: string
	port: number
	user: string
	password: string
	default_from_email: string
	use_ssl: boolean
	user_tls: boolean
}

//七牛云---------------------------------------------------------------------------
export interface QiNiu {
	enable: boolean
	access_key: string
	secret_key: string
	bucket: string
	cdn: string
	zone: string
	prefix: string
	size: number
}


//QQ---------------------------------------------------------------------------
export interface QQ {
	app_id: string
	key: string
	redirect: string
}

//jwt---------------------------------------------------------------------------
export interface JWT {
	secret: string
	expires: string
	issuer: string
}
