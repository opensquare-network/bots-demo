import { Button } from "@/components/ui/button";
import { useState, useMemo } from "react";
import { generateRandomState } from "@/lib/oauth";
import { generateAuthLink } from "@/lib/twitter";
import { generateDiscordAuthLink } from "@/lib/discord";

export default function Login() {
  const discordLink = useMemo(
    () =>
      generateDiscordAuthLink({
        type: "discord",
        chain: "polkadot",
        verifyCode: "xxx-code",
      }),
    []
  );

  const xLink = useMemo(() => {
    return generateAuthLink();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div className="space-y-4">
          <Button
            asChild
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-lg"
          >
            <a href={discordLink}>
              <div className="flex items-center justify-center">
                Verify Discord
              </div>
            </a>
          </Button>

          <Button
            asChild
            className="w-full bg-black hover:bg-gray-800 text-white py-3 text-lg"
          >
            <a href={xLink}>
              <div className="flex items-center justify-center">Verify X</div>
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
