import { StyleSheet, View, useWindowDimensions } from "react-native";
import { PropertyCard } from "../property/PropertyCard";

type Props = {
  items: any[];
  onOpenProperty: (property: any) => void;
  onBoostProperty?: (property: any) => void;
};

export function HomePropertyGrid({
  items,
  onOpenProperty,
  onBoostProperty,
}: Props) {
  const { width } = useWindowDimensions();

  const isPhone = width < 700;
  const isTablet = width >= 700 && width < 1024;
  const isDesktop = width >= 1024;

  const columns = isPhone ? 1 : isTablet ? 2 : isDesktop ? 3 : 1;
  const gap = isPhone ? 16 : 24;

  const itemWidth = isPhone ? "100%" : `${100 / columns - 1.5}%`;

  return (
    <View style={[styles.grid, { gap }]}>
      {items.map((item) => (
        <View
          key={String(item.id)}
          style={[styles.gridItem, { width: itemWidth as any }]}
        >
          <PropertyCard
            item={item}
            compact={false}
            onPress={() => onOpenProperty(item)}
            onBoost={() => onBoostProperty?.(item)}
          />
        </View>
      ))}
    </View>
  );
}

export default HomePropertyGrid;

const styles = StyleSheet.create({
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "stretch",
    marginBottom: 26,
  },

  gridItem: {
    minWidth: 0,
  },
});