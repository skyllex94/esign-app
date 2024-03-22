import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button } from "react-native";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
  tokenEndpoint: "https://www.dropbox.com/oauth2/token",
};

export default function DropBox() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "iyb3rx4tx9vjkt3",
      // There are no scopes so just pass an empty array
      scopes: [],
      redirectUri: makeRedirectUri({ scheme: "com.kkanchev94.esignapp" }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="DropBox"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}
