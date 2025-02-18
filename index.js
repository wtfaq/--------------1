const VK = require('node-vk-bot-api');

// Создаем экземпляр VK с токеном
const bot = new VK("vk1.a.9mc4Z45ccjueovmwbliyTmMKZ6hF9JX7ROzvy5X6ignhmeU2knIdhMvKJ9f0zqPn4iEnUh3xAkoXA-CBGWHh0EBlIum-r6HNqk_4IgRD85HGIzXMIGN5SJ0EchNa_h1re6P6EhXZ2L0rVP64JWQNxRh9iOkPTtuhhgISz89Loi1Z3OdbepE2t22sTVbE0y2HKNLphGBh3hCaoACwQ9apYQ");

const userInfo = {}; // Информация пользователей

bot.on((ctx) => {
    const userId = ctx.message.from_id;
    console.log('Входное сообщение прочитано')

    if (!userInfo[userId]) {
        // Начинаем диалог
        userInfo[userId] = { step: 1 };
        ctx.reply('Привет! Пожалуйста, введи свое ФИО:');
    } else {
        switch (userInfo[userId].step) {
            case 1:
                userInfo[userId].fullName = ctx.message.text; // Сохраняем ФИО
                userInfo[userId].step = 2; 
                ctx.reply('Спасибо! Теперь, пожалуйста, введи свою дату рождения (в формате ДД.ММ.ГГГГ):');
                break;

            case 2:
                userInfo[userId].birthDate = ctx.message.text; // Сохраняем дату рождения
                ctx.reply(`Спасибо! Вот твои данные:\nФИО: ${userInfo[userId].fullName}\nДата рождения: ${userInfo[userId].birthDate}`);
                delete userInfo[userId]; // Сбрасываем состояние
                break;

            default:
                ctx.reply('Произошла ошибка. Пожалуйста, начни заново, введя свое ФИО.');
                delete userInfo[userId]; // Сбрасываем состояние
                break;
        }
    }
});

// Запускаем Long Polling
bot.startPolling()
    .then(() => {
        console.log("Бот запущен и слушает сообщения");
    })
    .catch((error) => {
        console.error('Ошибка при запуске Long Poll:', error);
    });