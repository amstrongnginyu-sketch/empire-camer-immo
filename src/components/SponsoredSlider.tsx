import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { PropertyCard } from "../components/property/PropertyCard";

type Props = {
  items: any[];
  onOpenProperty: (property: any) => void;
  onBoostProperty?: (property: any) => void;
};

export function SponsoredSlider({
  items,
  onOpenProperty,
  onBoostProperty,
}: Props) {
  const { width } = useWindowDimensions();

  const isPhone = width < 600;
  const isTablet = width >= 600 && width < 1024;

  const cardWidth = isPhone ? width - 42 : isTablet ? 520 : 700;

  if (!items || items.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>Aucune annonce sponsorisée.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.slider}
    >
      {items.map((item) => (
        <View key={item.id} style={[styles.cardWrap, { width: cardWidth }]}>
          <PropertyCard
            item={item}
            compact={false}
            onPress={() => onOpenProperty(item)}
            onBoost={() => onBoostProperty?.(item)}
          />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  slider: {
    gap: 16,
    paddingBottom: 18,
    paddingRight: 16,
  },

  cardWrap: {
    flexShrink: 0,
  },

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E3EAE6",
    marginBottom: 20,
  },

  emptyText: {
    color: "#51635A",
    fontWeight: "800",
  },
});