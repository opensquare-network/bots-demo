import { Client, GatewayIntentBits } from 'discord.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userId, message } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }

  if (!process.env.DISCORD_BOT_TOKEN) {
    return res.status(500).json({ error: 'Discord bot token not configured' });
  }

  const client = new Client({
    intents: [GatewayIntentBits.DirectMessages]
  });

  try {
    await client.login(process.env.DISCORD_BOT_TOKEN);

    const user = await client.users.fetch(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.send(message);

    await client.destroy();

    res.status(200).json({
      msg: "发送成功",
      userId: userId,
      message: message
    });
  } catch (error) {
    console.error('Discord DM error:', error);

    if (client.isReady()) {
      await client.destroy();
    }

    if (error.code === 50007) {
      return res.status(400).json({ error: 'Cannot send messages to this user' });
    }

    res.status(500).json({
      error: 'Failed to send message',
      details: error.message
    });
  }
}
