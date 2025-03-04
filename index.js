import VK from 'node-vk-bot-api';
import Scene from 'node-vk-bot-api/lib/scene.js';
import Session from 'node-vk-bot-api/lib/session.js';
import Stage from 'node-vk-bot-api/lib/stage.js';

// Создаем экземпляр VK с токеном
const token = "vk1.a.9mc4Z45ccjueovmwbliyTmMKZ6hF9JX7ROzvy5X6ignhmeU2knIdhMvKJ9f0zqPn4iEnUh3xAkoXA-CBGWHh0EBlIum-r6HNqk_4IgRD85HGIzXMIGN5SJ0EchNa_h1re6P6EhXZ2L0rVP64JWQNxRh9iOkPTtuhhgISz89Loi1Z3OdbepE2t22sTVbE0y2HKNLphGBh3hCaoACwQ9apYQ";
const bot = new VK(token);

const botStartTime = Math.floor(Date.now() / 1000);

const scene = new Scene('info',
	
	async (ctx) => {
		ctx.session.userId = ctx.message.from_id;
		ctx.scene.step = 1;
		console.log('Входное сообщение прочитано')
		await ctx.reply('Привет! Пожалуйста, отправь свое ФИО');
		return
	},

	async (ctx) => {

		if (ctx.message.text && ctx.message.text.length > 0) {
			ctx.session.fullName = ctx.message.text; // Сохраняем ФИО
			await ctx.reply('Спасибо! Теперь, пожалуйста, введи свою дату рождения (в формате ДД.ММ.ГГГГ):');
			ctx.scene.step = 2;
			return
		}
	},

	async (ctx) => {
		if (ctx.message.text && ctx.message.text.length > 0) {
			ctx.session.birthDate = ctx.message.text; // Сохраняем дату рождения
			await ctx.reply(`Спасибо! Теперь, пожалуйста, отправь свою фотографию`)
			ctx.scene.step = 3;
			return
		}
	},

	async (ctx) => {
		if (ctx.message.attachments && ctx.message.attachments.length > 0) {
			const attachment = ctx.message.attachments[0];
			
			// Проверяем, что это изображение
			if (attachment.type === 'photo') {
				ctx.session.photoId = attachment.photo.id; 
				ctx.session.ownerId = attachment.photo.owner_id;
				ctx.session.photoString = `photo${ctx.session.ownerId}_${ctx.session.photoId}`;

				// Отправляем изображение обратно пользователю
				await bot.sendMessage(ctx.session.userId, `Спасибо! Вот твои данные:\nФИО: ${ctx.session.fullName}\nДата рождения: ${ctx.session.birthDate}`);
				await bot.sendMessage(ctx.session.userId, {
					message: 'Фотография',
					attachment: ctx.session.photoString,
					random_id: Date.now(),
				});
				
				ctx.scene.leave();

			} 
			else {
				await ctx.reply('Пожалуйста, отправьте изображение.');
			}
			
			
		} 
		else {
			await ctx.reply('Пожалуйста, отправьте изображение.');
		}

	}

)

const session = new Session();
const stage = new Stage(scene);

bot.use(session.middleware());
bot.use(stage.middleware());

bot.on(async (ctx) => {
	const messageTimestamp = ctx.message.date;
	if (messageTimestamp >= botStartTime){
		ctx.scene.enter('info');
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