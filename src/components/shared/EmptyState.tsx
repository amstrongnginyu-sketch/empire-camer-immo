import { StyleSheet, Text, View } from "react-native";

type Props = {
  title?: string;
  subtitle?: string;
};

export default function EmptyState({
  title = "Aucun résultat",
  subtitle = "Aucune donnée disponible pour le moment.",
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📭</Text>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    paddingVertical: 40,
    paddingHorizontal: 24,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  icon: {
    fontSize: 46,
    marginBottom: 14,
  },

  title: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 8,
  },

  subtitle: {
    color: "#6B6B5F",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
    textAlign: "center",
    maxWidth: 420,
  },
});