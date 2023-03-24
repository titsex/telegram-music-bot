import { config } from 'dotenv'
config()

import { Logger } from '@class/Logger'
import { Telegraf } from 'telegraf'
import { fetchSong, validateQuery } from '@utils'

const bot = new Telegraf(process.env.TOKEN!)

bot.on('message', async (context) => {
    if (!('text' in context.message)) return
    if (context.message.text.startsWith('/')) return

    const send = await context.reply('Обработка...')

    const queries = new Set<string>()

    for (const text of context.message.text.split('\n')) {
        queries.add(validateQuery(text))
    }

    if (!queries.size) return

    try {
        for (const query of queries) {
            const song = await fetchSong(query)
            await context.replyWithAudio(song.media, song)
        }

        await context.deleteMessage(context.message.message_id)
    } catch (error) {
        if (error instanceof Error) await context.reply(error.message)
    }

    await context.deleteMessage(send.message_id)
})

bot.launch()
Logger.info('Bot has been successfully started')
