const VK = require('node-vk-bot-api');

// Создаем экземпляр VK с токеном
const token = "vk1.a.9mc4Z45ccjueovmwbliyTmMKZ6hF9JX7ROzvy5X6ignhmeU2knIdhMvKJ9f0zqPn4iEnUh3xAkoXA-CBGWHh0EBlIum-r6HNqk_4IgRD85HGIzXMIGN5SJ0EchNa_h1re6P6EhXZ2L0rVP64JWQNxRh9iOkPTtuhhgISz89Loi1Z3OdbepE2t22sTVbE0y2HKNLphGBh3hCaoACwQ9apYQ";
const bot = new VK(token);

const userInfo = {}; // Информация пользователей

bot.on(async (ctx) => {
	const userId = ctx.message.from_id;
	console.log('Входное сообщение прочитано')

	if (!userInfo[userId]) {
		// Начинаем диалог
		ctx.reply('Привет! Пожалуйста, отправь свое ФИО');
		userInfo[userId] = { step: 1 };
		return;
	} 

	else {
		switch (userInfo[userId].step) {
			case 1:
				if (ctx.message.text && ctx.message.length > 0) {
					userInfo[userId].fullName = ctx.message.text; // Сохраняем ФИО
					userInfo[userId].step = 2; 
					ctx.reply('Спасибо! Теперь, пожалуйста, введи свою дату рождения (в формате ДД.ММ.ГГГГ):');
					return;
				}

			case 2:
				if (ctx.message.text && ctx.message.length > 0) {
					userInfo[userId].birthDate = ctx.message.text; // Сохраняем дату рождения
					ctx.reply(`Спасибо! Теперь, пожалуйста, отправь свою фотографию`)
					userInfo[userId].step = 3;
					return;
				}

			case 3:
				if (ctx.message.attachments && ctx.message.attachments.length > 0) {
					const attachment = ctx.message.attachments[0];
					
					// Проверяем, что это изображение
					if (attachment.type === 'photo') {
						const photoId = attachment.photo.id; 
                        const ownerId = attachment.photo.owner_id;
						const photoString = `photo${ownerId}_${photoId}`;

						// Отправляем изображение обратно пользователю
						bot.sendMessage(userId, `Спасибо! Вот твои данные:\nФИО: ${userInfo[userId].fullName}\nДата рождения: ${userInfo[userId].birthDate}`);
						await bot.sendMessage(userId, {
                            message: 'Фотография',
                            attachment: photoString,
							random_id: Date.now(),
                        });
						delete userInfo[userId]; // Сбрасываем состояние
						return;

					} 
					else {
						await ctx.reply('Пожалуйста, отправьте изображение.');
					}
					return;
					
				} 
				else {
					await ctx.reply('Пожалуйста, отправьте изображение.');
				}
				return;

			default:
				ctx.reply('Произошла ошибка. Пожалуйста, начни заново, введя свое ФИО.');
				delete userInfo[userId]; // Сбрасываем состояние
				return;
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