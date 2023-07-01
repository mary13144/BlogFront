import type {UserPersonalInfo} from "@/types/user";

export interface MenuBrief {
	id: number
	title: string
	path: string
}

export interface CommentAdd {
	article_id: string
	content: string
	parent_comment_id?: number
}

export interface CommentItem {
	id: number
	created_at: string
	sub_comments: CommentItem[]
	parent_comment_model: CommentItem
	parent_comment_id: number
	content: string
	digg_count: number
	article_id: string
	user: UserPersonalInfo
	user_id: number
}

export interface fullText {
	id: string
	key: string
	title: string
	slug: string
	body: string
}

export interface ArticleDatas {
	count: number
	category: number
}
