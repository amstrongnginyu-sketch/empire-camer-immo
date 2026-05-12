import { StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  name?: string;
  phone?: string;
  email?: string;

  onChangeName?: (value: string) => void;
  onChangePhone?: (value: string) => void;
  onChangeEmail?: (value: string) => void;
};

export default function PublishContactInfo({
  name = "",
  phone = "",
  email = "",

  onChangeName,
  onChangePhone,
  onChangeEmail,
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        Informations du propriétaire
      </Text>

      <View style={styles.field}>
        <Text style={styles.label}>
          Nom complet
        </Text>

        <TextInput
          value={name}
          onChangeText={onChangeName}
          placeholder="Nom du propriétaire"
          placeholderTextColor="#7A807C"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Téléphone
        </Text>

        <TextInput
          value={phone}
          onChangeText={onChangePhone}
          placeholder="+237 6XX XXX XXX"
          placeholderTextColor="#7A807C"
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          value={email}
          onChangeText={onChangeEmail}
          placeholder="email@example.com"
          placeholderTextColor="#7A807C"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
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
});