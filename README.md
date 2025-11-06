# Discord

Link:
Bot Portal : https://discord.com/developers/applications

Develop Docs: https://discordjs.guide/

## 准备工作

1. 环境变量
   token： `Bot` > `Token`
   clientId: `OAuth2`>`Client information`
   guildId:找群组详情复制 `群组 ID`
2. 邀请机器人进入群组
   `https://discord.com/oauth2/authorize?client_id={client_id}&permissions=8&integration_type=0&scope=bot`
3. 下载 `discord.js`

## 开发

声明 command

```js
const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("ping") // command 名称
    .setDescription("Replies with Pong!"), // 描述
  async execute(interaction) {
    // 处理并相应
    await interaction.reply("Pong!");
  },
};
```

## 注册 command

```js
const { REST, Routes } = require("discord.js");
const commands = [pingCommand.data.JSON()];

const rest = new REST().setToken(token);
const data = await rest.put(
  Routes.applicationGuildCommands(clientId, guildId),
  { body: commands }
);
```

注册会有延时需要等待注册生效

# ELement

## 准备

1. 安装 matrix-js-sdk
2. accessToken： `Setting`>`Help & About`>`Access Token`

```js
// 创建客户端
const matrixClient = createClient({
  baseUrl,
  accessToken,
  userId,
});

//监听事件

matrixClient.on(RoomEvent.Timeline, function (event, room, toStartOfTimeline) {
  if (toStartOfTimeline) {
    return; // don't print paginated results
  }
  if (event.getType() !== "m.room.message") {
    return; // only print messages
  }
  // 处理逻辑
});

// 发送消息
matrixClient.sendEmoteMessage(roomID, "消息文案");
```

# Twitter

1. 申请开发者账号：https://developer.x.com/en/portal/dashboard
2. 修改权限信息 `User authentication settings`
3. 获取 token: `Consumer Keys`,`Access Token and Secret`
4. 安装 twitter-api-v2 包

```js
// 发帖
const rwClient = client.readWrite;
// 发送推文 (现代 API)
const response = await rwClient.v2.tweet("Hello Twitter!");
console.log("Tweet ID:", response.data.id);
```
