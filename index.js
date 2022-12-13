const core = require('@actions/core');
const github = require('@actions/github');
const Bot = require('node-telegram-bot-api');

const tgtoken = core.getInput('token', { required: true });
const chatid = core.getInput('chat', { required: true });
const prAuthor = core.getInput('prAuthor');
const prNumber = core.getInput('prNumber');
const prBody = core.getInput('prBody');
const prTitle = core.getInput('prTitle');
const teamNicknames = core.getInput('teamNicknames');
const repositoryName = core.getInput('repositoryName').split('/')[1];
const repositoryOwner = core.getInput('repositoryOwner');
const ghToken = core.getInput('ghToken');

const main = async () => {
    const bot = new Bot(tgtoken);
    const octokit = new github.getOctokit(ghToken);

    const teamNicknamesParsed = JSON.parse(teamNicknames);
    const reviewersForPr = teamNicknamesParsed.filter((user) => user[0] !== prAuthor).map(user => `@${user[1]}`)

    const { data: changedFiles } = await octokit.rest.pulls.listFiles({
        owner: repositoryOwner,
        repo: repositoryName,
        pull_number: prNumber,
        // TODO: add pagination or smth similar if more than 100 files
        per_page: 100,
    });

    const { additions, deletions } = changedFiles.reduce((result, current) => {
        result.additions += current.additions;
        result.deletions += current.deletions;
        return result;
    }, { additions: 0, deletions: 0 })

    const PR_MESSAGE = `
Опа! Новый пр #${prNumber}!
Master ${prAuthor} радует своих slaves!

*Сделал*: ${prTitle}

*Файлов изменил*: ${changedFiles.length}
*Добавил*: ${additions} строк
*Удалил*: ${deletions} строк

*А поподробнее*: 
${prBody || `${prAuthor} решил не указывать подробности, пусть это будет сюрпризом!`}

[Посмотреть прчик](https://github.com/${repositoryOwner}/${repositoryName}/pull/${prNumber})
`

    const REVIEWERS = `
${reviewersForPr.reduce((res, next) => res += `${next} `, '')}
`

    bot.sendMessage(chatid, PR_MESSAGE, { parse_mode: "Markdown" });
    bot.sendMessage(chatid, REVIEWERS);
};

main()
