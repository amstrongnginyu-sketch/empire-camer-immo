import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  price?: string;
  surface?: string;
  bedrooms?: string;
  bathrooms?: string;

  onChangePrice?: (value: string) => void;
  onChangeSurface?: (value: string) => void;
  onChangeBedrooms?: (value: string) => void;
  onChangeBathrooms?: (value: string) => void;
};

export default function PublishPriceInfo({
  price = "",
  surface = "",
  bedrooms = "",
  bathrooms = "",

  onChangePrice,
  onChangeSurface,
  onChangeBedrooms,
  onChangeBathrooms,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Prix & caractéristiques
      </Text>

      <View style={styles.grid}>
        <View style={styles.field}>
          <Text style={styles.label}>
            Prix (FCFA)
          </Text>

          <TextInput
            value={price}
            onChangeText={onChangePrice}
            placeholder="25000000"
            placeholderTextColor="#7A807C"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Surface (m²)
          </Text>

          <TextInput
            value={surface}
            onChangeText={onChangeSurface}
            placeholder="240"
            placeholderTextColor="#7A807C"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Chambres
          </Text>

          <TextInput
            value={bedrooms}
            onChangeText={onChangeBedrooms}
            placeholder="4"
            placeholderTextColor="#7A807C"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>
            Salles de bain
          </Text>

          <TextInput
            value={bathrooms}
            onChangeText={onChangeBathrooms}
            placeholder="3"
            placeholderTextColor="#7A807C"
            keyboardType="numeric"
            style={styles.input}
          />
        </View>
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

  sectionTitle: {
    color: "#06251A",
    fontSize: 24,
    fontWeight: "900",
    marginBottom: 18,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  field: {
    width: "48%",
    minWidth: 220,
  },

  label: {
    color: "#06251A",
    fontSize: 15,
    fontWeight: "900",
    marginBottom: 10,
  },

  input: {
    minHeight: 56,

    borderRadius: 18,

    backgroundColor: "#F7F8F6",

    borderWidth: 1,
    borderColor: "#E3EAE6",

    paddingHorizontal: 16,

    color: "#06251A",
    fontSize: 15,
    fontWeight: "700",

    outlineStyle: "none" as any,
  },
});