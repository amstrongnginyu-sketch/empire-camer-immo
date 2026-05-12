import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  city?: string;
  neighborhood?: string;
  address?: string;

  onChangeCity?: (value: string) => void;
  onChangeNeighborhood?: (value: string) => void;
  onChangeAddress?: (value: string) => void;
};

export default function PublishLocationInfo({
  city = "",
  neighborhood = "",
  address = "",

  onChangeCity,
  onChangeNeighborhood,
  onChangeAddress,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Localisation
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>
          Ville
        </Text>

        <TextInput
          value={city}
          onChangeText={onChangeCity}
          placeholder="Ex: Douala"
          placeholderTextColor="#7A807C"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Quartier
        </Text>

        <TextInput
          value={neighborhood}
          onChangeText={onChangeNeighborhood}
          placeholder="Ex: Bonapriso"
          placeholderTextColor="#7A807C"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Adresse complète
        </Text>

        <TextInput
          value={address}
          onChangeText={onChangeAddress}
          placeholder="Rue, avenue, point de repère..."
          placeholderTextColor="#7A807C"
          multiline
          textAlignVertical="top"
          style={styles.textarea}
        />
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

  field: {
    marginBottom: 18,
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

  textarea: {
    minHeight: 100,

    borderRadius: 18,

    backgroundColor: "#F7F8F6",

    borderWidth: 1,
    borderColor: "#E3EAE6",

    paddingHorizontal: 16,
    paddingTop: 14,

    color: "#06251A",
    fontSize: 15,
    fontWeight: "700",

    outlineStyle: "none" as any,
  },
});