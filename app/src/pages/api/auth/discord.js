export default async function handler(req, res) {
  console.log('Discord auth handler called');
  console.log('Query params:', req.query);
  console.log('Method:', req.method);

  if (req.method !== 'GET') {
    console.log('Method not allowed');
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, state, error, error_description } = req.query;

  // 如果有错误参数，说明 Discord 返回了错误
  if (error) {
    console.error('Discord OAuth error:', error, error_description);
    return res.redirect(`/login?error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    console.log('No authorization code provided');
    return res.status(400).json({ message: 'Authorization code is required' });
  }

  console.log('Authorization code received:', code);

  try {
    // 手动构建 token 请求
    const tokenData = {
      client_id: '1439892024525586462',
      client_secret: 'rnyRfVTX2POqpwrto9DhBRdH8i4e61lN',
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/api/auth/discord'
    };

    console.log('Requesting token with data:', { ...tokenData, client_secret: '[HIDDEN]' });

    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(tokenData)
    });

    const tokenResult = await tokenResponse.json();
    console.log('Token response:', tokenResponse.status, tokenResult);

    if (!tokenResponse.ok || tokenResult.error) {
      console.error('Token exchange failed:', tokenResult);
      return res.redirect(`/login?error=${encodeURIComponent('Token exchange failed')}`);
    }

    // 获取用户信息
    console.log('Fetching user info with token:', tokenResult.access_token);

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        'Authorization': `Bearer ${tokenResult.access_token}`
      }
    });

    const userInfo = await userResponse.json();
    console.log('User info response:', userResponse.status, userInfo);

    if (!userResponse.ok || userInfo.error) {
      console.error('User info fetch failed:', userInfo);
      return res.redirect(`/login?error=${encodeURIComponent('Failed to get user info')}`);
    }

    // 成功获取用户信息，重定向到回调页面
    const userData = {
      id: userInfo.id,
      username: userInfo.username,
      global_name: userInfo.global_name,
      avatar: userInfo.avatar,
      email: userInfo.email,
      provider: 'discord'
    };

    console.log('Redirecting to callback with user data:', userData);

    const encodedUserData = encodeURIComponent(JSON.stringify(userData));
    return res.redirect(`/callback/discord?data=${encodedUserData}`);

  } catch (error) {
    console.error('Discord OAuth error:', error);
    return res.redirect(`/login?error=${encodeURIComponent('Internal server error')}`);
  }
}