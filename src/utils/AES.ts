import CryptoJS from "crypto-js";

//解密
function decrypt(word: any, keyStr: string) {
	keyStr = keyStr ? keyStr : 'abcdsxyzhkj12345';
	let key = CryptoJS.enc.Utf8.parse(keyStr);
	let decrypt = CryptoJS.AES.decrypt(word, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
	return CryptoJS.enc.Utf8.stringify(decrypt).toString();
}

//加密
function encrypt(word: any, keyStr: string) {
	keyStr = keyStr ? keyStr : 'abcdsxyzhkj12345'; //判断是否存在ksy，不存在就用定义好的key
	let key = CryptoJS.enc.Utf8.parse(keyStr);
	let srcs = CryptoJS.enc.Utf8.parse(word);
	let encrypted = CryptoJS.AES.encrypt(srcs, key, {mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
	return encrypted.toString();
}

export default {
	decrypt,
	encrypt
}
