/**
 * 检查更新
 * checkUpdate.js
 * @author kechen
 * @since 2022/3/23
 */
import shell from "shelljs";
import semver from "semver"
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import {createRequire} from "module"
const require = createRequire(import.meta.url);
const pkg = require("../package.json");

/**
 * @description 更新到最新版
 * @param {string} remoteVersionStr 版本号
 */
const updateNewVersion = (remoteVersionStr) => {
    const spinner = ora(chalk.blackBright('edu-cli更新中,请稍后...'));
    spinner.start();
    const shellScript = shell.exec("npm -g install new-cli");
    if (!shellScript.code) {
        spinner.succeed(chalk.green(`更新成功, 现在你的版本号是: ${remoteVersionStr}`));
        return;
    }
    spinner.stop();
    console.log(chalk.red('\n\r 最新的版本安装失败, 请检查你的网络或者代理'));
};
/**
 * @description 检查更新
 * @return {Promise<void>}
 */
export default async function checkUpdate() {
    const localVersion = pkg.version;
    const pkgName = pkg.name;
    const remoteVersionStr = shell.exec(
        `npm info ${pkgName}@latest version`,
        {
            silent: true,
        }
    ).stdout;

    if (!remoteVersionStr) {
        console.log(chalk.red('获取edu-cli版本号失败, 请检查网络'));
        process.exit(1);
    }
    const remoteVersion = semver.clean(remoteVersionStr, null);

    if (remoteVersion !== localVersion) {
        // 检测本地安装版本是否是最新版本，如果不是则询问是否自动更新
        console.log(`最新版是:  ${chalk.greenBright(remoteVersion)}, 本地版本是:  ${chalk.blackBright(localVersion)} \n\r`)

        const {isUpdate} = await inquirer.prompt([
            {
                name: "isUpdate",
                type: "confirm",
                message: "是否需要更新?",
                choices: [
                    {name: "Yes", value: true},
                    {name: "No", value: false}
                ]
            }
        ]);
        if (isUpdate) {
            updateNewVersion(remoteVersionStr);
        } else {
            console.log(`Ok, 你可以运行 ${chalk.greenBright('edu-cli update')} 命令来更新最新版本`);
        }
        return;
    }
    console.info(chalk.green("Great! 你的本地版本是最新的!"));
};
