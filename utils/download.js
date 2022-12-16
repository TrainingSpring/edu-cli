/**
 * 下载
 * download.js
 * @author kechen
 * @since 2022/3/25
 */

import download from "download-git-repo"
import path from "path"
import ora from "ora"
import chalk from "chalk";
import fs from "fs-extra";

export default function (downloadPath, target) {
    target = path.join(target);
    return new Promise(function (resolve, reject) {
        const spinner = ora(chalk.greenBright('加载模板中, 请稍后...\r\n'));
        spinner.start();

        download(downloadPath, target, {clone: true}, async function (err) {
            if (err) {
                spinner.fail();
                reject(err);
                console.error(chalk.red(`[错误: ]${err} ,加载模板出错, 请检查您的网络连接或重试`));
                await fs.removeSync(target);
                process.exit(1);
            } else {
                spinner.succeed(chalk.greenBright('✨ 加载模板成功, 开始配置... \n'));
                resolve(target);
            }
        })
    })
}
