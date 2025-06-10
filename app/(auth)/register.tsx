import { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Linking } from "react-native";
import { supabase } from "../../lib/supabase"; 


export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [diabetesSince, setDiabetesSince] = useState("");
  const [age, setAge] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleRegister = async () => {
    if (!agreed) {
      alert("Je moet akkoord gaan met de algemene voorwaarden.");
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: email + age, // Tijdelijke dummy-password, beter om dit nog te verbeteren
      options: {
        data: {
          username,
          first_name: firstName,
          last_name: lastName,
          age,
          diabetes_since: diabetesSince,
        },
      },
    });

    if (error) alert(error.message);
    else alert("Check je e-mail om te bevestigen!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registreren</Text>

      <TextInput placeholder="Gebruikersnaam" style={styles.input} value={username} onChangeText={setUsername} />
      <TextInput placeholder="Voornaam" style={styles.input} value={firstName} onChangeText={setFirstName} />
      <TextInput placeholder="Achternaam" style={styles.input} value={lastName} onChangeText={setLastName} />
      <TextInput placeholder="E-mailadres" style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput placeholder="Leeftijd" style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" />
      <TextInput placeholder="Sinds wanneer heb je diabetes?" style={styles.input} value={diabetesSince} onChangeText={setDiabetesSince} />

      <TouchableOpacity onPress={() => setAgreed(!agreed)}>
        <Text style={styles.checkbox}>
          {agreed ? "☑" : "☐"} Ik ga akkoord met de{" "}
          <Text style={styles.link} onPress={() => Linking.openURL("/terms")}>
            algemene voorwaarden
          </Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Account aanmaken</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  checkbox: {
    marginBottom: 15,
    color: "#333",
  },
  link: {
    fontWeight: "bold",
    color: "#0088cc",
  },
  button: {
    backgroundColor: "#0088cc",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});
