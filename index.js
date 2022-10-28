import * as core from '@actions/core';
const Bot = require('node-telegram-bot-api');

const tgtoken = core.getInput('token', { required: true });
const chatid = core.getInput('chat', { required: true });
const prAuthor = core.getInput('prAuthor');
const prNumber = core.getInput('prNumber');
const prBody = core.getInput('prBody');
const prTitle = core.getInput('prTitle');
const repository = core.getInput('repository');

const reviewersByPrAuthor = {
    dnotrad: ['@plsdie', '@tim_kim_tim'],
    overkam: ['@lentsd', '@tim_kim_tim'],
    timkimtim: ['@lentsd', '@plsdie'],
};

const PR_MESSAGE = `
Опа! Новый пр #${prNumber}!
Барин ${prAuthor} радует своих подданых:

*Что сделали*: ${prTitle}
*Подробнее*: 
${prBody}

[Посмотреть прчик](https://github.com/${repository}/pull/${prNumber})
`

const REVIEWERS = `
${reviewersByPrAuthor[prAuthor].reduce((res, next) => res += `${next} `, '')}
`

const bot = new Bot(tgtoken);
bot.sendMessage(chatid, PR_MESSAGE, { parse_mode: "Markdown" });
bot.sendMessage(chatid, REVIEWERS);
