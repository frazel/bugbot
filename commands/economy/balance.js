const { ApplicationCommandOptionType } = require('discord.js');
const UserProfile = require('../../schemas/UserProfile');

module.exports = {
  run: async ({ interaction }) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'This command can only be executed inside a server.',
        ephemeral: true,
      });
      return;
    }

    const targetUserId = interaction.options.getUser('target-user')?.id || interaction.user.id;

    await interaction.deferReply();

    try {
      let userProfile = await UserProfile.findOne({ userId: targetUserId });

      if (!userProfile) {
        userProfile = new UserProfile({ userId: targetUserId });
      }

      interaction.editReply(
        targetUserId === interaction.user.id ? `Your balance is ${userProfile.balance} Bugs` : `<@${targetUserId}>'s balance is ${userProfile.balance} Bugs`
      );
    } catch (error) {
      console.log(`Error handling /balance: ${error}`);
    }
  },

  data: {
    name: 'balance',
    description: 'Check your total Bugs.',
    options: [
      {
        name: 'target-user',
        description: 'The user whose balance you want to see.',
        type: ApplicationCommandOptionType.User,
      },
    ],
  },
};
