export const generateRandomState = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const discordConfig = {
  clientId: "1439892024525586462",
  clientSecret: "rnyRfVTX2POqpwrto9DhBRdH8i4e61lN",
  redirectUri: "http://localhost:3000/api/auth/discord",
  scope: 'identify email',
  authUrl: 'https://discord.com/api/oauth2/authorize',
  tokenUrl: 'https://discord.com/api/oauth2/token',
  userUrl: 'https://discord.com/api/users/@me'
};

export const xConfig = {
  clientId: "b3hWYTZlYXhSWlhUT05vVGFrSXE6MTpjaQ",
  clientSecret: "pNU5l7LqtSP3zG-p1FGyNLtelwl2YcOTHGRKdjqiC5uFc_id_z",
  redirectUri: "http://localhost:3000/api/auth/x",
  scope: 'tweet.read users.read',
  authUrl: 'https://twitter.com/i/oauth2/authorize',
  tokenUrl: 'https://api.twitter.com/2/oauth2/token',
  userUrl: 'https://api.twitter.com/2/users/me'
};

export const getDiscordAuthUrl = (state) => {
  const params = new URLSearchParams({
    client_id: discordConfig.clientId,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/discord`,
    response_type: 'code',
    scope: discordConfig.scope,
    state
  });
  return `${discordConfig.authUrl}?${params}`;
};

export const getXAuthUrl = (state, codeChallenge) => {
  const params = new URLSearchParams({
    client_id: xConfig.clientId,
    redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/x`,
    response_type: 'code',
    scope: xConfig.scope,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256'
  });
  return `${xConfig.authUrl}?${params}`;
};

export const exchangeCodeForToken = async (code, provider, codeVerifier = null) => {
  const config = provider === 'discord' ? discordConfig : xConfig;

  const body = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: 'authorization_code',
    redirect_uri: config.redirectUri
  };

  if (provider === 'x' && codeVerifier) {
    body.code_verifier = codeVerifier;
  }

  const response = await fetch(config.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams(body)
  });

  return response.json();
};

export const getUserInfo = async (accessToken, provider) => {
  const config = provider === 'discord' ? discordConfig : xConfig;

  const response = await fetch(config.userUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  return response.json();
};

// 为 X OAuth 2.0 生成 code verifier 和 challenge
export const generateCodeVerifier = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const generateCodeChallenge = async (verifier) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};