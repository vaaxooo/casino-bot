const TelegramApi = require("node-telegram-bot-api");

const Telegram = new TelegramApi(process.env.TELEGRAM_TOKEN_BOT, { polling: true });


module.exports = Telegram;