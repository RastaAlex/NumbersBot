'use strict';

const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const sequelize = require('./db');

const token = '1845360664:AAFo6pUGPhNtktxIecLN0dIyRok5DUY8U2Y';

const bot = new TelegramApi(token, {
    polling: true
});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `You need to guess number from 0 to 9`);

    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;

    await bot.sendMessage(chatId, 'Lets play', gameOptions);
}


const start = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        console.log('Connection is failed', e);
    }

    bot.setMyCommands([{
            command: '/start',
            description: 'Start bot'
        },
        {
            command: '/info',
            description: 'User Info'
        },
        {
            command: '/game',
            description: 'guess number game'
        }
    ])

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://telegram-stickers.github.io/public/stickers/fogsland/1.png');
            return bot.sendMessage(chatId, 'Welcome to NumbersBot');
        }

        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
        }

        if (text === '/game') {
            return startGame(chatId);
        }

        return bot.sendMessage(chatId, 'I dont understand you, try again');
    })

    bot.on('callback_query', async (msg) => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            await bot.sendMessage(chatId, 'You win', againOptions);
        } else {
            await bot.sendMessage(chatId, `No, Bot choose number ${chats[chatId]}`, againOptions);
        }
    })
}

start();