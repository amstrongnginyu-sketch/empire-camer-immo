import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

type Props = {
  onHome?: () => void;
  onFavorites?: () => void;
  onPublish?: () => void;
  onLogin?: () => void;
};

export default function AppHeader({
  onHome,
  onFavorites,
  onPublish,
  onLogin,
}: Props) {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#06251A", "#0F3D2E"]}
        style={[styles.header, isPhone && styles.headerPhone]}
      >
        <Pressable onPress={onHome} style={styles.brand}>
          <View style={styles.flag}>
            <View style={styles.flagGreen} />

            <View style={styles.flagRed}>
              <Text style={styles.star}>★</Text>
            </View>

            <View style={styles.flagGold} />
          </View>

          <View>
            <Text style={[styles.logo, isPhone && styles.logoPhone]}>
              EMPIRE
            </Text>

            <Text style={[styles.sub, isPhone && styles.subPhone]}>
              CAMER IMMO
            </Text>
          </View>
        </Pressable>

        <View style={styles.actions}>
          {!isPhone && (
            <>
              <Pressable style={styles.linkButton} onPress={onHome}>
                <Text style={styles.linkText}>Accueil</Text>
              </Pressable>

              <Pressable style={styles.linkButton} onPress={onFavorites}>
                <Text style={styles.linkText}>Favoris</Text>
              </Pressable>
            </>
          )}

          <Pressable style={styles.publishButton} onPress={onPublish}>
            <Text style={styles.publishText}>Publier</Text>
          </Pressable>

          <Pressable style={styles.loginButton} onPress={onLogin}>
            <Text style={styles.loginText}>Connexion</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    position: "sticky" as any,
    top: 0,
    zIndex: 999,
  },

  header: {
    minHeight: 82,
    paddingHorizontal: 26,
    paddingVertical: 14,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  headerPhone: {
    paddingHorizontal: 14,
    minHeight: 72,
  },

  brand: {
    flexDirection: "row",
    alignItems: "center",
  },

  flag: {
    width: 34,
    height: 34,
    borderRadius: 999,
    overflow: "hidden",
    marginRight: 12,
  },

  flagGreen: {
    flex: 1,
    backgroundColor: "#007A3D",
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
    fontSize: 8,
    fontWeight: "900",
  },

  logo: {
    color: "#FCD116",
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "900",
    letterSpacing: 1,
  },

  logoPhone: {
    fontSize: 18,
    lineHeight: 20,
  },

  sub: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 2,
  },

  subPhone: {
    fontSize: 9,
  },

  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  linkButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  linkText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  publishButton: {
    backgroundColor: "#F0D77A",
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  publishText: {
    color: "#06251A",
    fontSize: 14,
    fontWeight: "900",
  },

  loginButton: {
    backgroundColor: "rgba(255,255,255,0.1)",
    minHeight: 42,
    paddingHorizontal: 18,
    borderRadius: 14,

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",

    alignItems: "center",
    justifyContent: "center",
  },

  loginText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});