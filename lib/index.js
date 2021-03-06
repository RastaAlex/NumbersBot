'use strict';

const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const sequelize = require('../db/db');
const UserModel = require('./models');

const token = '1845360664:AAFo6pUGPhNtktxIecLN0dIyRok5DUY8U2Y'; //where store?

const bot = new TelegramApi(token, {
    polling: true,
});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `You need to guess number from 0 to 9`);
    
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    
    await bot.sendMessage(chatId, 'Lets play', gameOptions);
};

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch(e) {
        return e;
    }
    
    bot.setMyCommands([{
        command: '/start',
        description: 'Start bot',
    }, {
        command: '/info',
        description: 'User Info',
    }, {
        command: '/game',
        description: 'guess number game',
    }]);
    
    bot.on('message', async (msg) => {
        const {text} = msg;
        const chatId = msg.chat.id;
        
        try {
            if (text === '/start') {
                await UserModel.create({chatId});
                await bot.sendSticker(chatId, 'https://telegram-stickers.github.io/public/stickers/fogsland/1.png');
                return bot.sendMessage(chatId, 'Welcome to NumbersBot');
            }
            
            if (text === '/info') {
                const user = await UserModel.findOne({chatId});
                return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name} in game you have right answers ${user.right}, wrong ${user.wrong}`);
            }
            
            if (text === '/game') {
                return startGame(chatId);
            }
            
            return bot.sendMessage(chatId, 'I dont understand you, try again');
        } catch(e) {
            return bot.sendMessage(chatId, `Some error ${e}`);
        }
    });
    
    bot.on('callback_query', async (msg) => {
        const {data} = msg;
        const chatId = msg.message.chat.id;
        
        if (data === '/again') {
            return startGame(chatId);
        }
        
        const user = await UserModel.findOne({chatId});
        
        if (data === chats[chatId]) {
            ++user.right;
            await bot.sendMessage(chatId, 'You win', againOptions);
        } else {
            ++user.wrong;
            await bot.sendMessage(chatId, `No, Bot choose number ${chats[chatId]}`, againOptions);
        }
        
        await user.save();
    });
};

start();

