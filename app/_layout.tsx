import { AuthProvider } from "../context/AuthContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
     <SafeAreaProvider>
       <AuthProvider> 
        <Stack screenOptions={{ headerShown: false }} />
        </AuthProvider> 
     </SafeAreaProvider> 
  );
}
