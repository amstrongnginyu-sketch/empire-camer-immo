import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

import { loginUser, registerUser } from "../services/authService";

type Props = {
  onBack?: () => void;
  onLoginSuccess?: () => void;
};

export function AuthScreen({ onBack, onLoginSuccess }: Props) {
  const { width } = useWindowDimensions();
  const isPhone = width < 700;

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
      <LinearGradient colors={["#06251A", "#0F3D2E"]} style={styles.top}>
        {onBack && (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.back}>← Retour</Text>
          </Pressable>
        )}

        <View style={styles.flag}>
          <View style={styles.flagGreen} />

          <View style={styles.flagRed}>
            <Text style={styles.star}>★</Text>
          </View>

          <View style={styles.flagGold} />
        </View>

        <Text style={[styles.logoEmpire, isPhone && styles.logoEmpireMobile]}>
          EMPIRE
        </Text>

        <Text style={[styles.logoSub, isPhone && styles.logoSubMobile]}>
          CAMER IMMO
        </Text>

        <Text style={[styles.tagline, isPhone && styles.taglineMobile]}>
          L'immobilier du Cameroun, dans votre poche.
        </Text>
      </LinearGradient>

      <View style={styles.cardWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.card, !isPhone && styles.cardDesktop]}>
            <Text style={styles.title}>
              {isRegister ? "Créer un compte" : "Connexion"}
            </Text>

            <Text style={styles.subtitle}>
              {isRegister
                ? "Créez votre espace sécurisé"
                : "Accédez à votre espace sécurisé"}
            </Text>

            {isRegister && (
              <>
                <Text style={styles.label}>Nom</Text>

                <View style={styles.inputBox}>
                  <Text style={styles.inputIcon}>👤</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Votre nom"
                    placeholderTextColor="#7D8882"
                    value={name}
                    onChangeText={setName}
                  />
                </View>

                <Text style={styles.label}>Téléphone</Text>

                <View style={styles.inputBox}>
                  <Text style={styles.inputIcon}>📞</Text>

                  <TextInput
                    style={styles.input}
                    placeholder="+237..."
                    placeholderTextColor="#7D8882"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}

            <Text style={styles.label}>Email</Text>

            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>✉️</Text>

              <TextInput
                style={styles.input}
                placeholder="votre@email.com"
                placeholderTextColor="#7D8882"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <Text style={styles.label}>Mot de passe</Text>

            <View style={styles.inputBox}>
              <Text style={styles.inputIcon}>🔒</Text>

              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#7D8882"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <Pressable
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>
                  {isRegister ? "Créer mon compte" : "Se connecter"}
                </Text>
              )}
            </Pressable>

            <Pressable onPress={() => setIsRegister(!isRegister)}>
              <Text style={styles.switch}>
                {isRegister ? (
                  <>
                    Déjà un compte ?{" "}
                    <Text style={styles.switchStrong}>Se connecter</Text>
                  </>
                ) : (
                  <>
                    Pas encore de compte ?{" "}
                    <Text style={styles.switchStrong}>Créer un compte</Text>
                  </>
                )}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

export default AuthScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#06251A",
  },

  top: {
    minHeight: 230,
    paddingTop: 22,
    paddingHorizontal: 28,
    justifyContent: "center",
  },

  backButton: {
    position: "absolute",
    top: 18,
    left: 24,
    zIndex: 10,
  },

  back: {
    color: "#F0D77A",
    fontWeight: "900",
    fontSize: 20,
  },

  flag: {
    width: 99,
    height: 15,
    flexDirection: "row",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 22,
  },

  flagGreen: {
    flex: 1,
    backgroundColor: "#00843D",
  },

  flagRed: {
    flex: 1,
    backgroundColor: "#CE1126",
    alignItems: "center",
    justifyContent: "center",
  },

  flagGold: {
    flex: 1,
    backgroundColor: "#FCD116",
  },

  star: {
    color: "#FCD116",
    fontSize: 10,
    fontWeight: "900",
  },

  logoEmpire: {
    color: "#FCD116",
    fontSize: 46,
    lineHeight: 50,
    fontWeight: "900",
    letterSpacing: 1,
  },

  logoEmpireMobile: {
    fontSize: 40,
    lineHeight: 44,
  },

  logoSub: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 4,
    marginTop: 2,
  },

  logoSubMobile: {
    fontSize: 18,
    letterSpacing: 3,
  },

  tagline: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 16,
    fontWeight: "700",
    marginTop: 16,
  },

  taglineMobile: {
    fontSize: 14,
    marginTop: 12,
  },

  cardWrapper: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
    marginTop: -10,
    overflow: "hidden",
  },

  scrollContent: {
    flexGrow: 1,
  },

  card: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 16,
  },

  cardDesktop: {
    maxWidth: 460,
    width: "100%",
    alignSelf: "center",
  },

  title: {
    color: "#06251A",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 4,
  },

  subtitle: {
    color: "#7D8882",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 20,
  },

  label: {
    color: "#101A16",
    fontSize: 14,
    fontWeight: "900",
    marginBottom: 8,
  },

  inputBox: {
    minHeight: 46,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E4E1DA",
    backgroundColor: "#F6F4F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },

  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: "#06251A",
    fontSize: 16,
    fontWeight: "700",
    outlineStyle: "none" as any,
  },

  button: {
    backgroundColor: "#008C45",
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    shadowColor: "#008C45",
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },

  buttonDisabled: {
    opacity: 0.65,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
  },

  switch: {
    textAlign: "center",
    marginTop: 18,
    color: "#7D8882",
    fontSize: 15,
    fontWeight: "700",
  },

  switchStrong: {
    color: "#008C45",
    fontWeight: "900",
  },
});