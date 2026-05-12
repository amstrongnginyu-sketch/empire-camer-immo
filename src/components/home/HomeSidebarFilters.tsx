import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onReset?: () => void;
};

export default function HomeSidebarFilters({
  onReset,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Filtres avancés
      </Text>

      <View style={styles.section}>
        <Text style={styles.label}>Type de bien</Text>

        <View style={styles.tags}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>Villa</Text>
          </View>

          <View style={styles.tag}>
            <Text style={styles.tagText}>Appartement</Text>
          </View>

          <View style={styles.tag}>
            <Text style={styles.tagText}>Terrain</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Budget</Text>

        <View style={styles.priceBox}>
          <Text style={styles.priceText}>
            5M - 250M FCFA
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Localisation</Text>

        <View style={styles.locationBox}>
          <Text style={styles.locationText}>
            Douala • Yaoundé • Kribi
          </Text>
        </View>
      </View>

      <Pressable style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetText}>
          Réinitialiser les filtres
        </Text>
      </Pressable>
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
  },

  title: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 20,
  },

  section: {
    marginBottom: 22,
  },

  label: {
    color: "#06251A",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 12,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  tag: {
    backgroundColor: "#F7F8F6",

    borderRadius: 999,

    paddingVertical: 10,
    paddingHorizontal: 14,

    borderWidth: 1,
    borderColor: "#E3EAE6",
  },

  tagText: {
    color: "#06251A",
    fontSize: 13,
    fontWeight: "800",
  },

  priceBox: {
    minHeight: 52,

    borderRadius: 16,

    backgroundColor: "#F7F8F6",

    borderWidth: 1,
    borderColor: "#E3EAE6",

    alignItems: "center",
    justifyContent: "center",
  },

  priceText: {
    color: "#1F5C42",
    fontSize: 14,
    fontWeight: "900",
  },

  locationBox: {
    minHeight: 52,

    borderRadius: 16,

    backgroundColor: "#F7F8F6",

    borderWidth: 1,
    borderColor: "#E3EAE6",

    paddingHorizontal: 14,

    justifyContent: "center",
  },

  locationText: {
    color: "#06251A",
    fontSize: 13,
    fontWeight: "700",
  },

  resetButton: {
    minHeight: 50,

    borderRadius: 16,

    backgroundColor: "#1F5C42",

    alignItems: "center",
    justifyContent: "center",
  },

  resetText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});