import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import { Button, Platform } from "react-native";

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
        scheme: "com.kkanchev94.esignapp",
        path: "oauth",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    async function getFiles(code) {
      const result = await fetch(`${discovery.tokenEndpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: {
          code: code.toString(),
          grant_type: "authorization_code",
          client_id: "iyb3rx4tx9vjkt3",
          client_secret: "p113uhdcy2qhvg2",
        },
      });
      console.log("result:", result);
      const resp = await result.json();
      console.log("resp:", resp);
    }

    if (response?.type === "success") {
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

// --------------------------------------------------------------------------------

// import * as React from "react";
// import * as WebBrowser from "expo-web-browser";
// import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
// import { Text, View, TouchableOpacity } from "react-native";
// import { AntDesign } from "@expo/vector-icons";

// WebBrowser.maybeCompleteAuthSession();

// // Endpoint
// const discovery = {
//   authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
//   tokenEndpoint: "https://www.dropbox.com/oauth2/token",
// };

// export default function App() {
//   const [request, response, promptAsync] = useAuthRequest(
//     {
//       clientId: "iyb3rx4tx9vjkt3",
//       // clientSecret: "p113uhdcy2qhvg2",
//       // There are no scopes so just pass an empty array
//       scopes: [],
//       redirectUri: makeRedirectUri({
//         scheme: "com.kkanchev94.esignapp://oauth",
//       }),
//     },
//     discovery
//   );

//   React.useEffect(() => {
//     if (response?.type === "success") {
//       const { code } = response.params;
//     }
//   }, [response]);

//   return (
//     <TouchableOpacity
//       // disabled={!request}
//       onPress={() => {
//         promptAsync();
//       }}
//       className="flex-1 items-center justify-center bg-gray-200 rounded-md p-2 ml-2"
//     >
//       <View className="flex-row items-center gap-x-2">
//         <AntDesign name="dropbox" size={26} color="black" />
//         <Text className="font-semibold">DropBox</Text>
//       </View>
//     </TouchableOpacity>
//   );
// }

// -----------------------------------------------------------

// import * as React from "react";
// import * as WebBrowser from "expo-web-browser";
// import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
// import { Button } from "react-native";

// import { authorize } from "react-native-app-auth";

// export default function DropBox() {
//   const config = {
//     issuer: "",
//     clientId: "iyb3rx4tx9vjkt3",
//     redirectUrl: "com.kkanchev94.esignapp://oauth",
//     scopes: [],
//     serviceConfiguration: {
//       authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
//       tokenEndpoint: "https://www.dropbox.com/oauth2/token",
//     },
//   };

//   // const config = {
//   //   issuer: "",
//   //   clientId: "iyb3rx4tx9vjkt3",
//   //   clientSecret: "p113uhdcy2qhvg2",
//   //   redirectUrl: "com.kkanchev94.esignapp://oauth",
//   //   scopes: [],
//   //   serviceConfiguration: {
//   //     authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
//   //     tokenEndpoint: "https://www.dropbox.com/oauth2/token",
//   //   },
//   //   additionalParameters: {
//   //     token_access_type: "offline",
//   //   },
//   // };

//   async function openDropbox() {
//     // Log in to get an authentication token
//     await authorize(config);
//     // const dropboxUID = authState.tokenAdditionalParameters.kkanchev94;
//   }

//   return <Button title="DropBox" onPress={() => openDropbox()} />;
// }
