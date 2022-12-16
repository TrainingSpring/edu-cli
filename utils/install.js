/**
 * 安装依赖
 * install.js
 * @author kechen
 * @since 2022/3/22
 */
import {spawn} from "cross-spawn";
export default function install(options) {
    const cwd = options.projectName || process.cwd();
    return new Promise((resolve, reject) => {
        const command = options.installTool;
        const args = ["install", "--save", "--save-exact", "--loglevel", "error"];
        const child = spawn(command, args, {cwd, stdio: ["pipe", process.stdout, process.stderr]});

        child.once("close", code => {
            if (code !== 0) {
                reject({
                    command: `${command} ${args.join(" ")}`
                });
                return;
            }
            resolve();
        });
        child.once("error", reject);
    });
};
