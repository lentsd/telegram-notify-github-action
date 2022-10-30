const core = require('@actions/core');
const github = require('@actions/github');
const Bot = require('node-telegram-bot-api');

const tgtoken = core.getInput('token', { required: true });
const chatid = core.getInput('chat', { required: true });
const prAuthor = core.getInput('prAuthor');
const prNumber = core.getInput('prNumber');
const prBody = core.getInput('prBody');
const prTitle = core.getInput('prTitle');
const repositoryName = core.getInput('repositoryName');
const repositoryOwner = core.getInput('repositoryOwner');
const GITHUB_TOKEN = core.getInput('GITHUB_TOKEN');

const main = async () => {

    const bot = new Bot(tgtoken);
    const octokit = new github.getOctokit(GITHUB_TOKEN);

    const reviewersByPrAuthor = {
        dnotrad: ['@plsdie', '@tim_kim_tim'],
        overkam: ['@lentsd', '@tim_kim_tim'],
        timkimtim: ['@lentsd', '@plsdie'],
    };

    const { data: changedFiles } = await octokit.rest.pulls.listFiles({
        owner: repositoryOwner,
        repo: repositoryName,
        pull_number: prNumber,
    });

    const { additions, deletions } = changedFiles.reduce((result, current) => {
        result.additions += current.additions;
        result.deletions += current.deletions;
        return result;
    }, { additions: 0, deletions: 0 })

    const PR_MESSAGE = `
Опа! Новый пр #${prNumber}!
Барин ${prAuthor} радует своих подданых:

*🙋🏼Что сделали🙋🏼*: ${prTitle}

*📏Файлов изменили📏*: ${changedFiles.length}
🪜*Добавили*🪜: ${additions} строк
🧹*Удалили*🧹: ${deletions} строк

*Подробнее*: 
${prBody}

[Посмотреть прчик](https://github.com/${repositoryOwner}/${repositoryName}/pull/${prNumber})
`

    const REVIEWERS = `
${reviewersByPrAuthor[prAuthor].reduce((res, next) => res += `${next} `, '')}
`

    bot.sendMessage(chatid, PR_MESSAGE, { parse_mode: "Markdown" });
    bot.sendMessage(chatid, REVIEWERS);
};

main()
