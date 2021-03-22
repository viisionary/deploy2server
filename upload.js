const chalk = require('chalk');
const ora = require('ora');
const { Client } = require('ssh2');

const doDeploy =  ({
	                  host,
	                  port,
	                  username,
	                  password,
	                  serverBaseCodePath,
	                  serverWebPath,
	                  projectName,
	                  outputPath,
	                  chunkSize = 65535 * 1024 * 1024
                  }) => {
	const HostConfig = {
		host,
		port,
		username,
		password,
	};
	const serverTarPath = serverBaseCodePath + projectName + '.tar';
	const serverCodePath = serverBaseCodePath + projectName;
	const localTarPath = outputPath + projectName + '.tar';
	const serverSitePath = serverWebPath + projectName;
	return new Promise((resolve)=>{
		/*
		TODO 有空加一下备份文件
		 */
		const conn = new Client();
		conn.on('ready', () => {
			conn.sftp((err, sftp) => {
				const loading = ora(projectName + '.tar uploading...');
				loading.start();
				if (err) throw err;
				sftp.fastPut(localTarPath, serverTarPath, {
					chunkSize,
					concurrency: 128,
					step(total_transferred, chunk, total) {
						if (total_transferred < total) {
						}
					}
				}, (err) => {
					if (err) throw err;
					conn.exec(`rm -rf ${serverCodePath}/* && tar -xvf ${serverTarPath} -C ${serverBaseCodePath} && cp -r ${serverCodePath}/* ${serverSitePath}/`, async function (err1, stream) {
						loading.stop();
						await endLog({ stream, conn, host, projectName })
						resolve()
					});
				});
			});
		}).connect(HostConfig);
	})

};

function endLog({ stream, conn, projectName, host }) {
	return new Promise(resolve => {
		stream.on('close', function () {
			console.log(chalk.cyan(`${host} ${projectName} put completed!`));
			conn.end();
			resolve();
		})
			.on('data', function (data) {
				console.log(chalk.green('OUTPUT: ') + data)
			});
	})

}

module.exports = doDeploy;
