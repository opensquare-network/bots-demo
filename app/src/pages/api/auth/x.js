export default async function handler(req, res) {
  console.log('X auth handler called');
  console.log('Query params:', req.query);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { code, state, error, error_description } = req.query;

  if (error) {
    console.error('X OAuth error:', error, error_description);
    return res.redirect(`/login?error=${encodeURIComponent(error_description || error)}`);
  }

  if (!code) {
    return res.redirect(`/login?error=${encodeURIComponent('Missing authorization code')}`);
  }

  try {
    // 简化的 token 请求（不使用 PKCE）
    const tokenData = {
      client_id: 'b3hWYTZlYXhSWlhUT05vVGFrSXE6MTpjaQ',
      client_secret: 'qmzuTG_L8F35MhwpxImiifn3JXZ7SbweoaFoJYI8DOejOzh0yz',
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: 'http://localhost:3000/api/auth/x'
    };

    console.log('Making token request...');

    const tokenResponse = await fetch('https://api.twitter.com/2/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json'
      },
      body: new URLSearchParams(tokenData)
    });

    const tokenResult = await tokenResponse.json();
    console.log('Token response status:', tokenResponse.status);
    console.log('Token response:', tokenResult);

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenResult);
      return res.redirect(`/login?error=${encodeURIComponent('X token exchange failed: ' + (tokenResult.error_description || 'Unknown error'))}`);
    }

    // 获取用户信息
    console.log('Fetching user info...');
    const userResponse = await fetch('https://api.twitter.com/2/users/me?user.fields=profile_image_url', {
      headers: {
        'Authorization': `Bearer ${tokenResult.access_token}`,
        'Accept': 'application/json'
      }
    });

    const userResult = await userResponse.json();
    console.log('User response status:', userResponse.status);
    console.log('User response:', userResult);

    if (!userResponse.ok || userResult.errors) {
      console.error('User info fetch failed:', userResult);
      return res.redirect(`/login?error=${encodeURIComponent('Failed to get X user info')}`);
    }

    // 构建用户数据
    const userData = {
      id: userResult.data.id,
      username: userResult.data.username,
      name: userResult.data.name,
      profile_image_url: userResult.data.profile_image_url,
      provider: 'x'
    };

    console.log('User data:', userData);

    const encodedUserData = encodeURIComponent(JSON.stringify(userData));
    return res.redirect(`/callback/x?data=${encodedUserData}`);

  } catch (error) {
    console.error('X OAuth error:', error);
    return res.redirect(`/login?error=${encodeURIComponent('X authentication failed')}`);
  }
}