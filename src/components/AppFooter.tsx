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
          <Text style={styles.link}>TERMS & PRIVACY POLICY</Text>
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
    marginTop: 40,
    backgroundColor: "#050706",
    paddingVertical: 38,
    paddingHorizontal: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 30,
    borderTopWidth: 4,
    borderTopColor: "#1F5C42",
  },

  left: {
    flex: 1,
  },

  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },

  link: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  sep: {
    color: "#777777",
    fontSize: 16,
    fontWeight: "900",
  },

  country: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 30,
  },

  copy: {
    color: "#9C9C9C",
    fontSize: 13,
    fontWeight: "700",
  },

  right: {
    alignItems: "flex-end",
  },

  socials: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 18,
  },

  social: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    color: "#111111",
    textAlign: "center",
    lineHeight: 42,
    fontSize: 22,
    fontWeight: "900",
    overflow: "hidden",
  },

  storeRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  store: {
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    fontWeight: "900",
    fontSize: 12,
  },

  topButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
  },

  topText: {
    color: "#000000",
    fontWeight: "900",
  },
});