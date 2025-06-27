const IS_DEV = process.env.APP_VARIANT === 'development';

module.exports = {
  expo: {
    name: "reusebob",
    name: IS_DEV ? 'ReuseBob (Dev)' : 'ReuseBob',
    slug: "reusebob",
    version: "0.3.1",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "reusebob",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV ? 'com.reusebob.reusebob.dev' : 'com.reusebob.reusebob',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      "expo-font",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "7bc88413-2062-483e-83e4-b37c94119d1c"
      }
    },
    updates: {
      url: "https://u.expo.dev/7bc88413-2062-483e-83e4-b37c94119d1c"
    },
    runtimeVersion: {
      policy: "appVersion"
    }
  }
}
