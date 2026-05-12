import { Linking, Pressable, StyleSheet, Text, useWindowDimensions, View } from "react-native";

export default function AppFooter() {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;

  function open(url: string) {
    Linking.openURL(url);
  }

  return (
    <View style={[styles.footer, isPhone && styles.footerPhone]}>
      <View style={[styles.content, isPhone && styles.contentPhone]}>
        <View style={styles.left}>
          <View style={styles.links}>
            <Text style={styles.link}>ABOUT US</Text>

            {!isPhone && <Text style={styles.sep}>|</Text>}

            <Text style={styles.link}>CAREERS</Text>

            {!isPhone && <Text style={styles.sep}>|</Text>}

            <Text style={styles.link}>CONTACT US</Text>

            {!isPhone && <Text style={styles.sep}>|</Text>}

            <Text style={styles.link}>PRIVACY POLICY</Text>
          </View>

          <Text style={styles.country}>
            COUNTRY: 🇨🇲 Cameroon
          </Text>

          <Text style={styles.copyright}>
            © 2026 Empire Camer Immo
          </Text>
        </View>

        <View style={[styles.right, isPhone && styles.rightPhone]}>
          <View style={styles.socials}>
            <Pressable
              style={styles.socialButton}
              onPress={() => open("https://facebook.com")}
            >
              <Text style={styles.socialText}>f</Text>
            </Pressable>

            <Pressable
              style={styles.socialButton}
              onPress={() => open("https://instagram.com")}
            >
              <Text style={styles.socialText}>◎</Text>
            </Pressable>

            <Pressable
              style={styles.socialButton}
              onPress={() => open("https://x.com")}
            >
              <Text style={styles.socialText}>𝕏</Text>
            </Pressable>

            <Pressable
              style={styles.socialButton}
              onPress={() => open("https://youtube.com")}
            >
              <Text style={styles.socialText}>▶</Text>
            </Pressable>
          </View>

          <View style={styles.storeButtons}>
            <View style={styles.storeButton}>
              <Text style={styles.storeText}>App Store</Text>
            </View>

            <View style={styles.storeButton}>
              <Text style={styles.storeText}>Google Play</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    width: "100%",
    backgroundColor: "#050706",
    borderTopWidth: 3,
    borderTopColor: "#1F5C42",
    paddingHorizontal: 28,
    paddingVertical: 20,
  },

  footerPhone: {
    paddingHorizontal: 14,
    paddingVertical: 16,
  },

  content: {
    width: "100%",
    maxWidth: 1500,
    alignSelf: "center",

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    gap: 20,
  },

  contentPhone: {
    flexDirection: "column",
    alignItems: "flex-start",
  },

  left: {
    gap: 8,
  },

  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 10,
  },

  link: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  sep: {
    color: "#7A7A7A",
    fontSize: 11,
    fontWeight: "800",
  },

  country: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "800",
  },

  copyright: {
    color: "#8A8A8A",
    fontSize: 10,
    fontWeight: "700",
  },

  right: {
    alignItems: "flex-end",
    gap: 10,
  },

  rightPhone: {
    alignItems: "flex-start",
    width: "100%",
  },

  socials: {
    flexDirection: "row",
    gap: 8,
  },

  socialButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  socialText: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "900",
  },

  storeButtons: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },

  storeButton: {
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },

  storeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "800",
  },
});