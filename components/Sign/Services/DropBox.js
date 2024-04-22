import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button } from "react-native";
// Encryption imports
import { encode } from "base-64";
import * as Crypto from "expo-crypto";
import pkceChallenge from "react-native-pkce-challenge";

WebBrowser.maybeCompleteAuthSession();

const client_id = "iyb3rx4tx9vjkt3";
const challenge = pkceChallenge();

// Endpoints
const discovery = {
  authorizationEndpoint: `https://www.dropbox.com/oauth2/authorize?client_id=${client_id}&response_type=code&code_challenge=${challenge.codeChallenge}&code_challenge_method=S256`,
  tokenEndpoint: "https://api.dropbox.com/oauth2/token",
};

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "iyb3rx4tx9vjkt3",
      // There are no scopes so just pass an empty array
      scopes: [],
      redirectUri: makeRedirectUri({
        scheme: "com.kkanchev94.esignapp",
        path: "oauth",
      }),
    },
    discovery
  );

  async function authorizeUser() {
    // const base64Encode = async (str) => {
    //   console.log("str:", str);
    //   const result = await str.toString("base64");
    //   console.log("result:", result);
    // };

    // const codeVerifier = base64Encode(Crypto.getRandomBytes(32));
    // console.log(`Client generated code_verifier: ${codeVerifier}`);

    // const sha256 = async (buffer) => {
    //   const digest = await Crypto.digestStringAsync("SHA-256", buffer);

    //   console.log("digest:", digest);

    //   return digest;
    // };
    // const codeChallenge = base64Encode(sha256(codeVerifier));
    // console.log(`Client generated code_challenge: ${codeChallenge}`);

    const challenge = pkceChallenge();
    console.log("challenge:", challenge);

    fetch(
      `${discovery.authorizationEndpoint}?client_id=${client_id}&response_type=code&code_challenge=${challenge.codeChallenge}&code_challenge_method=S256`
    ).then((response) => console.log(response));

    // console.log("sendOAuthRequest:", sendOAuthRequest);
    // const response = await sendOAuthRequest.json();
    // console.log("response:", response);
  }

  React.useEffect(() => {
    async function getFiles(code) {
      const formData = {
        code: code,
        grant_type: "authorization_code",
        redirect_uri: makeRedirectUri({
          scheme: "com.kkanchev94.esignapp",
          path: "oauth",
        }).toString(),
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

      // getFiles(code);
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        authorizeUser();
      }}
    />
  );
}
