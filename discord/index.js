const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const token = process.env.DISCORD_TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
});

client.commands = new Collection();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);
for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));
for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.once("clientReady", () => {
  console.log(`Bot 已登录为 ${client.user.tag}`);

  // 示例：登录后5秒发送消息
  setTimeout(() => {
    sendMessageToChannel("1434803533072433234", "👋 大家好！Bot 已上线！");
  }, 5000);
});

async function sendMessageToChannel(channelId, message) {
  try {
    const channel = await client.channels.fetch(channelId);
    if (channel && channel.isTextBased()) {
      const sentMessage = await channel.send(message);
      console.log(`✅ 消息已发送: "${message}"`);
      return sentMessage;
    } else {
      console.log("❌ 频道不存在或不是文本频道");
    }
  } catch (error) {
    console.error("❌ 发送消息时出错:", error);
  }
}

// client.on(Events.MessageCreate, async (message) => {
//   console.log(message);
//   if (message.author.bot) return;

//   if (message.content.startsWith("给我私信")) {
//     try {
//       await message.author.send("📨 你好！这是你要的私信。");
//       await message.react("✅"); // 简单反应，不回复消息
//     } catch (error) {
//       await message.react("❌");
//     }
//   }
// });

// Log in to Discord with your client's token
client.login(token);
