### 安装
```
npm i deploy2server --save
```
### 使用
```
const { dir2Tar, upload2Server } = require('./index');

const config = {
	host: '',
	port: '',
	username: "",
	password: '',
	// ⚠️：windows system path different from linux
	serverBaseCodePath: '/root/wwwRoot/code/',
	serverWebPath: '/root/wwwRoot/',
	projectName: 'web-project',
	version: 'v1.0.0',
	outputPath: './',
	codePath: './build',
};
const packageCallback = () => {
	console.info('Package Succeed ！\n');

};
const uploadCallback = () => {
	console.info('Upload Succeed ！');
};
(async () => {
	await dir2Tar(config);
	packageCallback();
	await upload2Server(config);
	uploadCallback();
})();
__
```
