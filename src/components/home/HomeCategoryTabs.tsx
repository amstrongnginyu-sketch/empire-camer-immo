import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

type Props = {
  categories?: string[];
  selected?: string;
  onSelect?: (category: string) => void;
};

export default function HomeCategoryTabs({
  categories = [
    "Tous",
    "Villas",
    "Appartements",
    "Terrains",
    "Bureaux",
    "Studios",
  ],
  selected = "Tous",
  onSelect,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => {
        const active = category === selected;

        return (
          <Pressable
            key={category}
            style={[
              styles.tab,
              active && styles.activeTab,
            ]}
            onPress={() => onSelect?.(category)}
          >
            <Text
              style={[
                styles.tabText,
                active && styles.activeTabText,
              ]}
            >
              {category}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 16,
    marginBottom: 8,
  },

  tab: {
    minHeight: 44,

    paddingHorizontal: 18,

    borderRadius: 999,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E3EAE6",

    alignItems: "center",
    justifyContent: "center",
  },

  activeTab: {
    backgroundColor: "#1F5C42",
    borderColor: "#1F5C42",
  },

  tabText: {
    color: "#06251A",
    fontSize: 14,
    fontWeight: "800",
  },

  activeTabText: {
    color: "#FFFFFF",
  },
});