import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

type Props = {
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: () => void;
  placeholder?: string;
};

export default function HomeSearchBar({
  value = "",
  onChangeText,
  onSearch,
  placeholder = "Rechercher une ville, quartier ou type de bien...",
}: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.inputContainer}>
        <Text style={styles.icon}>🔍</Text>

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#7A807C"
          style={styles.input}
        />

        <Pressable style={styles.button} onPress={onSearch}>
          <Text style={styles.buttonText}>Rechercher</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    marginBottom: 20,
  },

  inputContainer: {
    minHeight: 66,

    backgroundColor: "#FFFFFF",

    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E3EAE6",

    paddingHorizontal: 18,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  icon: {
    fontSize: 18,
    marginRight: 10,
  },

  input: {
    flex: 1,
    color: "#06251A",
    fontSize: 15,
    fontWeight: "700",
    outlineStyle: "none" as any,
  },

  button: {
    backgroundColor: "#1F5C42",
    minHeight: 46,

    paddingHorizontal: 18,

    borderRadius: 14,

    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});