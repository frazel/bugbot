module.exports = {
  data: {
    name: 'links',
    description: 'replies with the website',
  },

  run: ({ interaction }) => {
    interaction.reply('https://foodmonsters.io');
  },
};
