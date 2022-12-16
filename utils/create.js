import inquirer from "inquirer";
import chalk from "chalk";
import {baseUrl, promptList, templateConfig} from "./constants.js"
import path from "path"
import fs from "fs";
import downloadTemplate from "./download.js"
import renderTemplate from "./renderTemplate.js";
import install from "./install.js";
import setRegistry from "./setRegister.js";
import ora from "ora";

const go = (downloadPath, projectRoot) => {
    return downloadTemplate(downloadPath, projectRoot).then(target => {
        //下载模版
        return {
            downloadTemp: target
        }
    })
}
export default async function (projectName) {
    // 校验项目名称合法性，项目名称仅支持字符串、数字，因为后续这个名称会用到项目中的package.json以及其他很多地方，所以不能存在特殊字符
    const pattern = /^[a-zA-Z0-9]*$/;
    if (!pattern.test(projectName.trim())) {
        console.log(`\n${chalk.redBright('你的项目名不合法, 请使用字母或数字命名!\n')}`);
        return;
    }
    // 询问
    inquirer.prompt(promptList).then(async answers => {
        let {frame,template,setRegistry:isRegistry,gitRemote} = answers;

        let temp = templateConfig[frame][template];
        // 目标文件夹
        const destDir = path.join(process.cwd(), projectName);
        // 下载地址
        const downloadPath = `direct:${baseUrl}/${temp}.git#master`
        // 创建文件夹
        fs.mkdir(destDir, {recursive: true}, (err) => {
            if (err) throw err;
        });
        // 开始下载
        const data = await go(downloadPath, destDir);
        // 开始渲染
        await renderTemplate(data.downloadTemp, projectName);
        // 是否需要自动安装依赖，默认否
        const {isInstall, installTool} = await inquirer.prompt([
            {
                name: "isInstall",
                type: "confirm",
                default: "No",
                message: "是否自动安装依赖?",
                choices: [
                    {name: "Yes", value: true},
                    {name: "No", value: false}
                ]
            },
            // 选择了安装依赖，则使用哪一个包管理工具
            {
                name: "installTool",
                type: "list",
                default: "npm",
                message: '使用哪个包管理工具',
                choices: ["npm", "cnpm", "yarn"],
                when: function (answers) {
                    return answers.isInstall;
                }
            }
        ]);
        // 开始安装依赖
        if (isInstall) {
            await install({projectName, installTool});
        }

        // 是否设置了仓库地址
        if (isRegistry) {
            setRegistry(projectName, answers.gitRemote);
        }

        // 项目下载成功
        const success = chalk.greenBright("✨项目初始化完成!");
        success.start();
    });
}
