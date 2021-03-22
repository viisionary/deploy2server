const chalk = require('chalk');
const fsExtra = require('fs-extra');
let archiver = require('archiver')
let fs = require('fs');

const doPackage = ({ codePath, outputPath, projectName, version }) => {
	return new Promise(async (resolve) => {
		try {
			await fsExtra.copy(codePath, `./${projectName}`);
			let output = await fs.createWriteStream(`${outputPath}/${projectName}.tar`)
			let archive = archiver('tar', {
				zlib: { level: 9 } // 设置压缩级别
			})
			archive.pipe(output);
			archive.directory(`${outputPath}/${projectName}`, `${projectName}`);
			output.on('close', function () {
				console.log(`总共 ${chalk.green(parseInt(archive.pointer() / (1024 * 1024)))} MB`)
				resolve()
			})
			archive.on('error', function (err) {
				throw err
			})
			await archive.finalize();

		} catch (e) {
			console.error(chalk.red('Package with error.\n'));
			console.error(e);
			throw e;
		}
	})
};

module.exports = doPackage

