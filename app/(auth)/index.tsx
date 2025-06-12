import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { globalStyles } from "../theme/globalStyles";

export default function AuthIndex() {
  return (
    <View style={[globalStyles.container, { justifyContent: "center", alignItems: "center" }]}>
      <Text style={globalStyles.title}>Welkom!</Text>

      <TouchableOpacity style={globalStyles.button} onPress={() => router.push("/auth/login")}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={globalStyles.button} onPress={() => router.push("/auth/register")}>
        <Text style={globalStyles.buttonText}>Registreren</Text>
      </TouchableOpacity>
    </View>
  );
}
