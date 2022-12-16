#!/usr/bin/env node
import inquirer from "inquirer";
import {program} from "commander";
import figlet from "figlet"
import path from "path";
import fs from "fs-extra";
import chalk from "chalk";
import ora from "ora"
import create from "../utils/create.js";
import checkUpdate from "../utils/checkUpdate.js";
program.command("init <project-name>")
    .description("创建一个新的项目 , 项目名称是<project-name>")
    .option("-f, --force", "如果项目已经存在 ， 则覆盖重建。")
    .action(async (projectName,options)=>{
        // 当前命令行路径
        const cwd = process.cwd();
        // 文件夹拼接
        const targetDir = path.join(cwd,projectName)
        if (fs.existsSync(targetDir)) {
            if (!options.force) {
                // 如果没有设置-f则提示，并退出
                console.error(chalk.red(`项目已存在! 请更改你的项目名或者使用命令 ${chalk.greenBright(`edu-cli create ${projectName} -f`)} 来创建项目!`))
                return;
            }
            // 如果设置了-f则二次询问是否覆盖原文件夹
            const {isOverWrite} = await inquirer.prompt([{
                name: "isOverWrite",
                type: "confirm",
                message: "目标文件夹已存在, 你要覆盖它吗?",
                choices: [
                    {name: "Yes", value: true},
                    {name: "No", value: false}
                ]
            }]);
            // 如需覆盖则开始执行删除原文件夹的操作
            if (isOverWrite) {
                const spinner = ora(chalk.blackBright('删除文件夹中, 请稍等...'));
                spinner.start();
                await fs.removeSync(targetDir);
                spinner.succeed();
                console.info(chalk.green("✨ 删除成功, 开始初始化项目..."));
                // 删除成功后，开始初始化项目
                await create(projectName);
                return;
            }
            console.error(chalk.green("创建项目被取消!"));
            return;
        }
        await create(projectName);
        console.log(cwd,targetDir);
    });
program.command("update")
    .description("更新edu-cli脚手架")
    .action(async ()=>{
       await checkUpdate()
    });
program.on("--help", () => {
    // 监听--help命令，输出一个提示
    console.log(figlet.textSync("edu-cli", {
        font: "Standard",
        horizontalLayout: 'full',
        verticalLayout: 'fitted',
        width: 120,
        whitespaceBreak: true
    }));
});

// 这个一定不能忘，且必须在最后！！！
program.parse(process.argv);
