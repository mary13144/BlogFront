import axiosRequest from "@/service/axiosRequest";
import type {
	Article,
	ArticleDatas,
	CommentAdd,
	CommentItem,
	fullText,
	Menu,
	MenuBrief,
	PageData,
	SetInfo,
	UserPersonalInfo,
	Video,
} from "@/types";

export async function GetMenuDetail(id: number) {
	return await axiosRequest.get<Menu>("/menus/detail", {
		params: {
			id: id
		}
	})
}

export async function GetMenuBrief() {
	return await axiosRequest.get<MenuBrief[]>("/menus/brief", {})
}

//查询文章详情
export async function ArticleDetail(id: string) {
	return await axiosRequest.get<Article>("/articles/detail", {
		params: {
			id: id
		}
	})
}

//查询文章作者信息
export async function UserOwner(id: number) {
	return await axiosRequest.get<UserPersonalInfo>("/users/owner", {
		params: {
			id: id
		}
	})
}

//文章点赞
export async function ArticleDigg(id: string, is_digg: boolean) {
	return await axiosRequest.put<string>('/articles/digg', {
		id: id,
		is_digg: is_digg
	}, {})
}

//文章收藏
export async function ArticleCollection(id: string) {
	return await axiosRequest.put<string>('/articles/collection', {
		id: id
	}, {})
}

//文章评论
export async function ArticleComment(data: CommentAdd) {
	return await axiosRequest.post<string>("/comments", data, {})
}

//查询文章评论
export async function CommentList(id: string) {
	return await axiosRequest.get<CommentItem[]>("/comments", {
		params: {
			article_id: id
		}
	})
}

//删除评论
export async function CommentDelete(id: number) {
	return await axiosRequest.delete<string>('/comments', {
		params: {
			comment_id: id
		}
	})
}

//评论点赞
export async function CommentsDigg(id: number, is_digg: boolean) {
	return await axiosRequest.put<string>("/comments", {
		id: id,
		is_digg: is_digg
	}, {})
}

//全文搜索
export async function FullTextSearch(key: string) {
	return await axiosRequest.get<PageData<fullText>>("/articles/fulltext", {
		params: {
			key: key
		}
	})
}

//影视推荐
export async function VideoRecommend() {
	return await axiosRequest.get<Video[]>("/videos", {
		params: {
			is_all: true
		}
	})
}

//网站信息
export async function SetInfoQuery() {
	return await axiosRequest.get<SetInfo>("/settings/info", {})
}


//文章数据
export async function ArticleData() {
	return await axiosRequest.get<ArticleDatas>("/articles/data", {})
}