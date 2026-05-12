import { StyleSheet, Text, View } from "react-native";

type Props = {
  title?: string;
  city?: string;
  neighborhood?: string;
  type?: string;
  reference?: string;
};

export default function DetailHeader({
  title = "Villa moderne premium",
  city = "Douala",
  neighborhood = "Bonapriso",
  type = "Villa",
  reference = "ECI-2026-001",
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{type}</Text>
        </View>

        <Text style={styles.reference}>
          Réf : {reference}
        </Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.locationRow}>
        <Text style={styles.locationIcon}>📍</Text>

        <Text style={styles.locationText}>
          {neighborhood}, {city}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 22,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  badge: {
    backgroundColor: "#E8F2ED",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  badgeText: {
    color: "#1F5C42",
    fontSize: 13,
    fontWeight: "900",
  },

  reference: {
    color: "#7A807C",
    fontSize: 12,
    fontWeight: "700",
  },

  title: {
    color: "#06251A",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "900",
    marginBottom: 10,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  locationIcon: {
    fontSize: 15,
    marginRight: 6,
  },

  locationText: {
    color: "#5F655F",
    fontSize: 15,
    fontWeight: "700",
  },
});