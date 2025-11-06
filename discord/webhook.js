const WEBHOOK_URL =
  "https://discord.com/api/webhooks/1435106689820131499/ilg1C5ANrZlyOzsKIc9UFSdKvhAw2NfIlS9nKFUWqlWRsSzOFggDTOY3G5TX6BMkz3Ln";

async function sendWebhookMessage(message) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: message,
        username: "我的机器人",
        avatar_url: "https://example.com/avatar.png",
      }),
    });

    if (response.status === 204) {
      console.log("✅ 消息发送成功");
    } else {
      console.error("❌ 发送失败:", response.status, await response.text());
    }
  } catch (error) {
    console.error("❌ 请求错误:", error);
  }
}

sendWebhookMessage("Hello from Webhook!");
