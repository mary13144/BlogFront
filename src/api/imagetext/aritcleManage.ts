import axiosRequest from "@/service/axiosRequest";
import type {Article, Article_Add, Page, PageData, Select} from "@/types";

//文章查询
export async function ArticleQuery(params: Page, tag: string, category: string, isUser: boolean) {
	return await axiosRequest.get<PageData<Article>>("/articles", {
		params: {
			...params,
			tag: tag,
			category: category,
			is_user: isUser
		}
	})
}

//文章标签查询
export async function TagArticle() {
	return await axiosRequest.get<Select[]>("/tags/article", {})
}

//文章分类查询
export async function ArticleQueryCategory() {
	return await axiosRequest.get<Select[]>("/articles/category", {})
}

//创建文章
export async function ArticleCreate(data: Article_Add) {
	return await axiosRequest.post<string>("/articles", data, {})
}

//修改文章
export async function ArticleUpdate(date: Article_Add) {
	return await axiosRequest.put<string>("/articles", date, {})
}

//删除文章
export async function ArticleRemove(id_list: string[]) {
	return await axiosRequest.delete<string>("/articles", {
		data: {
			id_list: id_list
		}
	})
}

//查询文章详情
export async function ArticleDetail(id: string) {
	return await axiosRequest.get<Article>("/articles/detail", {
		params: {
			id: id
		}
	})
}

//查询文章内容
export async function ArticleContent(id: string) {
	return await axiosRequest.get<string>("/articles/content", {
		params: {
			id: id
		}
	})
}
