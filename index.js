// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { token } = require('./config.json');
const { getImage } = require("gocomics-api");
const cron = require("node-cron");
const greetings = require('./greetings');
const fs = require('fs');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.on('ready', (client) => {

    let tasks = cron.getTasks();
    if(tasks[0] != undefined) {
        tasks[0].stop();
        tasks.splice(0, 1);
    }
    
    const task = cron.schedule('0 0 8 * * *', () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let greeting = greetings[Math.floor(Math.random() * greetings.length) ];

        fs.appendFile('logfile.log',
            `Date being used: ${year} / ${month} / ${day} \n
            Greeting being used: ${greeting}
            \n\n-----------------------------------------------------------------\n\n`
        );

        getImage({
            date: [year,month,day],
            comicName: "heathcliff",
            URLOnly: true
        }).then(
            (response) => {
                client.channels.cache.get('789313283588489271').send(`@everyone
Here's your daily Heathcliff comic! ${greeting}
                
${response}`);
            }
        ).catch(err => {
            fs.appendFile('logfile.log',
                `Error occured while fetching comic: ${err}
                \n\n-----------------------------------------------------------------\n\n`);
        });
    }, { scheduled: true, timezone: 'America/Chicago' });
});

// Login to Discord with your client's token
client.login(token);
