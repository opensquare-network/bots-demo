const { SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("user")
    .setDescription("Provides information about the user."),
  async execute(interaction, client) {
    try {
      const dm = await interaction.user.send(
        `🤖 这是 command 触发的一条私信 ${new Date().toString()}`
      );
      await interaction.reply(`已私信.`);
    } catch (error) {
      if (error.code === 50007) {
        await interaction.reply(
          "🚫 无法发送私信给该用户（用户关闭了私信或不是好友）"
        );
      } else if (error.code === 10013) {
        await interaction.reply("🔍 用户不存在或ID错误");
      }

      await interaction.reply(`私信失败：${error.message}`);
    }
  },
};
