import { getAccessToken, getUserInfo } from "@/lib/discord";

export default function XCallback({ userinfo }) {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-black text-white px-6 py-4">
            {JSON.stringify(userinfo)}
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (context) => {
  const { code, token, ...otherQuery } = context.query;
  if (token) {
    const userinfo = (await getUserInfo(token)) || {};
    return {
      props: {
        userinfo,
      },
    };
  }

  if (code) {
    const accessToken = (await getAccessToken(code)) || null;
    if (accessToken) {
      const params = new URLSearchParams({
        ...otherQuery,
        token: accessToken,
      });

      return {
        redirect: {
          permanent: true,
          destination: `./discord?${params}`,
        },
      };
    }
  }

  return {
    props: {
      token,
      code,
      name: "xx",
    },
  };
};
