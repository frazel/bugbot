module.exports = (message) => {
  if (message.author.bot) return;

  if (message.content === 'bug') {
    message.reply('Busters!');
  }
};
