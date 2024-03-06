const Cooldown = require('../../schemas/Cooldown');
const UserProfile = require('../../schemas/UserProfile');

function getRandomNumber(x, y) {
  const range = y - x + 1;
  const randomNumber = Math.floor(Math.random() * range);
  return randomNumber + x;
}

module.exports = {
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      await interaction.reply({
        content: 'You can only run this command inside a server',
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const commandName = 'bugs';
      const userId = interaction.user.id;

      let cooldown = await Cooldown.findOne({ userId, commandName });

      if (cooldown && Date.now() < cooldown.endsAt) {
        const { default: prettyMs } = await import('pretty-ms');

        await interaction.editReply(
          `You are on cooldown, come back after ${prettyMs(cooldown.endsAt - Date.now())}`
        );
        return;
      }

      if (!cooldown) {
        cooldown = new Cooldown({ userId, commandName });
      }

      const chance = getRandomNumber(0, 100);

      if (chance < 40) {
        await interaction.editReply("You didn't catch anything this time. Try again later.");

        cooldown.endsAt = Date.now() + 300_000;
        await cooldown.save();
        return;
      }

      const amount = getRandomNumber(30, 150);

      let userProfile = await UserProfile.findOne({ userId }).select('userId balance');

      if (!userProfile) {
        userProfile = new UserProfile({ userId });
      }

      userProfile.balance += amount;
      cooldown.endsAt = Date.now() + 300_000;

      await Promise.all([cooldown.save(), userProfile.save()]);

      await interaction.editReply(`Hunting brought you ${amount} Bugs!\nYou now have: ${userProfile.balance} Bugs`);
    } catch (error) {
      console.log(`Error handling /bugs: ${error}`);
    }
  },

  data: {
    name: 'hunt',
    description: 'on on a hunt to find some bugs.',
  },
};
