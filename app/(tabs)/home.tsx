import React from "react";
import { View, Text } from "react-native";
import { globalStyles } from "../../theme/globalStyles";

export default function Home() {
  return (
    <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>
      <Text style={globalStyles.title}>Welkom</Text>
      <Text style={globalStyles.subtitle}>Je bent ingelogd. Veel plezier!</Text>
    </View>
  );
}
