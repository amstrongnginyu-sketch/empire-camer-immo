import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

function AppFooter() {
  const open = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.footer}>
      <View style={styles.left}>
        <View style={styles.links}>
          <Text style={styles.link}>ABOUT US</Text>
          <Text style={styles.sep}>|</Text>
          <Text style={styles.link}>CAREERS</Text>
          <Text style={styles.sep}>|</Text>
          <Text style={styles.link}>CONTACT US</Text>
          <Text style={styles.sep}>|</Text>
          <Text style={styles.link}>TERMS & PRIVACY</Text>
        </View>

        <Text style={styles.country}>COUNTRY: 🇨🇲 Cameroon ▾</Text>
        <Text style={styles.copy}>© 2026 Empire Camer Immo</Text>
      </View>

      <View style={styles.right}>
        <View style={styles.socials}>
          <Pressable onPress={() => open("https://facebook.com")}>
            <Text style={styles.social}>f</Text>
          </Pressable>

          <Pressable onPress={() => open("https://x.com")}>
            <Text style={styles.social}>𝕏</Text>
          </Pressable>

          <Pressable onPress={() => open("https://linkedin.com")}>
            <Text style={styles.social}>in</Text>
          </Pressable>

          <Pressable onPress={() => open("https://instagram.com")}>
            <Text style={styles.social}>◎</Text>
          </Pressable>

          <Pressable onPress={() => open("https://youtube.com")}>
            <Text style={styles.social}>▶</Text>
          </Pressable>
        </View>

        <View style={styles.storeRow}>
          <Text style={styles.store}>App Store</Text>
          <Text style={styles.store}>Google Play</Text>
          <Text style={styles.store}>AppGallery</Text>
        </View>

        <Pressable style={styles.topButton}>
          <Text style={styles.topText}>TOP ↑</Text>
        </Pressable>
      </View>
    </View>
  );
}

export { AppFooter };
export default AppFooter;

const styles = StyleSheet.create({
 footer: {
  position: "fixed" as any,

  left: 0,
  right: 0,
  bottom: 0,
  top: "auto" as any,

  height: 92,

  backgroundColor: "#050706",
  borderTopWidth: 3,
  borderTopColor: "#1F5C42",

  paddingVertical: 10,
  paddingHorizontal: 28,

  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",

  zIndex: 999999,

  elevation: 999,

  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 12,
},

  left: {
    flex: 1,
    minWidth: 0,
  },

  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  link: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 1,
  },

  sep: {
    color: "#777777",
    fontSize: 11,
    fontWeight: "900",
  },

  country: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
    marginBottom: 6,
  },

  copy: {
    color: "#9C9C9C",
    fontSize: 10,
    fontWeight: "700",
  },

  right: {
    alignItems: "flex-end",
    gap: 6,
  },

  socials: {
    flexDirection: "row",
    gap: 8,
  },

  social: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    color: "#111111",
    textAlign: "center",
    lineHeight: 28,
    fontSize: 15,
    fontWeight: "900",
    overflow: "hidden",
  },

  storeRow: {
    flexDirection: "row",
    gap: 8,
  },

  store: {
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 6,
    fontWeight: "900",
    fontSize: 10,
  },

  topButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  topText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "900",
  },
});