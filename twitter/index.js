import { TwitterApi } from "twitter-api-v2";

// const appKey = "fsgMPcml622GCWDa5WpPJ9Fdn";
// const appSecret = "E9FcppVk3D8RvHvj9VvZlVDGqQX2YjIl7CLdyZ8TygyiP0ldUr";
// const accessToken = "1519880232244695040-kEd7eLCZpvsYdSxDC8eRfcQDtHQiEd";
// const accessSecret = "MXTwqw8gu7FMHArvUrDYveTzYHNLoEJ6O7eyWI8uV8TzN";

const appKey = "rvcgKCArw1585q6pRoxlfiE6F";
const appSecret = "6vJkAOpdSBXTGNINW3VHGGfy1UgmJz6QYkZCFePVNHH94vz7Kv";
const accessToken = "1792741449408380928-MXOSaONjiHqVKNgP1KzXh1We2WtLrj";
const accessSecret = "KU2cdDYYU2pfdObGtQ8iefdyKJYH12fVhfXFhKqFKVs7B";

const client = new TwitterApi({
  appKey,
  appSecret,
  accessToken,
  accessSecret,
});

// 收费
const dms = await client.v2.listDmEvents();
console.log(dms);

async function getUserIdByUsername(username) {
  try {
    const user = await twitterClient.v2.userByUsername(username);
    return user.data.id;
  } catch (error) {
    console.error("获取用户ID失败:", error);
    throw error;
  }
}

// 最简发送函数
const sendDM = (userId, text) => client.v2.sendDm(userId, { text });

// 使用
sendDM(await getUserIdByUsername("quinn47875"), "最简单的私信发送！")
  .then((result) => console.log("发送成功:", result.data.id))
  .catch((error) => console.error("发送失败:", error));
