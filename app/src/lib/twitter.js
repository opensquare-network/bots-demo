const client_secret = process.env.NEXT_X_CLIENT_SECRET;
const client_id = process.env.NEXT_PUBLIC_X_CLIENT_ID;
const redirect_uri = process.env.NEXT_PUBLIC_X_REDIRECT_URI2;
const scope = "tweet.read users.read offline.access";

// data: type chain verify-code
export function generateAuthLink(data = {}) {
  const params = new URLSearchParams({
    state: encodeURIComponent(JSON.stringify(data)),
    client_id,
    redirect_uri,
    scope,
    response_type: "code",
    code_challenge: "challenge",
    code_challenge_method: "plain",
  });

  console.log({
    state: "code",
    client_id,
    redirect_uri,
    response_type: "code",
    scope,
  });
  return `https://twitter.com/i/oauth2/authorize?${params}`;
}

// 获取访问令牌
export async function getAccessToken(code) {
  const credentials = Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  const response = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      code: code,
      grant_type: "authorization_code",
      client_id,
      redirect_uri,
      code_verifier: "challenge",
    }),
  })
    .then((res) => res.json())
    .catch((e) => {
      console.log(e);
    });

  console.log(response);
  return response?.access_token;
}

// 获取用户信息
export async function getUserInfo(accessToken) {
  const response = await fetch(
    "https://api.twitter.com/2/users/me?user.fields=id,name,username",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  const data = await response.json();
  return data;
}
