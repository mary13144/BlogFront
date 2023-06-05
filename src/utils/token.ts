import type {Token} from "@/types";

export function ParesToken(token: string): Token {
	let strings = token.split(".");//通过split()方法将token转为字符串数组
	//取strings[1]数组中的第二个字符进行解析
	//然后可以拿到解析后的数据，可以console.log()打印下，
	return JSON.parse(decodeURIComponent(escape(window.atob(strings[1].replace(/-/g, "+").replace(/_/g, "/")))))
}