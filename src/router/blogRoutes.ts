import type {RouteRecordRaw} from "vue-router";


const BlogRoutes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "blog",
		component: () => import("@/views/blog/Blog.vue"),
		redirect: "/home",
		children: [
			{
				path: "home",
				name: "blog_home",
				component: () => import("@/views/blog/Blog_home.vue"),
			},
			{
				path: "/search",
				name: "search",
				component: () => import("@/views/blog/Blog_search.vue"),
			},
		],
	}
]

export default BlogRoutes