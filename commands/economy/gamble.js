const { ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });

      return;
    }

    const amount = interaction.options.getNumber('amount');

    if (amount < 10) {
      interaction.reply('You must gamble at least 10 bugs');
      return;
    }

    let userProfile = await UserProfile.findOne({
      userId: interaction.user.id,
    });

    if (!userProfile) {
      userProfile = new UserProfile({
        userId: interaction.user.id,
      });
    }

    if (amount > userProfile.balance) {
      interaction.reply("You don't have enough bugs to gamble.");
      return;
    }

    const didWin = Math.random() > 0.5;

    if (!didWin) {
      userProfile.balance -= amount;
      await userProfile.save();

      interaction.reply("You didn't win anything this time. Try again later.");
      return;
    }

    const amountWon = Number((amount * (Math.random() + 0.75)).toFixed(0));

    userProfile.balance += amountWon;
    await userProfile.save();

    interaction.reply(`🎉 You won + ${amountWon} Bugs!\nNew balance: ${userProfile.balance} bugs`);
  },

  data: {
    name: 'gamble',
    description: 'Gamble some of your bugs.',
    options: [
      {
        name: 'amount',
        description: 'The amount of bugs to gamble.',
        type: ApplicationCommandOptionType.Number,
        required: true,
      },
    ],
  },
};
