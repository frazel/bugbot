require('dotenv/config');
const { Client, IntentsBitField, ActivityType } = require('discord.js');
const { CommandHandler } = require('djs-commander');
const mongoose = require('mongoose');
const path = require('path');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

let status = [
  {
    name: 'Bug Bot',
    type: ActivityType.Streaming,
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  },
  {
    name: 'Catching Bugs',
  },
  {
    name: 'Negativity is prohibited',
    type: ActivityType.Watching,
  },
  {
    name: 'to the sounds of insects',
    type: ActivityType.Listening,
  },
];

client.on('ready', (c) => {
  console.log(`✅ ${c.user.tag} is online.`);

  setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
  }, 10000);
});

new CommandHandler({
  client,
  eventsPath: path.join(__dirname, 'events'),
  commandsPath: path.join(__dirname, 'commands'),
});

(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to the database.');


  client.login(process.env.TOKEN);

})();
