import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type Props = {
  text?: string;
};

export default function LoadingView({
  text = "Chargement...",
}: Props) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#1F5C42"
      />

      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 50,
    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    marginTop: 14,
    color: "#1F5C42",
    fontSize: 15,
    fontWeight: "800",
  },
});