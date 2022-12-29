/**
 * constants.js
 * @author kechen
 * @since 2022/3/25
 */

export const baseUrl = 'https://gitee.com/TrainingLove';
export const templateConfig = {
    'react':{
        "taro模板":"school-taro-template"
    },
    'vue 2':{
        "PC后台管理,带登录":"school-system-login-template"
    },
    "vue 3":{

    }
}
const frames = Object.keys(templateConfig);
export const promptList = [
    {
        name: 'frame',
        message: '使用什么技术框架',
        type: 'list',
        default: 'react',
        choices: frames,
    },
    {
        name: 'template',
        message: '使用什么项目模板',
        type: 'list',
        when:(answers)=>{
            let frame = answers.frame;
            if (frame === 'vue 2')
                return true;
            return false
        },
        choices: (ans)=>{
            let frame = ans.frame;
            let temp = templateConfig[frame];
            return Object.keys(temp);
        },
    },
    /*{
        name: 'type',
        message: '使用哪种构建工具?',
        type: 'list',
        default: 'webpack',
        choices: ['webpack', 'vite'],
    },*/
    {
        name: 'isRegistry',
        message: "是否需要设置git远程仓库地址?",
        type: 'confirm',
        default: false,
        choices: [
            {name: "Yes", value: true},
            {name: "No", value: false}
        ]
    },
    {
        name: 'remote',
        message: '输入您的远程git地址! ',
        type: 'input',
        when: (answers) => {
            return answers.isRegistry;
        },
        validate: function (input) {
            const done = this.async();
            setTimeout(function () {
                // 校验是否为空，是否是字符串
                if (!input.trim()) {
                    done('请提供一个远程的git地址!');
                    return;
                }
                const pattern = /^(http(s)?:\/\/([^\/]+?\/){2}|git@[^:]+:[^\/]+?\/).*?.git$/;
                if (!pattern.test(input.trim())) {
                    done(
                        'url必须是一个合法的git远程地址',
                    );
                    return;
                }
                done(null, true);
            }, 500);
        },
    }
];
