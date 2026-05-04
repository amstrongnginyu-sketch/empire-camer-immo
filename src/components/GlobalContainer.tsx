import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  children: React.ReactNode;
};

export default function GlobalContainer({ children }: Props) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // 🎯 BACKGROUND PREMIUM (propre, luxe)
    backgroundColor: "#F5F7F4",

    // optionnel: padding global
    paddingHorizontal: 16,
    paddingTop: 10,
  },
});