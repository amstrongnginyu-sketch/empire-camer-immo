import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  city?: string;
  neighborhood?: string;
  address?: string;
  onOpenMap?: () => void;
};

export default function DetailLocation({
  city = "Douala",
  neighborhood = "Bonapriso",
  address = "Adresse non renseignée",
  onOpenMap,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Localisation
      </Text>

      <View style={styles.locationBox}>
        <Text style={styles.locationIcon}>
          📍
        </Text>

        <View style={styles.locationContent}>
          <Text style={styles.city}>
            {neighborhood}, {city}
          </Text>

          <Text style={styles.address}>
            {address}
          </Text>
        </View>
      </View>

      <Pressable
        style={styles.mapButton}
        onPress={onOpenMap}
      >
        <Text style={styles.mapButtonText}>
          Ouvrir la carte
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
    marginBottom: 18,
  },

  title: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 18,
  },

  locationBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  locationIcon: {
    fontSize: 24,
    marginRight: 12,
    marginTop: 2,
  },

  locationContent: {
    flex: 1,
  },

  city: {
    color: "#06251A",
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 6,
  },

  address: {
    color: "#5F655F",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 22,
  },

  mapButton: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#1F5C42",
    alignItems: "center",
    justifyContent: "center",
  },

  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});