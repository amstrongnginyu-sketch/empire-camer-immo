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
          <Pressable style={[styles.logoBox, isPhone && styles.logoBoxMobile]} onPress={onHome}>
            <Text style={[styles.logo, isPhone && styles.logoMobile]}>
              EMPIRE <Text style={styles.logoGold}>CAMER IMMO</Text>
            </Text>
            <Text style={[styles.slogan, isPhone && styles.sloganMobile]}>
              ICI C’EST LE CONTINENT.
            </Text>
          </Pressable>

          {!isPhone && (
            <View style={styles.adZone}>
              <Text style={styles.adLabel}>ESPACE PUBLICITAIRE PREMIUM</Text>
              <Text style={styles.adText}>
                Annonce sponsorisée • rotation automatique • agences partenaires
              </Text>
            </View>
          )}

          <View style={[styles.rightBox, isPhone && styles.rightBoxMobile]}>
            <Pressable style={[styles.favButton, isPhone && styles.iconButtonMobile]} onPress={onFavorites}>
              <Text style={[styles.favText, isPhone && styles.mobileIconText]}>
                ❤️{!isPhone ? ` Favoris ${favoriteCount > 0 ? `(${favoriteCount})` : ""}` : ""}
              </Text>
            </Pressable>

            {isAdmin && (
              <Pressable style={[styles.adminButton, isPhone && styles.smallButtonMobile]} onPress={onAdmin}>
                <Text style={[styles.adminText, isPhone && styles.smallTextMobile]}>
                  Admin
                </Text>
              </Pressable>
            )}

            <Pressable style={[styles.publishButton, isPhone && styles.smallButtonMobile]} onPress={onPublish}>
              <Text style={[styles.publishText, isPhone && styles.smallTextMobile]}>
                Publier
              </Text>
            </Pressable>

            {isLoggedIn ? (
              <View style={[styles.accountBox, isPhone && styles.accountBoxMobile]}>
                <Text style={[styles.loginTitle, isPhone && styles.accountTextMobile]}>
                  Connecté
                </Text>

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
              <View style={[styles.accountBox, isPhone && styles.accountBoxMobile]}>
                <Pressable onPress={onLogin}>
                  <Text style={[styles.loginTitle, isPhone && styles.accountTextMobile]}>
                    Login
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#FFFFFF",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight || 24 : 0,
  },

  wrapper: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EDE6D6",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 100,
  },

  flagBar: {
    height: 20,
    flexDirection: "row",
  },

  flagBarMobile: {
    height: 6,
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
    minHeight: 90,
    paddingHorizontal: 28,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  headerMobile: {
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },

  logoBox: {
    minWidth: 260,
  },

  logoBoxMobile: {
    minWidth: 0,
    flex: 1,
  },

  logo: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F5C42",
  },

  logoMobile: {
    fontSize: 15,
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

  sloganMobile: {
    marginTop: 1,
    fontSize: 8,
    letterSpacing: 0.7,
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

  rightBoxMobile: {
    minWidth: 0,
    gap: 5,
  },

  favButton: {
    backgroundColor: "#FFF0F3",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
  },

  iconButtonMobile: {
    width: 32,
    height: 32,
    paddingVertical: 0,
    paddingHorizontal: 0,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  favText: {
    color: "#A84A3A",
    fontWeight: "900",
  },

  mobileIconText: {
    fontSize: 15,
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

  smallButtonMobile: {
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderRadius: 14,
  },

  publishText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },

  smallTextMobile: {
    fontSize: 10,
  },

  accountBox: {
    alignItems: "flex-start",
    maxWidth: 160,
  },

  accountBoxMobile: {
    maxWidth: 38,
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

  accountTextMobile: {
    fontSize: 10,
  },
});