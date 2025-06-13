import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Image, Text } from "react-native";
import { router } from "expo-router";
import { globalStyles } from "../theme/globalStyles";

export default function SplashScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 1600); 
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>
      <Image
        source={require("../assets/logo.png")} 
        style={{ width: 150, height: 150, marginBottom: 32, resizeMode: "contain" }}
      />
      <ActivityIndicator size="large" color="#1E5128" />
      <Text style={[globalStyles.titleXL, { marginTop: 32, textAlign: "center" }]}>The Curve</Text>
      <Text style={[globalStyles.textDark, { textAlign: "center", marginTop: 12 }]}>Even laden...</Text>
    </View>
  );
}
