const client_secret = process.env.NEXT_DISCORD_CLIENT_SECRET;
const client_id = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const redirect_uri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI2;
const scope = "identify";

export function generateDiscordAuthLink(state = {}) {
  const response_type = "code"; // Constant
  const scope = "identify"; // Constant
  const params = new URLSearchParams({
    client_id,
    response_type,
    redirect_uri,
    scope,
    state: encodeURIComponent(JSON.stringify(state)),
  });

  return `https://discord.com/oauth2/authorize?${params.toString()}`;
}

// 获取访问令牌
export async function getAccessToken(code) {
  const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id,
      client_secret,
      grant_type: "authorization_code",
      code: code,
      redirect_uri,
    }),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e, "tokenResponse error");
    });

  console.log(tokenResponse, "tokenResponse");
  const tokenData = tokenResponse;
  const { access_token, token_type } = tokenData;
  return `${token_type} ${access_token}`;
}

// 获取用户信息
export async function getUserInfo(token) {
  const response = await fetch("https://discord.com/api/users/@me", {
    headers: {
      Authorization: token,
    },
  });

  const data = await response.json();
  return data;
}
