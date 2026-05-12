import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  title?: string;
  description?: string;
  type?: string;
  purpose?: string;

  onChangeTitle?: (value: string) => void;
  onChangeDescription?: (value: string) => void;
};

export default function PublishBasicInfo({
  title = "",
  description = "",
  type = "Villa",
  purpose = "Vente",

  onChangeTitle,
  onChangeDescription,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Informations générales
      </Text>

      <View style={styles.badges}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{purpose}</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{type}</Text>
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Titre de l’annonce
        </Text>

        <TextInput
          value={title}
          onChangeText={onChangeTitle}
          placeholder="Ex: Villa moderne à Bonapriso"
          placeholderTextColor="#7A807C"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Description
        </Text>

        <TextInput
          value={description}
          onChangeText={onChangeDescription}
          placeholder="Décrivez votre bien immobilier..."
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

  badges: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  badge: {
    backgroundColor: "#EAF4EF",

    borderRadius: 999,

    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  badgeText: {
    color: "#1F5C42",
    fontSize: 13,
    fontWeight: "900",
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
    minHeight: 140,

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