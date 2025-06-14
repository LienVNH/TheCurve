import "react-native-url-polyfill/auto";
import { Slot } from "expo-router";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Slot /> 
    </AuthProvider>
  );
}
