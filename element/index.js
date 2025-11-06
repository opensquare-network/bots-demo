const { createClient, RoomEvent } = require("matrix-js-sdk");

const accessToken = process.env.ELEMENT_ACCESS_TOKEN;
const baseUrl = process.env.ELEMENT_BASE_URL;
const userId = process.env.ELEMENT_USER_ID;

class MatrixBot {
  roomMap = new Map([]);
  constructor() {
    this.client = createClient({
      baseUrl,
      accessToken,
      userId,
    });
    this.startTime = Date.now(); // 记录启动时间
    this.isReady = false;
  }

  init() {
    // 监听客户端就绪事件
    this.client.on("sync", (state) => {
      console.log(`🔄 同步状态: ${state}`);
      if (state === "PREPARED") {
        this.isReady = true;
        console.log("🤖 Matrix Bot 已就绪，开始监听新消息...");
        console.log(`📍 用户ID: ${userId}`);
        console.log(
          `⏰ 启动时间: ${new Date(this.startTime).toLocaleString()}`
        );
      }
    });

    // 监听新消息
    this.client.on(RoomEvent.Timeline, (event, room, toStartOfTimeline) => {
      console.log(
        `📥 收到事件: ${event.getType()}, 时间: ${new Date(
          event.getTs()
        ).toLocaleString()}`
      );

      // 跳过历史消息
      if (toStartOfTimeline) {
        console.log("⏮️ 跳过历史消息");
        return;
      }

      // 只处理消息事件
      if (event.getType() !== "m.room.message") {
        console.log(`⏭️ 跳过非消息事件: ${event.getType()}`);
        return;
      }

      // 跳过自己发送的消息
      if (event.getSender() === userId) {
        console.log("🙋 跳过自己的消息");
        return;
      }

      // 只处理启动后的新消息
      if (!this.isReady) {
        console.log("⏳ Bot 尚未就绪，跳过消息");
        return;
      }

      if (event.getTs() < this.startTime) {
        console.log(
          `⏰ 消息时间早于启动时间，跳过: ${new Date(
            event.getTs()
          ).toLocaleString()}`
        );
        return;
      }

      this.handleMessage(event, room);
    });

    console.log("🚀 启动 Matrix 客户端...");
    this.client.startClient();
  }

  handleMessage(event, room) {
    const content = event.getContent();
    const sender = event.getSender();
    const messageBody = content.body || "";

    console.log(`📨 [${room.name}] ${sender}: ${messageBody}`);

    console.log(content);

    // 检查是否被@提及
    if (this.isMentioned(content)) {
      if (messageBody.includes("私信")) {
        return this.privateMessage(sender);
      }
      this.replyToMention(room, sender);
    } else {
      if (messageBody.includes("私信")) {
        return this.privateMessage(sender);
      }
    }
  }

  isMentioned(content) {
    // 首先检查 m.mentions 字段（推荐方法）
    if (content["m.mentions"] && content["m.mentions"].user_ids) {
      const mentioned = content["m.mentions"].user_ids.includes(userId);
      console.log(
        `🔍 检查 m.mentions: ${content["m.mentions"].user_ids} -> ${
          mentioned ? "是" : "否"
        }`
      );
      if (mentioned) return true;
    }
  }

  async replyToMention(room, sender) {
    try {
      const senderName = sender.split(":")[0].replace("@", "");
      const replyText = `👋 你好 ${senderName}！我收到了你的消息。`;

      console.log(`🔄 回复 ${sender} 在 ${room.name}`);

      await this.client.sendTextMessage(room.roomId, replyText);

      console.log("✅ 回复发送成功");
    } catch (error) {
      console.error("❌ 发送回复失败:", error);
    }
  }
  async privateMessage(sender) {
    console.log(sender);
    try {
      const roomId = await this.getRoom(sender);
      console.log(roomId, "roomId");

      // 发送私信
      await this.client.sendMessage(roomId, {
        msgtype: "m.text",
        body: `🤖 这是你要的私信！现在时间 ${new Date().toString()}`,
      });
      console.log(`✅ 已发送私信给 ${sender}`);
    } catch (error) {
      console.log("❌ 发送私信失败:", error);
    }
  }

  async getRoom(userId) {
    if (this.roomMap.has(userId)) {
      return this.roomMap.get(userId);
    }
    const room = await this.client.createRoom({
      visibility: "private",
      is_direct: true,
      invite: [userId],
      preset: "private_chat",
      name: `私信 ${new Date().toString()}`,
    });
    const roomId = room.room_id;
    this.roomMap.set(userId, roomId);
    return roomId;
  }

  // 手动发送测试消息的方法
  async sendTestMessage(roomId) {
    try {
      await this.client.sendTextMessage(roomId, "🤖 Bot 测试消息");
      console.log("✅ 测试消息发送成功");
    } catch (error) {
      console.error("❌ 发送测试消息失败:", error);
    }
  }
}

// 启动bot
const bot = new MatrixBot();
bot.init();
