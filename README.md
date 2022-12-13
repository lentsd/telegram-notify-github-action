# telegram-notify-github-action
## Add bot message for each Pull Request to your Frontend team telegram group

All you need is:

- Telegram bot token
- Telegram chat id
- Team nicknames

## Info in message

- PR Author
- PR Name
- PR Changed files count
- PR Description
- Link to PR

## Action example
### Add it to .gihub/workflows
```sh
name: New PR Telegram Notify
on:
  pull_request:
    types: [opened, reopened]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Check out repository
        uses: actions/checkout@v2
      - name: Telegram Notify
        uses: dnotrad/telegram-notify-github-action@master
        with:
          chat: ${{ secrets.chat }}
          token: ${{ secrets.token }}
          ghToken: ${{ secrets.GITHUB_TOKEN }}
          teamNicknames: '[["timkimtim","tim_kim_tim"],["overkam","plsdie"]]'
```

### teamNicknames
#### Team nicknames is a string in format:
##### ```[[USER_1_GITHUB_NAME, USER_1_TG_NAME], ```
##### ```[USER_2_GITHUB_NAME, USER_2_TG_NAME], [...]]```




