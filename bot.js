const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

// Config
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const TOKEN_ADDRESS = '0x71a67215a2025F501f386A49858A9ceD2FC0249d'; // Replace with Solana's token address
const PRICE_API_URL = `https://api.dexscreener.com/latest/dex/search?q=${TOKEN_ADDRESS}`;

// Init bot
const bot = new Telegraf(BOT_TOKEN);

// fetch Solana price
async function getSeiPrice() {
    try {
        const response = await axios.get(PRICE_API_URL);
        const markets = response.data.pairs;

        // Example: Fetch price from the first pair
        const price = parseFloat(markets[0].priceUsd);
        return price;
    } catch (error) {
        console.error('Error fetching Solana price:', error.message);
        return null;
    }
}

// send price update
async function sendPriceUpdate() {
    const price = await getSeiPrice();
    if (price) {
        const message = `🔴 *Sei Price Update* 🔴\n\n💰 1 SEI = $${price.toFixed(4)} USD`;
        await bot.telegram.sendMessage(CHAT_ID, message, { parse_mode: 'Markdown' });
        console.log('Price update sent.');
    }
}

// Start bot
(async () => {
    bot.launch();
    console.log('Bot started.');

    // Update price every 3 minutes
    setInterval(() => {
        sendPriceUpdate();
    }, 180000);
})();
