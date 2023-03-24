# telegram-music-bot
A telegram bot that searches for music on the specified request and returns it.

# Example
To check, you can use this bot: https://t.me/extensive_music_bot

Note: It only responds to plain text. Slash commands, stickers, etc. are ignored!

# Installation
First, make a clone of this repository and go to the bot folder.

Secondly, rename the ```.example.env``` in ```.env``` and edit it.

After that, open the terminal and follow the commands from the table below.

|     npm     | yarn | pnpm |
|     ---     | ---- | ---- |
|   install   |      | install |
|  run build  | build | build |
|  run start  | start | start |

# Why is the audio not sent by the media group?
Media groups also have strange behavior in the current version of telegraf.js types are broken.

For example, if you specify thumb.source.url, telegram api returns an error that thumb should be a string.
