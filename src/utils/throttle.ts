//节流
//@ts-ignore
import {NodeJS} from 'node:types';

type ThrottleFn = (...args: any[]) => void; // 定义节流函数类型别名

export function throttle(func: ThrottleFn, delay: number): ThrottleFn {
	let timeoutId: NodeJS.Timeout | undefined; // 定时器标识符，用于存储定时器的引用
	let lastExecTime = 0; // 上次执行函数的时间戳

	return function (...args: any[]) { // 返回一个新的函数作为节流函数
		//@ts-ignore
		const context = this; // 保存函数执行时的上下文
		const currentTime = Date.now(); // 获取当前时间戳

		const execute = function () { // 执行函数的内部方法
			func.apply(context, args); // 在指定的上下文中执行传入的函数，传递参数
			lastExecTime = currentTime; // 更新上次执行函数的时间戳
		};

		if (currentTime - lastExecTime >= delay) { // 如果当前时间与上次执行时间间隔大于等于指定的时间间隔
			execute(); // 立即执行函数
		} else {
			clearTimeout(timeoutId); // 清除之前的定时器
			timeoutId = setTimeout(execute, delay - (currentTime - lastExecTime)); // 延迟剩余的时间后执行函数
		}
	};
}
