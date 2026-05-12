import { useEffect, useState } from "react";
import {
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

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
  const { width } = useWindowDimensions();
  const isPhone = width < 700;
  const isTablet = width >= 700 && width < 1024;

  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    setFavoriteCount(getFavoriteCount());

    const timer = setInterval(() => {
      setFavoriteCount(getFavoriteCount());
    }, 700);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.wrapper}>
        <View style={[styles.flagBar, isPhone && styles.flagBarMobile]}>
          <View style={styles.flagGreen} />

          <View style={styles.flagRed}>
            <Text style={styles.star}>★</Text>
          </View>

          <View style={styles.flagGold} />
        </View>

        <View style={[styles.header, isPhone && styles.headerMobile]}>
          <Pressable
            style={[styles.logoBox, isPhone && styles.logoBoxMobile]}
            onPress={onHome}
          >
            <Text style={[styles.logo, isPhone && styles.logoMobile]}>
              EMPIRE <Text style={styles.logoGold}>CAMER IMMO</Text>
            </Text>

            {!isPhone && (
              <Text style={styles.slogan}>ICI C’EST LE CONTINENT.</Text>
            )}
          </Pressable>

          {!isPhone && !isTablet && (
            <View style={styles.adZone}>
              <Text style={styles.adLabel}>ESPACE PUBLICITAIRE PREMIUM</Text>
              <Text style={styles.adText} numberOfLines={1}>
                Annonce sponsorisée • rotation automatique • agences partenaires
              </Text>
            </View>
          )}

          <View style={[styles.rightBox, isPhone && styles.rightBoxMobile]}>
            <Pressable
              style={[styles.favButton, isPhone && styles.iconButtonMobile]}
              onPress={onFavorites}
            >
              <Text style={[styles.favText, isPhone && styles.mobileIconText]}>
                ❤️ {!isPhone && favoriteCount > 0 ? `(${favoriteCount})` : ""}
              </Text>
            </Pressable>

            {isAdmin && !isPhone && (
              <Pressable style={styles.adminButton} onPress={onAdmin}>
                <Text style={styles.adminText}>Admin</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.publishButton, isPhone && styles.smallButtonMobile]}
              onPress={onPublish}
            >
              <Text style={[styles.publishText, isPhone && styles.smallTextMobile]}>
                Publier
              </Text>
            </Pressable>

            {isLoggedIn ? (
              <View style={[styles.accountBox, isPhone && styles.accountBoxMobile]}>
                {!isPhone && (
                  <Text style={styles.emailText} numberOfLines={1}>
                    {userEmail || "Utilisateur"}
                  </Text>
                )}

                <Pressable onPress={onLogout}>
                  <Text style={[styles.logoutText, isPhone && styles.accountTextMobile]}>
                    Sortir
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={[styles.loginButton, isPhone && styles.smallButtonMobile]}
                onPress={onLogin}
              >
                <Text style={[styles.loginText, isPhone && styles.smallTextMobile]}>
                  Login
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default AppHeader;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0,
  },

  wrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDE6D6",
    zIndex: 100,
  },

  flagBar: {
    height: 6,
    flexDirection: "row",
  },

  flagBarMobile: {
    height: 4,
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
    fontSize: 10,
    fontWeight: "900",
  },

  header: {
    minHeight: 58,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  headerMobile: {
    minHeight: 48,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
  },

  logoBox: {
    minWidth: 180,
  },

  logoBoxMobile: {
    minWidth: 0,
    flex: 1,
  },

  logo: {
    fontSize: 17,
    fontWeight: "900",
    color: "#1F5C42",
  },

  logoMobile: {
    fontSize: 13,
  },

  logoGold: {
    color: "#C9A646",
  },

  slogan: {
    marginTop: 2,
    fontSize: 9,
    fontWeight: "800",
    color: "#6B6B5F",
    letterSpacing: 0.8,
  },

  adZone: {
    flex: 1,
    maxWidth: 860,
    backgroundColor: "#F7F4EC",
    borderWidth: 1,
    borderColor: "#EDE6D6",
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  adLabel: {
    color: "#1F5C42",
    fontSize: 10,
    fontWeight: "900",
  },

  adText: {
    color: "#6B6B5F",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 2,
    textAlign: "center",
  },

  rightBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },

  rightBoxMobile: {
    gap: 5,
  },

  favButton: {
    backgroundColor: "#FFF0F3",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  iconButtonMobile: {
    width: 30,
    height: 30,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },

  favText: {
    color: "#A84A3A",
    fontWeight: "900",
    fontSize: 12,
  },

  mobileIconText: {
    fontSize: 13,
  },

  adminButton: {
    backgroundColor: "#EAF4EF",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  adminText: {
    color: "#1F5C42",
    fontWeight: "900",
    fontSize: 12,
  },

  publishButton: {
    backgroundColor: "#1F5C42",
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 12,
  },

  smallButtonMobile: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    borderRadius: 12,
  },

  publishText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
  },

  smallTextMobile: {
    fontSize: 10,
  },

  loginButton: {
    backgroundColor: "#EAF4EF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },

  loginText: {
    color: "#1F5C42",
    fontSize: 12,
    fontWeight: "900",
  },

  accountBox: {
    maxWidth: 150,
  },

  accountBoxMobile: {
    maxWidth: 34,
  },

  emailText: {
    color: "#C9A646",
    fontSize: 10,
    fontWeight: "900",
  },

  logoutText: {
    color: "#A84A3A",
    fontSize: 11,
    fontWeight: "900",
  },

  accountTextMobile: {
    fontSize: 10,
  },
});