import { StyleSheet, Text, View } from "react-native";

type Props = {
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  surface?: number;
  furnished?: boolean;
};

export default function DetailFeatures({
  bedrooms = 4,
  bathrooms = 3,
  parking = 2,
  surface = 240,
  furnished = false,
}: Props) {
  const features = [
    {
      icon: "🛏️",
      label: "Chambres",
      value: bedrooms,
    },
    {
      icon: "🛁",
      label: "Salles de bain",
      value: bathrooms,
    },
    {
      icon: "🚗",
      label: "Parking",
      value: parking,
    },
    {
      icon: "📐",
      label: "Surface",
      value: `${surface} m²`,
    },
    {
      icon: furnished ? "🛋️" : "🏠",
      label: "État",
      value: furnished ? "Meublé" : "Non meublé",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Caractéristiques
      </Text>

      <View style={styles.grid}>
        {features.map((feature, index) => (
          <View
            key={`${feature.label}-${index}`}
            style={styles.card}
          >
            <Text style={styles.icon}>
              {feature.icon}
            </Text>

            <Text style={styles.value}>
              {feature.value}
            </Text>

            <Text style={styles.label}>
              {feature.label}
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
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 18,
  },

  title: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },

  card: {
    width: "30%",
    minWidth: 130,

    backgroundColor: "#F7F8F6",
    borderRadius: 18,

    paddingVertical: 18,
    paddingHorizontal: 14,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: "#E5ECE8",
  },

  icon: {
    fontSize: 28,
    marginBottom: 10,
  },

  value: {
    color: "#06251A",
    fontSize: 18,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 4,
  },

  label: {
    color: "#6B6B5F",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 18,
  },
});