const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

// --- Telegram Bot Setup ---
// The token should come from environment variables.
const token = process.env.TELEGRAM_BOT_TOKEN || '8034114294:AAEQuVu5Zq6EnefvTUaR1c4psrgaqAPY0KY'; 
const bot = new TelegramBot(token, { polling: true });

let ROOT_CHAT_ID = process.env.TELEGRAM_ROOT_CHAT_ID || null;

bot.on('polling_error', (error) => {
  console.error(`Telegram Polling Error: ${error.code} - ${error.message}`);
});

bot.onText(/\/start/, (msg) => {
    if (!process.env.TELEGRAM_ROOT_CHAT_ID) {
        ROOT_CHAT_ID = msg.chat.id;
    }
    bot.sendMessage(msg.chat.id, 
        '🚀 **تم تفعيل نظام المراقبة الجذرية (Root System)**\n' +
        'أهلاً بك. سأقوم الآن بمراقبة النظام وإرسال تنبيهات فورية لك.\n' +
        'Your Chat ID: ' + msg.chat.id, 
        { parse_mode: 'Markdown' }
    );
    if (!process.env.TELEGRAM_ROOT_CHAT_ID) {
        console.log(`Root Chat ID registered: ${ROOT_CHAT_ID}. Consider setting this as TELEGRAM_ROOT_CHAT_ID in your .env file.`);
    }
});


// --- Express Server Setup ---
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- API Endpoints ---

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend is running' });
});

// Placeholder for future API routes
app.get('/api/tools', (req, res) => {
    res.json([
        { id: 'ai-assistant', name: 'AI Assistant' },
        { id: 'searxng', name: 'SearXNG' }
    ]);
});

// Notification endpoint for Telegram bot
app.post('/api/notify', (req, res) => {
    const { event, details, user, isRoot } = req.body;

    const effectiveChatId = process.env.TELEGRAM_ROOT_CHAT_ID || ROOT_CHAT_ID;

    if (!effectiveChatId) {
        console.warn('Telegram notification received, but no ROOT_CHAT_ID is configured. Ask the root user to send /start to the bot.');
        return res.status(200).json({ status: 'warning', message: 'Bot not initialized by root user.' });
    }

    let icon = isRoot ? '🚨' : '🔔';
    let title = isRoot ? 'نشاط بصلاحيات جذرية (ROOT)' : 'نشاط مستخدم';
    
    const message = `${icon} <b>${title}</b>\n` +
                    `👤 <b>المستخدم:</b> ${user}\n` +
                    `📌 <b>الحدث:</b> ${event}\n` +
                    `📝 <b>التفاصيل:</b> ${details}\n` +
                    `⏰ <b>الوقت:</b> ${new Date().toLocaleTimeString('ar-YE')}`;

    bot.sendMessage(effectiveChatId, message, { parse_mode: 'HTML' }).catch(err => {
        console.error("Failed to send Telegram message:", err.message);
    });
    
    res.json({ status: 'sent' });
});

app.listen(port, () => {
  console.log(`YemenJPT backend with bot listening at http://localhost:${port}`);
});
