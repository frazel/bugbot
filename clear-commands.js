const { REST, Routes } = require('discord.js');
require('dotenv/config');

const botId = process.env.BOT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`Refreshing application (/) commands.`);

    await rest.put(Routes.applicationCommands(botId), { body: [] });
    console.log(`Successfully deleted all global (/) commands.`);

    if (guildId) {
      await rest.put(Routes.applicationGuildCommands(botId, guildId), { body: [] });
      console.log(`Successfully deleted all guild-based (/) commands.`);
    }
  } catch (error) {
    console.error(error);
  }
})();
