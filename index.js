require('dotenv-flow').config()
const { Telegraf } = require('telegraf')
const md5 = require('md5')

const token = process.env.TELEGRAM_TOKEN_BOT
if (token === undefined) {
  throw new Error('BOT_TOKEN must be provided!')
}

const gameShortName = 'blowbetofficial'

let telegramRefs = {}

const bot = new Telegraf(token)
bot.start((ctx) => {
	let user = ctx;
	telegramRefs[user.from.id] = ctx.args[0];
	ctx.replyWithGame(gameShortName)
})

bot.gameQuery((ctx) => {
	let user = ctx;
	let ref = telegramRefs[user.from.id]
	let currentTimestamp = new Date().getTime();
	let userData = {
		telegram_id: user.from.id,
		timestamp: currentTimestamp
	}

	let userInfo = {
		telegram_id: user.from.id,
		first_name: user.from.first_name || '',
		username: user.from.username || '',
		photo_url: user.from.photo_url || '',
		last_name: user.from.last_name || '',
		ref: ref || ''
	}

	let hash = md5(JSON.stringify(userData) + process.env.SECRET);
	let gameUrl = process.env.URL + "/auth?telegram_hash=" + hash + "&telegram_id=" + user.from.id + "&timestamp=" + currentTimestamp + "&lang=ru" + "&first_name=" + userInfo.first_name + "&username=" + userInfo.username + "&photo_url=" + userInfo.photo_url + "&last_name=" + userInfo.last_name + "&ref=" + userInfo.ref;
	ctx.answerGameQuery(gameUrl)
})
bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))