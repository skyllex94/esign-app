import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button, Platform } from "react-native";
import { encode } from "base-64";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
  tokenEndpoint: "https://api.dropbox.com/oauth2/token",
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "iyb3rx4tx9vjkt3",
      clientSecret: "p113uhdcy2qhvg2",
      // There are no scopes so just pass an empty array
      scopes: [],
      redirectUri: makeRedirectUri({
        scheme: "com.kkanchev94.esignapp",
        path: "oauth",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    async function getFiles(code) {
      const formData = {
        code: code,
        grant_type: "authorization_code",
        redirect_uri: makeRedirectUri({
          scheme: "com.kkanchev94.esignapp",
          path: "oauth",
        }).toString(),
        code_verifier: "II6-OmmD0RLMlbtX-yDbHNIUYmUEh_JreVIS_1XarZU",
        client_id: "iyb3rx4tx9vjkt3",
        client_secret: "p113uhdcy2qhvg2",
      };

      // const url = `${discovery.tokenEndpoint}/${client_secret}`.toString();

      const result = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(formData).toString(),
      });
      console.log("result:", result);
      const resp = await result.json();
      console.log("resp:", resp);
    }

    if (response?.type === "success") {
      console.log("response:", response);
      const { code } = response.params;
      console.log("code:", code);

      getFiles(code);
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
