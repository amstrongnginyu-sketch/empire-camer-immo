import { StyleSheet, Text, View } from "react-native";

type Props = {
  description?: string;
};

export default function DetailDescription({
  description = "Cette annonce ne contient pas encore de description détaillée.",
}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Description</Text>

      <Text style={styles.text}>
        {description}
      </Text>
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

  title: {
    color: "#06251A",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },

  text: {
    color: "#34433B",
    fontSize: 15,
    fontWeight: "700",
    lineHeight: 24,
  },
});