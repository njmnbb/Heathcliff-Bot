// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { getImage } = require("gocomics-api");
const cron = require("node-cron");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.on('ready', (client) => {

    let tasks = cron.getTasks();
    if(tasks[0] != undefined) {
        tasks[0].stop();
        tasks.splice(0, 1);
    }
    
    const task = cron.schedule('0 16 0 * * *', () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();

        getImage({
            date: [year,month,day],
            comicName: "heathcliff",
            URLOnly: true
        }).then(
            (response) => {
                client.channels.cache.get('776261999595356223').send(`@everyone
Here's your daily Heathcliff comic! It's sure to be a meow-velous one!
                
${response}`);
            }
        );
    }, { scheduled: true, timezone: 'America/Chicago' });
});

// Login to Discord with your client's token
client.login(token);