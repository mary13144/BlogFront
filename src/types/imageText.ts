//图片列表---------------------------------------------------------------------------------------------
//图片数据接口
export interface Image {
	id: number
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
export interface ImageUpdateData {
	id: number,
	name: string,
	path: string,
}

//tag
export interface Tag {
	tag: string
	count: number
}

//文章列表-----------------------------------------------------------------------
export interface Article {
	id: string
	created_at: string
	title: string
	keyword: string
	abstract: string
	content: string
	look_count: number
	comment_count: number
	digg_count: number
	collects_count: number
	user_id: number
	user_nick_name: string
	user_avatar: string
	category: string
	banner_id: number
	banner_url: string
	tags: string[]
}

export interface Select {
	label: string
	value: string
}

//文章
export interface Article_Add {
	id: string
	title?: string
	abstract?: string
	content?: string
	category?: string
	banner_id?: number
	tags?: string[]
}

//评论
export interface Comment {
	id: number
	created_at: string
	article_title: string
	banner_url: string
	content: string
	digg_count: number
	user_nick_name: string
}