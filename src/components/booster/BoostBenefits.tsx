import { StyleSheet, Text, View } from "react-native";

export default function BoostBenefits() {
  const benefits = [
    "Annonce affichée en priorité",
    "Badge Premium visible",
    "Plus de vues et de contacts",
    "Meilleure visibilité locale",
    "Priorité dans les résultats",
    "Mise en avant homepage",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Pourquoi booster votre annonce ?
      </Text>

      <View style={styles.grid}>
        {benefits.map((item) => (
          <View key={item} style={styles.card}>
            <Text style={styles.icon}>🚀</Text>

            <Text style={styles.text}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 28,
  },

  title: {
    color: "#06251A",
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  card: {
    flex: 1,
    minWidth: 220,

    backgroundColor: "#FFFFFF",

    borderRadius: 22,

    padding: 20,

    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  icon: {
    fontSize: 28,
    marginBottom: 14,
  },

  text: {
    color: "#34433B",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "800",
  },
});