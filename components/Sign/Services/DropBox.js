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

export default function App() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "iyb3rx4tx9vjkt3",
      clientSecret: "p113uhdcy2qhvg2",
      // There are no scopes so just pass an empty array
      scopes: [],
      redirectUri: makeRedirectUri({
        scheme: "com.kkanchev94.esignapp://oauth",
      }),
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
      title="Dropbox"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}

// -----------------------------------------------------------

// import * as React from "react";
// import * as WebBrowser from "expo-web-browser";
// import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
// import { Button } from "react-native";

// import { authorize } from "react-native-app-auth";

// export default function DropBox() {
//   const config = {
//     clientId: "iyb3rx4tx9vjkt3",
//     clientSecret: "p113uhdcy2qhvg2",
//     redirectUrl: "com.kkanchev94.esignapp://oauth",
//     scopes: [],
//     serviceConfiguration: {
//       authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
//       tokenEndpoint: `https://www.dropbox.com/oauth2/token`,
//     },
//     additionalParameters: {
//       token_access_type: "offline",
//     },
//   };

//   async function openDropbox() {
//     // Log in to get an authentication token
//     const authState = await authorize(config);
//     const dropboxUID = authState.tokenAdditionalParameters.kkanchev94;
//   }

//   return <Button title="DropBox" onPress={() => openDropbox()} />;
// }
