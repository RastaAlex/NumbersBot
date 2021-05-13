'use strict';

const TelegramApi = require('node-telegram-bot-api');

const token = '1845360664:AAFo6pUGPhNtktxIecLN0dIyRok5DUY8U2Y';

const bot = new TelegramApi(token, {polling: true});

const chats = {};

const gameOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: '1', callback_data: '1'}, {text: '2', callback_data: '2'}, {text: '3', callback_data: '3'}],
            [{text: '4', callback_data: '4'}, {text: '5', callback_data: '5'}, {text: '6', callback_data: '6'}],
            [{text: '7', callback_data: '7'}, {text: '8', callback_data: '8'}, {text: '9', callback_data: '9'}],
            [{text: '0', callback_data: '0'}]
        ]
        })
}


const againOptions = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Play again', callback_data: '/again'}]
        ]
    })
}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `You need to guess number from 0 to 9`);

    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;

    await bot.sendMessage(chatId, 'Lets play', gameOptions);
}


const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Start bot'},
        {command: '/info', description: 'User Info'},
        {command: '/game', description: 'guess number game'}
    ])
    
    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
    
        if (text === '/start') {
            await bot.sendSticker(chatId,'https://telegram-stickers.github.io/public/stickers/fogsland/1.png');
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