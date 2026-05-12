import { StyleSheet, Text, View } from "react-native";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function HomeEmptyState({
  title = "Aucune annonce trouvée",
  subtitle = "Essayez de modifier vos filtres ou votre recherche.",
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🏠</Text>

      <Text style={styles.title}>
        {title}
      </Text>

      <Text style={styles.subtitle}>
        {subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",

    borderRadius: 24,
    paddingVertical: 46,
    paddingHorizontal: 24,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  icon: {
    fontSize: 54,
    marginBottom: 16,
  },

  title: {
    color: "#06251A",
    fontSize: 24,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "#6B6B5F",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "700",
    textAlign: "center",
    maxWidth: 420,
  },
});