import { InputMediaAudio } from 'telegraf/types'

import ytsr from 'alternative-ytsr'
import ytdl from 'ytdl-core'

export function getDate() {
    const date = new Date()

    return [date, date.toLocaleString('ru-RU')]
}

export async function fetchSong(query: string): Promise<InputMediaAudio> {
    const search = await ytsr(query)

    if (!search.items.length) throw new Error('Видео не найдено')

    const song = search.items[0]
    const result = {} as InputMediaAudio

    if (song.type === 'video')
        return new Promise((resolve, reject) => {
            const video = ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio' })

            const buffers: Uint8Array[] = []

            video.on('data', (chunk: Uint8Array) => buffers.push(chunk))

            video.on('end', async () => {
                const artistAndTitle = validateArtistAndTitle(song.author!.name, song.title)

                result.media = { source: Buffer.concat(buffers) }
                result.performer = artistAndTitle[0].trim()
                result.title = artistAndTitle[1].trim()
                result.duration = parseDurations(song.duration!)
                result.thumb = { url: song.bestThumbnail.url! }
                result.type = 'audio'

                resolve(result)
            })

            video.on('error', () => reject('Что-то произошло при загрузке трека..'))
        })

    throw new Error('Поддерживается только видео формат.')
}

export function parseDurations(time: string) {
    const times = time.split(':')

    let duration = 0

    for (let i = 0; i < times.length; i++) {
        duration += Number(times[i]) * 60 ** (times.length - i - 1)
    }

    return duration
}

function validateArtistAndTitle(artist: string, title: string) {
    const regex = /(?:\(|)(?:lyric(?:s|al|)|official|music|video|hd|extended)(?:\)|)/gi

    title = title.replace(regex, '')
    artist = artist.replace(regex, '')

    if (title.match('-')) return title.split('-')
    return [artist, title]
}

export function validateQuery(text: string) {
    return text.startsWith('-') ? `${text.slice(1)} (lyrics)` : text
}
