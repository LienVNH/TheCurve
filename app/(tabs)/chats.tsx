import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { globalStyles } from "../../theme/globalStyles";
import { theme } from "../../theme/theme";
import Header from "../../components/UI/Header";

export default function Chats() {
  return (
    <View style={styles.container}>

      <View style={styles.content}>
        <Image
          source={require("../../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.text}>Deze pagina is in ontwikkeling...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundColor, 
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: theme.colors.textDark,
  },
});
