import { StyleSheet, Text, View } from "react-native";

type Props = {
  item: any;
};

export function PropertyBadges({ item }: Props) {
  return (
    <View style={styles.badgeRow}>
      <Text style={styles.badgeGreen}>{item?.type || "Bien"}</Text>
      <Text style={styles.badgeGold}>{item?.purpose || "Vente"}</Text>
      {item?.boost && <Text style={styles.badgePremium}>💎 Premium</Text>}
    </View>
  );
}

export default PropertyBadges;

const styles = StyleSheet.create({
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginBottom: 10,
  },

  badgeGreen: {
    backgroundColor: "#EAF4EF",
    color: "#1F5C42",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: "900",
    fontSize: 12,
  },

  badgeGold: {
    backgroundColor: "#F0D77A",
    color: "#06251A",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: "900",
    fontSize: 12,
  },

  badgePremium: {
    backgroundColor: "#FFF3C4",
    color: "#8A6A00",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    fontWeight: "900",
    fontSize: 12,
  },
});