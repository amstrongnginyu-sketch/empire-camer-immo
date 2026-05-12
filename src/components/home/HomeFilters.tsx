import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  filters?: string[];
  selectedFilters?: string[];
  onToggleFilter?: (filter: string) => void;
};

export default function HomeFilters({
  filters = [
    "Récent",
    "Meublé",
    "Parking",
    "Piscine",
    "Sécurisé",
    "Climatisation",
  ],
  selectedFilters = [],
  onToggleFilter,
}: Props) {
  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const active = selectedFilters.includes(filter);

        return (
          <Pressable
            key={filter}
            style={[
              styles.filter,
              active && styles.activeFilter,
            ]}
            onPress={() => onToggleFilter?.(filter)}
          >
            <Text
              style={[
                styles.filterText,
                active && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",

    flexDirection: "row",
    flexWrap: "wrap",

    gap: 10,
    marginBottom: 20,
  },

  filter: {
    minHeight: 42,

    paddingHorizontal: 16,

    borderRadius: 999,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#E3EAE6",

    alignItems: "center",
    justifyContent: "center",
  },

  activeFilter: {
    backgroundColor: "#F0D77A",
    borderColor: "#F0D77A",
  },

  filterText: {
    color: "#06251A",
    fontSize: 13,
    fontWeight: "800",
  },

  activeFilterText: {
    color: "#06251A",
    fontWeight: "900",
  },
});