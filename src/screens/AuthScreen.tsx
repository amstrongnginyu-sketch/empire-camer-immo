import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { loginUser, registerUser } from "../services/authService";

type Props = {
  onBack?: () => void;
  onLoginSuccess?: () => void;
};

export function AuthScreen({ onBack, onLoginSuccess }: Props) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword || (isRegister && (!name || !phone))) {
      Alert.alert("Erreur", "Remplis tous les champs.");
      return;
    }

    if (cleanPassword.length < 6) {
      Alert.alert("Erreur", "Le mot de passe doit avoir au moins 6 caractères.");
      return;
    }

    try {
      setLoading(true);

      if (isRegister) {
        await registerUser({
          name: name.trim(),
          phone: phone.trim(),
          email: cleanEmail,
          password: cleanPassword,
        });

        Alert.alert("Succès", "Compte créé avec succès.");
        onLoginSuccess?.();
        return;
      }

      await loginUser(cleanEmail, cleanPassword);
      onLoginSuccess?.();
    } catch (error) {
      Alert.alert(
        "Erreur",
        error instanceof Error ? error.message : "Erreur inconnue"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#1F5C42", "#0F3D2E"]} style={styles.header}>
        {onBack && (
          <Pressable onPress={onBack}>
            <Text style={styles.back}>← Retour</Text>
          </Pressable>
        )}

        <Text style={styles.logo}>EMPIRE</Text>
        <Text style={styles.sub}>CAMER IMMO</Text>
      </LinearGradient>

      <View style={styles.card}>
        <Text style={styles.title}>
          {isRegister ? "Créer un compte" : "Connexion"}
        </Text>

        {isRegister && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nom"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={styles.input}
              placeholder="Téléphone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isRegister ? "Créer" : "Se connecter"}
            </Text>
          )}
        </Pressable>

        <Pressable onPress={() => setIsRegister(!isRegister)}>
          <Text style={styles.switch}>
            {isRegister
              ? "Déjà un compte ? Se connecter"
              : "Pas encore de compte ? Créer un compte"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1F5C42" },
  header: { padding: 40 },
  back: {
    color: "#F0D77A",
    fontWeight: "900",
    marginBottom: 20,
  },
  logo: { color: "#F0D77A", fontSize: 30, fontWeight: "900" },
  sub: { color: "white", fontSize: 18 },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "900", marginBottom: 20 },
  input: {
    backgroundColor: "#F4F2EE",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#1F5C42",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "white", fontWeight: "900" },
  switch: { textAlign: "center", marginTop: 15, color: "#1F5C42" },
});