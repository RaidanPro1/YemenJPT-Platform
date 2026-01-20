
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// 1. إعدادات البوت والتوكن الخاص بك
const token = '8034114294:AAEQuVu5Zq6EnefvTUaR1c4psrgaqAPY0KY';
const bot = new TelegramBot(token, { polling: true });

let ROOT_CHAT_ID = null; // سيتم تخزين معرفك هنا تلقائياً

// 2. التعرف على المستخدم Root
bot.onText(/\/start/, (msg) => {
    ROOT_CHAT_ID = msg.chat.id;
    bot.sendMessage(ROOT_CHAT_ID, 
        '🚀 **تم تفعيل نظام المراقبة الجذرية (Root System)**\n' +
        'أهلاً بك يا ريدان. سأقوم الآن بمراقبة النظام وإرسال تنبيهات فورية لك.\n' +
        'ID: ' + ROOT_CHAT_ID, 
        { parse_mode: 'Markdown' }
    );
});

// 3. خادم لاستقبال الأحداث من Angular
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/notify', (req, res) => {
    const { event, details, user, isRoot } = req.body;

    if (!ROOT_CHAT_ID) {
        return res.status(200).json({ error: 'Waiting for /start command' });
    }

    // تخصيص الرسالة إذا كان المستخدم هو Root
    let icon = isRoot ? '🚨' : '🔔';
    let title = isRoot ? 'نشاط بصلاحيات جذرية (ROOT)' : 'نشاط مستخدم';
    
    // تنسيق الرسالة
    const message = `${icon} <b>${title}</b>\n` +
                    `👤 <b>المستخدم:</b> ${user}\n` +
                    `📌 <b>الحدث:</b> ${event}\n` +
                    `📝 <b>التفاصيل:</b> ${details}\n` +
                    `⏰ <b>الوقت:</b> ${new Date().toLocaleTimeString('ar-YE')}`;

    bot.sendMessage(ROOT_CHAT_ID, message, { parse_mode: 'HTML' });
    res.json({ status: 'sent' });
});

// تشغيل الخادم
const port = 3000;
app.listen(port, () => console.log(`🤖 Bot Server is running on port ${port}...`));
