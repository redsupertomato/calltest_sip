npm install -g expo-cli
npm install
npm i react-native-web@~0.19.10 react-dom@^18.2.0 @expo/metro-runtime@~3.2.1
npm run web
npm start

npm install react-native-dotenv --save


# android
npx expo start --android

# info

server: "wss://rhpbxprod02.com:8089/ws",

    authorizationPassword: "Mark10005!",
    authorizationUsername: "10005",

const uri = UserAgent.makeURI("sip:10005@rhpbxprod02.com");