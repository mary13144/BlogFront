//首页或后台公用组件---------------------------------------------------------------------------------------------
//首页汇总数据接口

export interface Home_dataSum {
	title: string
	data: number
}

//侧边栏渲染数据接口
export interface Admin_aside {
	id: string
	icon: string
	title: string
	router: string
	children?: Admin_aside[]
}

//表格数据接口
export interface TableColumn {
	title: string
	prop: string
	avatar?: boolean
}


//tabItem数据接类型接口
export interface Tab {
	title: string
	name: string
	params?: object
	query?: object
	parent?: string
	upper_parent?: string
}

export interface CalenderDate {
	date: string
	count: number
}

export interface WeekDate {
	date_list: string[]
	login_data: number[]
	sign_data: number[]
}

export interface DataSum {
	user_count: number
	article_count: number
	message_count: number
	now_login_count: number
	now_sign_count: number
}