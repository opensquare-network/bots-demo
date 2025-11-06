const { Events, MessageFlags } = require("discord.js");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    if (message.author.bot) return;
    if (message.content.startsWith("给我私信")) {
      try {
        await message.author.send("📨 你好！这是通过匹配关键触发的私信。");
        await message.react("✅");
      } catch (error) {
        await message.react("❌");
      }
    }
  },
};
