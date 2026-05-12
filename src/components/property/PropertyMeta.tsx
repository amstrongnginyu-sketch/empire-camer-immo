import { StyleSheet, Text } from "react-native";

type Props = {
  item: any;
};

export function PropertyMeta({ item }: Props) {
  return (
    <Text style={styles.meta} numberOfLines={1}>
      🛏 {item?.bedrooms || "-"} | 🚿 {item?.bathrooms || "-"} | 📐{" "}
      {item?.surface || "-"} m²
    </Text>
  );
}

export default PropertyMeta;

const styles = StyleSheet.create({
  meta: {
    color: "#1D2E26",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 6,
  },
});