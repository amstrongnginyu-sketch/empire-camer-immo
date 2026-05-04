import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const FAVORITES_KEY = "empire_camer_immo_favorites";

type Props = {
  isLoggedIn: boolean;
  userEmail?: string | null;
  isAdmin?: boolean;

  onHome: () => void;
  onPublish: () => void;
  onLogin: () => void;
  onLogout: () => void;

  onAdmin?: () => void;
  onFavorites?: () => void;
};

function getFavoriteCount() {
  try {
    const raw = globalThis?.localStorage?.getItem(FAVORITES_KEY);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export function AppHeader({
  isLoggedIn,
  userEmail,
  isAdmin,
  onHome,
  onPublish,
  onLogin,
  onLogout,
  onAdmin,
  onFavorites,
}: Props) {
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    setFavoriteCount(getFavoriteCount());

    const timer = setInterval(() => {
      setFavoriteCount(getFavoriteCount());
    }, 700);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.wrapper}>
      <View style={styles.flagBar}>
        <View style={styles.flagGreen} />

        <View style={styles.flagRed}>
          <Text style={styles.star}>★</Text>
        </View>

        <View style={styles.flagGold} />
      </View>

      <View style={styles.header}>
        <Pressable style={styles.logoBox} onPress={onHome}>
          <Text style={styles.logo}>
            EMPIRE <Text style={styles.logoGold}>CAMER IMMO</Text>
          </Text>

          <Text style={styles.slogan}>ICI C’EST LE CONTINENT.</Text>
        </Pressable>

        <View style={styles.adZone}>
          <Text style={styles.adLabel}>ESPACE PUBLICITAIRE PREMIUM</Text>
          <Text style={styles.adText}>
            Annonce sponsorisée • rotation automatique • agences partenaires
          </Text>
        </View>

        <View style={styles.rightBox}>
          <Pressable style={styles.favButton} onPress={onFavorites}>
            <Text style={styles.favText}>
              ❤️ Favoris {favoriteCount > 0 ? `(${favoriteCount})` : ""}
            </Text>
          </Pressable>

          {isAdmin && (
            <Pressable style={styles.adminButton} onPress={onAdmin}>
              <Text style={styles.adminText}>Admin</Text>
            </Pressable>
          )}

          <Pressable style={styles.publishButton} onPress={onPublish}>
            <Text style={styles.publishText}>Publier</Text>
          </Pressable>

          {isLoggedIn ? (
            <View style={styles.accountBox}>
              <Text style={styles.loginTitle}>Connecté</Text>

              <Text style={styles.emailText} numberOfLines={1}>
                {userEmail || "Utilisateur"}
              </Text>

              <Pressable onPress={onLogout}>
                <Text style={styles.logoutText}>Se déconnecter</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.accountBox}>
              <Pressable onPress={onLogin}>
                <Text style={styles.loginTitle}>Login</Text>
              </Pressable>

              <Pressable onPress={onLogin}>
                <Text style={styles.emailText}>Créer un compte</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDE6D6",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    zIndex: 100,
  },

  flagBar: {
    height: 20,
    flexDirection: "row",
  },

  flagGreen: {
    flex: 1,
    backgroundColor: "#1F5C42",
  },

  flagRed: {
    flex: 1,
    backgroundColor: "#A84A3A",
    justifyContent: "center",
    alignItems: "center",
  },

  flagGold: {
    flex: 1,
    backgroundColor: "#F0D77A",
  },

  star: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "900",
  },

  header: {
    minHeight: 90,
    paddingHorizontal: 28,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  logoBox: {
    minWidth: 260,
  },

  logo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F5C42",
  },

  logoGold: {
    color: "#C9A646",
  },

  slogan: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "800",
    color: "#6B6B5F",
    letterSpacing: 1,
  },

  adZone: {
    flex: 1,
    backgroundColor: "#F7F4EC",
    borderWidth: 1,
    borderColor: "#EDE6D6",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  adLabel: {
    color: "#1F5C42",
    fontSize: 13,
    fontWeight: "900",
  },

  adText: {
    color: "#6B6B5F",
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },

  rightBox: {
    minWidth: 320,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },

  favButton: {
    backgroundColor: "#FFF0F3",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  favText: {
    color: "#A84A3A",
    fontWeight: "900",
  },

  adminButton: {
    backgroundColor: "#EAF4EF",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  adminText: {
    color: "#1F5C42",
    fontWeight: "900",
  },

  publishButton: {
    backgroundColor: "#1F5C42",
    paddingVertical: 12,
    paddingHorizontal: 22,
    borderRadius: 18,
  },

  publishText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  accountBox: {
    alignItems: "flex-start",
    maxWidth: 160,
  },

  loginTitle: {
    color: "#1F5C42",
    fontSize: 13,
    fontWeight: "900",
  },

  emailText: {
    color: "#C9A646",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2,
  },

  logoutText: {
    color: "#A84A3A",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 2,
  },
});